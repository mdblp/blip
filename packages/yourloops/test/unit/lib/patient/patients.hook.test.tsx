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

import usePatientsProviderCustomHook from '../../../../lib/patient/patients.hook'
import { act, renderHook, waitFor } from '@testing-library/react'
import PatientUtils from '../../../../lib/patient/patient.util'
import { buildTeam, createPatient } from '../../common/utils'
import * as notificationHookMock from '../../../../lib/notifications/notification.hook'
import * as teamHookMock from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import * as patientFilterHookMock from '../../../../lib/providers/patient-list.provider'
import PatientApi from '../../../../lib/patient/patient.api'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/notifications/notification.hook')
jest.mock('../../../../lib/providers/patient-list.provider')
describe('Patients hook', () => {
  const loggedInUserAsPatient = createPatient('loggedInUserAsPatient', UserInviteStatus.Accepted)
  const patientToRemove = createPatient('patientToRemove', UserInviteStatus.Accepted)
  const notificationHookCancelMock = jest.fn()
  const authHookGetFlagPatientMock = jest.fn().mockReturnValue([patientToRemove.userid])
  const authHookFlagPatientMock = jest.fn()
  const getInvitationMock = jest.fn()
  const refreshTeamsMock = jest.fn()
  const refreshSentInvitationsMock = jest.fn()
  const computePatientsSpy = jest.spyOn(PatientUtils, 'computePatients')

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
    jest.spyOn(PatientApi, 'getPatientsMetricsForHcp').mockResolvedValue([])
  })

  async function renderPatientsHook(patients: Patient[]) {
    jest.spyOn(PatientUtils, 'computePatients').mockResolvedValue(patients)
    const hook = renderHook(() => usePatientsProviderCustomHook())
    await waitFor(() => {
      expect(hook.result.current.patients).toBeDefined()
    })
    return hook
  }

  describe('invitePatient', () => {
    const basicPatient = createPatient('basicPatient1', UserInviteStatus.Accepted)
    basicPatient.profile.email = 'simple@basic.com'
    const allPatients = [basicPatient]
    const team1 = buildTeam('team1Id')
    let customHook

    beforeAll(async () => {
      const res = await renderPatientsHook(allPatients)
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
        expect(computePatientsSpy).toHaveBeenCalledTimes(1)
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
        expect(computePatientsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
