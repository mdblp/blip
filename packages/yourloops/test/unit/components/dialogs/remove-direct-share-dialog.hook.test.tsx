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

import DirectShareApi from '../../../../lib/share/direct-share.api'
import * as notificationHookMock from '../../../../lib/notifications/notification.hook'
import * as patientsHookMock from '../../../../lib/patient/patients.provider'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { renderHook } from '@testing-library/react'
import useRemoveDirectShareDialog from '../../../../components/dialogs/remove-direct-share-dialog.hook'
import * as alertMock from '../../../../components/utils/snackbar'
import { type User } from '../../../../lib/auth'
import { NotificationType } from '../../../../lib/notifications/models/enums/notification-type.enum'
import ErrorApi from '../../../../lib/error/error.api'

jest.mock('../../../../components/utils/snackbar')
jest.mock('../../../../lib/notifications/notification.hook')
jest.mock('../../../../lib/patient/patients.provider')

describe('Remove direct share dialog hook', () => {
  const userToRemoveEmail = 'fake@email.com'
  const userToRemove = { id: 'fake-id', email: userToRemoveEmail, fullName: 'Fake User' }
  const invitation = { id: 'fake-invitation-id', email: userToRemoveEmail, type: NotificationType.directInvitation, target: { id: 'fakeTeamId' } }
  const authUserId = 'auth-user-id'

  const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare')
  const cancelInvitationMock = jest.spyOn(NotificationApi, 'cancelInvitation')
  const isUserCaregiverMock = jest.fn()
  const onClose = jest.fn()
  const onSuccessAlertMock = jest.fn()
  const onErrorAlertMock = jest.fn()
  const refreshMock = jest.fn()

  const currentUser = { id: authUserId, isUserCaregiver: isUserCaregiverMock } as unknown as User

  let sentInvitationsMock = []

  beforeEach(() => {
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => ({
      cancel: cancelInvitationMock,
      sentInvitations: sentInvitationsMock
    }));

    (alertMock.useAlert as jest.Mock).mockImplementation(() => ({
      success: onSuccessAlertMock,
      error: onErrorAlertMock
    }));

    (patientsHookMock.usePatientsContext as jest.Mock).mockImplementation(() => ({
      refresh: refreshMock
    }))
  })

  describe('when a patient removes a pending invitation', () => {
    beforeEach(() => {
      isUserCaregiverMock.mockReturnValueOnce(false)
      sentInvitationsMock = [invitation]
    })

    it('should show success and close the dialog if the removal is successful', async () => {
      cancelInvitationMock.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useRemoveDirectShareDialog(onClose))
      await result.current.removeDirectShare(userToRemove, currentUser)

      expect(cancelInvitationMock).toHaveBeenCalledWith(invitation.id, invitation.target.id, userToRemove.email)
      expect(onSuccessAlertMock).toHaveBeenCalledWith('modal-patient-remove-caregiver-success')
      expect(onClose).toHaveBeenCalledWith(false)
    })

    it('should show error and not close the dialog if the removal fails', async () => {
      jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)
      cancelInvitationMock.mockRejectedValueOnce('Error')

      const { result } = renderHook(() => useRemoveDirectShareDialog(onClose))
      await result.current.removeDirectShare(userToRemove, currentUser)

      expect(cancelInvitationMock).toHaveBeenCalledWith(invitation.id, invitation.target.id, userToRemove.email)
      expect(onErrorAlertMock).toHaveBeenCalledWith('modal-patient-remove-caregiver-failure')
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('when a patient removes a direct share', () => {
    beforeEach(() => {
      isUserCaregiverMock.mockReturnValueOnce(false)
      sentInvitationsMock = []
    })

    it('should show success and close the dialog if the removal is successful', async () => {
      removeDirectShareMock.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useRemoveDirectShareDialog(onClose))
      await result.current.removeDirectShare(userToRemove, currentUser)

      expect(removeDirectShareMock).toHaveBeenCalledWith(authUserId, userToRemove.id)
      expect(onSuccessAlertMock).toHaveBeenCalledWith('modal-patient-remove-caregiver-success')
      expect(onClose).toHaveBeenCalledWith(true)
    })

    it('should show error and not close the dialog if the removal fails', async () => {
      jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)
      removeDirectShareMock.mockRejectedValueOnce('Error')

      const { result } = renderHook(() => useRemoveDirectShareDialog(onClose))
      await result.current.removeDirectShare(userToRemove, currentUser)

      expect(removeDirectShareMock).toHaveBeenCalledWith(authUserId, userToRemove.id)
      expect(onErrorAlertMock).toHaveBeenCalledWith('modal-patient-remove-caregiver-failure')
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('when a caregiver removes a direct share', () => {
    beforeEach(() => {
      isUserCaregiverMock.mockReturnValueOnce(true)
      sentInvitationsMock = []
    })

    it('should show success and close the dialog when the removal is successful', async () => {
      removeDirectShareMock.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useRemoveDirectShareDialog(onClose))
      await result.current.removeDirectShare(userToRemove, currentUser)

      expect(removeDirectShareMock).toHaveBeenCalledWith(userToRemove.id, authUserId)
      expect(onSuccessAlertMock).toHaveBeenCalledWith('modal-caregiver-remove-patient-success')
      expect(refreshMock).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalledWith(true)
    })

    it('should show error and not close the dialog when the removal fails', async () => {
      jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)
      removeDirectShareMock.mockRejectedValueOnce('Error')

      const { result } = renderHook(() => useRemoveDirectShareDialog(onClose))
      await result.current.removeDirectShare(userToRemove, currentUser)

      expect(removeDirectShareMock).toHaveBeenCalledWith(userToRemove.id, authUserId)
      expect(onErrorAlertMock).toHaveBeenCalledWith('modal-caregiver-remove-patient-failure')
      expect(onClose).not.toHaveBeenCalled()
    })
  })
})
