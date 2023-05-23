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

import { createPatient } from '../../common/utils'
import PatientUtils from '../../../../lib/patient/patient.util'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import { Gender } from '../../../../lib/auth/models/enums/gender.enum'

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
  telemonitoredEnabled: false,
  timeOutOfTargetEnabled: false,
  hypoglycemiaEnabled: false,
  dataNotTransferredEnabled: false,
  messagesEnabled: false
}

const patientWithTimeOutOfTargetAlert = createPatient('outOfTarget', UserInvitationStatus.accepted, undefined, undefined, undefined, undefined, {
  ...defaultMonitoringAlerts,
  timeSpentAwayFromTargetActive: true
})
const patientWithHypoglycemiaAlert = createPatient('hypoglycemia', UserInvitationStatus.accepted, undefined, undefined, undefined, undefined, {
  ...defaultMonitoringAlerts,
  frequencyOfSevereHypoglycemiaActive: true
})
const patientWithNoDataAlert = createPatient('noData', UserInvitationStatus.accepted, undefined, undefined, undefined, undefined, {
  ...defaultMonitoringAlerts,
  nonDataTransmissionActive: true
})
const noAlertsPatient = createPatient('nothing', UserInvitationStatus.accepted, undefined, undefined, undefined, undefined, defaultMonitoringAlerts)

describe('Patient utils', () => {
  describe('computeFlaggedPatients', () => {
    it('should return patients with the correct flagged attribute', () => {
      const patientFlaggedId = 'flaggedPatient'
      const patients: Patient[] = [createPatient(patientFlaggedId, UserInvitationStatus.accepted), createPatient('fakePatient1', UserInvitationStatus.accepted), createPatient('fakePatient2', UserInvitationStatus.accepted)]
      const flaggedPatientIds = [patientFlaggedId]
      const patientsUpdated = PatientUtils.computeFlaggedPatients(patients, flaggedPatientIds)
      patientsUpdated.forEach(patient => {
        expect(patient.metadata.flagged).toBe(flaggedPatientIds.includes(patient.userid))
      })
    })
  })

  describe('getAllPatients and getPendingPatients', () => {
    const acceptedPatient1 = createPatient('acceptedPatient1', UserInvitationStatus.accepted)
    const acceptedPatient2 = createPatient('acceptedPatient2', UserInvitationStatus.accepted)
    const pendingPatient = createPatient('pendingPatient', UserInvitationStatus.pending)

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
      const patient = createPatient('fakePatientId', UserInvitationStatus.pending)
      const result = PatientUtils.isInvitationPending(patient)
      expect(result).toBeTruthy()
    })

    it('should return false when patient invite is accepted', () => {
      const patient = createPatient('fakePatientId', UserInvitationStatus.accepted)
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
    const pendingPatient = createPatient('pendingPatient', UserInvitationStatus.pending, undefined, undefined, undefined, undefined, undefined)
    const monitoredPatient = createPatient('monitoredPatient', UserInvitationStatus.accepted, undefined, undefined, undefined, undefined)
    const flaggedPatient = createPatient('flaggedPatient', UserInvitationStatus.accepted, null, undefined, undefined, undefined, undefined)
    const unreadMessagesPatient = createPatient('unreadMessagesPatient', UserInvitationStatus.accepted, null, undefined, undefined, { hasSentUnreadMessages: true }, undefined)
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
})
