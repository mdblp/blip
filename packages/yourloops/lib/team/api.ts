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
import { UserInvitationStatus } from "../../models/generic";
import { UserRoles } from "../../models/shoreline";
import { TeamType, ITeam, ITeamMember, TeamMemberRole, TypeTeamMemberRole } from "../../models/team";
import { waitTimeout, errorFromHttpStatus } from "../../lib/utils";
import { Session } from "../auth";
import appConfig from "../config";

const log = bows("TeamAPI");
let teams: ITeam[] | null = null;
let teamToJoin: ITeam | null = null;

async function fetchTeams(session: Session): Promise<ITeam[]> {
  const { sessionToken, traceToken } = session;
  log.info("fetchTeams()");

  const apiURL = new URL(`/v0/teams`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    return response.json() as Promise<ITeam[]>;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function fetchPatients(session: Session): Promise<ITeamMember[]> {
  const { sessionToken, traceToken } = session;
  log.info("fetchPatients()");

  const apiURL = new URL(`/v0/patients`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function invitePatient(session: Session, teamId: string, username: string): Promise<ITeamMember> {
  const { sessionToken, traceToken } = session;
  log.info(`invitePatient(${username}, ${teamId})`);

  const apiURL = new URL(`/confirm/send/team/invite`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "POST",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({ teamId, email: username, role: UserRoles.patient }),
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function inviteMember(session: Session, teamId: string, email: string, role: Exclude<TypeTeamMemberRole, "patient">): Promise<ITeamMember> {
  const { sessionToken, traceToken } = session;
  log.info("inviteMember()", teamId, email, role);

  const apiURL = new URL(`/confirm/send/team/invite`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "POST",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({ teamId, email, role }),
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function createTeam(session: Session, team: Partial<ITeam>): Promise<ITeam> {
  const { sessionToken, traceToken /*, user */ } = session;

  // eslint-disable-next-line no-magic-numbers
  // await waitTimeout(100 + Math.random() * 50);

  log.info("createTeam()", team);

  if (typeof team.name !== "string") {
    throw new Error('Missing team name');
  }
  if (typeof team.address !== "object") {
    throw new Error('Missing team address');
  }
  if (typeof team.phone !== "string") {
    throw new Error('Missing team phone');
  }

  const apiURL = new URL(`/crew/v0/teams`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "POST",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({ ...team, type: TeamType.medical }),
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function editTeam(session: Session, editedTeam: ITeam): Promise<void> {
  const { sessionToken, traceToken } = session;
  log.info("editTeam()", traceToken, sessionToken, editedTeam);

  const apiURL = new URL(`/crew/v0/teams/${editedTeam.id}`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "PUT",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify(editedTeam),
  });

  if (response.ok) {
    return;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function leaveTeam(session: Session, teamId: string): Promise<void> {
  const { sessionToken, traceToken } = session;
  log.info("leaveTeam()", teamId);

  const apiURL = new URL(`/crew/v0/teams/${teamId}`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "DELETE",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    return;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function removeMember(session: Session, teamId: string, userId: string): Promise<void> {
  const { sessionToken, traceToken } = session;
  log.info("removeMember()", teamId, userId);

  const apiURL = new URL(`/crew/v0/teams/${teamId}/members/${userId}`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "DELETE",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    return;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function changeMemberRole(session: Session, teamId: string, userId: string, role: Exclude<TypeTeamMemberRole, "patient">): Promise<void> {
  const { sessionToken, traceToken } = session;
  log.info("changeMemberRole()", teamId, userId, role);

  try {
    const apiURL = new URL(`/confirm/send/team/role/${userId}`, appConfig.API_HOST);
    const response = await fetch(apiURL.toString(), {
      method: "PUT",
      headers: {
        [HttpHeaderKeys.traceToken]: traceToken,
        [HttpHeaderKeys.sessionToken]: sessionToken,
      },
      body: JSON.stringify({
        teamId,
        userId,
        role,
      }),
    });

    if (response.ok) {
      log.info("changeMemberRole", await response.json());
      return;
    }
  } catch (err) {
    log.error(err);
  }

  // Try direct change: My hydrophone config failed because of sesMock don't work (or not configured for hydrophone)
  const apiURL = new URL(`/crew/v0/teams/${teamId}/members`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "PUT",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
    body: JSON.stringify({
      teamId,
      userId,
      role,
    }),
  });

  if (response.ok) {
    return;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function getTeamFromCode(session: Session, code: string): Promise<ITeam | null> {
  if (code.match(/^[0-9]{9}$/) === null) {
    return Promise.resolve(null);
  }
  if (code[0] === "0") {
    // To test an error
    return Promise.resolve(null);
  }

  const team = {
    id: `team-${code}`,
    name: `Test Code Team`,
    code,
    owner: session.traceToken,
    type: TeamType.medical,
    address: {
      line1: "Avenue to be defined",
      zip: "002255",
      city: "Somewhere",
      country: "FR",
    },
    phone: `+33 (0) ${code}`,
    members: [],
  };

  teamToJoin = team;

  await waitTimeout(10);
  return team;
}

async function joinTeam(session: Session, teamId: string): Promise<void> {
  await waitTimeout(100);
  log.info("joinTeam", { teamId });

  if (teamId === teamToJoin?.id) {
    teamToJoin.members = [{
      invitationStatus: UserInvitationStatus.accepted,
      role: TeamMemberRole.patient,
      teamId,
      userId: session.user.userid,
      email: session.user.username,
      // user: session.user,
      preferences: null,
      profile: null,
      settings: null,
    }];
    teams?.push(teamToJoin);
    teamToJoin = null;
  } else {
    Promise.reject(new Error("Invalid team id"));
  }
}

export default {
  fetchTeams,
  fetchPatients,
  invitePatient,
  inviteMember,
  createTeam,
  editTeam,
  leaveTeam,
  removeMember,
  changeMemberRole,
  getTeamFromCode,
  joinTeam,
};
