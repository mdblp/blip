/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { type PatientFilterStats } from './patient-filter-stats.model'
import { type Team } from '../../team'
import { type MedicalData } from '../../data/models/medical-data.model'
import { type Patient } from './patient.model'
import { type PatientTeam } from './patient-team.model'

export interface PatientContextResult {
  patients: Patient[]
  patientsFilterStats: PatientFilterStats
  errorMessage: string | null
  initialized: boolean
  refreshInProgress: boolean
  getPatientByEmail: (email: string) => Patient
  getPatientById: (userId: string) => Patient
  searchPatients: (search: string) => Patient[]
  invitePatient: (team: Team, username: string) => Promise<void>
  editPatientRemoteMonitoring: (patient: Patient) => void
  markPatientMessagesAsRead: (patient: Patient) => void
  updatePatientMonitoring: (patient: Patient) => Promise<void>
  removePatient: (patient: Patient, patientTeam: PatientTeam) => Promise<void>
  leaveTeam: (team: string) => Promise<void>
  setPatientMedicalData: (userId: string, medicalData: MedicalData | null) => void
  refresh: () => void
}
