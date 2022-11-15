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

import { useTranslation } from 'react-i18next'
import { useAlert } from '../utils/snackbar'
import { INotification } from '../../lib/notifications/models'
import DirectShareApi from '../../lib/share/direct-share-api'
import { User } from '../../lib/auth'
import { useNotification } from '../../lib/notifications/hook'
import { OnCloseRemoveDirectShareDialog, UserToRemove } from './remove-direct-share-dialog'

interface RemoveDirectShareDialogHookReturn {
  removeDirectShare: (userToRemove: UserToRemove, currentUser: User) => Promise<void>
}

const useRemoveDirectShareDialog = (onClose: OnCloseRemoveDirectShareDialog): RemoveDirectShareDialogHookReturn => {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { cancel, sentInvitations } = useNotification()

  const removeDirectShare = async (userToRemove: UserToRemove, currentUser: User): Promise<void> => {
    const isCurrentUserCaregiver = currentUser.isUserCaregiver()

    try {
      const invitation = sentInvitations.find((invitation: INotification) => invitation.email === userToRemove.email)

      if (invitation) {
        await cancel(invitation)
      } else {
        const patientId = isCurrentUserCaregiver ? userToRemove.id : currentUser.id
        const viewerId = isCurrentUserCaregiver ? currentUser.id : userToRemove.id

        await DirectShareApi.removeDirectShare(patientId, viewerId)
      }

      const successAlertKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-success' : 'modal-patient-remove-caregiver-success'
      alert.success(t(successAlertKey))

      onClose(!invitation)
    } catch (reason) {
      const errorAlertKey = isCurrentUserCaregiver ? 'modal-caregiver-remove-patient-failure' : 'modal-patient-remove-caregiver-failure'
      alert.error(t(errorAlertKey))
    }
  }

  return { removeDirectShare }
}

export default useRemoveDirectShareDialog
