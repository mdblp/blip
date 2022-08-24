/**
 * Copyright (c) 2021, Diabeloop
 * Teams utility functions
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

import { Patient, PatientTeam } from '../data/patient'
import PatientApi from './patient-api'
import { mapITeamMemberToPatient } from '../../components/patient/utils'

export default class PatientUtils {
  static removeDuplicates(patientsWithDuplicates: Patient[]): Patient[] {
    const patientsWithoutDuplicates = []
    patientsWithDuplicates.forEach(patient => {
      if (!patientsWithoutDuplicates.find(mergedPatient => mergedPatient.userid === patient.userid)) {
        patient.teams = patientsWithDuplicates.filter(patientDuplicated => patientDuplicated.userid === patient.userid).map(p => p.teams[0])
        patientsWithoutDuplicates.push(patient)
      }
    })
    return patientsWithoutDuplicates
  }

  static async retrievePatients(): Promise<Patient[]> {
    const patientsAsITeamMembers = await PatientApi.getPatients()
    return patientsAsITeamMembers.map(patientAsITeamMember => mapITeamMemberToPatient(patientAsITeamMember))
  }

  static async computePatients(): Promise<Patient[]> {
    return PatientUtils.removeDuplicates(await PatientUtils.retrievePatients())
  }

  static getRemoteMonitoringTeam(patient: Patient): PatientTeam {
    const remoteMonitoredTeam = patient.teams.find(team => team.remoteMonitoringEnabled)
    if (!remoteMonitoredTeam) {
      throw Error(`Could not find a monitored team for patient ${patient.userid}`)
    }
    return remoteMonitoredTeam
  }
}
