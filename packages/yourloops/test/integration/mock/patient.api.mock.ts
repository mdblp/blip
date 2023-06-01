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

import PatientApi from '../../../lib/patient/patient.api'
import {
  patient1AsTeamMember,
  patient3AsTeamMember,
  PATIENTS_BY_TEAMID,
  pendingPatientAsTeamMember,
  patient2AsTeamMember
} from '../data/patient.api.data'
import { mySecondTeamId } from './team.api.mock'

export const mockPatientApiForPatients = () => {
  jest.spyOn(PatientApi, 'getPatient').mockImplementation((userId: string) => {
    const patientsToReturn = PATIENTS_BY_TEAMID[mySecondTeamId]
    if (!patientsToReturn) {
      console.warn('Your mocked getPatient return is undefined, make sure that this is a wanted behaviour.', userId)
    }
    return Promise.resolve(patientsToReturn)
  })
  jest.spyOn(PatientApi, 'getPatients').mockResolvedValue([patient1AsTeamMember])
  jest.spyOn(PatientApi, 'updatePatientAlerts').mockResolvedValue(undefined)
}

export const mockPatientApiForCaregivers = () => {
  jest.spyOn(PatientApi, 'getPatients').mockResolvedValue([patient1AsTeamMember, patient2AsTeamMember, patient3AsTeamMember, pendingPatientAsTeamMember])
  jest.spyOn(PatientApi, 'updatePatientAlerts').mockResolvedValue(undefined)
}
export const mockPatientApiForHcp = () => {
  jest.spyOn(PatientApi, 'getPatientsForHcp').mockImplementation((userId: string, teamId: string) => {
    const patientsToReturn = PATIENTS_BY_TEAMID[teamId]
    if (!patientsToReturn) {
      console.warn('Your mocked patients return is undefined, make sure that this is a wanted behaviour.')
    }
    return Promise.resolve(patientsToReturn)
  })
  jest.spyOn(PatientApi, 'updatePatientAlerts').mockResolvedValue(undefined)
}
