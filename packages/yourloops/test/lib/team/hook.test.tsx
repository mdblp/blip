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

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { Team, TeamContext, TeamContextProvider, TeamMember, useTeam } from "../../../lib/team";
import { FilterType, PatientFilterTypes, UserInvitationStatus } from "../../../models/generic";
import { loggedInUsers } from "../../common";
import { directShareAPI } from "../direct-share/hook";
import { teamAPI } from "./utils";
import { createAuthHookStubs } from "../auth/utils";
import { INotification, NotificationContextProvider, NotificationType } from "../../../lib/notifications";
import { TeamMemberRole } from "../../../models/team";
import { UserRoles } from "../../../models/shoreline";
import { createPatient, createPatientTeam } from "../../common/utils";
import { Patient } from "../../../lib/data/patient";
import { stubNotificationContextValue } from "../notifications/utils";

describe("Team hook", () => {

  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  let container: HTMLElement | null = null;

  let teamHook: TeamContext;
  let patients: Patient[];

  async function mountComponent(): Promise<void> {
    const DummyComponent = (): JSX.Element => {
      teamHook = useTeam();
      patients = teamHook.getPatients();
      return (<div />);
    };
    await act(() => {
      return new Promise(resolve => render(
        <AuthContextProvider value={authHookHcp}>
          <NotificationContextProvider value={stubNotificationContextValue}>
            <TeamContextProvider teamAPI={teamAPI} directShareAPI={directShareAPI}>
              <DummyComponent />
            </TeamContextProvider>
          </NotificationContextProvider>
        </AuthContextProvider>,
        container, resolve)
      );
    });
  }

  beforeEach(async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    await mountComponent();
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  describe("filterPatients", () => {
    it("should return correct patients when filter is pending", () => {
      const patientsExpected = patients.filter(patient => patient.teams.find(team => team.status === UserInvitationStatus.pending) !== undefined);
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.pending, "", []);
      expect(patientsReceived).toEqual(patientsExpected);
    });

    it("should return correct patients when provided a flag list", () => {
      const patientExpected = patients[0];
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.flagged, "", [patientExpected.userid]);
      expect(patientsReceived).toEqual([patientExpected]);
    });
  });

  describe("computeFlaggedPatients", () => {
    it("should return patients with the correct flagged attribute", () => {
      const flaggedPatientIds = [patients[0].userid];
      const patientsUpdated = teamHook.computeFlaggedPatients(patients, flaggedPatientIds);
      patientsUpdated.forEach(patient => {
        expect(patient.flagged).toBe(flaggedPatientIds.includes(patient.userid));
      });
    });
  });

  describe("isInAtLeastATeam", () => {
    it("should return false when team user does not have an accepted status in any team", () => {
      const members = [
        createPatientTeam("team1Id", UserInvitationStatus.pending),
        createPatientTeam("team2Id", UserInvitationStatus.pending),
      ];
      const teamUser = createPatient("id1", members);
      const res = teamHook.isInAtLeastATeam(teamUser);
      expect(res).toBe(false);
    });

    it("should return true when team user does has an accepted status in a team", () => {

      const members = [
        createPatientTeam("team1Id", UserInvitationStatus.pending),
        createPatientTeam("team2Id", UserInvitationStatus.accepted),
      ];
      const teamUser = createPatient("id1", members);

      const res = teamHook.isInAtLeastATeam(teamUser);
      expect(res).toBe(true);
    });
  });

  describe("removeMember", () => {

    function buildTeamMember(teamId = "fakeTeamId", userId = "fakeUserId", invitation: INotification = null): TeamMember {
      return {
        team: { id: teamId } as Team,
        role: TeamMemberRole.admin,
        status: UserInvitationStatus.pending,
        user: {
          role: UserRoles.hcp,
          userid: userId,
          username: "fakeUsername",
          members: [],
        },
        invitation,
      };
    }

    function buildInvite(teamId = "fakeTeamId", userId = "fakeUserId"): INotification {
      return {
        id: "fakeInviteId",
        type: NotificationType.careTeamProInvitation,
        metricsType: "join_team",
        email: "fake@email.com",
        creatorId: "fakeCreatorId",
        date: "fakeDate",
        target: {
          id: teamId,
          name: "fakeTeamName",
        },
        role: TeamMemberRole.admin,
        creator: {
          userid: userId,
        },
      };
    }

    it("should throw an error when there is no invitation", () => {
      const teamMember = buildTeamMember();
      expect(async () => {
        await teamHook.removeMember(teamMember);
      }).rejects.toThrow();
    });

    it("should throw an error when there is no invitation for the member team", () => {
      const teamMember = buildTeamMember("fakeTeamId", "fakeUserId", buildInvite("wrongTeam"));
      expect(async () => {
        await teamHook.removeMember(teamMember);
      }).rejects.toThrow();
    });
  });
});
