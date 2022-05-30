/**
 * Copyright (c) 2022, Diabeloop
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
import { MedicalRecord, Prescription, WeeklyReport } from "./model";
import HttpService from "../../services/http";

export default class MedicalFilesApi {
  static async getPrescriptions(patientId: string, teamId: string): Promise<Prescription[]> {
    try {
      const { data } = await HttpService.get<Prescription[]>({
        url: "/v0/prescriptions",
        config: { params: { teamId, patientId } },
      });
      return data;
    } catch (err) {
      const arr = [...Array(1).keys()];
      let count = 1;
      return arr.map(() => ({
        id: "56445d354",
        link: "",
        name: "Ordo" + count++,
        patientId: "se454216",
        prescriptorId: "78454315",
        teamId: "145246",
        timezone: "",
        uploadedAt: new Date(),
      }));
    }
  }

  static async getWeeklyReports(patientId: string, teamId: string): Promise<WeeklyReport[]> {
    try {
      const { data } = await HttpService.get<WeeklyReport[]>({
        url: "/v0/weekly-reports",
        config: { params: { teamId, patientId } },
      });
      return data;
    } catch (err) {
      const arr = [...Array(6).keys()];
      let count = 1;
      return arr.map(() => ({
        id: "4551",
        patientId: "464168",
        teamId: "546121651",
        name: "reports" + count++,
        timezone: "",
        createdAt: new Date(),
      }));
    }
  }

  static async getMedicalRecords(patientId: string, teamId: string): Promise<MedicalRecord[]> {
    try {
      const { data } = await HttpService.get<MedicalRecord[]>({
        url: "/v0/medical-records",
        config: { params: { teamId, patientId } },
      });
      return data;
    } catch (err) {
      const arr = [...Array(7).keys()];
      let count = 1;
      return arr.map(() => ({
        authorId: "",
        createdAt: new Date(),
        diagnosis: "",
        id: "",
        name: "Medical record " + count++,
        patientId: "",
        progressionProposal: "",
        teamId: "",
        timezone: "",
        trainingSubject: "",
      }));
    }
  }
}
