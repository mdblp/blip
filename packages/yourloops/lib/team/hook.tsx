/**
 * Copyright (c) 2021, Diabeloop
 * Teams management & helpers - hook version
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from "react";
import _ from "lodash";
import bows from "bows";

import { FilterType, UserInvitationStatus } from "../../models/generic";
import { MedicalData } from "../../models/device-data";
import { UserRoles } from "../../models/shoreline";
import { ITeam, ITeamMember, TeamMemberRole, TeamType, TypeTeamMemberRole } from "../../models/team";

import { errorTextFromException, fixYLP878Settings } from "../utils";
import metrics from "../metrics";
import { Session, useAuth } from "../auth";
import { notificationConversion, useNotification } from "../notifications";
import { LoadTeams, Team, TeamAPI, TeamContext, TeamMember, TeamProvider, TeamUser } from "./models";
import { DirectShareAPI } from "../share/models";
import ShareAPIImpl from "../share";
import TeamAPIImpl from "./api";
import { Patient, PatientTeam } from "../data/patient";
import { mapTeamUserToPatient } from "../../components/patient/utils";

const log = bows("TeamHook");
const ReactTeamContext = React.createContext<TeamContext>({} as TeamContext);
/** hackish way to prevent 2 or more consecutive loading */
let lock = false;

export function iMemberToMember(iTeamMember: ITeamMember, team: Team, users: Map<string, TeamUser>): TeamMember {
  const {
    userId,
    invitationStatus,
    role,
    email,
    preferences,
    profile,
    settings,
    idVerified,
    alarms,
    monitoring,
    unreadMessages,
  } = iTeamMember;

  let teamUser = users.get(userId);
  if (!teamUser) {
    teamUser = {
      role: role === TeamMemberRole.patient ? UserRoles.patient : UserRoles.hcp,
      userid: userId,
      username: email,
      emails: [email],
      preferences,
      profile,
      settings: fixYLP878Settings(settings),
      members: [],
      idVerified,
      alarms,
      monitoring,
      unreadMessages,
    };
    users.set(userId, teamUser);
  }

  const teamMember: TeamMember = {
    team,
    role,
    status: invitationStatus,
    user: teamUser,
  };
  teamUser.members.push(teamMember);
  team.members.push(teamMember);
  return teamMember;
}

export function iTeamToTeam(iTeam: ITeam, users: Map<string, TeamUser>): Team {
  const team: Team = { ...iTeam, members: [] };
  // Detect duplicate users, and update the member if needed
  iTeam.members.forEach(iTeamMember => iMemberToMember(iTeamMember, team, users));
  return team;
}

export async function loadTeams(
  session: Session,
  // Default API promise calls (here for the unit tests)
  fetchTeams: TeamAPI["fetchTeams"],
  fetchPatients: TeamAPI["fetchPatients"]
): Promise<LoadTeams> {
  const getFlagPatients = (): string[] => {
    const flagged = session.user.preferences?.patientsStarred;
    if (Array.isArray(flagged)) {
      return Array.from(flagged);
    }
    return [];
  };

  const users = new Map<string, TeamUser>();
  const [apiTeams, apiPatients] = await Promise.all([fetchTeams(session), fetchPatients(session)]);
  const nPatients = apiPatients.length;
  log.debug("loadTeams", { nPatients, nTeams: apiTeams.length });

  const privateTeam: Team = {
    code: TeamType.private,
    id: TeamType.private,
    members: [],
    name: TeamType.private,
    owner: session.user.userid,
    type: TeamType.private,
  };

  const teams: Team[] = [privateTeam];
  apiTeams.forEach((apiTeam: ITeam) => {
    const team = iTeamToTeam(apiTeam, users);
    teams.push(team);
  });

  const flaggedNotInResult = getFlagPatients();

  // Merge patients
  for (let i = 0; i < nPatients; i++) {
    const apiPatient = apiPatients[i];
    const userId = apiPatient.userId;

    if (flaggedNotInResult.includes(userId)) {
      flaggedNotInResult.splice(flaggedNotInResult.indexOf(userId), 1);
    }

    let team = teams.find((t) => t.id === apiPatient.teamId);
    if (typeof team === "undefined") {
      log.error(`Missing teamId ${apiPatient.teamId} for patient member`, apiPatient);
      // Use the private team
      team = privateTeam;
    }

    iMemberToMember(apiPatient, team, users);
  }

  // End, cleanup to help the garbage collector
  users.clear();
  return { teams, flaggedNotInResult };
}

function getUserByEmail(teams: Team[], email: string): TeamUser | null {
  for (const team of teams) {
    for (const member of team.members) {
      if (member.user.username === email) {
        return member.user;
      }
    }
  }
  return null;
}

function TeamContextImpl(teamAPI: TeamAPI, directShareAPI: DirectShareAPI): TeamContext {
  // hooks (private or public variables)
  // TODO: Transform the React.useState with React.useReducer
  const authHook = useAuth();
  const notificationHook = useNotification();
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const session = authHook.session();
  if (session === null) {
    throw new Error("TeamHook need a logged-in user");
  }

  // public methods

  const getTeam = (teamId: string): Team | null => {
    return teams.find((t) => t.id === teamId) ?? null;
  };

  const getUser = (userId: string): TeamUser | null => {
    // Sorry for the "for", I know it's now forbidden
    // But today it's too late for me to think how to use a magic function
    // to have this info.
    for (const team of teams) {
      for (const member of team.members) {
        if (member.user.userid === userId) {
          return member.user;
        }
      }
    }
    return null;
  };

  const getPatient = (userId: string): Patient | null => {
    // Sorry for the "for", I know it's now forbidden
    // But today it's too late for me to think how to use a magic function
    // to have this info.
    for (const team of teams) {
      for (const member of team.members) {
        if (member.user.userid === userId) {
          return mapTeamUserToPatient(member.user);
        }
      }
    }
    return null;
  };

  const getMapUsers = (): Map<string, TeamUser> => {
    const users = new Map<string, TeamUser>();
    for (const team of teams) {
      for (const member of team.members) {
        if (!users.has(member.user.userid)) {
          users.set(member.user.userid, member.user);
        }
      }
    }
    return users;
  };

  const refresh = (forceRefresh: boolean): void => {
    if (initialized || forceRefresh) {
      setInitialized(false);
    }
  };

  const getMedicalTeams = (): Team[] => {
    return teams.filter((team: Team): boolean => team.type === TeamType.medical);
  };

  const getRemoteMonitoringTeams = (): Team[] => {
    return teams.filter(team => team.monitoring?.enabled);
  };

  const getPatientsAsTeamUsers = (): TeamUser[] => {
    const patients = new Map<string, TeamUser>();
    const nTeams = teams.length;
    for (let i = 0; i < nTeams; i++) {
      const team = teams[i];
      const members = team.members;
      const nMembers = members.length;
      for (let j = 0; j < nMembers; j++) {
        const member = members[j];
        if (member.role === TeamMemberRole.patient && !patients.has(member.user.userid)) {
          patients.set(member.user.userid, member.user);
        }
      }
    }
    return Array.from(patients.values());
  };

  const getPatients = (): Patient[] => {
    const teamUsers = getPatientsAsTeamUsers();
    return teamUsers.map(teamUser => mapTeamUserToPatient(teamUser));
  };

  const getPatientRemoteMonitoringTeam = (patient: Patient): PatientTeam => {
    if (!patient.monitoring) {
      throw Error("Cannot get patient remote monitoring team as patient is not remote monitored");
    }
    const res = patient.teams.find(team => getRemoteMonitoringTeams().find(t => t.id === team.teamId) !== undefined);
    if (!res) {
      throw Error("Could not find team to which patient is remote monitored");
    }
    return res;
  };

  const editPatientRemoteMonitoring = (patient: Patient) => {
    const user = getUser(patient.userid);
    if (!user) {
      throw Error("Cannot update user monitoring as user was not found");
    }
    user.monitoring = patient.monitoring;
    setTeams(teams);
  };

  const getMedicalMembers = (team: Team): TeamMember[] => {
    return team.members.filter((member) => member.role !== TeamMemberRole.patient);
  };

  const getNumMedicalMembers = (team: Team): number => {
    return team.members.reduce<number>((num, member) => {
      return member.role === TeamMemberRole.patient ? num : num + 1;
    }, 0);
  };

  const teamHasOnlyOneMember = (team: Team): boolean => {
    const numMembers = team.members.reduce((p, t) => t.role === TeamMemberRole.patient ? p : p + 1, 0);
    return numMembers < 2;
  };

  const isUserAdministrator = (team: Team, userId: string): boolean => {
    const result = team.members.find((member) => member.role === TeamMemberRole.admin && member.user.userid === userId);
    return typeof result === "object";
  };

  const isUserTheOnlyAdministrator = (team: Team, userId: string): boolean => {
    const admins = team.members.filter((member) => member.role === TeamMemberRole.admin && member.status === UserInvitationStatus.accepted);
    return admins.length === 1 && admins[0].user.userid === userId;
  };

  const isInvitationPending = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status === UserInvitationStatus.pending);
    return typeof tm === "object";
  };
  const isOnlyPendingInvitation = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status !== UserInvitationStatus.pending);
    return typeof tm === "undefined";
  };

  const isUserInvitationPending = (patient: Patient, teamId: string): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.teamId === teamId && team.status === UserInvitationStatus.pending);
    return !!tm;
  };

  const isInAtLeastATeam = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status === UserInvitationStatus.accepted);
    return !!tm;
  };

  const isInTeam = (patient: Patient, teamId: string): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.teamId === teamId);
    return typeof tm === "object";
  };

  const getPendingPatients = (): Patient[] => {
    return getPatients().filter((patient) => isInvitationPending(patient));
  };

  const getDirectSharePatients = (): Patient[] => {
    return getPatients().filter((patient) => patient.teams.find(team => team.teamId === "private"));
  };

  const filterPatients = (filterType: FilterType | string, filter: string, flaggedPatients: string[]): Patient[] => {
    const allPatients = getPatients();
    let patients: Patient[];
    if (!(filterType in FilterType)) {
      //filterType is a team id, retrieve all patients not pending in given team
      patients = allPatients.filter((patient) => !isUserInvitationPending(patient, filterType));
    } else if (filterType === FilterType.pending) {
      patients = allPatients.filter((patient) => isInvitationPending(patient));
    } else {
      patients = allPatients.filter((patient) => !isOnlyPendingInvitation(patient));
    }

    const searchByName = filter.length > 0;
    if (searchByName) {
      const searchText = filter.toLocaleLowerCase();
      patients = patients.filter((patient: Patient): boolean => {
        switch (filterType) {
        case FilterType.all:
        case FilterType.pending:
          break;
        case FilterType.flagged:
          if (!flaggedPatients.includes(patient.userid)) {
            return false;
          }
          break;
        default:
          if (!isInTeam(patient, filterType)) {
            return false;
          }
          break;
        }

        const firstName = patient.profile.firstName ?? "";
        if (firstName.toLocaleLowerCase().includes(searchText)) {
          return true;
        }
        const lastName = patient.profile.lastName ?? "";
        return lastName.toLocaleLowerCase().includes(searchText);
      });
    } else if (filterType === FilterType.flagged) {
      patients = patients.filter(patient => flaggedPatients.includes(patient.userid));
    } else if (filterType !== FilterType.all && filterType !== FilterType.pending) {
      patients = patients.filter(patient => isInTeam(patient, filterType));
    }
    return patients;
  };

  const computeFlaggedPatients = (patients: Patient[], flaggedPatients: string[]): Patient[] => {
    return patients.map(patient => {
      return { ...patient, flagged: flaggedPatients.includes(patient.userid) };
    });
  };

  const invitePatient = async (team: Team, username: string): Promise<void> => {
    const apiInvitation = await teamAPI.invitePatient(session, team.id, username);
    const invitation = notificationConversion(apiInvitation);
    if (invitation === null) {
      // Should not be possible
      throw new Error("Invalid invitation type");
    }
    let user = getUserByEmail(teams, invitation.email);
    if (user === null) {
      user = {
        userid: invitation.id,
        role: UserRoles.patient,
        username,
        emails: [username],
        members: [],
      };
    }
    const member: TeamMember = {
      role: TeamMemberRole.patient,
      status: UserInvitationStatus.pending,
      team,
      user,
      invitation,
    };
    user.members.push(member);
    team.members.push(member);
    setTeams(teams);
  };

  const inviteMember = async (team: Team, username: string, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void> => {
    const apiInvitation = await teamAPI.inviteMember(session, team.id, username, role);
    const invitation = notificationConversion(apiInvitation);
    if (invitation === null) {
      // Should not be possible
      throw new Error("Invalid invitation type");
    }
    let user = getUserByEmail(teams, invitation.email);
    if (user === null) {
      user = {
        userid: invitation.id,
        role: UserRoles.hcp,
        username,
        emails: [username],
        members: [],
      };
    }
    const member: TeamMember = {
      role: role as TeamMemberRole,
      status: UserInvitationStatus.pending,
      team,
      user,
      invitation,
    };
    user.members.push(member);
    team.members.push(member);
    setTeams(teams);
  };

  const createTeam = async (team: Partial<Team>): Promise<void> => {
    const apiTeam: Partial<ITeam> = {
      address: team.address,
      description: team.description,
      email: team.email,
      name: team.name,
      phone: team.phone,
      type: team.type,
    };
    const iTeam = await teamAPI.createTeam(session, apiTeam);
    const users = getMapUsers();
    const newTeam = iTeamToTeam(iTeam, users);
    teams.push(newTeam);
    setTeams(teams);
    metrics.send("team_management", "create_care_team", _.isEmpty(team.email) ? "email_not_filled" : "email_filled");
  };

  const editTeam = async (team: Team): Promise<void> => {
    const session = authHook.session() as Session;
    const apiTeam: ITeam = {
      ...team,
      members: [],
    };
    await teamAPI.editTeam(session, apiTeam);
    const cachedTeam = teams.find((t: Team) => t.id === team.id);
    if (typeof cachedTeam === "object") {
      cachedTeam.name = team.name;
      cachedTeam.phone = team.phone;
      cachedTeam.address = team.address;
      if (typeof team.email === "string") {
        cachedTeam.email = team.email;
      }
      setTeams(teams);
    } else {
      log.warn("editTeam(): Team not found", team);
    }
    metrics.send("team_management", "edit_care_team");
  };

  const markPatientMessagesAsRead = (patient: Patient) => {
    const clonedTeams = teams;
    clonedTeams.forEach(team => {
      const patientAsTeamUser = team.members.find(member => member.user.userid === patient.userid);
      if (patientAsTeamUser) {
        patientAsTeamUser.user.unreadMessages = 0;
      }
    });
    setTeams(clonedTeams);
  };

  const updateTeamAlerts = async (team: Team): Promise<void> => {
    const session = authHook.session() as Session;
    if (!team.monitoring) {
      throw Error("Cannot update team monitoring with undefined");
    }
    try {
      await teamAPI.updateTeamAlerts(session, team.id, team.monitoring);
    } catch (error) {
      console.error(error);
      throw Error(`Failed to update team with id ${team.id}`);
    }
    const cachedTeam = teams.find(t => t.id === team.id);
    if (cachedTeam) {
      cachedTeam.monitoring = team.monitoring;
      setTeams(teams);
    } else {
      throw Error(`Could not find team with id ${team.id}`);
    }
  };

  const leaveTeam = async (team: Team): Promise<void> => {
    const session = authHook.session() as Session;
    const ourselve = team.members.find((member) => member.user.userid === session.user.userid);
    if (_.isNil(ourselve)) {
      throw new Error("We are not a member of the team!");
    }
    log.info("leaveTeam", { ourselve, team });
    if (ourselve.role === TeamMemberRole.patient) {
      await teamAPI.removePatient(session, team.id, ourselve.user.userid);
      metrics.send("team_management", "leave_team");
    } else if (ourselve.role === TeamMemberRole.admin && ourselve.status === UserInvitationStatus.accepted && teamHasOnlyOneMember(team)) {
      await teamAPI.deleteTeam(session, team.id);
      metrics.send("team_management", "delete_team");
    } else {
      await teamAPI.leaveTeam(session, team.id);
      metrics.send("team_management", "leave_team");
    }
    const idx = teams.findIndex((t: Team) => t.id === team.id);
    if (idx > -1) {
      teams.splice(idx, 1);
      setTeams(teams);
    } else {
      log.warn("leaveTeam(): Team not found", team);
    }
  };

  const removeMember = async (member: TeamMember): Promise<void> => {
    if (member.status === UserInvitationStatus.pending) {
      if (!member.invitation || member.team.id !== member.invitation.target?.id) {
        throw new Error("Missing invitation!");
      }
      await notificationHook.cancel(member.invitation);
    } else {
      await teamAPI.removeMember(session, member.team.id, member.user.userid, member.user.username);
    }
    const { team } = member;
    const idx = team.members.findIndex((m: TeamMember) => m.user.userid === member.user.userid);
    if (idx > -1) {
      team.members.splice(idx, 1);
      setTeams(teams);
    } else {
      log.warn("removeMember(): Member not found", member);
    }
  };

  const removePatient = async (patient: Patient, member: PatientTeam, teamId: string): Promise<void> => {
    if (member.status === UserInvitationStatus.pending) {
      if (_.isNil(member.invitation)) {
        throw new Error("Missing invitation!");
      }
      await notificationHook.cancel(member.invitation);
    }
    if (teamId === "private") {
      await directShareAPI.removeDirectShare(session, patient.userid);
    } else {
      await teamAPI.removePatient(session, teamId, patient.userid);
    }

    const team = teams.find(team => team.id === teamId);
    if (!team) {
      throw Error(`Could not find team with id ${teamId}`);
    }
    const memberIndex = team.members.findIndex(member => member.user.userid === patient.userid);
    team.members.splice(memberIndex, 1);
    setTeams(teams);

    if (team.members.length < 1) {
      const isFlagged = authHook.getFlagPatients().includes(patient.userid);
      if (isFlagged) {
        await authHook.flagPatient(patient.userid);
      }
    }
  };

  const changeMemberRole = async (member: TeamMember, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void> => {
    await teamAPI.changeMemberRole(session, member.team.id, member.user.userid, member.user.username, role);
    member.role = role as TeamMemberRole;
    setTeams(teams);
    metrics.send("team_management", "manage_admin_permission", role === "admin" ? "grant" : "revoke");
  };

  const setPatientMedicalData = (userId: string, medicalData: MedicalData | null): void => {
    const user = getUser(userId);
    if (user !== null && user.role === UserRoles.patient) {
      user.medicalData = medicalData;
    }
  };

  const getTeamFromCode = async (code: string): Promise<Readonly<Team> | null> => {
    const iTeam = await teamAPI.getTeamFromCode(session, code);
    if (iTeam === null) {
      return null;
    }
    const team: Team = { ...iTeam, members: [] };
    return team;
  };

  const joinTeam = async (teamId: string): Promise<void> => {
    await teamAPI.joinTeam(session, teamId);
    refresh(true);
  };

  const initHook = () => {
    if (initialized || lock || !notificationHook.initialized) {
      return;
    }
    log.info("init");
    lock = true;

    loadTeams(session, teamAPI.fetchTeams, teamAPI.fetchPatients).then(({ teams, flaggedNotInResult }: LoadTeams) => {
      log.debug("Loaded teams: ", teams);
      for (const invitation of notificationHook.sentInvitations) {
        const user = getUserByEmail(teams, invitation.email);
        if (user) {
          for (const member of user.members) {
            if (member.status === UserInvitationStatus.pending) {
              member.invitation = invitation;
            }
          }
        }
      }
      setTeams(teams);
      if (errorMessage !== null) {
        setErrorMessage(null);
      }

      if (flaggedNotInResult.length > 0) {
        // For some reason, the flagged list is not accurate - update it
        log.warn("Missing patients in team list", flaggedNotInResult);
        const validUserIds = authHook.getFlagPatients().filter((userId: string) => !flaggedNotInResult.includes(userId));
        authHook.setFlagPatients(validUserIds);
      }
    }).catch((reason: unknown) => {
      log.error(reason);
      const message = errorTextFromException(reason);
      if (message !== errorMessage) {
        setErrorMessage(message);
      }
    }).finally(() => {
      log.debug("Initialized !");
      setInitialized(true);
      // Clear the lock
      lock = false;
    });

  };

  React.useEffect(initHook, [initialized, errorMessage, teams, session, authHook, notificationHook, teamAPI]);

  return {
    teams,
    initialized,
    errorMessage,
    refresh,
    getTeam,
    getUser,
    getPatient,
    getMedicalTeams,
    getRemoteMonitoringTeams,
    getPatientsAsTeamUsers,
    getPatients,
    filterPatients,
    getMedicalMembers,
    getNumMedicalMembers,
    getPendingPatients,
    getDirectSharePatients,
    getPatientRemoteMonitoringTeam,
    teamHasOnlyOneMember,
    isUserAdministrator,
    isUserTheOnlyAdministrator,
    isInvitationPending,
    isOnlyPendingInvitation,
    isUserInvitationPending,
    isInAtLeastATeam,
    isInTeam,
    computeFlaggedPatients,
    invitePatient,
    inviteMember,
    markPatientMessagesAsRead,
    createTeam,
    editTeam,
    editPatientRemoteMonitoring,
    updateTeamAlerts,
    leaveTeam,
    removeMember,
    removePatient,
    changeMemberRole,
    setPatientMedicalData,
    getTeamFromCode,
    joinTeam,
  };
}

/**
 * Provider component that wraps your app and makes auth object available to any child component that calls useTeam().
 * @param props for team provider & children
 */
export function TeamContextProvider(props: TeamProvider): JSX.Element {
  const { children, teamAPI, directShareAPI } = props;
  const context = TeamContextImpl(teamAPI ?? TeamAPIImpl, directShareAPI ?? ShareAPIImpl); // eslint-disable-line new-cap
  return <ReactTeamContext.Provider value={context}>{children}</ReactTeamContext.Provider>;
}

/**
 * Hook for child components to get the teams functionalities
 *
 * Trigger a re-render when it change.
 */
export function useTeam(): TeamContext {
  return React.useContext(ReactTeamContext);
}
