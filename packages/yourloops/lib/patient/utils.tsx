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
import { Team } from '../team'
import PatientApi from './patient-api'
import { mapITeamMemberToPatient } from '../../components/patient/utils'
import { INotification } from '../notifications/models'

export default class PatientUtils {
  static computePatientTeams(partialPatientTeams: PatientTeam[], teams: Team[], invitations: INotification[]): PatientTeam[] {
    return partialPatientTeams.map(partialPatientTeam => {
      const team = teams.find(team => team.id === partialPatientTeam.teamId)
      if (!team) {
        // throw Error(`Could not compute patient teams as team with id ${partialPatientTeam.teamId} could not be found`)
        return {} as PatientTeam
      } else {
        return {
          code: team.code,
          invitation: invitations.find(invitation => invitation.target.id === team.id),
          status: partialPatientTeam.status,
          teamId: partialPatientTeam.teamId,
          teamName: team.name
        }
      }
    })
  }

  static async computePatients(teams: Team[], invitations: INotification[]): Promise<Patient[]> {
    const res = []
    const patientsAsITeamMembers = await PatientApi.getPatients()
    const patientsWithUncompletedTeams = patientsAsITeamMembers.map(patientAsITeamMember => mapITeamMemberToPatient(patientAsITeamMember))
    const patientsWithDuplicates = patientsWithUncompletedTeams.map(patient => {
      patient.teams = PatientUtils.computePatientTeams(patient.teams, teams, invitations)
      return patient
    })
    patientsWithDuplicates.forEach(patient => {
      if (!res.find(mergedPatient => mergedPatient.userid === patient.userid)) {
        patient.teams = patientsWithDuplicates.filter(patientDuplicated => patientDuplicated.userid === patient.userid).map(p => p.teams[0])
        res.push(patient)
      }
    })
    return res
  }
}
