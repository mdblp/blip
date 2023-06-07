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

import usePatientProviderCustomHook from '../../../../lib/patient/patient.hook'
import { act, renderHook, waitFor } from '@testing-library/react'
import PatientUtils from '../../../../lib/patient/patient.util'
import { buildTeam, createPatient } from '../../common/utils'
import * as notificationHookMock from '../../../../lib/notifications/notification.hook'
import * as teamHookMock from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import * as selectedTeamHookMock from '../../../../lib/selected-team/selected-team.provider'
import * as patientFilterHookMock from '../../../../lib/providers/patient-list.provider'
import PatientApi from '../../../../lib/patient/patient.api'
import DirectShareApi from '../../../../lib/share/direct-share.api'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'
import { type Notification } from '../../../../lib/notifications/models/notification.model'
import { PRIVATE_TEAM_ID } from '../../../../lib/team/team.hook'
import { type MonitoringAlertsParameters } from '../../../../lib/team/models/monitoring-alerts-parameters.model'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/selected-team/selected-team.provider')
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/notifications/notification.hook')
jest.mock('../../../../lib/providers/patient-list.provider')
describe('Patient hook', () => {
  const loggedInUserAsPatient = createPatient('loggedInUserAsPatient', UserInviteStatus.Accepted)
  const patientToRemove = createPatient('patientToRemove', UserInviteStatus.Accepted)
  const notificationHookCancelMock = jest.fn()
  const authHookGetFlagPatientMock = jest.fn().mockReturnValue([patientToRemove.userid])
  const authHookFlagPatientMock = jest.fn()
  const getInvitationMock = jest.fn()
  const refreshTeamsMock = jest.fn()
  const refreshSentInvitationsMock = jest.fn()
  const computePatientsSpy = jest.spyOn(PatientUtils, 'computePatients')
  const selectedTeamId = 'selectedTeamId'

  beforeAll(() => {
    computePatientsSpy.mockReset();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { id: loggedInUserAsPatient.userid, isUserHcp: () => true, preferences: { patientsStarred: [] } },
        getFlagPatients: authHookGetFlagPatientMock,
        flagPatient: authHookFlagPatientMock
      }
    });
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return {
        cancel: notificationHookCancelMock,
        getInvitation: getInvitationMock,
        refreshSentInvitations: refreshSentInvitationsMock
      }
    });
    (selectedTeamHookMock.useSelectedTeamContext as jest.Mock).mockImplementation(() => {
      return { selectedTeam: { id: selectedTeamId } }
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        refresh: refreshTeamsMock
      }
    });
    (patientFilterHookMock.usePatientListContext as jest.Mock).mockImplementation(() => {
      return {
        filters: {
          pendingEnabled: false,
          manualFlagEnabled: false,
          timeOutOfTargetEnabled: false,
          hypoglycemiaEnabled: false,
          dataNotTransferredEnabled: false,
          messagesEnabled: false
        }
      }
    })
  })

  async function renderPatientHook(patients: Patient[]) {
    jest.spyOn(PatientUtils, 'computePatients').mockResolvedValue(patients)
    const hook = renderHook(() => usePatientProviderCustomHook())
    await waitFor(() => {
      expect(hook.result.current.patients).toBeDefined()
    })
    return hook
  }

  describe('filterPatients', () => {
    const pendingPatient = createPatient('pendingPatient', UserInviteStatus.Pending, undefined, { birthdate: new Date(2001, 10, 19) })
    const basicPatient = createPatient('basicPatient1', UserInviteStatus.Accepted, undefined, {
      birthdate: new Date(2005, 5, 5),
      firstName: 'small brain',
      lastName: 'dupont'
    })
    const basicPatient2 = createPatient('basicPatient2', UserInviteStatus.Accepted, undefined, { birthdate: new Date(2001, 10, 19) })
    const bigBrainPatient = createPatient('big brain', UserInviteStatus.Accepted, undefined, {
      birthdate: new Date(2005, 5, 5),
      firstName: 'big brain',
      lastName: 'smith'
    })
    const noNamePatient = createPatient('big brain', UserInviteStatus.Accepted, undefined, {
      birthdate: new Date(2006, 6, 6)
    })
    noNamePatient.profile.firstName = undefined
    noNamePatient.profile.lastName = undefined

    const allPatients = [basicPatient, basicPatient2, bigBrainPatient, noNamePatient, pendingPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should return correct patients when provided a first name search filter', () => {
      const patientsReceived = customHook.searchPatients('big brain')
      expect(patientsReceived).toEqual([bigBrainPatient])
    })

    it('should return correct patients when provided a date search filter', () => {
      const patientsReceived = customHook.searchPatients('19/11/2001')
      expect(patientsReceived).toEqual([basicPatient2])
    })

    it('should return correct patients when provided a date and first name search filter', () => {
      const patientsReceived = customHook.searchPatients('05/06/2005 big')
      expect(patientsReceived).toEqual([bigBrainPatient])
    })

    it('should return correct patients when provided a date and last name search filter', () => {
      const patientsReceived = customHook.searchPatients('05/06/2005smith')
      expect(patientsReceived).toEqual([bigBrainPatient])
    })
  })

  describe('getPatientByEmail', () => {
    const unknownPatient = createPatient('unknownPatient')
    const existingPatient = createPatient('existingPatient', UserInviteStatus.Accepted, undefined, { email: 'test@test.com' })
    const allPatients = [existingPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should return a patient when the patient is present in the patient state', () => {
      const patient = customHook.getPatientByEmail(existingPatient.profile.email)
      expect(patient).toBeDefined()
    })

    it('should return null when patient is not present in the patient state', () => {
      const patient = customHook.getPatientByEmail(unknownPatient.profile.email)
      expect(patient).toBeUndefined()
    })
  })

  describe('getPatientById', () => {
    const unknownPatient = createPatient('unknownPatient')
    const existingPatient = createPatient('existingPatient', UserInviteStatus.Accepted)
    const allPatients = [existingPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should return a patient when the patient is present in the patient state', () => {
      const patient = customHook.getPatientById(existingPatient.userid)
      expect(patient).toBeDefined()
    })

    it('should return null when patient is not present in the patient state', () => {
      const patient = customHook.getPatientById(unknownPatient.userid)
      expect(patient).toBeUndefined()
    })
  })

  describe('invitePatient', () => {
    const basicPatient = createPatient('basicPatient1', UserInviteStatus.Accepted)
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
        type: INotificationType.medicalTeamPatientInvitation,
        email: 'fake@username.com',
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })

      await act(async () => {
        await customHook.invitePatient(team1, 'new-patient@mail.com')
        expect(computePatientsSpy).toBeCalledTimes(1)
      })
    })

    it('should invite and update a patient when the patient is already present in the patient list', async () => {
      jest.spyOn(PatientApi, 'invitePatient').mockResolvedValueOnce({
        key: 'key',
        type: INotificationType.medicalTeamPatientInvitation,
        email: basicPatient.profile.email,
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })

      const initialPatientsLength: number = customHook.patients.length
      await act(async () => {
        await customHook.invitePatient(team1, basicPatient.profile.email)
      })
      await waitFor(() => {
        expect(customHook.patients.length).toEqual(initialPatientsLength)
        expect(computePatientsSpy).toBeCalledTimes(1)
      })
    })
  })

  describe('removePatient', () => {
    const pendingPatient = createPatient('pendingPatient', UserInviteStatus.Pending, {} as MonitoringAlertsParameters)
    pendingPatient.invite = { creationDate: 'fakeCreationDate', creatorId: 'fakeCreatorId', id: 'fakeInviteId' }
    const patientToRemovePrivatePractice = createPatient('patientToRemovePrivatePractice', UserInviteStatus.Accepted)
    const patientToRemove2 = createPatient('patientToRemove2', UserInviteStatus.Accepted)
    const allPatients = [pendingPatient, patientToRemovePrivatePractice, patientToRemove, patientToRemove2]

    it('should call notification hook cancel method if invite is pending and call removePatient method', async () => {
      const res = await renderPatientHook(allPatients)
      const customHook = res.result.current
      const invitation = { id: 'fakeInvitationId', email: 'fakeInvitationEmail' } as Notification
      getInvitationMock.mockReturnValue(invitation)
      const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(pendingPatient)
      })
      expect(notificationHookCancelMock).toHaveBeenCalled()
      expect(removePatientMock).toHaveBeenCalled()
    })

    it('should call removeDirectShare API method if private practice', async () => {
      (selectedTeamHookMock.useSelectedTeamContext as jest.Mock).mockImplementation(() => {
        return { selectedTeam: { id: PRIVATE_TEAM_ID } }
      })
      const res = await renderPatientHook(allPatients)
      const customHook = res.result.current
      const invitation = { id: 'fakeInvitationId', email: 'fakeInvitationEmail' } as Notification
      getInvitationMock.mockReturnValue(invitation)
      const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(patientToRemovePrivatePractice)
      })
      expect(removeDirectShareMock).toHaveBeenCalled()
      expect(PatientUtils.computePatients).toHaveBeenCalledTimes(2)
    })

    it.skip('should unflag a patient when he no longer belongs to a team', async () => {
      const res = await renderPatientHook(allPatients)
      const customHook = res.result.current
      const invitation = { id: 'fakeInvitationId', email: 'fakeInvitationEmail' } as Notification
      getInvitationMock.mockReturnValue(invitation)
      jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(patientToRemove)
      })
      await waitFor(() => {
        expect(customHook.getPatientById(patientToRemove.userid)).toBeUndefined()
      })
      expect(authHookGetFlagPatientMock).toHaveBeenCalled()
      expect(authHookFlagPatientMock).toHaveBeenCalled()
    })

    it('should update patient when he still belongs to a team', async () => {
      (selectedTeamHookMock.useSelectedTeamContext as jest.Mock).mockImplementation(() => {
        return { selectedTeam: { id: selectedTeamId } }
      })
      const res = await renderPatientHook(allPatients)
      const customHook = res.result.current
      const invitation = { id: 'fakeInvitationId', email: 'fakeInvitationEmail' } as Notification
      getInvitationMock.mockReturnValue(invitation)
      const removePatientSpy = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        await customHook.removePatient(patientToRemove2)
      })
      expect(removePatientSpy).toHaveBeenCalledWith(selectedTeamId, patientToRemove2.userid)
    })
  })

  describe('markPatientMessagesAsRead', () => {
    let customHook
    let basicPatient

    beforeAll(async () => {
      basicPatient = createPatient('basicPatient1', UserInviteStatus.Accepted)
      basicPatient.metadata.hasSentUnreadMessages = true
      const allPatients = [basicPatient]

      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should update patient unread messages to 0', () => {
      act(() => {
        customHook.markPatientMessagesAsRead(basicPatient)
        expect(customHook.getPatientById(basicPatient.userid).metadata.hasSentUnreadMessages).toBeFalsy()
      })
    })
  })

  describe('leaveTeam', () => {
    const allPatients = [loggedInUserAsPatient]
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook(allPatients)
      customHook = res.result.current
    })

    it('should call API and refresh team list', async () => {
      const teamId = 'fakeTeamId'

      const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        customHook.leaveTeam(teamId)
        expect(removePatientMock).toBeCalledWith(teamId, loggedInUserAsPatient.userid)
      })
      await waitFor(() => {
        expect(refreshTeamsMock).toBeCalled()
        expect(computePatientsSpy).toBeCalledTimes(1)
      })
    })
  })
})
