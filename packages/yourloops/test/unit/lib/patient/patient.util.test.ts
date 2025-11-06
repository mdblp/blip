/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { createPatient } from '../../common/utils'
import PatientUtils from '../../../../lib/patient/patient.util'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { Gender } from '../../../../lib/auth/models/enums/gender.enum'
import PatientApi from '../../../../lib/patient/patient.api'

const defaultMonitoringAlerts = {
  timeSpentAwayFromTargetRate: 10,
  timeSpentAwayFromTargetActive: false,
  frequencyOfSevereHypoglycemiaRate: 20,
  frequencyOfSevereHypoglycemiaActive: false,
  nonDataTransmissionRate: 30,
  nonDataTransmissionActive: false
}

const defaultPatientFilters = {
  pendingEnabled: false,
  manualFlagEnabled: false,
  timeOutOfTargetEnabled: false,
  hypoglycemiaEnabled: false,
  dataNotTransferredEnabled: false,
  messagesEnabled: false
}

const patientWithTimeOutOfTargetAlert = createPatient('outOfTarget', UserInviteStatus.Accepted, undefined, undefined, undefined, {
  ...defaultMonitoringAlerts,
  timeSpentAwayFromTargetActive: true
})
const patientWithHypoglycemiaAlert = createPatient('hypoglycemia', UserInviteStatus.Accepted, undefined, undefined, undefined, {
  ...defaultMonitoringAlerts,
  frequencyOfSevereHypoglycemiaActive: true
})
const patientWithNoDataAlert = createPatient('noData', UserInviteStatus.Accepted, undefined, undefined, undefined, {
  ...defaultMonitoringAlerts,
  nonDataTransmissionActive: true
})
const noAlertsPatient = createPatient('nothing', UserInviteStatus.Accepted, undefined, undefined, undefined, defaultMonitoringAlerts)

describe('Patient utils', () => {
  describe('computeFlaggedPatients', () => {
    it('should return patients with the correct flagged attribute', () => {
      const patientFlaggedId = 'flaggedPatient'
      const patients: Patient[] = [createPatient(patientFlaggedId, UserInviteStatus.Accepted), createPatient('fakePatient1', UserInviteStatus.Accepted), createPatient('fakePatient2', UserInviteStatus.Accepted)]
      const flaggedPatientIds = [patientFlaggedId]
      const patientsUpdated = PatientUtils.computeFlaggedPatients(patients, flaggedPatientIds)
      patientsUpdated.forEach(patient => {
        expect(patient.flagged).toBe(flaggedPatientIds.includes(patient.userid))
      })
    })
  })

  describe('getAllPatients and getPendingPatients', () => {
    const acceptedPatient1 = createPatient('acceptedPatient1', UserInviteStatus.Accepted)
    const acceptedPatient2 = createPatient('acceptedPatient2', UserInviteStatus.Accepted)
    const pendingPatient = createPatient('pendingPatient', UserInviteStatus.Pending)

    it('should return all the patients of the selected team without pending patients', () => {
      const result = PatientUtils.getNonPendingPatients([acceptedPatient1, acceptedPatient2, pendingPatient])
      expect(result).toEqual([acceptedPatient1, acceptedPatient2])
    })

    it('should return pending patients of the selected team without other accepted patients', () => {
      const result = PatientUtils.getPendingPatients([acceptedPatient1, acceptedPatient2, pendingPatient])
      expect(result).toEqual([pendingPatient])
    })
  })

  describe('isInvitationPending', () => {
    it('should return true when patient invite is pending', () => {
      const patient = createPatient('fakePatientId', UserInviteStatus.Pending)
      const result = PatientUtils.isInvitationPending(patient)
      expect(result).toBeTruthy()
    })

    it('should return false when patient invite is accepted', () => {
      const patient = createPatient('fakePatientId', UserInviteStatus.Accepted)
      const result = PatientUtils.isInvitationPending(patient)
      expect(result).toBeFalsy()
    })
  })

  describe('filterPatientsOnMonitoringAlerts', () => {
    const patients = [patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert, noAlertsPatient]

    it('should return all patient when no filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, defaultPatientFilters)
      expect(result).toEqual(patients)
    })

    it('should return only patients with alerts when all alerts are selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        dataNotTransferredEnabled: true,
        timeOutOfTargetEnabled: true,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert])
    })

    it('should return only patients with target and hypo alert when target and hypo are the filters selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        timeOutOfTargetEnabled: true,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert])
    })

    it('should return only patients with no data and hypo alert when no data and hypo are the filters selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        dataNotTransferredEnabled: true,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithHypoglycemiaAlert, patientWithNoDataAlert])
    })

    it('should return only patients with target and no data alert when target and no data are the filters selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        timeOutOfTargetEnabled: true,
        dataNotTransferredEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithNoDataAlert])
    })

    it('should return patient with target alert when target filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        timeOutOfTargetEnabled: true
      })
      expect(result).toEqual([patientWithTimeOutOfTargetAlert])
    })

    it('should return patient with hypo alert when hypo filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        hypoglycemiaEnabled: true
      })
      expect(result).toEqual([patientWithHypoglycemiaAlert])
    })

    it('should return patient with no data alert when no data filter is selected', () => {
      const result = PatientUtils.filterPatientsOnMonitoringAlerts(patients, {
        ...defaultPatientFilters,
        dataNotTransferredEnabled: true
      })
      expect(result).toEqual([patientWithNoDataAlert])
    })
  })

  describe('extractPatients', () => {
    const pendingPatient = createPatient('pendingPatient', UserInviteStatus.Pending, undefined, undefined, undefined, undefined, undefined)
    const monitoredPatient = createPatient('monitoredPatient', UserInviteStatus.Accepted, undefined, undefined, undefined, undefined)
    const flaggedPatient = createPatient('flaggedPatient', UserInviteStatus.Accepted, null, undefined, undefined, undefined, undefined)
    const unreadMessagesPatient = createPatient('unreadMessagesPatient', UserInviteStatus.Accepted, null, undefined, undefined, undefined, undefined, true)
    const patients = [noAlertsPatient, pendingPatient, monitoredPatient, unreadMessagesPatient, patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert, noAlertsPatient, flaggedPatient]
    const flaggedPatientsIds = [flaggedPatient.userid]

    it('should return only patients with alerts when only alerts filters are selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          dataNotTransferredEnabled: true,
          timeOutOfTargetEnabled: true,
          hypoglycemiaEnabled: true
        },
        flaggedPatientsIds
      )

      expect(result).toEqual([patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert])
    })

    it('should return all patients except the pending one when no filters are selected', () => {
      const result = PatientUtils.extractPatients(patients, defaultPatientFilters, flaggedPatientsIds)

      expect(result).toEqual([noAlertsPatient, monitoredPatient, unreadMessagesPatient, patientWithTimeOutOfTargetAlert, patientWithHypoglycemiaAlert, patientWithNoDataAlert, noAlertsPatient, flaggedPatient])
    })

    it('should return only flagged patient when only flagged filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          manualFlagEnabled: true
        },
        flaggedPatientsIds
      )

      expect(result).toEqual([flaggedPatient])
    })

    it('should return only patient with unread messaged sent when only messages filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          messagesEnabled: true
        },
        flaggedPatientsIds
      )

      expect(result).toEqual([unreadMessagesPatient])
    })

    it('should return only pending patient when only pending filter is selected', () => {
      const result = PatientUtils.extractPatients(
        patients,
        {
          ...defaultPatientFilters,
          pendingEnabled: true
        },
        flaggedPatientsIds
      )

      expect(result).toEqual([pendingPatient])
    })
  })

  describe('computeAge', () => {
    it('should return the age of the patient based on their birthdate', () => {
      const realDateNow = Date.now.bind(global.Date)
      // Mocking the current date as Wednesday, 26 April 2023 13:03:05
      global.Date.now = jest.fn(() => 1682514185000)

      expect(PatientUtils.computeAge('2000-03-12T10:44:34+01:00')).toEqual(23)
      expect(PatientUtils.computeAge('2023-04-26T13:03:05+01:00')).toEqual(0)
      expect(PatientUtils.computeAge('2021-04-26T13:03:05+01:00')).toEqual(2)
      expect(PatientUtils.computeAge('2021-04-27T13:03:05+01:00')).toEqual(1)
      expect(PatientUtils.computeAge('2025-01-01T10:44:34+01:00')).toEqual(-1)

      global.Date.now = realDateNow
    })
  })

  describe('getGenderLabel', () => {
    it('should return the appropriate label based on the given gender', () => {
      expect(PatientUtils.getGenderLabel(Gender.Indeterminate)).toEqual('gender-i')
      expect(PatientUtils.getGenderLabel(Gender.Female)).toEqual('gender-f')
      expect(PatientUtils.getGenderLabel(Gender.Male)).toEqual('gender-m')
      expect(PatientUtils.getGenderLabel(Gender.NotDefined)).toEqual('-')
    })
  })

  describe('formatPercentageValue', () => {
    it('should format the value with 1 digit', () => {
      expect(PatientUtils.formatPercentageValue(70.06)).toEqual('70.1%')
    })

    it('should format the value even if it equals 0', () => {
      expect(PatientUtils.formatPercentageValue(0)).toEqual('0%')
    })

    it('should return N/A if the value is not defined', () => {
      expect(PatientUtils.formatPercentageValue(undefined)).toEqual('N/A')
      expect(PatientUtils.formatPercentageValue(null)).toEqual('N/A')
    })
  })

  describe('fetchMetrics', () => {
    it('should not perform an API call if there is no patient in the team', async () => {
      jest.spyOn(PatientApi, 'getPatientsMetricsForHcp')
      const patients = []

      const result = await PatientUtils.fetchMetrics(patients, 'team-id', 'user-id')
      expect(result).toEqual(undefined)
      expect(PatientApi.getPatientsMetricsForHcp).not.toHaveBeenCalled()
    })

    it('should not perform an API call if there are only pending patients in the team', async () => {
      jest.spyOn(PatientApi, 'getPatientsMetricsForHcp')
      const patients = [
        { userid: 'pending-patient-1', invitationStatus: UserInviteStatus.Pending },
        { userid: 'pending-patient-2', invitationStatus: UserInviteStatus.Pending }
      ] as Patient[]

      const result = await PatientUtils.fetchMetrics(patients, 'team-id', 'user-id')
      expect(result).toEqual(undefined)
      expect(PatientApi.getPatientsMetricsForHcp).not.toHaveBeenCalled()
    })

    it('should perform an API call for the non-pending patients in the team and return their metrics', async () => {
      const acceptedPatientId = 'accepted-patient'
      const userId = 'user-id'
      const teamId = 'team-id'
      const patientMetrics = {
        userid: acceptedPatientId,
        glycemiaIndicators: {
          glucoseManagementIndicator: 1,
          coefficientOfVariation: 2,
          hypoglycemia: 3,
          timeInRange: 4
        },
        monitoringAlerts: defaultMonitoringAlerts,
        medicalData: { data: [] }
      }
      jest.spyOn(PatientApi, 'getPatientsMetricsForHcp').mockResolvedValue([patientMetrics])
      const patients = [
        { userid: 'pending-patient-1', invitationStatus: UserInviteStatus.Pending },
        { userid: 'pending-patient-2', invitationStatus: UserInviteStatus.Pending },
        { userid: acceptedPatientId, invitationStatus: UserInviteStatus.Accepted }
      ] as Patient[]

      const result = await PatientUtils.fetchMetrics(patients, teamId, userId)
      expect(result).toEqual([patientMetrics])
      expect(PatientApi.getPatientsMetricsForHcp).toHaveBeenCalledWith(userId, teamId, [acceptedPatientId])
    })
  })

  describe('getUpdatedPatientsWithMetrics', () => {
    it('should update only the patients having metrics', () => {
      const pendingPatient = { userid: 'pending-patient', invitationStatus: UserInviteStatus.Pending } as Patient
      const acceptedPatient = { userid: 'accepted-patient', invitationStatus: UserInviteStatus.Accepted } as Patient

      const patientMetrics = {
        userid: acceptedPatient.userid,
        glycemiaIndicators: {
          glucoseManagementIndicator: 1,
          coefficientOfVariation: 2,
          hypoglycemia: 3,
          timeInRange: 4
        },
        monitoringAlerts: defaultMonitoringAlerts,
        medicalData: { data: [] }
      }

      const result = PatientUtils.getUpdatedPatientsWithMetrics([pendingPatient, acceptedPatient], [patientMetrics])
      expect(result).toEqual([
        pendingPatient,
        {
          userid: acceptedPatient.userid,
          invitationStatus: acceptedPatient.invitationStatus,
          glycemiaIndicators: acceptedPatient.glycemiaIndicators,
          monitoringAlerts: acceptedPatient.monitoringAlerts,
          medicalData: acceptedPatient.medicalData
        }
      ])
    })
  })
})
