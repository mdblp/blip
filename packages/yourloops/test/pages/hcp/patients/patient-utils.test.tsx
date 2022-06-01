/**
 * Copyright (c) 2022, Diabeloop
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

import { createAlarm, createPatient, createTeamMember, createTeamUser } from "../../../common/utils";
import {
  comparePatients,
  mapTeamMemberToPatientTeam,
  mapTeamUserToPatient,
} from "../../../../components/patient/utils";
import { PatientTableSortFields, UserInvitationStatus } from "../../../../models/generic";
import { Patient, PatientTeam } from "../../../../lib/data/patient";
import { INotification } from "../../../../lib/notifications";
import { Profile } from "../../../../models/shoreline";
import { Monitoring } from "../../../../models/monitoring";

describe("Patient utils", () => {

  describe("comparePatients", () => {

    describe("alertTimeTarget", () => {
      const smallerAlarm = createAlarm(10, 0);
      const biggerAlarm = createAlarm(11, 0);

      it("should return negative number when first patient has a smaller alarm value", () => {
        const patient1 = createPatient("fakePatient1Id", [], smallerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], biggerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient has a smaller alarm value", () => {
        const patient1 = createPatient("fakePatient1Id", [], biggerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], smallerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when patients have same alarm value", () => {
        const patient1 = createPatient("fakePatient1Id", [], smallerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], smallerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget);
        expect(res).toBe(0);
      });

      it("should return positive number when first patient has smaller alarm", () => {
        const patient1 = createPatient("fakePatient1Id", [], smallerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], biggerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget);
        expect(res).toBeLessThan(0);
      });

      it("should return negative number when second patient has bigger alarm", () => {
        const patient1 = createPatient("fakePatient1Id", [], biggerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], smallerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when both patient have same alarm", () => {
        const patient1 = createPatient("fakePatient1Id", []);
        const patient2 = createPatient("fakePatient2Id", []);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertTimeTarget);
        expect(res).toBe(0);
      });
    });

    describe("alertHypoglycemic", () => {
      const smallerAlarm = createAlarm(0, 10);
      const biggerAlarm = createAlarm(0, 11);

      it("should return negative number when first patient has a smaller alarm", () => {
        const patient1 = createPatient("fakePatient1Id", [], smallerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], biggerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient has a smaller alarm value", () => {
        const patient1 = createPatient("fakePatient1Id", [], biggerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], smallerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when patients have same alarm value", () => {
        const patient1 = createPatient("fakePatient1Id", [], smallerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], smallerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic);
        expect(res).toBe(0);
      });

      it("should return positive number when first patient has smaller alarm", () => {
        const patient1 = createPatient("fakePatient1Id", [], smallerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], biggerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient has smaller alarm", () => {
        const patient1 = createPatient("fakePatient1Id", [], biggerAlarm);
        const patient2 = createPatient("fakePatient2Id", [], smallerAlarm);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when both patient have same alarm", () => {
        const patient1 = createPatient("fakePatient1Id", []);
        const patient2 = createPatient("fakePatient2Id", []);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.alertHypoglycemic);
        expect(res).toBe(0);
      });
    });

    describe("remoteMonitoring", () => {
      const smallerDate = new Date();
      const biggerDate = new Date(smallerDate.getUTCFullYear(), smallerDate.getMonth() + 1);
      const firstRemoteMonitoringEnding = { monitoringEnd: smallerDate } as Monitoring;
      const lastRemoteMonitoringEnding = { monitoringEnd: biggerDate } as Monitoring;

      it("should return negative number when first patient has a more recent date", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", firstRemoteMonitoringEnding);
        const patient2 = createPatient("fakePatient2Id", [], null, "", lastRemoteMonitoringEnding);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient has a more recent date", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", lastRemoteMonitoringEnding);
        const patient2 = createPatient("fakePatient2Id", [], null, "", firstRemoteMonitoringEnding);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when patients have same date", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", firstRemoteMonitoringEnding);
        const patient2 = createPatient("fakePatient2Id", [], null, "", firstRemoteMonitoringEnding);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring);
        expect(res).toBe(0);
      });

      it("should return positive number when first patient has no remote monitoring", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "");
        const patient2 = createPatient("fakePatient2Id", [], null, "", firstRemoteMonitoringEnding);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring);
        expect(res).toBeGreaterThan(0);
      });

      it("should return negative number when second patient has no remote monitoring", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", firstRemoteMonitoringEnding);
        const patient2 = createPatient("fakePatient2Id", [], null, "");
        const res = comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring);
        expect(res).toBeLessThan(0);
      });

      it("should return 0 when both patient have no remote monitoring", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "");
        const patient2 = createPatient("fakePatient2Id", [], null, "");
        const res = comparePatients(patient1, patient2, PatientTableSortFields.remoteMonitoring);
        expect(res).toBe(0);
      });
    });

    describe("system", () => {
      const smallerSystemName = "DBLG1";
      const biggerSystemName = "DBLG2";

      it("should return negative number when first patient has a smaller system name", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", null, smallerSystemName);
        const patient2 = createPatient("fakePatient2Id", [], null, "", null, biggerSystemName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.system);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient has a smaller system name", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", null, biggerSystemName);
        const patient2 = createPatient("fakePatient2Id", [], null, "", null, smallerSystemName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.system);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when patients have same system name", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", null, smallerSystemName);
        const patient2 = createPatient("fakePatient2Id", [], null, "", null, smallerSystemName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.system);
        expect(res).toBe(0);
      });

      it("should return positive number when first patient has no system name", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "");
        const patient2 = createPatient("fakePatient2Id", [], null, "", null, smallerSystemName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.system);
        expect(res).toBeGreaterThan(0);
      });

      it("should return negative number when second patient has no system name", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", null, smallerSystemName);
        const patient2 = createPatient("fakePatient2Id", [], null, "");
        const res = comparePatients(patient1, patient2, PatientTableSortFields.system);
        expect(res).toBeLessThan(0);
      });

      it("should return 0 when both patient have no system name", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "");
        const patient2 = createPatient("fakePatient2Id", [], null, "");
        const res = comparePatients(patient1, patient2, PatientTableSortFields.system);
        expect(res).toBe(0);
      });
    });

    describe("patientFullName", () => {
      const smallerPatientName = "aaron";
      const biggerPatientName = "zacchaeus";

      it("should return negative number when first patient has a smaller fullname", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, smallerPatientName);
        const patient2 = createPatient("fakePatient2Id", [], null, biggerPatientName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.patientFullName);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient has a smaller fullname", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, biggerPatientName);
        const patient2 = createPatient("fakePatient2Id", [], null, smallerPatientName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.patientFullName);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when patients have same fullname", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, smallerPatientName);
        const patient2 = createPatient("fakePatient2Id", [], null, smallerPatientName);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.patientFullName);
        expect(res).toBe(0);
      });
    });

    describe("flag", () => {

      it("should return negative number when first patient is flagged", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", null, null, true);
        const patient2 = createPatient("fakePatient2Id", []);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.patientFullName);
        expect(res).toBeLessThan(0);
      });

      it("should return positive number when second patient is flagged", () => {
        const patient1 = createPatient("fakePatient1Id", [],);
        const patient2 = createPatient("fakePatient2Id", [], null, "", null, null, true);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.patientFullName);
        expect(res).toBeGreaterThan(0);
      });

      it("should return 0 when patients are flagged", () => {
        const patient1 = createPatient("fakePatient1Id", [], null, "", null, null, true);
        const patient2 = createPatient("fakePatient2Id", [], null, "", null, null, true);
        const res = comparePatients(patient1, patient2, PatientTableSortFields.patientFullName);
        expect(res).toBe(0);
      });
    });
  });

  describe("mapMembersToPatientTeamStatus", () => {

    it("should map correctly", () => {
      const member = createTeamMember("fakeTeamMember", "teamName", "fakeTeamCode", UserInvitationStatus.accepted);
      member.invitation = { id: "invitationId" } as INotification;
      const patientTeam: PatientTeam = {
        code: member.team.code,
        invitation: member.invitation,
        status: member.status,
        teamId: member.team.id,
        teamName: member.team.name,
      };
      const res = mapTeamMemberToPatientTeam(member);
      expect(res).toStrictEqual(patientTeam);
    });
  });

  describe("mapTeamUserToPatient", () => {

    it("should map correctly", () => {
      const profile: Profile = {
        fullName: "fake full name",
        firstName: "fake full",
        lastName: "name",
      };
      const member = createTeamMember("fakeTeamMember", "teamName", "fakeTeamCode", UserInvitationStatus.accepted);
      const teamUser = createTeamUser("fakeTeamMember", [member], profile);
      const patient: Patient = {
        metadata: {
          alarm: teamUser.alarms,
          flagged: undefined,
          medicalData: null,
          unreadMessagesSent: 0,
        },
        monitoring: undefined,
        profile: {
          birthdate: undefined,
          firstName: profile.firstName,
          fullName: profile.fullName,
          lastName: profile.lastName,
          username: teamUser.username,
        },
        settings: {
          a1c: undefined,
          system: "DBLG1",
        },
        teams: [mapTeamMemberToPatientTeam(teamUser.members[0])],
        userid: teamUser.userid,
      };
      const res = mapTeamUserToPatient(teamUser);
      patient.monitoring = res.monitoring;
      expect(res).toStrictEqual(patient);
    });
  });
});

