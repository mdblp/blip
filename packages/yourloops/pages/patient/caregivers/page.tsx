/**
 * Copyright (c) 2021, Diabeloop
 * Patient care givers page
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

import React, { useCallback, useEffect } from 'react'
import bows from 'bows'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'

import { UserInvitationStatus } from '../../../models/generic'
import { UserRoles } from '../../../models/user'
import { useAuth } from '../../../lib/auth'
import metrics from '../../../lib/metrics'
import { setPageTitle } from '../../../lib/utils'
import { useNotification } from '../../../lib/notifications/hook'
import { ShareUser } from '../../../lib/share/models'
import { useAlert } from '../../../components/utils/snackbar'
import { AddDialogContentProps } from './types'
import SecondaryBar from './secondary-bar'
import AddCaregiverDialog from './add-dialog'
import CaregiverTable from './table'
import DirectShareApi from '../../../lib/share/direct-share-api'
import { INotification, NotificationType } from '../../../lib/notifications/models'

const log = bows('PatientCaregiversPage')

/**
 * Patient caregivers page
 */
function PatientCaregiversPage(): JSX.Element {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { user } = useAuth()
  const notificationHook = useNotification()
  const [caregiverToAdd, setCaregiverToAdd] = React.useState<AddDialogContentProps | null>(null)
  const [caregivers, setCaregivers] = React.useState<ShareUser[] | null>(null)
  const { sentInvitations, initialized: haveNotifications } = notificationHook

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
        alert.success(t('alert-invitation-sent-success'))
        metrics.send('invitation', 'send_invitation', 'caregiver')
        // Refresh the notifications list
        notificationHook.update()
        // And refresh the list
        setCaregivers(null)
      } catch (reason) {
        log.error(reason)
        alert.error(t('alert-invitation-caregiver-failed'))
      }
    }
  }

  const getCaregiversFromPendingInvitations = useCallback((): ShareUser[] => {
    return sentInvitations.reduce((acc: ShareUser[], invitation: INotification) => {
      if (invitation.type !== NotificationType.directInvitation) {
        return acc
      }

      log.debug('Found pending direct-share invitation: ', invitation)
      const caregiver: ShareUser = {
        invitation,
        status: UserInvitationStatus.pending,
        user: {
          username: invitation.email,
          userid: uuidv4(),
          role: UserRoles.caregiver
        }
      }
      acc.push(caregiver)
      return acc
    }, [])
  }, [sentInvitations])

  const fetchCaregivers = useCallback(async (): Promise<void> => {
    return await DirectShareApi.getDirectShares()
      .catch((reason: unknown) => {
        log.error(reason)

        return []
      })
      .then((caregivers: ShareUser[]) => {
        const invitedCaregivers = getCaregiversFromPendingInvitations()
        caregivers.push(...invitedCaregivers)
        setCaregivers(caregivers)
      })
  }, [getCaregiversFromPendingInvitations])

  useEffect(() => {
    fetchCaregivers()
  }, [fetchCaregivers, sentInvitations])

  useEffect(() => {
    if (!caregivers && user && haveNotifications) {
      fetchCaregivers()
    }
  }, [caregivers, fetchCaregivers, haveNotifications, user])

  useEffect(() => {
    setPageTitle(t('caregivers-title'))
  }, [t])

  return (
    <>
      {!caregivers
        ? <CircularProgress
          className="centered-spinning-loader"
        />
        : <>
          <SecondaryBar onShowAddCaregiverDialog={handleShowAddCaregiverDialog} />
          <Container maxWidth="lg">
            <Box marginTop={4}>
              <CaregiverTable caregivers={caregivers} fetchCaregivers={fetchCaregivers}/>
            </Box>
          </Container>
        </>
      }
      <AddCaregiverDialog actions={caregiverToAdd} />
    </>
  )
}

export default PatientCaregiversPage
