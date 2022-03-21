/**
 * Copyright (c) 2022, Diabeloop
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

import { TeamAPI } from "../../../lib/team";
import { emptyTeam3, members, patients, teams } from "../../common";

export const teamAPI: TeamAPI = {
  fetchTeams: jest.fn().mockResolvedValue(teams),
  fetchPatients: jest.fn().mockResolvedValue(patients),
  changeMemberRole: jest.fn().mockReturnValue(() => Promise.resolve()),
  createTeam: jest.fn().mockResolvedValue(teams[1]),
  editTeam: jest.fn().mockReturnValue(() => Promise.resolve()),
  inviteMember: jest.fn().mockResolvedValue(members[0]),
  invitePatient: jest.fn().mockResolvedValue(patients[4]),
  deleteTeam: jest.fn().mockReturnValue(() => Promise.resolve()),
  leaveTeam: jest.fn().mockReturnValue(() => Promise.resolve()),
  removeMember: jest.fn().mockReturnValue(() => Promise.resolve()),
  removePatient: jest.fn().mockReturnValue(() => Promise.resolve()),
  getTeamFromCode: jest.fn().mockResolvedValue(emptyTeam3),
  joinTeam: jest.fn().mockReturnValue(() => Promise.resolve()),
};

export function resetTeamAPIStubs(): void {
  (teamAPI.fetchTeams as jest.Mock).mockReset();
  (teamAPI.fetchPatients as jest.Mock).mockReset();
  (teamAPI.changeMemberRole as jest.Mock).mockReset();
  (teamAPI.createTeam as jest.Mock).mockReset();
  (teamAPI.editTeam as jest.Mock).mockReset();
  (teamAPI.inviteMember as jest.Mock).mockReset();
  (teamAPI.invitePatient as jest.Mock).mockReset();
  (teamAPI.deleteTeam as jest.Mock).mockReset();
  (teamAPI.leaveTeam as jest.Mock).mockReset();
  (teamAPI.removeMember as jest.Mock).mockReset();
  (teamAPI.removePatient as jest.Mock).mockReset();

  (teamAPI.fetchTeams as jest.Mock).mockResolvedValue(teams);
  (teamAPI.fetchPatients as jest.Mock).mockResolvedValue(patients);
}
