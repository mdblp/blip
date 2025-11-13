/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { type MonitoringAlerts } from '../../../lib/patient/models/monitoring-alerts.model'
import { type MedicalData } from '../../../lib/data/models/medical-data.model'
import { type Patient, type PatientMetrics } from '../../../lib/patient/models/patient.model'
import { type GlycemiaIndicators } from '../../../lib/patient/models/glycemia-indicators.model'
import { type MonitoringAlertsParameters } from 'medical-domain'
import { type ProfilePatient } from '../../../lib/patient/models/patient-profile.model'
import { type PatientSettings } from '../../../lib/patient/models/patient-settings.model'
import { Gender } from '../../../lib/auth/models/enums/gender.enum'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { DiabeticProfile } from '../../../lib/patient/models/patient-diabete-profile'
import { defaultBgClasses, DiabeticType, Unit } from 'medical-domain'

const defaultGlycemiaIndicators: GlycemiaIndicators = {
  timeInRange: 0,
  glucoseManagementIndicator: null,
  coefficientOfVariation: null,
  hypoglycemia: 0
}

const defaultMedicalData = { range: { startDate: '', endDate: '' } }

export const buildPatient = (params: {
  userid: string
  monitoringAlertsParameters?: MonitoringAlertsParameters
  profile?: Partial<ProfilePatient>
  settings?: Partial<PatientSettings>
  flagged?: boolean
  hasSentUnreadMessages?: boolean
  glycemiaIndicators?: GlycemiaIndicators
  medicalData?: MedicalData
  diabeticProfile?: DiabeticProfile
}): Patient => {
  return {
    profile: {
      birthdate: params.profile?.birthdate || new Date().toString(),
      firstName: params.profile?.firstName || 'fakeFirstname',
      fullName: params.profile?.fullName || 'fakePatientFullName',
      lastName: params.profile?.lastName || 'fakeLastname',
      email: params.profile?.email || 'fake@email.com',
      sex: params.profile?.sex || Gender.Male,
      drugTreatment: '',
      diet: ['gluten-free'],
      profession: 'Pescador',
      hobbies: 'eating burger',
      physicalActivities: ['Running'],
      hoursSpentOnPhysicalActivitiesPerWeek: 2,
      comments: ''
    },
    settings: {
      a1c: params.settings?.a1c || { date: '2023-05-26T12:28:36.047Z', value: 'fakeA1cValue' },
      system: params.settings?.system
    },
    flagged: params.flagged,
    hasSentUnreadMessages: params.hasSentUnreadMessages || false,
    monitoringAlertsParameters: params.monitoringAlertsParameters,
    invitationStatus: UserInviteStatus.Accepted,
    userid: params.userid,
    glycemiaIndicators: params.glycemiaIndicators,
    medicalData: params.medicalData,
    diabeticProfile: params.diabeticProfile || {
      type: DiabeticType.DT1DT2,
      bloodGlucosePreference: {
        bgUnits : Unit.MilligramPerDeciliter,
        bgClasses: defaultBgClasses[Unit.MilligramPerDeciliter],
        bgBounds: {
          veryHighThreshold: defaultBgClasses[Unit.MilligramPerDeciliter].high,
          targetUpperBound: defaultBgClasses[Unit.MilligramPerDeciliter].target,
          targetLowerBound: defaultBgClasses[Unit.MilligramPerDeciliter].low,
          veryLowThreshold: defaultBgClasses[Unit.MilligramPerDeciliter].veryLow
        }
      }
    }
  }
}

export const buildPatientMetrics = (params: {
  userId: string
  monitoringAlerts?: Partial<MonitoringAlerts>
  medicalData?: Partial<MedicalData>
}): PatientMetrics => {
  const timeSpentAwayFromTargetRate = params.monitoringAlerts?.timeSpentAwayFromTargetRate
  const frequencyOfSevereHypoglycemiaRate = params.monitoringAlerts?.frequencyOfSevereHypoglycemiaRate
  const nonDataTransmissionRate = params.monitoringAlerts?.nonDataTransmissionRate

  return {
    userid: params.userId,
    monitoringAlerts: {
      timeSpentAwayFromTargetRate: timeSpentAwayFromTargetRate !== undefined ? timeSpentAwayFromTargetRate : 10,
      timeSpentAwayFromTargetActive: params.monitoringAlerts?.timeSpentAwayFromTargetActive || false,
      frequencyOfSevereHypoglycemiaRate: frequencyOfSevereHypoglycemiaRate !== undefined ? frequencyOfSevereHypoglycemiaRate : 20,
      frequencyOfSevereHypoglycemiaActive: params.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive || false,
      nonDataTransmissionRate: nonDataTransmissionRate !== undefined ? nonDataTransmissionRate : 30,
      nonDataTransmissionActive: params.monitoringAlerts?.nonDataTransmissionActive || false
    },
    glycemiaIndicators: defaultGlycemiaIndicators,
    medicalData: params.medicalData || defaultMedicalData
  }
}
