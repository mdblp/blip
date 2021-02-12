/**
 * Copyright (c) 2021, Diabeloop
 * Teams management - API calls
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

import _ from "lodash";
import bows from "bows";

import { HttpHeaderKeys } from "../../models/api";
import { User, UserRoles } from "../../models/shoreline";
import { TeamType, ITeam, ITeamMember, TeamMemberRole, TypeTeamMemberRole, TeamMemberStatus } from "../../models/team";
import { waitTimeout } from "../../lib/utils";
import appConfig from "../config";
import httpStatus from "../http-status-codes";
import { t } from "../language";

const log = bows("TeamAPI");
let teams: ITeam[] | null = null;

export async function fetchTeams(traceToken: string, sessionToken: string, user: User): Promise<ITeam[]> {
  log.info("fetchTeams()", traceToken, sessionToken);

  // Simulate the fetch() wait network call:
  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(1000 + Math.random() * 200);

  if (teams === null) {
    teams = [
      {
        // FIXME
        id: "team-0",
        name: "CHU Grenoble",
        code: "123456789",
        ownerId: "abcdef",
        type: TeamType.medical,
        address: {
          line1: "Boulevard de la Chantourne",
          line2: "Cedex 38703",
          zip: "38700",
          city: "La Tronche",
          country: "FR",
        },
        phone: "+33 (0)4 76 76 75 75",
        email: "secretariat-diabethologie@chu-grenoble.fr",
        members: [
          {
            teamId: "team-0",
            userId: "a0a0a0a0",
            role: TeamMemberRole.viewer,
            invitationStatus: TeamMemberStatus.accepted,
            user: {
              userid: "a0a0a0a0",
              username: "jean.dupont@chu-grenoble.fr",
              termsAccepted: "2019-01-25T17:47:56+01:00",
              roles: [UserRoles.hcp],
              profile: { firstName: "Jean", lastName: "Dupont", fullName: "Jean Dupont" },
            },
          },
          {
            // Pending member invitation -> user not validated (missing termsAccepted field)
            teamId: "team-0",
            userId: "a0a0a0a1",
            role: TeamMemberRole.viewer,
            invitationStatus: TeamMemberStatus.pending,
            user: {
              userid: "a0a0a0a1",
              roles: [UserRoles.hcp],
              username: "michelle.dupuis@chu-grenoble.fr",
            },
          },
        ],
      },
      {
        id: "team-1",
        name: "Charité – Universitätsmedizin Berlin",
        code: "987654321",
        phone: "+49 30 450 - 50",
        address: {
          line1: "Charitéplatz 1",
          city: "Berlin",
          zip: "10117",
          country: "DE",
        },
        ownerId: "abcdef",
        type: TeamType.medical,
        members: [
          {
            teamId: "team-1",
            userId: "b0b1b2b3",
            role: TeamMemberRole.admin,
            invitationStatus: TeamMemberStatus.accepted,
            user: {
              userid: "b0b1b2b3",
              roles: [UserRoles.hcp],
              username: "adelheide.alvar@charite.de",
              termsAccepted: "2019-01-25T17:47:56+01:00",
              profile: { firstName: "Adelheide", lastName: "Alvar", fullName: "Adelheide Alvar" },
            },
          },
        ],
      },
    ];
  }

  const returnedTeam = _.cloneDeep(teams);
  // Add ourselves to the teams:
  returnedTeam[0].members.push({
    teamId: "team-0",
    userId: user.userid,
    role: TeamMemberRole.admin,
    invitationStatus: TeamMemberStatus.accepted,
    user,
  });
  returnedTeam[1].members.push({
    teamId: "team-1",
    userId: user.userid,
    role: TeamMemberRole.admin,
    invitationStatus: TeamMemberStatus.accepted,
    user,
  });

  return returnedTeam;
}

export async function fetchPatients(traceToken: string, sessionToken: string, user: User): Promise<ITeamMember[]> {
  log.info("fetchPatients()");

  const apiURL = new URL(`/metadata/users/${user.userid}/users`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  const patients: ITeamMember[] = [];
  if (response.ok) {
    const users = (await response.json()) as User[];
    // FIXME will be removed with the team API call
    const nPatients = users.length;
    let nPrivate = 0;
    for (let i = 0; i < nPatients; i++) {
      const user = users[i];

      // Randomize the teams associations
      const val = (Math.random() * 10) | 0;
      let teamIds = [];
      if (i < 2) {
        teamIds = ["private"];
      } else if (val < 6) { // eslint-disable-line no-magic-numbers
        teamIds = ["team-0"];
      } else if (val < 8) { // eslint-disable-line no-magic-numbers
        teamIds = ["team-1"];
      } else {
        teamIds = ["team-0", "team-1"];
      }
      // eslint-disable-next-line no-magic-numbers
      if (nPrivate < 3 && !teamIds.includes("private")) {
        nPrivate++;
        teamIds.push("private");
      }

      // Not using teamIds.forEach(): eslint(no-loop-func)
      for (const teamId of teamIds) {
        const member: ITeamMember = {
          invitationStatus: TeamMemberStatus.accepted,
          role: TeamMemberRole.patient,
          teamId,
          userId: user.userid,
          user,
        };
        patients.push(member);
      }
    }
    // Pending invite patient
    patients.push({
      invitationStatus: TeamMemberStatus.pending,
      role: TeamMemberRole.patient,
      teamId: "team-0",
      userId: "a0a0a0b0",
      user: {
        userid: "a0a0a0b0",
        username: "gerard.dumoulin@example.com",
        termsAccepted: "2021-01-05T15:00:00.000Z",
        profile: {
          firstName: "Gerard",
          lastName: "Dumoulin",
          fullName: "Gerard D.",
        },
      },
    });
    // FIXME end
    return patients;
  }

  log.error("Server response in error", response.status, response.statusText);

  switch (response.status) {
  case httpStatus.StatusInternalServerError:
    throw new Error(t("error-http-500"));
  default:
    throw new Error(t("error-http-40x"));
  }
}

export async function invitePatient(traceToken: string, sessionToken: string, teamId: string, username: string): Promise<void> {
  log.info(`invitePatient(${username}, ${teamId})`, traceToken, sessionToken);
  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);
  // For future!
  const team = teams?.find(t => t.id === teamId);
  if (typeof team === "object") {
    team.members.push({
      invitationStatus: TeamMemberStatus.pending,
      role: TeamMemberRole.patient,
      teamId,
      userId: username,
      user: {
        userid: username,
        username,
      },
    });
  }
}

export async function inviteMember(traceToken: string, sessionToken: string, teamId: string, username: string, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void> {
  log.info("inviteMember()", traceToken, sessionToken, teamId, username, role);
  if (teams === null || teams.length < 1) {
    throw new Error("Empty team list!");
  }

  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);

  // eslint-disable-next-line no-magic-numbers
  if (Math.random() < 0.2) {
    throw new Error(t("error-http-500"));
  }
}

export async function createTeam(traceToken: string, sessionToken: string, user: User, team: Partial<ITeam>): Promise<void> {
  log.info("createTeam()", traceToken, sessionToken, team);
  if (teams === null) {
    teams = [];
  }

  // id, code, owner fields will be set by the back-end API
  const teamId = `team-${Math.round(Math.random() * 1000)}`; // eslint-disable-line no-magic-numbers
  const tmpTeam = {
    ...team,
    id: teamId,
    code: "123-456-789",
    ownerId: "00000",
    type: TeamType.medical,
    members: [{
      invitationStatus: TeamMemberStatus.accepted,
      role: TeamMemberRole.admin,
      teamId,
      userId: user.userid,
      user,
    }],
  };

  // delete tmpTeam.members;

  teams.push(tmpTeam as ITeam);
  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);
}

export async function editTeam(traceToken: string, sessionToken: string, editedTeam: ITeam): Promise<void> {
  log.info("editTeam()", traceToken, sessionToken, editedTeam);
  if (teams === null || teams.length < 1) {
    throw new Error("Empty team list!");
  }
  const nTeams = teams.length;
  for (let i = 0; i < nTeams; i++) {
    const team = teams[i];
    if (editedTeam.id === team.id) {
      teams[i] = editedTeam;
      break;
    }
  }
  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);
}

export async function leaveTeam(traceToken: string, sessionToken: string, teamId: string): Promise<void> {
  log.info("leaveTeam()", traceToken, sessionToken, teamId);

  if (teams === null || teams.length < 1) {
    throw new Error("Empty team list !");
  }

  // eslint-disable-next-line no-magic-numbers
  if (Math.random() < 0.2) {
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
    throw new Error("A random error");
  }

  const nTeams = teams.length;
  for (let i = 0; i < nTeams; i++) {
    const thisTeam = teams[i];
    if (thisTeam.id === teamId) {
      log.debug(`Removing team ${thisTeam.id}`);
      teams.splice(i, 1);
      break;
    }
  }

  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);
}

export async function removeMember(traceToken: string, sessionToken: string, teamId: string, userId: string): Promise<void> {
  log.info("removeMember()", traceToken, sessionToken, teamId, userId);
  if (teams === null || teams.length < 1) {
    throw new Error("Empty team list!");
  }

  // eslint-disable-next-line no-magic-numbers
  if (Math.random() < 0.2) {
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
    throw new Error("A random error");
  }

  const nTeams = teams.length;
  for (let i = 0; i < nTeams; i++) {
    const thisTeam = teams[i];
    if (thisTeam.id === teamId) {
      if (Array.isArray(thisTeam.members)) {
        const idx = thisTeam.members.findIndex((tm: ITeamMember): boolean => tm.userId === userId);
        if (idx > -1) {
          thisTeam.members.splice(idx, 1);
        }
      }
      break;
    }
  }
  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);
}

export async function changeMemberRole(traceToken: string, sessionToken: string, teamId: string, userId: string, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void> {
  log.info("changeMemberRole()", traceToken, sessionToken, teamId, userId, role);
  if (teams === null || teams.length < 1) {
    throw new Error("Empty team list!");
  }

  // eslint-disable-next-line no-magic-numbers
  if (Math.random() < 0.2) {
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
    throw new Error("A random error");
  }

  const nTeams = teams.length;
  for (let i = 0; i < nTeams; i++) {
    const thisTeam = teams[i];
    if (thisTeam.id === teamId) {
      if (!Array.isArray(thisTeam.members)) {
        throw new Error("No member for this team !");
      }
      for (const member of thisTeam.members) {
        if (member.userId === userId) {
          member.role = role as TeamMemberRole;
          break;
        }
      }
      break;
    }
  }
  // eslint-disable-next-line no-magic-numbers
  await waitTimeout(500 + Math.random() * 200);
}
