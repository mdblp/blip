/**
 * Copyright (c) 2021, Diabeloop
 * Teams management - Interfaces
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

import { UserInvitationStatus, PostalAddress, FilterType } from "../../models/generic";
import { MedicalData } from "../../models/device-data";
import { IUser } from "../../models/shoreline";
import { INotificationAPI } from "../../models/notification";
import { INotification } from "../notifications";
import {
  ITeam,
  ITeamMember,
  TeamType,
  TeamMemberRole,
  TypeTeamMemberRole,
} from "../../models/team";
import { Session } from "../auth";
import { DirectShareAPI } from "../share/models";
import { Patient, PatientTeam } from "../data/patient";
import { Monitoring } from "../../models/monitoring";

export const TEAM_CODE_LENGTH = 9;
export const REGEX_TEAM_CODE = /^[0-9]{9}$/;
export const REGEX_TEAM_CODE_DISPLAY = /^[0-9]{3} - [0-9]{3} - [0-9]{3}$/;

export interface TeamUser extends IUser {
  members: TeamMember[];
}

export interface TeamMember {
  team: Team;
  role: TeamMemberRole;
  status: UserInvitationStatus;
  user: TeamUser;
  /** Invitations for roles = pending */
  invitation?: INotification;
  idVerified?: boolean;
}

export interface Team {
  readonly id: string;
  name: string;
  readonly code: string;
  readonly type: TeamType;
  readonly owner: string;
  phone?: string;
  email?: string;
  address?: PostalAddress;
  description?: string;
  members: TeamMember[];
  monitoring?: Monitoring;
}

export interface TeamAPI {
  fetchTeams: (session: Session) => Promise<ITeam[]>;
  fetchPatients: (session: Session) => Promise<ITeamMember[]>;
  invitePatient: (session: Session, teamId: string, username: string) => Promise<INotificationAPI>;
  inviteMember: (session: Session, teamId: string, username: string, role: Exclude<TypeTeamMemberRole, "patient">) => Promise<INotificationAPI>;
  createTeam: (session: Session, team: Partial<ITeam>) => Promise<ITeam>;
  editTeam: (session: Session, editedTeam: ITeam) => Promise<void>;
  updateTeamAlerts: (session: Session, teamId: string, monitoring: Monitoring) => Promise<void>
  deleteTeam: (session: Session, teamId: string) => Promise<void>;
  leaveTeam: (session: Session, teamId: string) => Promise<void>;
  removeMember: (session: Session, teamId: string, userId: string, email: string) => Promise<void>;
  removePatient: (session: Session, teamId: string, userId: string) => Promise<void>;
  changeMemberRole: (session: Session, teamId: string, userId: string, email: string, role: Exclude<TypeTeamMemberRole, "patient">) => Promise<void>;
  getTeamFromCode: (session: Session, code: string) => Promise<ITeam | null>;
  joinTeam: (session: Session, teamId: string) => Promise<void>;
}

export interface TeamContext {
  teams: Readonly<Team>[];
  /** true if an initial team fetch has been done */
  initialized: boolean;
  /** The error message set if there is any error */
  errorMessage: string | null;
  /**
   * Refresh the team list & members.
   *
   * @param forceRefresh if true, re-fetch the team
   */
  refresh: (forceRefresh: boolean) => void;
  /**
   * Return the medical teams only
   */
  getMedicalTeams: () => Readonly<Team>[];
  /**
   * Return the team for a teamId or null of not found
   * @param teamId The technical team id
   */
  getTeam: (teamId: string) => Readonly<Team> | null;
  /**
   * Return the user which the userId belongs to.
   * *All your base are belong to us*
   * @param userId The user we want
   */
  getUser: (userId: string) => Readonly<TeamUser> | null;
  /**
   * Return the patient which the userId belongs to.
   * *All your base are belong to us*
   * @param userId The user we want
   */
  getPatient: (userId: string) => Readonly<Patient> | null;
  /**
   * Return all patients (team user) we have
   */
  getPatientsAsTeamUsers: () => Readonly<TeamUser>[];
  /**
   * Return all patients
   */
  getPatients: () => Readonly<Patient>[];
  /**
   * Return all pending patients
   */
  getPendingPatients: () => Readonly<Patient>[];
  /**
   * Return all direct share patients
   */
  getDirectSharePatients: () => Readonly<Patient>[];
  /**
   * Return all patients filtered on the given params
   * @param filterType a FilterType value or a team id
   * @param filter a patient name
   * @param flagged the list of flagged patients
   */
  filterPatients: (filterType: FilterType | string, filter: string, flagged: string[]) => Patient[];
  /**
   * Return the medical members of a team.
   */
  getMedicalMembers: (team: Team) => Readonly<TeamMember>[];
  /**
   * Return the number of medical members
   */
  getNumMedicalMembers: (team: Team) => number;
  /**
   * Return true if the team has only one member
   */
  teamHasOnlyOneMember: (team: Team) => boolean;
  /**
   * Return true if the userId is an administrator of this team.
   * @param userId The user id to test
   */
  isUserAdministrator: (team: Team, userId: string) => boolean;
  /**
   * Return true if the userId is the only administrator of this team.
   * @param userId The user id to test
   */
  isUserTheOnlyAdministrator: (team: Team, userId: string) => boolean;
  /**
   * @param user The user to test
   * @returns true is the user has an invitation pending on one team
   */
  isInvitationPending: (patient: Patient) => boolean;
  /**
   * @param user The user to test
   * @returns {boolean} True if all members status is pending
   */
  isOnlyPendingInvitation: (patient: Patient) => boolean;
  /**
   * @param user The user to test
   * @param teamId A team id
   * @returns {boolean} True if members status is pending in given team
   */
   isUserInvitationPending: (patient: Patient, teamId: string) => boolean;
  /**
   * @param user The user to test
   * @returns {boolean} True if members status is accepted in at least a team
   */
   isInAtLeastATeam: (patient: Patient) => boolean;
  /**
   * Return true if this user is in a specific team
   * @param user The user to test
   * @param teamId A team id
   */
  isInTeam(patient: Patient, teamId: string): boolean;
  /**
   * Return the list of patient updated with the flag attribute.
   * @param patients The patients to update
   * @param flaggedPatients The list of patients that the current user has flagged
   */
  computeFlaggedPatients(patients : Patient[], flaggedPatients: string[]): Patient[];
  /**
   * As an HCP invite a patient to a team.
   * @param team The team to invite the patient
   * @param username The patient email
   */
  invitePatient(team: Team, username: string): Promise<void>;
  /**
   * As an HCP invite a member (non patient)
   * @param team The team to invite the member
   * @param username The member email
   * @param role The member role
   */
  inviteMember(team: Team, username: string, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void>;
  /**
   * Create a new team
   * @param team The team to create
   */
  createTeam(team: Partial<Team>): Promise<void>;
  /**
   * Change some team infos (name, address...)
   * @param team The updated team
   */
  editTeam(team: Team): Promise<void>;
  /**
   * Update team alarm configuration
   * @param team The updated team
   */
  updateTeamAlerts(team: Team): Promise<void>;
  /**
   * Leave a team
   * @param team The team to leave
   */
  leaveTeam(team: Team): Promise<void>;
  /**
   * Remove a team member from a team
   * @param member The member to remove
   */
  removeMember(member: TeamMember): Promise<void>;

  /**
   * Remove a patient from HCP patient list
   * @param patient the patient to remove
   * @param member
   * @param teamId id of the team ("private" if it's a private practice)
   */
  removePatient(patient: Patient, member: PatientTeam, teamId: string): Promise<void>;
  /**
   * Change a member role
   * @param member The concerned member
   * @param role The new role
   */
  changeMemberRole(member: TeamMember, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void>;
  /**
   * Update a patient medical data
   * @param userId Patient's userId
   * @param medicalData The medical data to set
   */
  setPatientMedicalData(userId: string, medicalData: MedicalData | null): void;
  /**
   * Retreive a team from it's 9 digit code.
   * Used by patient users to join a team
   */
  getTeamFromCode: (code: string) => Promise<Readonly<Team> | null>;
  /**
   * Join a specific team.
   */
  joinTeam: (teamId: string) => Promise<void>;
}

export interface TeamProvider {
  children: React.ReactNode;
  teamAPI?: TeamAPI;
  directShareAPI?: DirectShareAPI;
}

export interface LoadTeams {
  teams: Team[];
  flaggedNotInResult: string[];
}
