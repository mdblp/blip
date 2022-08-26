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

import { PatientFilterTypes, UserInvitationStatus } from '../../../../models/generic'
import usePatientProviderCustomHook from '../../../../lib/patient/hook'
import { renderHook } from '@testing-library/react-hooks/dom'
import PatientUtils from '../../../../lib/patient/utils'
import { buildTeam, createPatient, createPatientTeam } from '../../common/utils'
import { Monitoring, MonitoringStatus } from '../../../../models/monitoring'
import * as notificationHookMock from '../../../../lib/notifications/hook'
import * as teamHookMock from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import { act, waitFor } from '@testing-library/react'
import { Patient } from '../../../../lib/data/patient'
import { UNITS_TYPE } from '../../../../lib/units/utils'
import PatientApi from '../../../../lib/patient/patient-api'
import { APINotificationType } from '../../../../models/notification'
import DirectShareApi from '../../../../lib/share/direct-share-api'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/notifications/hook')
describe('Patient hook', () => {
  const basicTeam = createPatientTeam('basicTeam1Id', UserInvitationStatus.accepted)
  const loggedInUserAsPatient = createPatient('loggedInUserAsPatient', [basicTeam])
  const patientToRemove = createPatient('patientToRemove', [basicTeam])
  const notificationHookCancelMock = jest.fn()
  const authHookGetFlagPatientMock = jest.fn().mockReturnValue([patientToRemove.userid])
  const authHookFlagPatientMock = jest.fn()
  const getInvitationMock = jest.fn()
  const removeTeamFromListMock = jest.fn()

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { id: loggedInUserAsPatient.userid },
        getFlagPatients: authHookGetFlagPatientMock,
        flagPatient: authHookFlagPatientMock
      }
    });
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return {
        cancel: notificationHookCancelMock,
        getInvitation: getInvitationMock
      }
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        removeTeamFromList: removeTeamFromListMock
      }
    })
  })

  async function renderPatientHook(patients: Patient[]) {
    let hook
    jest.spyOn(PatientUtils, 'computePatients').mockResolvedValue(patients)
    await act(async () => {
      hook = renderHook(() => usePatientProviderCustomHook())
      await waitFor(() => expect(hook.result.current.patients).toEqual(patients))
    })
    return hook
  }

  describe('filterPatients', () => {
    const pendingPatientTeam = createPatientTeam('pendingTeamId', UserInvitationStatus.pending)
    const pendingPatient = createPatient('pendingPatient', [pendingPatientTeam], undefined, undefined, {} as Monitoring)
    const basicPatient = createPatient('basicPatient1', [basicTeam])
    const bigBrainPatient = createPatient('big brain', [basicTeam])
    bigBrainPatient.profile.firstName = 'big brain'
    const allPatients = [pendingPatient, basicPatient, bigBrainPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should return correct patients when filter is pending', () => {
      const patientsReceived = customHook.filterPatients(PatientFilterTypes.pending, '', [])
      expect(patientsReceived).toEqual([pendingPatient])
    })

    it('should return correct patients when provided a flag list', () => {
      const patientsReceived = customHook.filterPatients(PatientFilterTypes.flagged, '', [basicPatient.userid])
      expect(patientsReceived).toEqual([basicPatient])
    })

    it('should return correct patients when provided a search filter', () => {
      const patientsReceived = customHook.filterPatients(PatientFilterTypes.all, 'big brain', [])
      expect(patientsReceived).toEqual([bigBrainPatient])
    })
  })

  describe('editPatientRemoteMonitoring', () => {
    const unknownPatient = createPatient('unknownPatient')
    const unmonitoredPatient = createPatient('unmonitoredPatient', [basicTeam])
    const allPatients = [unmonitoredPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should throw an error if patient is not found', () => {
      expect(() => customHook.editPatientRemoteMonitoring(unknownPatient)).toThrowError()
    })

    it('should update patient monitoring', () => {
      const monitoring: Monitoring = {
        enabled: true,
        status: MonitoringStatus.pending,
        monitoringEnd: new Date(),
        parameters: {
          bgUnit: UNITS_TYPE.MGDL,
          lowBg: 1,
          highBg: 2,
          outOfRangeThreshold: 3,
          veryLowBg: 4,
          hypoThreshold: 5,
          nonDataTxThreshold: 6,
          reportingPeriod: 7
        }
      }
      expect(unmonitoredPatient.monitoring).toBeUndefined()
      unmonitoredPatient.monitoring = monitoring
      act(() => {
        customHook.editPatientRemoteMonitoring(unmonitoredPatient)
      })
      expect(customHook.getPatient(unmonitoredPatient.userid).monitoring).toEqual(monitoring)
    })
  })

  describe('getPatient', () => {
    const unknownPatient = createPatient('unknownPatient')
    const existingPatient = createPatient('existingPatient', [basicTeam])
    const allPatients = [existingPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should return a patient when the patient is present in the patient state', () => {
      const patient = customHook.getPatient(existingPatient.userid)
      expect(patient).toBeDefined()
    })

    it('should return null when patient is not present in the patient state', () => {
      const patient = customHook.getPatient(unknownPatient.userid)
      expect(patient).toBeUndefined()
    })
  })

  describe('invitePatient', () => {
    const basicPatient = createPatient('basicPatient1', [basicTeam])
    basicPatient.profile.email = 'simple@basic.com'
    const allPatients = [basicPatient]
    const team1 = buildTeam('team1Id')
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should invite and add a patient when the patient is not already present in the patient list', async () => {
      jest.spyOn(PatientApi, 'invitePatient').mockResolvedValueOnce({
        key: 'key',
        type: APINotificationType.medicalTeamPatientInvitation,
        email: 'fake@username.com',
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })
      const initialPatientsLength: number = customHook.patients.length

      await act(async () => {
        await customHook.invitePatient(team1, 'new-patient@mail.com')
        await waitFor(() => expect(customHook.patients.length).toEqual(initialPatientsLength + 1))
      })
    })

    it('should invite and update a patient when the patient is already present in the patient list', async () => {
      jest.spyOn(PatientApi, 'invitePatient').mockResolvedValueOnce({
        key: 'key',
        type: APINotificationType.medicalTeamPatientInvitation,
        email: basicPatient.profile.email,
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })
      expect(customHook.getPatient(basicPatient.userid).teams.find(t => t.id === team1.id)).toBeUndefined()

      const initialPatientsLength: number = customHook.patients.length
      await act(async () => {
        await customHook.invitePatient(team1, basicPatient.profile.email)
        await waitFor(() => expect(customHook.patients.length).toEqual(initialPatientsLength))
      })
      expect(customHook.getPatient(basicPatient.userid).teams.find(t => t.teamId === team1.id)).toBeDefined()
    })
  })

  describe('updatePatientMonitoring', () => {
    const basicPatient = createPatient('basicPatient1', [basicTeam])
    const monitoredTeam = createPatientTeam('monitoredTeam', UserInvitationStatus.accepted, MonitoringStatus.pending)
    const monitoredPatient = createPatient('monitoredPatient', [monitoredTeam])
    monitoredPatient.monitoring = { status: MonitoringStatus.accepted } as Monitoring
    const allPatients = [basicPatient, monitoredPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should throw an error if patient is not monitored', async () => {
      await expect(async () => {
        await customHook.updatePatientMonitoring(basicPatient)
      }).rejects.toThrowError('Cannot update patient monitoring with "undefined"')
    })

    it('should update patient alerts', async () => {
      const updatePatientAlertsMock = jest.spyOn(PatientApi, 'updatePatientAlerts').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.updatePatientMonitoring(monitoredPatient)
        expect(updatePatientAlertsMock).toHaveBeenCalled()
        expect(customHook.getPatient(monitoredPatient.userid).teams.find(t => t.teamId === monitoredTeam.teamId).monitoringStatus).toEqual(MonitoringStatus.accepted)
      })
    })

    it('should throw error when could not updated patient alerts', async () => {
      const updatePatientAlertsMock = jest.spyOn(PatientApi, 'updatePatientAlerts').mockRejectedValue(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await customHook.updatePatientMonitoring(monitoredPatient)
      }).rejects.toThrowError(`Failed to update patient with id ${monitoredPatient.userid}`)
      expect(updatePatientAlertsMock).toHaveBeenCalled()
    })
  })

  describe('removePatient', () => {
    const pendingPatientTeam = createPatientTeam('pendingTeamId', UserInvitationStatus.pending)
    const patientTeamPrivatePractice = createPatientTeam('private', UserInvitationStatus.pending)
    const pendingPatient = createPatient('pendingPatient', [pendingPatientTeam], undefined, undefined, {} as Monitoring)
    const patientToRemovePrivatePractice = createPatient('patientToRemovePrivatePractice', [patientTeamPrivatePractice])
    const allPatients = [pendingPatient, patientToRemovePrivatePractice, patientToRemove]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should call notification hook cancel method if invitation is pending and call removePatient method', async () => {
      const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(pendingPatient, pendingPatientTeam)
        expect(customHook.getPatient(pendingPatient.userid).teams.includes(pendingPatientTeam)).toBeFalsy()
      })
      expect(notificationHookCancelMock).toHaveBeenCalled()
      expect(removePatientMock).toHaveBeenCalled()
    })

    it('should call removeDirectShare API method if private practics', async () => {
      const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(patientToRemovePrivatePractice, patientTeamPrivatePractice)
        expect(customHook.getPatient(patientToRemovePrivatePractice.userid).teams.includes(patientTeamPrivatePractice)).toBeFalsy()
      })
      expect(removeDirectShareMock).toHaveBeenCalled()
    })

    it('should unflag a patient when he no longer belong to a team', async () => {
      jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(patientToRemove, basicTeam)
        expect(customHook.getPatient(patientToRemove)).toBeUndefined()
        expect(authHookGetFlagPatientMock).toHaveBeenCalled()
        expect(authHookFlagPatientMock).toHaveBeenCalled()
      })
    })
  })
})
