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

import Box from '@mui/material/Box'
import { TeamSettingsMenuMemoized as TeamSettingsMenu } from '../menus/team-settings-menu'
import { TeamScopeMenu } from '../menus/team-scope-menu'
import TeamUtils from '../../lib/team/team.util'
import Button from '@mui/material/Button'
import { HcpNavigationTab } from '../../models/enums/hcp-navigation-tab.model'
import CareTeamSettingsIcon from '../icons/care-team-settings-icon'
import React from 'react'
import { useAuth } from '../../lib/auth'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_SELECTED_TEAM_ID_KEY } from '../../layout/hcp-layout'
import { AppUserRoute } from '../../models/enums/routes.enum'

const classes = makeStyles()((theme) => ({
  settingsButton: {
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
    borderColor: 'var(--text-color-primary)'
  },
  teamMenu: {
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: theme.typography.htmlFontSize,
    paddingLeft: theme.spacing(4),
    opacity: 1
  }
}))

export const TeamSelectionAndSettings = () => {

  const { user } = useAuth()
  const { classes: { teamMenu, settingsButton } } = classes()
  const { t } = useTranslation('yourloops')
  const teamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
  const navigate = useNavigate()

  const goToCareTeamSettings = (): void => {
    navigate(`${AppUserRoute.Teams}/${teamId}`)
  }

  return (
    <>
      <Box
        className={teamMenu}
        data-testid="team-selection-tab"
      >
        <TeamScopeMenu />
      </Box>

      {!TeamUtils.isPrivate(teamId) && (
        <Button
          aria-label={t('header-tab-care-team-settings')}
          value={HcpNavigationTab.CareTeam}
          onClick={goToCareTeamSettings}
          variant="outlined"
          className={settingsButton}
          sx={{ color: 'var(--text-color-primary)' }}
          data-testid="main-header-hcp-care-team-settings-button"
        >
          <CareTeamSettingsIcon />
        </Button>
      )}
    </>
  )

}
