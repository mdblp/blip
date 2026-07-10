/*
 * Copyright (c) 2026, Diabeloop
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

import React, { Dispatch, type FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

import config from '../../lib/config/config'
import { TeamSettingsMenuMemoized as TeamSettingsMenu } from '../menus/team-settings-menu'
import { useNotification } from '../../lib/notifications/notification.hook'
import { UserMenuMemoized as UserMenu } from '../menus/user-menu'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { Banner } from './banner'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import { useStyles } from './main-header-style'
import { TeamSelectionAndSettings } from './team-selection-and-settings'
import { useAuth } from '../../lib/auth'
import { PatientView } from '../../enum/patient-view.enum'
import { LOCAL_STORAGE_SELECTED_TEAM_ID_KEY } from '../../layout/hcp-layout'
import TeamUtils from '../../lib/team/team.util'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'
interface MainHeaderProps {
  setMainHeaderHeight: Dispatch<SetStateAction<number>>
}

const classes = makeStyles()((theme) => ({
  arrowBack: {
    paddingLeft: theme.spacing(2),
    fontSize: '16px'
  },
  mobileLogo: {
    width: '97px',
    height: '28px',
    '& img': {
      objectFit: 'contain'
    }
  },
  bottomPart: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    width: '100%',
    margin: theme.spacing(1)
  }
}))

const MainHeaderMobile: FC<MainHeaderProps> = (props) => {
  const { setMainHeaderHeight } = props
  const { classes: { mobileLogo, arrowBack, bottomPart } } = classes()
  const { classes: { appBar, toolbar } } = useStyles()
  const { t } = useTranslation('yourloops')
  const { receivedInvitations } = useNotification()
  const theme = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const teamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
  const appBarRefCallback = (appMainHeaderElement: HTMLHeadElement): void => {
    if (appMainHeaderElement) {
      setMainHeaderHeight(appMainHeaderElement.offsetHeight ?? 0)
    }
  }

  const PATIENT_VIEW_URL_MAPPING: Record<PatientView, string> = {
    [PatientView.Daily]: 'daily',
    [PatientView.Dashboard]: 'dashboard',
    [PatientView.Devices]: 'devices',
    [PatientView.PatientProfile]: 'patient-profile',
    [PatientView.Trends]: 'trends',
  }

  const isMatchingPatientView = Object.values(PATIENT_VIEW_URL_MAPPING).some(viewValue =>
    pathname.includes(viewValue)
  )

  const goToNotifications = (): void => {
    navigate(AppUserRoute.Notifications)
  }

  const userRole = user?.role

  const getTargetUrl = (role: UserRole | undefined): string => {
    switch (role) {
      case UserRole.Patient:
        return AppUserRoute.Dashboard
      case UserRole.Caregiver:
        return AppUserRoute.PrivatePatientsList
      case UserRole.Hcp:
        return TeamUtils.isPrivate(teamId) ? AppUserRoute.PrivatePatientsList : `/teams/${teamId}/patients`
      default:
        return '/'
    }
  }

  const targetUrl = getTargetUrl(userRole)

  const goHome = () => {
    navigate(targetUrl)
  }

  return (
    <AppBar
      data-testid="app-main-header-mobile"
      elevation={0}
      className={appBar}
      ref={appBarRefCallback}
    >
      <Toolbar
        className={toolbar}
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            minHeight: "64px",
            padding: `${theme.spacing(1)} ${theme.spacing(2)}`
          }}>
          <Banner />
          <Link to={targetUrl} data-testid="main-header-logo-link">
            <Avatar
              id="header-main-logo"
              aria-label={t('alt-img-logo')}
              variant="square"
              src={`/branding_${config.BRANDING}_logo.svg`}
              alt={t('alt-img-logo')}
              className={mobileLogo}
            />
          </Link>
          <Box
            sx={{
              display: "flex",
              gap: theme.spacing(1)
            }}>
            <Badge
              id="notification-count-badge"
              aria-label={t('notification-list')}
              badgeContent={receivedInvitations.length}
              overlap="circular"
              color="error"
            >
              <IconButton
                color="inherit"
                id={"header-notification-link"}
                onClick={goToNotifications}
                data-testid="notification-icon">
                <NotificationsNoneIcon />
              </IconButton>
            </Badge>
            {user.isUserPatient() && <TeamSettingsMenu />}
            <UserMenu />
          </Box>
        </Box>
        {pathname.endsWith(AppUserRoute.Patients) &&
          (
            <Box
              className={bottomPart}
            >
              {user?.isUserHcp() && <TeamSelectionAndSettings />}
            </Box>
          )
        }
        {(!pathname.includes(AppUserRoute.Patients) && !isMatchingPatientView) &&
          (
            <Box
              className={bottomPart}
            >
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={goHome}
                className={arrowBack}
                data-testid="back-button"
              >
                {t('back')}
              </Button>
            </Box>
          )
        }
      </Toolbar>
    </AppBar>
  )
}

export const MainHeaderMobileMemoized = React.memo(MainHeaderMobile)
