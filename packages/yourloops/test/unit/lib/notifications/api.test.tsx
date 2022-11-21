/*
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

import HttpStatus from '../../../../lib/http-status-codes'
import HttpService, { ErrorMessageStatus } from '../../../../services/http'
import { APINotificationType, INotificationAPI } from '../../../../models/notification'
import { loggedInUsers } from '../../common'
import axios, { AxiosResponse } from 'axios'
import NotificationApi from '../../../../lib/notifications/notification-api'
import { INotification, NotificationType } from '../../../../lib/notifications/models'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Notification API', () => {
  const userId = 'fakeUserId'
  const userId2 = 'fakeUserId2'
  const email = 'fake@email.com'
  const hcp = loggedInUsers.getHcp()
  const patient = loggedInUsers.getPatient()
  const caregiver = loggedInUsers.getCaregiver()
  let err: Error | null = null

  afterEach(() => {
    mockedAxios.get.mockReset()
    mockedAxios.post.mockReset()
    mockedAxios.put.mockReset()
    err = null
  })

  const directInvitationNotification: INotification = {
    id: 'directInvitationNotificationFakeId',
    metricsType: 'share_data',
    type: NotificationType.directInvitation,
    creator: { userid: patient.id, profile: patient.profile },
    creatorId: patient.id,
    date: new Date().toISOString(),
    email
  }

  const careTeamProInvitationNotification: INotification = {
    id: 'careTeamProInvitationNotificationFakeId',
    metricsType: 'join_team',
    type: NotificationType.careTeamProInvitation,
    creator: { userid: caregiver.id, profile: caregiver.profile },
    creatorId: caregiver.id,
    date: new Date().toISOString(),
    email,
    target: {
      id: 'fakeTargetId',
      name: 'A team'
    }
  }

  const careTeamProInvitationNotificationNoTarget: INotification = {
    id: 'careTeamProInvitationNotificationNoTargetFakeId',
    metricsType: 'join_team',
    type: NotificationType.careTeamProInvitation,
    creator: { userid: caregiver.id, profile: caregiver.profile },
    creatorId: caregiver.id,
    date: new Date().toISOString(),
    email
  }

  const resolveOK: Response = {
    status: HttpStatus.StatusOK,
    ok: true,
    statusText: 'OK',
    type: 'basic',
    redirected: false,
    text: jest.fn().mockResolvedValue('OK')
  } as unknown as Response

  function buildAxiosError(error: string): Response {
    return {
      status: HttpStatus.StatusInternalServerError,
      ok: false,
      statusText: 'InternalServerError',
      type: 'error',
      redirected: false,
      json: jest.fn().mockRejectedValue(new Error(error))
    } as unknown as Response
  }

  describe('inviteToRemoteMonitoring', () => {
    it('should call api with correct params', async () => {
      const teamId = 'fakeTeamId'
      const userId = 'fakeUserId'
      const monitoringEnd = new Date()
      const referringDoctor = 'fakeReferringDoctor'
      const postRequestSpy = jest.spyOn(HttpService, 'post').mockResolvedValueOnce(null)
      const expectedArgs = {
        url: `/confirm/send/team/monitoring/${teamId}/${userId}`,
        payload: { monitoringEnd: monitoringEnd.toJSON(), referringDoctor }
      }
      await NotificationApi.inviteToRemoteMonitoring(teamId, userId, monitoringEnd, referringDoctor)
      expect(postRequestSpy).toHaveBeenCalledWith(expectedArgs)
    })
  })

  describe('cancelRemoteMonitoringInvite', () => {
    it('should call api with correct params', async () => {
      const teamId = 'fakeTeamId'
      const userId = 'fakeUserId'
      const putRequestSpy = jest.spyOn(HttpService, 'put').mockResolvedValueOnce(null)
      const expectedArgs = {
        url: `/confirm/dismiss/team/monitoring/${teamId}/${userId}`
      }
      await NotificationApi.cancelRemoteMonitoringInvite(teamId, userId)
      expect(putRequestSpy).toHaveBeenCalledWith(expectedArgs)
    })
  })

  describe('getReceivedInvitations', () => {
    const urlArgs = `/confirm/invitations/${userId}`

    it('should throw an error if the response is not ok', async () => {
      mockedAxios.get.mockResolvedValue(buildAxiosError('Not as JSON'))

      let error: Error | null = null
      try {
        await NotificationApi.getReceivedInvitations(userId)
      } catch (reason) {
        error = reason as Error
      }
      expect(error).toBeInstanceOf(Error)
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything())
    })

    it('should return an empty array, if there is no invitation', async () => {
      mockedAxios.get.mockImplementation(() => {
        throw new Error(ErrorMessageStatus.NotFound)
      })

      const result = await NotificationApi.getReceivedInvitations(userId)
      expect(result).toEqual([])
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything())
    })

    it('should return the converted notifications', async () => {
      const apiNotifications: INotificationAPI[] = [
        {
          key: 'fakeId',
          type: APINotificationType.careTeamInvitation,
          creatorId: 'abcd',
          created: new Date().toISOString(),
          creator: {
            userid: 'abcd',
            profile: {
              fullName: 'Test',
              firstName: 'Test',
              lastName: 'Test'
            }
          },
          shortKey: 'abcdef',
          email: patient.username
        }
      ]
      const resolveOK: AxiosResponse<INotificationAPI[]> = {
        headers: {},
        config: {},
        status: HttpStatus.StatusOK,
        statusText: 'OK',
        data: apiNotifications
      }
      mockedAxios.get.mockResolvedValue(resolveOK)

      const result = await NotificationApi.getReceivedInvitations(userId)
      const expectedResult: INotification[] = [
        {
          id: apiNotifications[0].key,
          metricsType: 'share_data',
          creatorId: apiNotifications[0].creatorId,
          date: apiNotifications[0].created,
          email: apiNotifications[0].email,
          type: NotificationType.directInvitation,
          creator: apiNotifications[0].creator,
          role: undefined,
          target: undefined
        }
      ]

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(1)
      expect(result).toEqual(expectedResult)
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything())
    })
  })

  describe('getSentInvitations', () => {
    const urlArgs = `/confirm/invite/${userId}`

    it('should throw an error if the response is not ok', async () => {
      mockedAxios.get.mockResolvedValue(buildAxiosError('Not a JSON'))

      let error: Error | null = null
      try {
        await NotificationApi.getSentInvitations(userId)
      } catch (reason) {
        error = reason as Error
      }

      expect(error).toBeInstanceOf(Error)
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything())
    })

    it('should return an empty array, if there is no invitation', async () => {
      mockedAxios.get.mockImplementation(() => {
        throw new Error(ErrorMessageStatus.NotFound)
      })

      const result = await NotificationApi.getSentInvitations(userId)

      expect(result).toEqual([])
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything())
    })

    it('should return the converted notifications', async () => {
      const apiNotifications: INotificationAPI[] = [
        {
          key: 'fakeId',
          type: APINotificationType.careTeamInvitation,
          creatorId: userId2,
          created: new Date().toISOString(),
          creator: {
            userid: 'abcd',
            profile: {
              fullName: 'Test',
              firstName: 'Test',
              lastName: 'Test'
            }
          },
          shortKey: 'abcdef',
          email: 'patient@yourloops.com'
        }
      ]
      mockedAxios.get.mockResolvedValue({
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: 'OK',
        type: 'basic',
        redirected: false,
        data: apiNotifications
      })

      const result = await NotificationApi.getSentInvitations(userId)
      const expectedResult: INotification[] = [
        {
          id: apiNotifications[0].key,
          metricsType: 'share_data',
          creatorId: apiNotifications[0].creatorId,
          date: apiNotifications[0].created,
          email: apiNotifications[0].email,
          type: NotificationType.directInvitation,
          creator: apiNotifications[0].creator,
          role: undefined,
          target: undefined
        }
      ]

      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBe(1)
      expect(result).toEqual(expectedResult)
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything())
    })
  })

  describe('acceptInvitation', () => {
    it('should throw an error if the invitation type is invalid', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error()
      })

      const notification: INotification = {
        metricsType: 'join_team',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: userId, profile: hcp.profile },
        creatorId: userId2,
        date: new Date().toISOString(),
        email,
        id: 'fakeId'
      }
      try {
        await NotificationApi.acceptInvitation(userId, {
          ...notification,
          type: 'unknownType' as unknown as NotificationType
        })
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(0)
    })

    it('should throw an error if the reply is not ok (directInvitation)', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error()
      })

      try {
        await NotificationApi.acceptInvitation(userId, directInvitationNotification)
      } catch (reason) {
        err = reason as Error
      }
      const expectedArgs = `/confirm/accept/invite/${userId}/${patient.id}`
      const expectedBody = { key: directInvitationNotification.id }

      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, expect.anything())
    })

    it('should resolve when the reply is ok (directInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(resolveOK)

      try {
        await NotificationApi.acceptInvitation(userId, directInvitationNotification)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/accept/invite/${userId}/${patient.id}`
      const expectedBody = { key: directInvitationNotification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, expect.anything())
    })

    it('should throw an error if the reply is not ok (careTeamProInvitation)', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error()
      })
      try {
        await NotificationApi.acceptInvitation(userId, careTeamProInvitationNotification)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = '/confirm/accept/team/invite'
      const expectedBody = { key: careTeamProInvitationNotification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should resolve when the reply is ok (careTeamProInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(resolveOK)

      const notification: INotification = {
        id: 'fakeId',
        metricsType: 'share_data',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: caregiver.id, profile: caregiver.profile },
        creatorId: caregiver.id,
        date: new Date().toISOString(),
        email,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }

      await NotificationApi.acceptInvitation(userId, notification)
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = '/confirm/accept/team/invite'
      const expectedBody = { key: notification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should throw an error if the reply is not ok (careTeamPatientInvitation)', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error('careTeamPatientInvitations')
      })

      const notification: INotification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamPatientInvitation,
        creator: { userid: patient.id, profile: patient.profile },
        creatorId: patient.id,
        date: new Date().toISOString(),
        email,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }

      try {
        await NotificationApi.acceptInvitation(userId, notification)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = '/confirm/accept/team/invite'
      const expectedBody = { key: notification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should resolve when the reply is ok (careTeamPatientInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(resolveOK)

      const patient = loggedInUsers.getPatient()
      const notification: INotification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamPatientInvitation,
        creator: { userid: patient.id, profile: patient.profile },
        creatorId: patient.id,
        date: new Date().toISOString(),
        email,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }

      await NotificationApi.acceptInvitation(userId, notification)
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = '/confirm/accept/team/invite'
      const expectedBody = { key: notification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    }
    )
  })

  describe('declineInvitation', () => {
    it('should throw an error if the invitation type is invalid', async () => {
      mockedAxios.put.mockResolvedValue(buildAxiosError('test'))

      const notificationTypes = [NotificationType.careTeamProInvitation, NotificationType.careTeamPatientInvitation]
      const user = hcp
      const notification: INotification = {
        metricsType: 'join_team',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: user.id, profile: user.profile },
        creatorId: user.id,
        date: new Date().toISOString(),
        email: user.username,
        id: 'fakeId'
      }
      for (const notificationType of notificationTypes) {
        try {
          await NotificationApi.declineInvitation(userId, { ...notification, type: notificationType })
        } catch (reason) {
          err = reason as Error
        }
        expect(err).not.toBeNull()
      }
      expect(mockedAxios.put).toHaveBeenCalledTimes(0)
    })

    it('should throw an error if the reply is not ok (directInvitation)', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error('directInvitation')
      })

      try {
        await NotificationApi.declineInvitation(userId, directInvitationNotification)
      } catch (reason) {
        err = reason as Error
      }

      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/dismiss/invite/${userId}/${patient.id}`
      const expectedBody = { key: directInvitationNotification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should resolve when the reply is ok (directInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(resolveOK)

      await NotificationApi.declineInvitation(userId, directInvitationNotification)
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/dismiss/invite/${userId}/${patient.id}`
      const expectedBody = { key: directInvitationNotification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should throw an error if the teamId is not set (careTeamProInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(buildAxiosError('careTeamProInvitation'))

      try {
        await NotificationApi.declineInvitation(userId, careTeamProInvitationNotificationNoTarget)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(0)
    })

    it('should throw an error if the reply is not ok (careTeamProInvitation)', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error('CareteamProInvitation')
      })

      try {
        await NotificationApi.declineInvitation(userId, careTeamProInvitationNotification)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/dismiss/team/invite/${careTeamProInvitationNotification.target.id}`
      const expectedBody = { key: careTeamProInvitationNotification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should resolve when the reply is ok (careTeamProInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(resolveOK)

      await NotificationApi.declineInvitation(userId, careTeamProInvitationNotification)
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/dismiss/team/invite/${careTeamProInvitationNotification.target.id}`
      const expectedBody = { key: careTeamProInvitationNotification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should throw an error if the teamId is not set (careTeamPatientInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(buildAxiosError('careTeamPatientInvitation'))

      const patient = loggedInUsers.getPatient()
      const notification: INotification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamPatientInvitation,
        creator: { userid: patient.id, profile: patient.profile },
        creatorId: patient.id,
        date: new Date().toISOString(),
        email
      }

      try {
        await NotificationApi.declineInvitation(userId, notification)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(0)
    })

    it('should throw an error if the reply is not ok (careTeamPatientInvitation)', async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error('careteamPatienInvitation')
      })

      const patient = loggedInUsers.getPatient()
      const notification: INotification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamPatientInvitation,
        creator: { userid: patient.id, profile: patient.profile },
        creatorId: patient.id,
        date: new Date().toISOString(),
        email,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }

      try {
        await NotificationApi.declineInvitation(userId, notification)
      } catch (reason) {
        err = reason as Error
      }
      expect(err).not.toBeNull()
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/dismiss/team/invite/${notification.target.id}`
      const expectedBody = { key: notification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })

    it('should resolve when the reply is ok (careTeamPatientInvitation)', async () => {
      mockedAxios.put.mockResolvedValue(resolveOK)

      const patient = loggedInUsers.getPatient()
      const notification: INotification = {
        id: 'fakeId',
        metricsType: 'join_team',
        type: NotificationType.careTeamPatientInvitation,
        creator: { userid: patient.id, profile: patient.profile },
        creatorId: patient.id,
        date: new Date().toISOString(),
        email,
        target: {
          id: 'fakeTargetId',
          name: 'A team'
        }
      }

      await NotificationApi.declineInvitation(userId, notification)
      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      const expectedArgs = `/confirm/dismiss/team/invite/${notification.target.id}`
      const expectedBody = { key: notification.id }
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })
  })

  describe('cancelInvitation', () => {
    it('should call API with correct parameters', async () => {
      mockedAxios.post.mockResolvedValue(resolveOK)
      const notificationId = 'fakeNotificationId'
      const teamId = 'fakeTeamId'
      const inviteeEmail = 'fakeEmail'

      await NotificationApi.cancelInvitation(notificationId, teamId, inviteeEmail)
      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      const expectedArgs = '/confirm/cancel/invite'
      const expectedBody = { email: inviteeEmail, key: notificationId, target: { id: teamId } }
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedArgs, expectedBody, {})
    })
  })
})
