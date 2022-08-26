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

import React from 'react'

import { Patient, PatientTeam } from '../data/patient'
import { Team } from '../team'
import { PatientFilterStats } from '../team/models'
import { PatientFilterTypes } from '../../models/generic'
import { MedicalData } from '../../models/device-data'
import { CircularProgress } from '@material-ui/core'
import usePatientProviderCustomHook from './hook'

export interface PatientContextResult {
  patients: Patient[]
  patientsFilterStats: PatientFilterStats
  errorMessage: string | null
  initialized: boolean
  getPatient: (userId: string) => Patient
  filterPatients: (filterType: PatientFilterTypes, search: string, flaggedPatients: string[]) => Patient[]
  invitePatient: (team: Team, username: string) => Promise<void>
  editPatientRemoteMonitoring: (patient: Patient) => void
  markPatientMessagesAsRead: (patient: Patient) => void
  updatePatientMonitoring: (patient: Patient) => Promise<void>
  removePatient: (patient: Patient, patientTeam: PatientTeam) => Promise<void>
  leaveTeam: (team: string) => Promise<void>
  setPatientMedicalData: (userId: string, medicalData: MedicalData | null) => void
  refresh: () => void
}

const PatientContext = React.createContext<PatientContextResult>({
  patients: [],
  patientsFilterStats: {} as PatientFilterStats,
  errorMessage: null,
  initialized: false,
  getPatient: () => ({} as Patient),
  filterPatients: () => [],
  invitePatient: async () => await Promise.resolve(),
  editPatientRemoteMonitoring: () => {
  },
  markPatientMessagesAsRead: () => {
  },
  updatePatientMonitoring: async () => await Promise.resolve(),
  removePatient: async () => await Promise.resolve(),
  leaveTeam: async () => await Promise.resolve(),
  setPatientMedicalData: () => {
  },
  refresh: () => {
  }
})

export const PatientProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const patientProviderCustomHook = usePatientProviderCustomHook()

  return patientProviderCustomHook.initialized ? (
    <PatientContext.Provider value={patientProviderCustomHook}>
      {children}
    </PatientContext.Provider>
  ) : <CircularProgress
    disableShrink
    style={{ position: 'absolute', top: 'calc(50vh - 20px)', left: 'calc(50vw - 20px)' }}
  />
}

export function usePatientContext(): PatientContextResult {
  return React.useContext(PatientContext)
}
