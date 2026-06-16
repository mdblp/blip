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
import { useNotification } from '../../lib/notifications/notification.hook'
import { useAuth } from '../../lib/auth'
import { TeamSettingsMenuMemoized as TeamSettingsMenu } from '../menus/team-settings-menu'
import { UserMenuMemoized as UserMenu } from '../menus/user-menu'
import { TeamScopeMenu } from '../menus/team-scope-menu'
import { Tab } from '@mui/material'
import { HcpNavigationTab } from '../../models/enums/hcp-navigation-tab.model'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { Banner } from './banner'
import { LOCAL_STORAGE_SELECTED_TEAM_ID_KEY } from '../../layout/hcp-layout'
import TeamUtils from '../../lib/team/team.util'
import Button from '@mui/material/Button'
import CareTeamSettingsIcon from '../icons/care-team-settings-icon'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import { useStyles } from './main-header-style';

interface MainHeaderProps {
  setMainHeaderHeight: Dispatch<SetStateAction<number>>
}

const classes = makeStyles()((theme) => ({
  arrowBack: {
    color: 'var(--primary-color-main)',
    paddingLeft: 'clamp(18px, 4.7vw, 22px)',
    fontSize: 'clamp(16px, 4vw, 18px)'
  },
  mobileLogo: {
    width: 'clamp(97px, 25vw, 100px)',
    height: 'clamp(28px, 3.3vh, 30px)',
    '& img': {
      objectFit: 'contain'
    }
  },
  settingsButton: {
    padding: 'clamp(8px, 1.2vh, 10px) clamp(25px, 7vw, 30px)',
    borderColor: 'var(--text-color-primary)'
  },
  tab: {
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: theme.typography.htmlFontSize,
    paddingLeft: 'clamp(32px, 11vw, 36px)',
    opacity: 1
  }
}))

const MainHeaderMobile: FC<MainHeaderProps> = (props) => {
  const { setMainHeaderHeight } = props
  const { classes: { mobileLogo, tab, arrowBack, settingsButton } } = classes()
  const { classes: { appBar, toolbar } } = useStyles()
  const { t } = useTranslation('yourloops')
  const { receivedInvitations } = useNotification()
  const { user } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const teamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
  const appBarRefCallback = (appMainHeaderElement: HTMLHeadElement): void => {
    if (appMainHeaderElement) {
      setMainHeaderHeight(appMainHeaderElement.offsetHeight ?? 0)
    }
  }

  const goBack = (): void => {
    navigate('/')
  }

  const goToNotifications = (): void => {
    navigate(`${AppUserRoute.Notifications}`)
  }

  const goToCareTeamSettings = (): void => {
    navigate(`${AppUserRoute.Teams}/${teamId}`)
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
            minHeight: "clamp(64px, 7.5vh, 70px)",
            padding: `0 ${theme.spacing(2)}`
          }}>
          <Banner />
          <Link to="/">
            <Avatar
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
              gap: "0.5rem"
            }}>
            <Badge
              aria-label={t('notification-list')}
              badgeContent={receivedInvitations.length}
              overlap="circular"
              color="error"
              data-testid="notification-icon"
            >
              <IconButton
                onClick={() => {
                  goToNotifications()
                }}
                sx={{
                  color: 'var(--text-color-primary)'
                }}>
                <NotificationsNoneIcon />
              </IconButton>
            </Badge>
            <UserMenu />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}
        >
          {pathname.endsWith('patients') ? (
              <>
                {!user?.isUserCaregiver() && (
                  <Tab
                    label={
                      <>
                        {user.isUserPatient() && <TeamSettingsMenu />}
                        {user.isUserHcp() && <TeamScopeMenu />}
                      </>
                    }
                    data-testid="team-selection-tab"
                    className={tab}
                  />
                )}
                {!TeamUtils.isPrivate(teamId) && user.isUserHcp() && (
                  <Button
                    aria-label={t('header-tab-care-team-settings')}
                    value={HcpNavigationTab.CareTeam}
                    onClick={() => {
                      goToCareTeamSettings()
                    }}
                    variant="outlined"
                    className={settingsButton}
                    sx={{ color: 'var(--text-color-primary)' }}
                  >
                    <CareTeamSettingsIcon data-testid="care-team-settings-icon" />
                  </Button>
                )}
              </>
            ) :
            (
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  goBack()
                }}
                className={arrowBack}
                data-testid="back-button"
              >
                Back
              </Button>
            )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export const MainHeaderMobileMemoized = React.memo(MainHeaderMobile)
