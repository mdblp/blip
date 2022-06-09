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

import { Team, TeamContext, TeamContextProvider, TeamMember, useTeam } from "../../../lib/team";
import { PatientFilterTypes, UserInvitationStatus } from "../../../models/generic";
import * as notificationHookMock from "../../../lib/notifications";
import { INotification, NotificationType } from "../../../lib/notifications";
import { TeamMemberRole } from "../../../models/team";
import { UserRoles } from "../../../models/shoreline";
import { buildTeam, buildTeamMember, createPatient, createPatientTeam } from "../../common/utils";
import * as authHookMock from "../../../lib/auth";
import { Session } from "../../../lib/auth";
import User from "../../../lib/auth/user";
import { Patient } from "../../../lib/data/patient";
import TeamUtils from "../../../lib/team/utils";
import { mapTeamUserToPatient } from "../../../components/patient/utils";

jest.mock("../../../lib/auth");
jest.mock("../../../lib/notifications");
describe("Team hook", () => {
  let container: HTMLElement | null = null;
  let teamHook: TeamContext;
  let patients: Patient[] = [];
  const session: Session = { user: {} as User, sessionToken: "fakeSessionToken", traceToken: "fakeTraceToken" };
  const memberPatientAccepted1 = buildTeamMember("team1Id", "memberPatientAccepted1", undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.accepted, UserRoles.patient);
  const memberPatientPending1 = buildTeamMember("team1Id", "memberPatientPending1", undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.pending, UserRoles.patient);
  const memberPatientPending2 = buildTeamMember("team1Id", "memberPatientPending2", undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.pending, UserRoles.patient);
  const team1 = buildTeam("team1Id", [memberPatientAccepted1, memberPatientPending1]);
  const team2 = buildTeam("team2Id", [memberPatientPending1, memberPatientPending2]);
  const team3 = buildTeam("team3Id", []);
  const team4 = buildTeam("team4Id", []);
  const teams: Team[] = [team1, team2, team3, team4];

  async function mountComponent(): Promise<void> {
    const DummyComponent = (): JSX.Element => {
      teamHook = useTeam();
      patients = teamHook.getPatients();
      return (<div />);
    };
    await act(() => {
      return new Promise(resolve => render(
        <TeamContextProvider>
          <DummyComponent />
        </TeamContextProvider>, container, resolve));
    });
  }

  beforeAll(() => {
    jest.spyOn(TeamUtils, "loadTeams").mockResolvedValue({ teams, flaggedNotInResult: [] });
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { session: () => session };
    });
    (notificationHookMock.NotificationContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return {
        initialized: true,
        sentInvitations: [],
      };
    });
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  describe("filterPatients", () => {
    it("should return correct patients when filter is pending", async () => {
      await mountComponent();
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.pending, "", []);
      expect(patientsReceived).toEqual([mapTeamUserToPatient(memberPatientPending1.user), mapTeamUserToPatient(memberPatientPending2.user)]);
    });

    it("should return correct patients when provided a flag list", async () => {
      await mountComponent();
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.flagged, "", [memberPatientAccepted1.user.userid]);
      expect(patientsReceived).toEqual([mapTeamUserToPatient(memberPatientAccepted1.user)]);
    });
  });

  describe("computeFlaggedPatients", () => {
    it("should return patients with the correct flagged attribute", async () => {
      await mountComponent();
      const flaggedPatientIds = [memberPatientAccepted1.user.userid];
      const patientsUpdated = teamHook.computeFlaggedPatients(patients, flaggedPatientIds);
      patientsUpdated.forEach(patient => {
        expect(patient.metadata.flagged).toBe(flaggedPatientIds.includes(patient.userid));
      });
    });
  });

  describe("isInAtLeastATeam", () => {
    it("should return false when team user does not have an accepted status in any team", () => {
      mountComponent();
      const members = [
        createPatientTeam("team1Id", UserInvitationStatus.pending),
        createPatientTeam("team2Id", UserInvitationStatus.pending),
      ];
      const teamUser = createPatient("id1", members);
      const res = teamHook.isInAtLeastATeam(teamUser);
      expect(res).toBe(false);
    });

    it("should return true when team user does has an accepted status in a team", () => {
      mountComponent();
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
      mountComponent();
      const teamMember = buildTeamMember();
      expect(async () => {
        await teamHook.removeMember(teamMember);
      }).rejects.toThrow();
    });

    it("should throw an error when there is no invitation for the member team", () => {
      mountComponent();
      const teamMember = buildTeamMember("fakeTeamId", "fakeUserId", buildInvite("wrongTeam"));
      expect(async () => {
        await teamHook.removeMember(teamMember);
      }).rejects.toThrow();
    });
  });
});
