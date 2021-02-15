/**
 * Copyright (c) 2021, Diabeloop
 * Teams hook tests
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

import sinon from "sinon";
// import * as React from "react";
// import { v4 as uuidv4 } from "uuid";

// import { ITeamMember, ITeam } from "../../../models/team";
// import { TeamContext, Team, TeamAPI } from "../../../lib/team";
// import { loadTeams } from "../../../lib/team/hook";
import { TeamAPI } from "../../../lib/team";
import {
  teams,
  patients,
} from "../../common";

// export const fetchTeams = sinon.stub().resolves(fetchedTeams); // (): Promise<ITeam[]> => sinon.stub().resolves(fetchedTeams);
// export const fetchPatients = sinon.stub().resolves(fetchedPatients); // (): Promise<ITeamMember[]> => Promise.resolve(fetchedPatients);

export const teamAPI: TeamAPI = {
  fetchTeams: sinon.stub().resolves(teams),
  fetchPatients: sinon.stub().resolves(patients),
  changeMemberRole: sinon.stub().resolves(),
  createTeam: sinon.stub().resolves(),
  editTeam: sinon.stub().resolves(),
  inviteMember: sinon.stub().resolves(),
  invitePatient: sinon.stub().resolves(),
  leaveTeam: sinon.stub().resolves(),
  removeMember: sinon.stub().resolves(),
};

export function resetTeamAPIStubs(): void {
  (teamAPI.fetchTeams as sinon.SinonStub).resetHistory();
  (teamAPI.fetchPatients as sinon.SinonStub).resetHistory();
  (teamAPI.changeMemberRole as sinon.SinonStub).resetHistory();
  (teamAPI.createTeam as sinon.SinonStub).resetHistory();
  (teamAPI.editTeam as sinon.SinonStub).resetHistory();
  (teamAPI.inviteMember as sinon.SinonStub).resetHistory();
  (teamAPI.invitePatient as sinon.SinonStub).resetHistory();
  (teamAPI.leaveTeam as sinon.SinonStub).resetHistory();
  (teamAPI.removeMember as sinon.SinonStub).resetHistory();

  (teamAPI.fetchTeams as sinon.SinonStub).resolves(teams);
  (teamAPI.fetchPatients as sinon.SinonStub).resolves(patients);
}

// /**
//  * To be used by other tests
//  */
// export function TestTeamContext(): TeamContext {
//   console.log("TestTeamContext");
//   const [initialized, setInitialized] = React.useState<boolean>(false);
//   const [teams, setTeams] = React.useState<Team[]>([]);

//   const defaultTeamContext = DefaultTeamContext;
//   const defaultContext = defaultTeamContext();

//   React.useEffect(() => {
//     console.log("TestTeamContext: useEffect");
//     if (teams.length < 1) {
//       const traceToken = uuidv4();
//       const sessionToken = "";
//       loadTeams(traceToken, sessionToken, loggedInUsers.hcp, fetchTeams, fetchPatients).then(({ teams }) => {
//         setTeams(teams);
//         setInitialized(true);
//       });
//     }
//   }, [teams]);

//   const medicalTeams = defaultContext.getMedicalTeams();

//   return {
//     teams,
//     initialized,
//     errorMessage: null,
//     refresh: sinon.spy(),
//     getTeam: sinon.spy(),
//     getUser: sinon.spy(),
//     getMedicalTeams: sinon.stub().returns(medicalTeams),
//     getPatients: sinon.spy(),
//     getMedicalMembers: sinon.spy(),
//     getNumMedicalMembers: sinon.spy(),
//     getUserFirstName: sinon.spy(),
//     getUserLastName: sinon.spy(),
//     isUserAdministrator: sinon.spy(),
//     isUserTheOnlyAdministrator: sinon.spy(),
//     isInvitationPending: sinon.spy(),
//     isInTeam: sinon.spy(),
//     invitePatient: sinon.spy(),
//     inviteMember: sinon.spy(),
//     createTeam: sinon.spy(),
//     editTeam: sinon.spy(),
//     leaveTeam: sinon.spy(),
//     removeMember: sinon.spy(),
//     changeMemberRole: sinon.spy(),
//   };
// }
