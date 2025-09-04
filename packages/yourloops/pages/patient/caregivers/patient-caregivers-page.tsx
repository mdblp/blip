/*
 * Copyright (c) 2021-2025, Diabeloop
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

import React, { type FC, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useAuth } from '../../../lib/auth'
import metrics from '../../../lib/metrics'
import { errorTextFromException, setPageTitle } from '../../../lib/utils'
import { useNotification } from '../../../lib/notifications/notification.hook'
import { type ShareUser } from '../../../lib/share/models/share-user.model'
import { useAlert } from '../../../components/utils/snackbar'
import SecondaryBar from './secondary-bar'
import AddCaregiverDialog from './add-caregiver-dialog'
import CaregiversTable from './caregivers-table'
import DirectShareApi, { PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE } from '../../../lib/share/direct-share.api'
import { NotificationType } from '../../../lib/notifications/models/enums/notification-type.enum'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { type Notification } from '../../../lib/notifications/models/notification.model'
import { type AddDialogContentProps } from './models/add-dialog-content-props.model'
import SpinningLoader from '../../../components/loaders/spinning-loader'
import { logError } from '../../../utils/error.util'

export const PatientCaregiversPage: FC = () => {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { user } = useAuth()
  const notificationHook = useNotification()
  const [caregiverToAdd, setCaregiverToAdd] = React.useState<AddDialogContentProps | null>(null)
  const [caregivers, setCaregivers] = React.useState<ShareUser[] | null>(null)
  const { sentInvitations } = notificationHook
  const sentInvitationsFetched = useRef(null)

  const handleShowAddCaregiverDialog = async (): Promise<void> => {
    const getCaregiverEmail = async (): Promise<string | null> => {
      return await new Promise((resolve: (email: string | null) => void) => {
        setCaregiverToAdd({ onDialogResult: resolve })
      })
    }

    const email = await getCaregiverEmail()
    setCaregiverToAdd(null) // Close the dialog

    if (email && user) {
      try {
        await DirectShareApi.addDirectShare(user.id, email)
        alert.success(t('alert-invite-sent-success'))
        metrics.send('invitation', 'send_invitation', 'caregiver')
        // Refresh the notifications list
        notificationHook.update()
        // And refresh the list
        setCaregivers(null)
      } catch (reason) {
        const error = reason as Error
        console.error(reason)

        if (error.message === PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE) {
          alert.error(t('alert-invite-caregiver-failed-user-is-patient'))
          return
        }
        const errorMessage = errorTextFromException(reason)
        logError(errorMessage, 'invite-caregiver')

        alert.error(t('alert-invite-caregiver-failed'))
      }
    }
  }

  const getCaregiversFromPendingInvitations = useCallback((): ShareUser[] => {
    return sentInvitations.reduce((acc: ShareUser[], invitation: Notification) => {
      if (invitation.type !== NotificationType.directInvitation) {
        return acc
      }

      const caregiver: ShareUser = {
        invitation,
        status: UserInviteStatus.Pending,
        user: {
          username: invitation.email,
          userid: uuidv4(),
          role: UserRole.Caregiver
        }
      }
      acc.push(caregiver)
      return acc
    }, [])
  }, [sentInvitations])

  const fetchCaregivers = useCallback(async (userId: string): Promise<void> => {
    await DirectShareApi.getDirectShares(userId)
      .catch((reason: unknown) => {
        console.error(reason)

        return []
      })
      .then((receivedCaregivers: ShareUser[]) => {
        const invitedCaregivers = getCaregiversFromPendingInvitations()
        receivedCaregivers.push(...invitedCaregivers)
        setCaregivers(receivedCaregivers)
      })
  }, [getCaregiversFromPendingInvitations])

  useEffect(() => {
    if (sentInvitationsFetched.current !== sentInvitations) {
      sentInvitationsFetched.current = sentInvitations
      fetchCaregivers(user.id)
    }
  }, [fetchCaregivers, sentInvitations, user.id])

  setPageTitle(t('caregivers-title'))

  return (
    <>
      {!caregivers
        ? <SpinningLoader className="centered-spinning-loader" />
        : <>
          <SecondaryBar onShowAddCaregiverDialog={handleShowAddCaregiverDialog} />
          <Container maxWidth="lg">
            <Box marginTop={4}>
              <CaregiversTable
                caregivers={caregivers}
                fetchCaregivers={fetchCaregivers}
              />
            </Box>
          </Container>
        </>
      }
      {caregiverToAdd &&
        <AddCaregiverDialog actions={caregiverToAdd} currentCaregivers={caregivers} />
      }
    </>
  )
}
