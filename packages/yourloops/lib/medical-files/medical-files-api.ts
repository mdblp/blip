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
import { MedicalRecord, NewMedicalRecord, Prescription, WeeklyReport } from "./model";
import HttpService from "../../services/http";

export default class MedicalFilesApi {
  static async getPrescriptions(patientId: string, teamId: string): Promise<Prescription[]> {
    const { data } = await HttpService.get<Prescription[]>({
      url: "cargo/v0/prescriptions",
      config: { params: { teamId, patientId } },
    });
    return data;
  }

  static async getPrescription(patientId: string, teamId: string, prescriptionId: string): Promise<Blob> {
    const { data } = await HttpService.get<Blob>({
      url: `/cargo/v0/prescriptions/${prescriptionId}`,
      config: { params: { teamId, patientId }, responseType: "blob" },
    });
    return data;
  }

  static async uploadPrescription(teamId: string, patientId: string, prescriptorId: string, initialPeriod: number, file: File): Promise<Prescription> {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("prescriptorId", prescriptorId);
    formData.append("initialPeriod", initialPeriod.toString());
    formData.append("teamId", teamId);
    formData.append("upload", file);
    const { data } = await HttpService.post<Prescription, FormData>({
      url: "cargo/v0/prescriptions",
      payload: formData,
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });
    return data;
  }

  static async getWeeklyReports(patientId: string, teamId: string): Promise<WeeklyReport[]> {
    const { data } = await HttpService.get<WeeklyReport[]>({
      url: "cargo/v0/weekly-reports",
      config: { params: { teamId, patientId } },
    });
    return data;
  }

  static async getWeeklyReport(patientId: string, teamId: string, weeklyReportId: string): Promise<WeeklyReport> {
    const { data } = await HttpService.get<WeeklyReport>({
      url: `/cargo/v0/weekly-reports/${weeklyReportId}`,
      config: { params: { teamId, patientId } },
    });
    return data;
  }

  static async getMedicalRecords(patientId: string, teamId: string): Promise<MedicalRecord[]> {
    const { data } = await HttpService.get<MedicalRecord[]>({
      url: "/cargo/v0/medical-records",
      config: { params: { teamId, patientId } },
    });
    return data;
  }

  static async getMedicalRecord(patientId: string, teamId: string, medicalRecordId: string): Promise<MedicalRecord> {
    const { data } = await HttpService.get<MedicalRecord>({
      url: `/cargo/v0/medical-records/${medicalRecordId}`,
      config: { params: { teamId, patientId } },
    });
    return data;
  }

  static async createMedicalRecord(payload: NewMedicalRecord): Promise<MedicalRecord> {
    const { data } = await HttpService.post<MedicalRecord, NewMedicalRecord>({
      url: "/cargo/v0/medical-records",
      payload,
    });
    return data;
  }

  static async updateMedicalRecord(payload: MedicalRecord): Promise<MedicalRecord> {
    const { data } = await HttpService.post<MedicalRecord, MedicalRecord>({
      url: "/cargo/v0/medical-records",
      payload,
    });
    return data;
  }

  static async deleteMedicalRecord(medicalRecordId: string): Promise<void> {
    await HttpService.delete({ url: `/cargo/v0/medical-records/${medicalRecordId}` });
  }
}
