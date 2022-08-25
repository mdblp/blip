/**
 * Copyright (c) 2021-2022, Diabeloop
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

import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import { PatientFilterTypes, UserInvitationStatus } from '../../../../models/generic'
import { TeamMemberRole } from '../../../../models/team'
import { buildTeam, buildTeamMember, createPatient, createPatientTeam } from '../../common/utils'
import * as authHookMock from '../../../../lib/auth'
import { Monitoring, MonitoringStatus } from '../../../../models/monitoring'
import { APINotificationType } from '../../../../models/notification'
import DirectShareApi from '../../../../lib/share/direct-share-api'
import { PatientContextResult, PatientProvider, usePatient } from '../../../../lib/patient/hook'
import PatientApi from '../../../../lib/patient/patient-api'
import PatientUtils from '../../../../lib/patient/utils'
import { UNITS_TYPE } from '../../../../lib/units/utils'
import * as notificationHookMock from '../../../../lib/notifications/hook'
import * as teamHookMock from '../../../../lib/team'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/notifications/hook')
describe('Patient hook', () => {
  let patientHook: PatientContextResult
  const patientTeam1 = createPatientTeam('team1Id', UserInvitationStatus.accepted, MonitoringStatus.accepted)
  const patientTeam2 = createPatientTeam('team2Id', UserInvitationStatus.accepted)
  const pendingPatientTeam = createPatientTeam('pendingTeam1Id', UserInvitationStatus.pending)
  const patientTeamPrivatePractice = createPatientTeam('private', UserInvitationStatus.pending)
  const pendingPatient1 = createPatient('pendingPatient1', [pendingPatientTeam], undefined, undefined, {} as Monitoring)
  const unknownPatient = createPatient('nigma')
  const monitoredPatient1 = createPatient('monitoredPatient1', [patientTeam1, patientTeam2, pendingPatientTeam], undefined, undefined, {} as Monitoring)
  const monitoredPatient2 = createPatient('monitoredPatient2', [patientTeam2], undefined, undefined, {} as Monitoring)
  const loggedInUserAsPatient = createPatient('loggedInUserAsPatient', [patientTeam2], undefined, undefined, undefined)
  const patientToRemove = createPatient('patientToRemove', [patientTeam2], undefined, undefined, undefined)
  const patientToRemove2 = createPatient('patientToRemove2', [patientTeam2], undefined, undefined, undefined)
  const patientToRemovePrivatePractice = createPatient('patientToRemovePrivatePractice', [patientTeamPrivatePractice, patientTeam2], undefined, undefined, undefined)
  const unmonitoredPatient = createPatient('unmonitoredPatient', [patientTeam2], undefined, undefined, undefined)
  const bigBrain = createPatient('big brain', [patientTeam1])
  bigBrain.profile.firstName = 'big brain'
  const allPatients = [pendingPatient1, monitoredPatient1, monitoredPatient2, unmonitoredPatient, bigBrain, patientToRemove, patientToRemove2, loggedInUserAsPatient, patientToRemovePrivatePractice]
  const memberHcp1 = buildTeamMember('team1Id', 'memberHcp', undefined, TeamMemberRole.member)
  const team1 = buildTeam('team1Id', [memberHcp1])
  const notificationHookCancelMock = jest.fn()
  const authHookGetFlagPatientMock = jest.fn().mockReturnValue([patientToRemove.userid])
  const authHookFlagPatientMock = jest.fn()
  const getInvitationMock = jest.fn()
  const removeTeamFromListMock = jest.fn()

  async function mountComponent() {
    const DummyComponent = (): JSX.Element => {
      patientHook = usePatient()
      return (<div />)
    }
    await act(async () => {
      render(
        <PatientProvider>
          <DummyComponent />
        </PatientProvider>
      )
      await waitFor(() => expect(patientHook.patients.length).toBeGreaterThan(0))
    })
  }

  beforeAll(async () => {
    jest.spyOn(PatientUtils, 'computePatients').mockResolvedValue(allPatients);
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
    await mountComponent()
  })

  describe('filterPatients', () => {
    it('should return correct patients when filter is pending', () => {
      const patientsReceived = patientHook.filterPatients(PatientFilterTypes.pending, '', [])
      expect(patientsReceived).toEqual([pendingPatient1, monitoredPatient1, patientToRemovePrivatePractice])
    })

    it('should return correct patients when provided a flag list', () => {
      const patientsReceived = patientHook.filterPatients(PatientFilterTypes.flagged, '', [monitoredPatient1.userid])
      expect(patientsReceived).toEqual([monitoredPatient1])
    })

    it('should return correct patients when provided a search filter', () => {
      const patientsReceived = patientHook.filterPatients(PatientFilterTypes.all, 'big brain', [])
      expect(patientsReceived).toEqual([bigBrain])
    })
  })

  describe('editPatientRemoteMonitoring', () => {
    it('should throw an error if patient is not found', () => {
      expect(() => patientHook.editPatientRemoteMonitoring(unknownPatient)).toThrowError()
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
        patientHook.editPatientRemoteMonitoring(monitoredPatient1)
      })
      expect(patientHook.getPatient(unmonitoredPatient.userid).monitoring).toEqual(monitoring)
    })
  })

  describe('getPatient', () => {
    it('should return a patient if existing in a team or null if not', () => {
      let patient = patientHook.getPatient(monitoredPatient1.userid)
      expect(patient).toBeTruthy()
      patient = patientHook.getPatient('unknownId')
      expect(patient).toBeFalsy()
    })
  })

  describe('patients', () => {
    it('should be a correct array of patients', () => {
      expect(patientHook.patients).toEqual(allPatients)
    })
  })

  describe('invitePatient', () => {
    it('should invite and add a patient', async () => {
      jest.spyOn(PatientApi, 'invitePatient').mockResolvedValueOnce({
        key: 'key',
        type: APINotificationType.medicalTeamPatientInvitation,
        email: 'fake@username.com',
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })
      const initialPatientsLength = patientHook.patients.length

      await act(async () => {
        await patientHook.invitePatient(team1, 'new-patient@mail.com')
      })
      expect(patientHook.patients.length).toEqual(initialPatientsLength + 1)
    })
  })

  describe('updatePatientMonitoring', () => {
    it('should throw an error if patient is not monitored', async () => {
      await expect(async () => {
        await patientHook.updatePatientMonitoring(unknownPatient)
      }).rejects.toThrowError('Cannot update patient monitoring with undefined')
    })

    it('should throw an error if patient team does not exists', async () => {
      const patientWithUnknownTeam = createPatient('id', [createPatientTeam('id', UserInvitationStatus.accepted)])
      patientWithUnknownTeam.monitoring = { enabled: true }

      await expect(async () => {
        await patientHook.updatePatientMonitoring(patientWithUnknownTeam)
      }).rejects.toThrowError(`Cannot find monitoring team in which patient ${patientWithUnknownTeam.profile.email} is in`)
    })

    it('should update patient alerts', async () => {
      await mountComponent()
      const updatePatientAlertsMock = jest.spyOn(PatientApi, 'updatePatientAlerts').mockResolvedValue(undefined)
      await act(async () => {
        await patientHook.updatePatientMonitoring(monitoredPatient1)
      })
      expect(updatePatientAlertsMock).toHaveBeenCalled()
    })
  })

  describe('removePatient', () => {
    it('should call notification hook cancel method if invitation is pending and call removePatient method', async () => {
      const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        await patientHook.removePatient(monitoredPatient1, pendingPatientTeam)
        expect(patientHook.getPatient(monitoredPatient1.userid).teams.includes(pendingPatientTeam)).toBeFalsy()
      })
      expect(notificationHookCancelMock).toHaveBeenCalled()
      expect(removePatientMock).toHaveBeenCalled()
    })

    it('should call removeDirectShare API method if private practics', async () => {
      const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare').mockResolvedValue(undefined)
      await act(async () => {
        await patientHook.removePatient(patientToRemovePrivatePractice, patientTeamPrivatePractice)
        expect(patientHook.getPatient(patientToRemovePrivatePractice.userid).teams.includes(patientTeamPrivatePractice)).toBeFalsy()
      })
      expect(removeDirectShareMock).toHaveBeenCalled()
    })

    it.skip('should unflag a patient when he no longer belong to a team', async () => {
      jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      const patientsLength = patientHook.patients.length
      await act(async () => {
        await patientHook.removePatient(patientToRemove, patientTeam2)
        await waitFor(() => expect(patientHook.patients).toEqual(patientsLength - 1))
      })
      expect(authHookGetFlagPatientMock).toHaveBeenCalled()
      expect(authHookFlagPatientMock).toHaveBeenCalled()
    })
  })

  describe('leaveTeam', () => {
    it('should remove patient if user is a patient', async () => {
      const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      const team = loggedInUserAsPatient.teams[0]

      await act(async () => {
        await patientHook.leaveTeam(team.teamId)
      })
      expect(patientHook.getPatient(loggedInUserAsPatient.userid).teams.includes(team)).toBeFalsy()
      expect(removePatientMock).toHaveBeenCalled()
      expect(removeTeamFromListMock).toHaveBeenCalled()
    })
  })
})
