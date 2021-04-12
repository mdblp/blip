/**
 * Copyright (c) 2021, Diabeloop
 * Commons data for all tests
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

import { Units, UserInvitationStatus } from "../../models/generic";
import { User, UserRoles } from "../../models/shoreline";
import { ITeam, ITeamMember, TeamMemberRole, TeamType } from "../../models/team";

const userHCP: User = new User("a0000000", "john.doe@example.com");
userHCP.role = UserRoles.hcp;
userHCP.emailVerified = true;
userHCP.profile= { firstName: "John", lastName: "Doe", fullName: "John Doe" };
userHCP.preferences= { displayLanguageCode: "en" };
userHCP.settings = { units: { bg: Units.gram } };


/**
 * Logged in users for test, choose one suitable
 */
export const loggedInUsers = {
  hcp: userHCP,
  // patient: {} as User,
  // careGiver: {} as User,
};

/**
 * An example list of teams for the unit tests
 */
export const teams: ITeam[] = [
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
        userId: loggedInUsers.hcp.userid,
        role: TeamMemberRole.admin,
        invitationStatus: UserInvitationStatus.accepted,
        user: loggedInUsers.hcp,
      },
      {
        teamId: "team-0",
        userId: "a0a1a2a3",
        role: TeamMemberRole.viewer,
        invitationStatus: UserInvitationStatus.accepted,
        user: {
          userid: "a0a1a2a3",
          role: UserRoles.hcp,
          username: "jean.dupont@chu-grenoble.fr",
          profile: { firstName: "Jean", lastName: "Dupont", fullName: "Jean Dupont" },
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
        userId: loggedInUsers.hcp.userid,
        role: TeamMemberRole.viewer,
        invitationStatus: UserInvitationStatus.accepted,
        user: loggedInUsers.hcp,
      },
      {
        teamId: "team-1",
        userId: "b0b1b2b3",
        role: TeamMemberRole.admin,
        invitationStatus: UserInvitationStatus.accepted,
        user: {
          userid: "b0b1b2b3",
          username: "adelheide.alvar@charite.de",
          role: UserRoles.hcp,
          profile: { firstName: "Adelheide", lastName: "Alvar", fullName: "Adelheide Alvar" },
        },
      },
    ],
  },
  {
    id: "team-2-empty",
    name: "Empty Team 2",
    code: "123654789",
    phone: "0000",
    address: {
      line1: "Test",
      city: "Test",
      zip: "00000",
      country: "FR",
    },
    ownerId: loggedInUsers.hcp.userid,
    type: TeamType.medical,
    members: [
      {
        teamId: "team-1",
        userId: loggedInUsers.hcp.userid,
        role: TeamMemberRole.admin,
        invitationStatus: UserInvitationStatus.accepted,
        user: loggedInUsers.hcp,
      },
    ],
  },
];

export const emptyTeam3: ITeam = {
  id: "team-3-empty",
  name: "Empty Team 3",
  phone: "33 33 33 33",
  code: "333333333",
  address: {
    line1: "Empty street 3",
    city: "City Three",
    zip: "33333",
    country: "FR",
  },
  ownerId: "33333333",
  type: TeamType.medical,
  members: [],
};

export const members: ITeamMember[] = [
  {
    teamId: "team-0",
    userId: "b0b1b2b4",
    role: TeamMemberRole.admin,
    invitationStatus: UserInvitationStatus.pending,
    user: {
      userid: "b0b1b2b4",
      role: UserRoles.hcp,
      username: "michelle.dufour@chu-grenoble.fr",
      profile: { firstName: "Michelle", lastName: "Dufour", fullName: "Michelle Dufour" },
    },
  },
];

export const patients: ITeamMember[] = [
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: "team-0",
    userId: "a0a0a0b0",
    user: {
      userid: "a0a0a0b0",
      role: UserRoles.patient,
      username: "josephine.dupuis@example.com",
      profile: {
        firstName: "Josephine",
        lastName: "Dupuis",
        fullName: "Josephine D.",
      },
    },
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: "team-1",
    userId: "a0a0a0b0",
    user: {
      userid: "a0a0a0b0",
      role: UserRoles.patient,
      username: "josephine.dupuis@example.com",
      profile: {
        firstName: "Josephine",
        lastName: "Dupuis",
        fullName: "Josephine D.",
      },
    },
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: "team-1",
    userId: "a0a0a0b1",
    user: {
      userid: "a0a0a0b1",
      role: UserRoles.patient,
      username: "michel.dupont@example.com",
      profile: {
        firstName: "Michel",
        lastName: "Dupont",
        fullName: "Michel D.",
      },
    },
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: TeamType.private,
    userId: "a0a0a0b2",
    user: {
      userid: "a0a0a0b2",
      role: UserRoles.patient,
      username: "marivone.duplessie@example.com",
      profile: {
        firstName: "Marivone",
        lastName: "Duplessie",
        fullName: "Marivone Duplessie",
      },
    },
  },
  {
    invitationStatus: UserInvitationStatus.pending,
    role: TeamMemberRole.patient,
    teamId: "team-0",
    userId: "a0a0a0b3",
    user: {
      userid: "a0a0a0b3",
      role: UserRoles.patient,
      username: "gerard.dumoulin@example.com",
      profile: {
        firstName: "Gerard",
        lastName: "Dumoulin",
        fullName: "Gerard D.",
      },
    },
  },
];
