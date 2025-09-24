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

import { type PatientProfile } from './patient-profile.model'
import { type PatientSettings } from './patient-settings.model'
import { type MonitoringAlerts } from './monitoring-alerts.model'
import { type UserInviteStatus } from '../../team/models/enums/user-invite-status.enum'
import { type MonitoringAlertsParameters } from '../../team/models/monitoring-alerts-parameters.model'
import { type PatientInvite } from './patient-invite.model'
import { type GlycemiaIndicators } from './glycemia-indicators.model'
import { type MedicalData } from '../../data/models/medical-data.model'
import { DiabeticProfile } from 'medical-domain'

export interface Patient extends Partial<PatientMetrics> {
  readonly userid: string
  profile: PatientProfile
  settings: PatientSettings
  diabeticProfile?: DiabeticProfile
  monitoringAlertsParameters?: MonitoringAlertsParameters
  invitationStatus?: UserInviteStatus
  invite?: PatientInvite
  isUsingTeamAlertParameters?: boolean
  hasSentUnreadMessages: boolean
  flagged?: boolean
}

export interface PatientMetrics {
  readonly userid: string
  monitoringAlerts?: MonitoringAlerts
  glycemiaIndicators: GlycemiaIndicators
  /** Patient medical data. undefined means not fetched, null if the fetch failed */
  medicalData?: MedicalData | null
}
