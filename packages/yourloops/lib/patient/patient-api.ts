/*
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
import { ITeamMember } from '../../models/team'
import HttpService, { ErrorMessageStatus } from '../../services/http'
import bows from 'bows'
import { INotificationAPI } from '../../models/notification'
import { UserRoles } from '../../models/user'
import { HttpHeaderKeys } from '../../models/api'
import { getCurrentLang } from '../language'
import { Monitoring } from '../../models/monitoring'
import { Patient } from '../data/patient'

const log = bows('Patient API')

export const PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE = 'patient-already-in-team'
const PATIENT_ALREADY_IN_TEAM_ERROR_CODE = 409

interface InvitePatientArgs {
  teamId: string
  email: string
}

interface InvitePatientPayload extends InvitePatientArgs {
  role: UserRoles
}

export default class PatientApi {
  static async getPatients(): Promise<ITeamMember[]> {
    try {
      const { data } = await HttpService.get<ITeamMember[]>({ url: '/v0/my-patients' })
      return data
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info('No patients')
        return []
      }
      throw err
    }
  }

  static async getPatientsForHcp(userId: string): Promise<Patient[]> {
    const { data } = await HttpService.get<Patient[]>({ url: `/bff/v1/hcps/${userId}/patients` })
    return data
  }

  static async invitePatient({ teamId, email }: InvitePatientArgs): Promise<INotificationAPI> {
    try {
      const { data } = await HttpService.post<INotificationAPI, InvitePatientPayload>({
        url: '/confirm/send/team/invite',
        payload: { teamId, email, role: UserRoles.patient },
        config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } }
      }, [PATIENT_ALREADY_IN_TEAM_ERROR_CODE])
      return data
    } catch (error) {
      if (error.response.status === PATIENT_ALREADY_IN_TEAM_ERROR_CODE) {
        throw new Error(PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE)
      }
      throw error
    }
  }

  static async updatePatientAlerts(teamId: string, patientId: string, monitoring: Monitoring): Promise<void> {
    await HttpService.put<void, Monitoring>({
      url: `/crew/v0/teams/${teamId}/patients/${patientId}/monitoring`,
      payload: monitoring
    })
  }

  static async removePatient(teamId: string, userId: string): Promise<void> {
    await HttpService.delete({ url: `/crew/v0/teams/${teamId}/patients/${userId}` })
  }
}
