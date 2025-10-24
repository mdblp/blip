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

import React, { Dispatch, type FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

import { type Theme, useTheme } from '@mui/material/styles'
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
import { styled, Tab, Tabs } from '@mui/material'
import { HcpNavigationTab } from '../../models/enums/hcp-navigation-tab.model'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { Banner } from './banner'
import { ConfigService } from '../../lib/config/config.service'
import { LOCAL_STORAGE_SELECTED_TEAM_ID_KEY } from '../../layout/hcp-layout'
import TeamUtils, { PRIVATE_TEAM_ID } from '../../lib/team/team.util'

interface MainHeaderProps {
  setMainHeaderHeight: Dispatch<SetStateAction<number>>
}

const classes = makeStyles()((theme: Theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.common.white,
    color: 'var(--text-color-primary)'
  },
  desktopLogo: {
    width: 140
  },
  separator: {
    height: 25,
    width: 1,
    backgroundColor: theme.palette.divider,
    margin: `0 ${theme.spacing(2)}`
  },
  toolbar: {
    padding: 0
  },
  actionHeader: {
    padding: `0 ${theme.spacing(2)}`
  },
  tab: {
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: theme.typography.htmlFontSize
  }
}))

// Allow the tabs to take the whole height of the toolbar
const StyledTabs = styled(Tabs)(({ theme }) => ({ ...theme.mixins.toolbar }))
const StyledTab = styled(Tab)(({ theme }) => ({ ...theme.mixins.toolbar }))

const MainHeader: FC<MainHeaderProps> = (props) => {
  const { setMainHeaderHeight } = props
  const { classes: { desktopLogo, separator, appBar, tab, toolbar } } = classes()
  const { t } = useTranslation('yourloops')
  const { receivedInvitations } = useNotification()
  const { user } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const teamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)

  const getSelectedTab = (): HcpNavigationTab | false => {
    if (pathname.includes('patients') || pathname.includes(PRIVATE_TEAM_ID)) {
      return HcpNavigationTab.Patients
    }
    if (pathname.includes('teams')) {
      return HcpNavigationTab.CareTeam
    }
    return false
  }

  const appBarRefCallback = (appMainHeaderElement: HTMLHeadElement): void => {
    if (appMainHeaderElement) {
      setMainHeaderHeight(appMainHeaderElement.offsetHeight ?? 0)
    }
  }

  return (
    <AppBar
      id="app-main-header"
      data-testid="app-main-header"
      elevation={0}
      className={appBar}
      position="fixed"
      ref={appBarRefCallback}
    >
      <Toolbar className={toolbar}>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <Banner />
          <Box
            alignItems="center"
            display="flex"
            minHeight={64}
            padding={`0 ${theme.spacing(2)}`}
            width="100%"
          >
            <Box display="flex" alignItems="center" justifyContent="flex-start" flex={1}>
              <Link to="/">
                <Avatar
                  id="header-main-logo"
                  aria-label={t('alt-img-logo')}
                  variant="square"
                  src={`/branding_${config.BRANDING}_logo.svg`}
                  alt={t('alt-img-logo')}
                  className={desktopLogo}
                />
              </Link>
            </Box>
            <Box flex={2} display="flex" alignItems="center" justifyContent="center">
              {user.isUserHcp() &&
                <StyledTabs value={getSelectedTab()} centered>
                  <StyledTab
                    data-testid="main-header-hcp-patients-tab"
                    className={tab}
                    label={t('header-tab-patients')}
                    value={HcpNavigationTab.Patients}
                    onClick={() => {
                      navigate(`${AppUserRoute.Teams}/${teamId}${AppUserRoute.Patients}`)
                    }}
                  />
                  {!TeamUtils.isPrivate(teamId) &&
                    <StyledTab
                      data-testid="main-header-hcp-care-team-settings-tab"
                      className={tab}
                      label={t('header-tab-care-team-settings')}
                      value={HcpNavigationTab.CareTeam}
                      onClick={() => {
                        navigate(`${AppUserRoute.Teams}/${teamId}`)
                      }}
                    />
                  }
                </StyledTabs>
              }
            </Box>

            <Box display="flex" alignItems="center" justifyContent="flex-end" flex={1}>
              <Link to={AppUserRoute.Notifications} id="header-notification-link">
                <Badge
                  id="notification-count-badge"
                  aria-label={t('notification-list')}
                  badgeContent={receivedInvitations.length}
                  overlap="circular"
                  color="error"
                >
                  <NotificationsNoneIcon />
                </Badge>
              </Link>
              <div className={separator} />
              {!user?.isUserCaregiver() &&
                <React.Fragment>
                  {user.isUserPatient() && <TeamSettingsMenu />}
                  {user.isUserHcp() && <TeamScopeMenu />}
                  <div className={separator} />
                </React.Fragment>
              }
              <UserMenu />
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export const MainHeaderMemoized = React.memo(MainHeader)
