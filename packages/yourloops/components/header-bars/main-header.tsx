/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

import { type Theme } from '@mui/material/styles'
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
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { HcpNavigationTab } from '../../models/enums/hcp-navigation-tab.model'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { PRIVATE_TEAM_ID } from '../../lib/team/team.hook'

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
    backgroundColor: 'var(--text-color-primary)',
    margin: `0 ${theme.spacing(2)}`
  },
  toolbar: {
    padding: `0 ${theme.spacing(2)}`
  },
  tab: {
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: theme.typography.htmlFontSize,
    color: 'var(--text-color-primary)'
  }
}))

// Allow the tabs to take the whole height of the toolbar
const StyledTabs = styled(Tabs)(({ theme }) => ({ ...theme.mixins.toolbar }))
const StyledTab = styled(Tab)(({ theme }) => ({ ...theme.mixins.toolbar }))

function MainHeader(): JSX.Element {
  const { classes: { desktopLogo, separator, appBar, tab, toolbar } } = classes()
  const { t } = useTranslation('yourloops')
  const { receivedInvitations } = useNotification()
  const { user } = useAuth()
  const { selectedTeam } = useSelectedTeamContext()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [selectedTab, setSelectedTab] = React.useState<HcpNavigationTab | boolean>(HcpNavigationTab.Patients)

  const handleTabChange = (event: React.SyntheticEvent, newTab: HcpNavigationTab): void => {
    setSelectedTab(newTab)
  }

  const handleTabClick = (tab: HcpNavigationTab): void => {
    const route = tab === HcpNavigationTab.CareTeam ? AppUserRoute.Team : AppUserRoute.Home
    navigate(route)
  }

  const getTabByPathname = (pathname): HcpNavigationTab | boolean => {
    switch (pathname) {
      case AppUserRoute.Team:
        return HcpNavigationTab.CareTeam
      case AppUserRoute.Preferences:
      case AppUserRoute.Notifications:
        return false
      default:
        return HcpNavigationTab.Patients
    }
  }

  useEffect(() => {
    const tabToSelect = getTabByPathname(pathname)
    setSelectedTab(tabToSelect)
  }, [pathname, selectedTeam])

  return (
    <AppBar
      id="app-main-header"
      data-testid="app-main-header"
      elevation={0}
      className={appBar}
      position="fixed"
    >
      <Toolbar className={toolbar}>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
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

          {user.isUserHcp() &&
            <StyledTabs value={selectedTab} onChange={handleTabChange} centered>
              <StyledTab
                data-testid="main-header-hcp-patients-tab"
                className={tab}
                label={t('header-tab-patients')}
                value={HcpNavigationTab.Patients}
                onClick={() => {
                  handleTabClick(HcpNavigationTab.Patients)
                }}
              />
              {selectedTeam.id !== PRIVATE_TEAM_ID &&
                <StyledTab
                  data-testid="main-header-hcp-care-team-tab"
                  className={tab}
                  label={t('header-tab-care-team')}
                  value={HcpNavigationTab.CareTeam}
                  onClick={() => {
                    handleTabClick(HcpNavigationTab.CareTeam)
                  }}
                />
              }
            </StyledTabs>
          }

          <Box display="flex" alignItems="center">
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
      </Toolbar>
    </AppBar>
  )
}

export default MainHeader
