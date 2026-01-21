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

import React, { type FunctionComponent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import { makeStyles } from 'tss-react/mui'
import GroupIcon from '@mui/icons-material/Group'
import PersonIcon from '@mui/icons-material/Person'
import MedicalServiceIcon from '../../components/icons/mui/medical-service-icon'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { errorTextFromException, getUserFirstName, getUserLastName } from '../../lib/utils'
import { useNotification } from '../../lib/notifications/notification.hook'
import metrics from '../../lib/metrics'
import { useAlert } from '../../components/utils/snackbar'
import { usePatientsContext } from '../../lib/patient/patients.provider'
import { useTeam } from '../../lib/team'
import { type Notification as NotificationModel } from '../../lib/notifications/models/notification.model'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'
import { type IUser } from '../../lib/data/models/i-user.model'
import { NotificationType } from '../../lib/notifications/models/enums/notification-type.enum'
import { JoinTeamDialog } from '../../components/dialogs/join-team/join-team-dialog'
import { logError } from '../../utils/error.util'

export interface NotificationSpanProps {
  id: string
  notification: NotificationModel
}

interface NotificationProps {
  notification: NotificationModel
  userRole: UserRole
  onHelp: () => void
  refreshReceivedInvitations: () => void
}

interface NotificationIconPayload {
  id: string
  type: NotificationType
  className: string
}

const useStyles = makeStyles({ name: 'ylp-page-notification' })((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
      padding: theme.spacing(1)
    }
  },
  rightSide: {
    width: '300px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: theme.spacing(1)
    }
  },
  notificationSpan: { marginLeft: '1em', flex: '1' },
  buttonAccept: {
    marginLeft: '1em',
    [theme.breakpoints.down('md')]: {
      marginLeft: 'auto'
    }
  },
  buttonDecline: {
    marginLeft: '1em'
  }
}))

export const NotificationSpan = ({ notification, id }: NotificationSpanProps): JSX.Element => {
  const { t } = useTranslation('yourloops')
  const { creator, type } = notification
  const firstName = getUserFirstName(creator as IUser)
  const lastName = getUserLastName(creator as IUser)
  const careTeam = notification.target?.name ?? ''
  const values = { firstName, lastName, careteam: careTeam }
  const { classes } = useStyles()

  let notificationText: JSX.Element
  switch (type) {
    case NotificationType.directInvitation:
      notificationText = (
        <Trans
          t={t}
          i18nKey="notification-caregiver-invite-by-patient"
          components={{ strong: <strong /> }}
          values={values} parent={React.Fragment}
        >
          <strong>{firstName} {lastName}</strong> wants to share their diabetes data with you.
        </Trans>
      )
      break
    case NotificationType.careTeamProInvitation:
      notificationText = (
        <Trans
          t={t}
          i18nKey="notification-hcp-invite-by-team"
          components={{ strong: <strong /> }}
          values={values}
          parent={React.Fragment}
        >
          <strong>{firstName} {lastName}</strong> invites you to join <strong>{careTeam}</strong>.
        </Trans>
      )
      break
    case NotificationType.careTeamPatientInvitation:
      notificationText = (
        <Trans
          t={t}
          i18nKey="notification-patient-invite-by-team"
          components={{ strong: <strong /> }}
          values={values} parent={React.Fragment}
        >
          You&apos;re invited to share your diabetes data with <strong>{careTeam}</strong>.
        </Trans>
      )
      break
    default:
      notificationText = <i>Invalid invitation type</i>
  }
  return <span id={id} className={`${classes.notificationSpan} notification-text`}>{notificationText}</span>
}

const NotificationIcon = ({ id, type, className }: NotificationIconPayload): JSX.Element => {
  switch (type) {
    case NotificationType.directInvitation:
      return (
        <PersonIcon
          id={`person-icon-${id}`}
          titleAccess="direct-invite-icon"
          className={className}
        />
      )
    case NotificationType.careTeamPatientInvitation:
      return (
        <MedicalServiceIcon
          id={`medical-service-icon-${id}`}
          titleAccess="care-team-invite-icon"
          className={className}
        />
      )
    case NotificationType.careTeamProInvitation:
    default:
      return (
        <GroupIcon
          id={`group-icon-${id}`}
          titleAccess="default-icon"
          className={className}
        />
      )
  }
}

const NotificationDate = ({ id, createdDate }: { id: string, createdDate: string }): JSX.Element => {
  const { t } = useTranslation('yourloops')
  // FIXME display at localtime ?
  const date = moment.utc(createdDate)
  const diff = moment.utc().diff(date, 'days')
  const tooltip = date.format('LT')
  const ariaLabel = date.format('LLLL')

  let display: string
  if (diff === 0) {
    display = t('today')
  } else if (diff === 1) {
    display = t('yesterday')
  } else {
    display = date.format('L')
  }

  return (
    <Tooltip title={tooltip} aria-label={ariaLabel} placement="bottom">
      <div id={`notification-date-${id}`}>{display}</div>
    </Tooltip>
  )
}

export const Notification: FunctionComponent<NotificationProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const notifications = useNotification()
  const alert = useAlert()
  const teamHook = useTeam()
  const patientsHook = usePatientsContext()
  const [inProgress, setInProgress] = useState(false)
  const { classes } = useStyles()
  const { notification, userRole, onHelp, refreshReceivedInvitations } = props
  const { id } = notification
  const [addTeamDialogVisible, setAddTeamDialogVisible] = useState(false)
  const isACareTeamPatientInvitation = notification.type === NotificationType.careTeamPatientInvitation
  const isADirectInvitation = notification.type === NotificationType.directInvitation
  const inviterName = isADirectInvitation ? notification.creator.profile.fullName : notification.target.name

  if (isACareTeamPatientInvitation && !notification.target) {
    throw Error('Cannot accept team invite because notification is missing the team id info')
  }

  const acceptInvitation = async (): Promise<void> => {
    setInProgress(true)
    try {
      await notifications.accept(notification)
      metrics.send('invitation', 'accept_invitation', notification.metricsType)
      if (isADirectInvitation) {
        patientsHook.refresh()
      } else {
        teamHook.refresh()
      }
      alert.success(t('accept-notification-success', { name: inviterName }))
      refreshReceivedInvitations()
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'notification-accept-invitation')

      alert.error(t(errorMessage))
      setInProgress(false)
      notifications.update()
    }
  }

  const onOpenInvitationDialog = async (): Promise<void> => {
    if (isACareTeamPatientInvitation) {
      setAddTeamDialogVisible(true)
    } else {
      await acceptInvitation()
    }
  }

  const onDecline = async (): Promise<void> => {
    setInProgress(true)
    try {
      await notifications.decline(notification)
      metrics.send('invitation', 'decline_invitation', notification.metricsType)
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'notification-decline-invitation')

      alert.error(t(errorMessage))
      setInProgress(false)
      notifications.update()
    }
  }
  const onCloseDialog = (): void => {
    setAddTeamDialogVisible(false)
  }

  const joinTeam = async (): Promise<void> => {
    try {
      await acceptInvitation()
      onCloseDialog()
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'notification-patient-add-team')

      alert.error(t('modal-patient-add-team-failure', { errorMessage }))
    }
  }
  const handleAcceptButtonClick = (): void => {
    userRole === UserRole.Caregiver && notification.type === NotificationType.careTeamProInvitation ? onHelp() : onOpenInvitationDialog()
  }

  return (
    <div id={`notification-line-${id}`} data-testid="notification-line"
         className={`${classes.container} notification-line`} data-notificationid={id}>
      <NotificationIcon id={id} className="notification-icon" type={notification.type} />
      <NotificationSpan id={`notification-text-${id}`} notification={notification} />
      {isACareTeamPatientInvitation && addTeamDialogVisible && notification.target &&
        <JoinTeamDialog
          onClose={onCloseDialog}
          onAccept={joinTeam}
          teamName={notification.target.name}
        />
      }
      <div className={classes.rightSide}>
        <NotificationDate createdDate={notification.date} id={id} />
        <Button
          data-testid="notification-button-accept"
          color="primary"
          variant="contained"
          disableElevation
          className={`${classes.buttonAccept} notification-button-accept`}
          disabled={inProgress}
          onClick={handleAcceptButtonClick}
        >
          {t('button-accept')}
        </Button>

        <Button
          data-testid="notification-button-decline"
          variant="outlined"
          className={`${classes.buttonDecline} notification-button-decline`}
          disabled={inProgress}
          onClick={onDecline}>
          {t('button-decline')}
        </Button>
      </div>
    </div>
  )
}
