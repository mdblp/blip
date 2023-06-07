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
import HttpService, { ErrorMessageStatus } from '../http/http.service'
import bows from 'bows'
import { type INotification } from '../notifications/models/i-notification.model'
import { getCurrentLang } from '../language'
import { UserRole } from '../auth/models/enums/user-role.enum'
import { type ITeamMember } from '../team/models/i-team-member.model'
import { HttpHeaderKeys } from '../http/models/enums/http-header-keys.enum'
import HttpStatus from '../http/models/enums/http-status.enum'
import { type Patient } from './models/patient.model'
import { type MonitoringAlertsParameters } from '../team/models/monitoring-alerts-parameters.model'

const log = bows('Patient API')

export const PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE = 'patient-already-in-team'
const PATIENT_ALREADY_IN_TEAM_ERROR_CODE = HttpStatus.StatusConflict

interface InvitePatientArgs {
  teamId: string
  email: string
}

interface InvitePatientPayload extends InvitePatientArgs {
  role: UserRole
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

  static async getPatient(userId: string): Promise<Patient[]> {
    try {
      const { data } = await HttpService.get<Patient>({ url: `/bff/v1/patients/${userId}` })
      return [data]
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info('No patient')
        return []
      }
      throw err
    }
  }

  static async getPatientsForHcp(userId: string, teamId: string): Promise<Patient[]> {
    const { data } = await HttpService.get<Patient[]>({ url: `/bff/v1/hcps/${userId}/teams/${teamId}/patients` })
    return data
  }

  static async invitePatient({ teamId, email }: InvitePatientArgs): Promise<INotification> {
    try {
      const { data } = await HttpService.post<INotification, InvitePatientPayload>({
        url: '/confirm/send/team/invite',
        payload: { teamId, email, role: UserRole.Patient },
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

  static async updatePatientAlerts(teamId: string, patientId: string, monitoringAlertsParameters: MonitoringAlertsParameters): Promise<void> {
    await HttpService.put<void, MonitoringAlertsParameters>({
      url: `/crew/v0/teams/${teamId}/patients/${patientId}/monitoring-alerts-parameters`,
      payload: monitoringAlertsParameters
    })
  }

  static async removePatient(teamId: string, userId: string): Promise<void> {
    await HttpService.delete({ url: `/crew/v0/teams/${teamId}/patients/${userId}` })
  }
}
