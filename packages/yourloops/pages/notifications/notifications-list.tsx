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

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'

import metrics from '../../lib/metrics'
import { setPageTitle } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import { INotification } from '../../lib/notifications/models'
import { useNotification } from '../../lib/notifications/hook'
import SwitchRoleDialogs from '../../components/switch-role'

import { Notification } from './notification'

const useStyles = makeStyles((theme: Theme) => ({
  homeIcon: {
    marginRight: '0.5em'
  },
  breadcrumbLink: {
    display: 'flex'
  },
  toolBar: {
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'auto auto auto',
    paddingLeft: '6em',
    paddingRight: '6em'
  },
  noNotificationMessage: {
    textAlign: 'center',
    margin: theme.spacing(4)
  }
}), { name: 'ylp-page-notifications-list' })

const NotificationsPage = (): JSX.Element => {
  const { t } = useTranslation('yourloops')
  const classes = useStyles()
  const { user } = useAuth()
  const notificationsHook = useNotification()
  const [switchRoleOpen, setSwitchRoleOpen] = useState<boolean>(false)

  useEffect(() => {
    setPageTitle(t('breadcrumb-notifications'))
  }, [t])

  if (user === null) {
    throw new Error('Notification require a logged-in user')
  }

  const notifications = notificationsHook.receivedInvitations
  const loading = !notificationsHook.initialized

  if (loading) {
    return (
      <CircularProgress
        id="notification-page-loading-progress"
        className="centered-spinning-loader"
      />
    )
  }

  const handleSwitchRoleOpen = (): void => {
    metrics.send('switch_account', 'display_switch_notification')
    setSwitchRoleOpen(true)
  }
  const handleSwitchRoleCancel = (): void => {
    setSwitchRoleOpen(false)
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <List>
          {notifications.length > 0 ? (
            notifications.map((notification: INotification, index: number) => (
              <ListItem
                key={notification.id}
                disableGutters
                divider={index !== notifications.length - 1}
              >
                <Notification
                  notification={notification}
                  userRole={user.role}
                  onHelp={handleSwitchRoleOpen}
                />
              </ListItem>
            ))
          ) : (
            <Typography
              className={classes.noNotificationMessage}
              id="typography-no-pending-invitation-message"
              variant="body2"
              gutterBottom
            >
              {t('notification-no-pending-invitation')}
            </Typography>
          )}
        </List>
        <SwitchRoleDialogs open={switchRoleOpen} onCancel={handleSwitchRoleCancel} />
      </Container>
    </React.Fragment>
  )
}

export default NotificationsPage
