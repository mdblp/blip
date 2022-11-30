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

import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import moment from 'moment-timezone'

import { Theme } from '@mui/material/styles'
import { makeStyles, createStyles } from '@mui/styles'
import GroupIcon from '@mui/icons-material/Group'
import PersonIcon from '@mui/icons-material/Person'
import HelpIcon from '@mui/icons-material/Help'
import MedicalServiceIcon from '../../components/icons/MedicalServiceIcon'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

import { IUser, UserRoles } from '../../models/user'
import { INotification, NotificationType } from '../../lib/notifications/models'
import { errorTextFromException, getUserFirstName, getUserLastName } from '../../lib/utils'
import { useNotification } from '../../lib/notifications/hook'
import metrics from '../../lib/metrics'
import { useAlert } from '../../components/utils/snackbar'
import AddTeamDialog from '../../pages/patient/teams/add-dialog'
import MonitoringConsentDialog from '../../components/dialogs/monitoring-consent-dialog'
import { usePatientContext } from '../../lib/patient/provider'
import { useTeam } from '../../lib/team'
import { useAuth } from '../../lib/auth'

export interface NotificationSpanProps {
  id: string
  notification: INotification
}

interface NotificationProps {
  notification: INotification
  userRole: UserRoles
  onHelp: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }), { name: 'ylp-page-notification' }
)

export const NotificationSpan = ({ notification, id }: NotificationSpanProps): JSX.Element => {
  const { t } = useTranslation('yourloops')
  const { creator, type } = notification
  const firstName = getUserFirstName(creator as IUser)
  const lastName = getUserLastName(creator as IUser)
  const careTeam = notification.target?.name ?? ''
  const values = { firstName, lastName, careteam: careTeam }
  const classes = useStyles()

  let notificationText: JSX.Element
  switch (type) {
    case NotificationType.directInvitation:
      notificationText = (
        <Trans
          t={t}
          i18nKey="notification-caregiver-invitation-by-patient"
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
          i18nKey="notification-hcp-invitation-by-team"
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
          i18nKey="notification-patient-invitation-by-team"
          components={{ strong: <strong /> }}
          values={values} parent={React.Fragment}
        >
          You&apos;re invited to share your diabetes data with <strong>{careTeam}</strong>.
        </Trans>
      )
      break
    case NotificationType.careTeamMonitoringInvitation:
      notificationText = (
        <Trans
          t={t}
          i18nKey="notification-patient-remote-monitoring"
          components={{ strong: <strong /> }}
          values={values} parent={React.Fragment}
        >
          {t('invite-join-monitoring-team')} <strong>{careTeam}</strong>.
        </Trans>
      )
      break
    default:
      notificationText = <i>Invalid invitation type</i>
  }

  return <span id={id} className={`${classes.notificationSpan} notification-text`}>{notificationText}</span>
}

const NotificationIcon = ({
  id,
  type,
  className
}: { id: string, type: NotificationType, className: string }): JSX.Element => {
  switch (type) {
    case NotificationType.directInvitation:
      return <PersonIcon id={`person-icon-${id}`} titleAccess="direct-invitation-icon" className={className} />
    case NotificationType.careTeamPatientInvitation:
      return <MedicalServiceIcon id={`medical-service-icon-${id}`} titleAccess="care-team-invitation-icon"
                                 className={className} />
    case NotificationType.careTeamProInvitation:
    default:
      return <GroupIcon id={`group-icon-${id}`} titleAccess="default-icon" className={className} />
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

export const Notification = (props: NotificationProps): JSX.Element => {
  const { t } = useTranslation('yourloops')
  const notifications = useNotification()
  const alert = useAlert()
  const teamHook = useTeam()
  const { user } = useAuth()
  const patientHook = usePatientContext()
  const [inProgress, setInProgress] = React.useState(false)
  const classes = useStyles()
  const { notification } = props
  const { id } = notification
  const [addTeamDialogVisible, setAddTeamDialogVisible] = React.useState(false)
  const isACareTeamPatientInvitation = notification.type === NotificationType.careTeamPatientInvitation
  const isAMonitoringInvitation = notification.type === NotificationType.careTeamMonitoringInvitation
  const [displayMonitoringTerms, setDisplayMonitoringTerms] = React.useState(false)

  if (isACareTeamPatientInvitation && !notification.target) {
    throw Error('Cannot accept team invite because notification is missing the team id info')
  }

  const acceptInvitation = async (): Promise<void> => {
    setInProgress(true)
    try {
      await notifications.accept(notification)
      metrics.send('invitation', 'accept_invitation', notification.metricsType)
      if (user.isUserHcp()) {
        teamHook.refresh()
      }
      patientHook.refresh()
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      alert.error(t(errorMessage))
      setInProgress(false)
      notifications.update()
    }
  }

  const onOpenInvitationDialog = (): void => {
    if (isACareTeamPatientInvitation) {
      setAddTeamDialogVisible(true)
    } else if (isAMonitoringInvitation) {
      setDisplayMonitoringTerms(true)
    } else {
      acceptInvitation()
    }
  }

  const acceptTerms = (): void => {
    setDisplayMonitoringTerms(false)
    acceptInvitation()
  }

  const onDecline = async (): Promise<void> => {
    setInProgress(true)
    try {
      await notifications.decline(notification)
      metrics.send('invitation', 'decline_invitation', notification.metricsType)
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      alert.error(t(errorMessage))
      setInProgress(false)
      notifications.update()
    }
  }

  const closeTeamAcceptDialog = (teamId?: string): void => {
    setAddTeamDialogVisible(false)
    if (notification.target && teamId && notification.target.id === teamId) {
      acceptInvitation()
    }
  }

  return (
    <div id={`notification-line-${id}`} data-testid="notification-line"
         className={`${classes.container} notification-line`} data-notificationid={id}>
      <NotificationIcon id={id} className="notification-icon" type={notification.type} />
      <NotificationSpan id={`notification-text-${id}`} notification={notification} />
      <div className={classes.rightSide}>
        <NotificationDate createdDate={notification.date} id={id} />
        {isACareTeamPatientInvitation && addTeamDialogVisible && notification.target &&
          <AddTeamDialog
            error={t('notification-patient-invitation-wrong-code', { careteam: notification.target.name })}
            teamName={notification.target.name}
            actions={{
              onDialogResult: (teamId) => {
                closeTeamAcceptDialog(teamId)
              }
            }}
          />}
        {isAMonitoringInvitation && displayMonitoringTerms && notification.target &&
          <MonitoringConsentDialog onAccept={acceptTerms} onCancel={() => setDisplayMonitoringTerms(false)}
                                   teamName={notification.target.name} />
        }
        {props.userRole === UserRoles.caregiver && notification.type === NotificationType.careTeamProInvitation ? (
          <IconButton
            id={`notification-help-${id}-button`}
            className="notification-help-button"
            size="medium"
            color="primary"
            aria-label="notification-help-button"
            onClick={props.onHelp}>
            <HelpIcon id={`notification-help-${id}-icon`} />
          </IconButton>
        ) : (
          <Button
            id={`notification-button-accept-${id}`}
            color="primary"
            variant="contained"
            disableElevation
            className={`${classes.buttonAccept} notification-button-accept`}
            disabled={inProgress}
            onClick={onOpenInvitationDialog}
          >
            {t('button-accept')}
          </Button>
        )}
        <Button
          id={`notification-button-decline-${id}`}
          className={`${classes.buttonDecline} notification-button-decline`}
          disabled={inProgress}
          onClick={onDecline}>
          {t('button-decline')}
        </Button>
      </div>
    </div>
  )
}
