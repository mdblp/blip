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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'
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
import { TeamMenuMemoized as TeamMenu } from '../menus/team-menu'
import { UserMenuMemoized as UserMenu } from '../menus/user-menu'
import Dropdown from '../dropdown/dropdown'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { type Team, useTeam } from '../../lib/team'
import TeamUtils from '../../lib/team/team.util'
import { usePatientContext } from '../../lib/patient/patient.provider'
import PatientUtils from '../../lib/patient/patient.util'

interface MainHeaderProps {
  withShrinkIcon?: boolean
  onClickShrinkIcon?: () => void
}

const classes = makeStyles()((theme: Theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.common.white,
    color: 'var(--text-base-color)'
  },
  leftIcon: {
    cursor: 'pointer',
    marginRight: theme.spacing(3)
  },
  desktopLogo: {
    width: 140
  },
  separator: {
    height: 25,
    width: 1,
    backgroundColor: 'var(--text-base-color)',
    margin: `0 ${theme.spacing(2)}`
  },
  teamsDropdown: {
    paddingLeft: theme.spacing(2)
  },
  toolbar: {
    padding: `0 ${theme.spacing(2)}`
  }
}))

const PATIENT_DASHBOARD_REGEX = /^\/patient\/([0-9a-f]+)\/dashboard/

function MainHeader({ withShrinkIcon, onClickShrinkIcon }: MainHeaderProps): JSX.Element {
  const { classes: { desktopLogo, separator, appBar, leftIcon, teamsDropdown, toolbar } } = classes()
  const { t } = useTranslation('yourloops')
  const { receivedInvitations } = useNotification()
  const { user } = useAuth()
  const { getMedicalAndPrivateTeams } = useTeam()
  const { selectedTeamId, selectTeam } = useSelectedTeamContext()
  const { pathname } = useLocation()
  const { getPatientById } = usePatientContext()
  const navigate = useNavigate()
  const patientDashboardRegexMatch = pathname.match(PATIENT_DASHBOARD_REGEX)
  const isPatientDashboard = !!patientDashboardRegexMatch
  /**
   * TODO YLP-1987 Fix the condition once the January release is done
   */
  const shouldDisplayTeamsDropdown = false && user.isUserHcp() && isPatientDashboard

  const getDropdownTeams = (): Map<string, string> => {
    const teams = getMedicalAndPrivateTeams()
    const sortedTeams = TeamUtils.sortTeams(teams)
    const teamsMap = new Map<string, string>()
    sortedTeams.forEach((team: Team) => teamsMap.set(team.id, team.name))
    return teamsMap
  }

  const onSelectTeam = (teamId: string): void => {
    const patientId = patientDashboardRegexMatch[1]
    const isPatientInSelectedTeam = PatientUtils.isInTeam(getPatientById(patientId), teamId)
    if (!isPatientInSelectedTeam) {
      navigate('/')
    }
    selectTeam(teamId)
  }

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
            {
              withShrinkIcon &&
              <MenuIcon id="left-menu-icon" aria-label={t('left-drawer-toggle')} className={leftIcon}
                        onClick={onClickShrinkIcon} />
            }
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
            {
              shouldDisplayTeamsDropdown &&
              <Box className={teamsDropdown}>
                <Dropdown
                  // "key" attribute is passed to force the component to render every time `selectedTeamId` changes,
                  // in order to display the adequate default value (otherwise, the value of the dropdown cannot be
                  // changed outside the dropdown itself)
                  key={selectedTeamId}
                  id="selected-team"
                  defaultKey={selectedTeamId}
                  values={getDropdownTeams()}
                  onSelect={onSelectTeam}
                />
              </Box>
            }
          </Box>

          <Box display="flex" alignItems="center">
            <Link to="/notifications" id="header-notification-link">
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
                <TeamMenu />
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
