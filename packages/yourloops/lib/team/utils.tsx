/**
 * Copyright (c) 2021, Diabeloop
 * Teams utility functions
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

import { LoadTeams, Team, TEAM_CODE_LENGTH, TeamMember, TeamUser } from "./models";
import TeamApi from "./team-api";
import { ITeam, ITeamMember, TeamMemberRole, TeamType } from "../../models/team";
import bows from "bows";
import { UserRoles } from "../../models/user";
import { fixYLP878Settings } from "../utils";
import { Patient, PatientTeam } from "../data/patient";
import { PatientFilterTypes, UserInvitationStatus } from "../../models/generic";
import User from "../auth/user";

const log = bows("TeamUtils");

/**
 * Get the team code for display - Can be use with partial code.
 * @param code 9 digit string team code
 * @returns `123 - 456 - 789`
 */
export function getDisplayTeamCode(code: string): string {
  const SEP_POS = [2, 5]; // eslint-disable-line no-magic-numbers
  let displayCode = "";
  const codeLen = Math.min(code.length, TEAM_CODE_LENGTH);
  for (let i = 0 | 0; i < codeLen; i++) {
    displayCode += code[i];
    if (SEP_POS.includes(i) && i + 1 < codeLen) {
      displayCode += " - ";
    }
  }
  return displayCode;
}

export default class TeamUtils {

  static computeFlaggedPatients = (patients: Patient[], flaggedPatients: string[]): Patient[] => {
    return patients.map(patient => {
      return { ...patient, metadata : { ...patient.metadata, flagged : flaggedPatients.includes(patient.userid) } };
    });
  };

  static extractPatients = (patients: Patient[], filterType: PatientFilterTypes, flaggedPatients: string[]): Patient[] => {
    const twoWeeksFromNow = new Date();
    switch (filterType) {
    case PatientFilterTypes.all:
      return patients.filter((patient) => !TeamUtils.isOnlyPendingInvitation(patient));
    case PatientFilterTypes.pending:
      return patients.filter((patient) => TeamUtils.isInvitationPending(patient));
    case PatientFilterTypes.flagged:
      return patients.filter(patient => flaggedPatients.includes(patient.userid));
    case PatientFilterTypes.unread:
      return patients.filter(patient => patient.metadata.unreadMessagesSent > 0);
    case PatientFilterTypes.outOfRange:
      return patients.filter(patient => patient.metadata.alarm.timeSpentAwayFromTargetActive);
    case PatientFilterTypes.severeHypoglycemia:
      return patients.filter(patient => patient.metadata.alarm.frequencyOfSevereHypoglycemiaActive);
    case PatientFilterTypes.dataNotTransferred:
      return patients.filter(patient => patient.metadata.alarm.nonDataTransmissionActive);
    case PatientFilterTypes.remoteMonitored:
      return patients.filter(patient => patient.monitoring?.enabled);
    case PatientFilterTypes.private:
      return patients.filter(patient => TeamUtils.isInTeam(patient, filterType));
    case PatientFilterTypes.renew:
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      return patients.filter(patient => patient.monitoring && patient.monitoring.enabled && patient.monitoring.monitoringEnd && new Date(patient.monitoring.monitoringEnd).getTime() - twoWeeksFromNow.getTime() < 0);
    default:
      return patients;
    }
  };

  static isInTeam = (patient: Patient, teamId: string): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.teamId === teamId);
    return typeof tm === "object";
  };

  static isInAtLeastATeam = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status === UserInvitationStatus.accepted);
    return !!tm;
  };

  static isUserTheOnlyAdministrator = (team: Team, userId: string): boolean => {
    const admins = team.members.filter((member) => member.role === TeamMemberRole.admin && member.status === UserInvitationStatus.accepted);
    return admins.length === 1 && admins[0].user.userid === userId;
  };

  static isUserAdministrator = (team: Team, userId: string): boolean => {
    const result = team.members.find((member) => member.role === TeamMemberRole.admin && member.user.userid === userId);
    return typeof result === "object";
  };

  static teamHasOnlyOneMember = (team: Team): boolean => {
    const numMembers = team.members.reduce((p, t) => t.role === TeamMemberRole.patient ? p : p + 1, 0);
    return numMembers < 2;
  };

  static getNumMedicalMembers = (team: Team): number => {
    return team.members.reduce<number>((num, member) => {
      return member.role === TeamMemberRole.patient ? num : num + 1;
    }, 0);
  };

  static isInvitationPending = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status === UserInvitationStatus.pending);
    return typeof tm === "object";
  };

  static isOnlyPendingInvitation = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status !== UserInvitationStatus.pending);
    return typeof tm === "undefined";
  };

  static iMemberToMember(iTeamMember: ITeamMember, team: Team, users: Map<string, TeamUser>): TeamMember {
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

  static iTeamToTeam(iTeam: ITeam, users: Map<string, TeamUser>): Team {
    const team: Team = { ...iTeam, members: [] };
    // Detect duplicate users, and update the member if needed
    iTeam.members.forEach(iTeamMember => TeamUtils.iMemberToMember(iTeamMember, team, users));
    return team;
  }

  static getUserByEmail(teams: Team[], email: string): TeamUser | null {
    for (const team of teams) {
      for (const member of team.members) {
        if (member.user.username === email) {
          return member.user;
        }
      }
    }
    return null;
  }

  static async loadTeams(user: User): Promise<LoadTeams> {
    const getFlagPatients = (): string[] => {
      const flagged = user.preferences?.patientsStarred;
      if (Array.isArray(flagged)) {
        return Array.from(flagged);
      }
      return [];
    };

    const users = new Map<string, TeamUser>();
    const [apiTeams, apiPatients] = await Promise.all([TeamApi.getTeams(), TeamApi.getPatients()]);

    const nPatients = apiPatients.length;
    log.debug("loadTeams", { nPatients, nTeams: apiTeams.length });

    const privateTeam: Team = {
      code: TeamType.private,
      id: TeamType.private,
      members: [],
      name: TeamType.private,
      owner: user.userid,
      type: TeamType.private,
    };

    const teams: Team[] = [privateTeam];
    apiTeams.forEach((apiTeam: ITeam) => {
      const team = TeamUtils.iTeamToTeam(apiTeam, users);
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

      TeamUtils.iMemberToMember(apiPatient, team, users);
    }

    // End, cleanup to help the garbage collector
    users.clear();
    return { teams, flaggedNotInResult };
  }
}
