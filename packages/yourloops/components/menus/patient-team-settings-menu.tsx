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

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { type Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import useMediaQuery from '@mui/material/useMediaQuery'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useTeam } from '../../lib/team'
import MenuLayout from '../../layout/menu-layout'
import { useAlert } from '../utils/snackbar'
import { useAuth } from '../../lib/auth'
import { type ShareUser } from '../../lib/share/models/share-user.model'
import { errorTextFromException } from '../../lib/utils'
import DirectShareApi from '../../lib/share/direct-share.api'
import { JoinTeamDialog } from '../dialogs/join-team/join-team-dialog'

const classes = makeStyles()((theme: Theme) => ({
  teamIcon: {
    marginRight: theme.spacing(2)
  },
  badge: {
    right: -8,
    color: theme.palette.common.white,
    backgroundColor: 'var(--text-base-color)'
  },
  clickableMenu: {
    cursor: 'pointer'
  },
  separator: {
    flexGrow: 1,
    height: 1,
    backgroundColor: theme.palette.divider,
    marginLeft: theme.spacing(1),
    marginTop: 2
  },
  menu: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  paddingBottom: {
    paddingBottom: theme.spacing(1)
  }
}))

function PatientTeamSettingsMenu(): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { classes: { badge, teamIcon, clickableMenu, separator, menu, paddingBottom } } = classes()
  const { teams, joinTeam, isPrivate } = useTeam()
  const history = useHistory()
  const alert = useAlert()
  const { user } = useAuth()
  const theme = useTheme()
  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [caregivers, setCaregivers] = React.useState<ShareUser[] | null>(null)
  const opened = !!anchorEl

  const filteredTeams = teams.filter(team => !isPrivate(team))
  const [showJoinTeamDialog, setShowJoinTeamDialog] = React.useState(false)
  const closeMenu = (): void => {
    setAnchorEl(null)
  }

  useEffect(() => {
    (async () => {
      if (!caregivers && user) {
        try {
          setCaregivers(await DirectShareApi.getDirectShares())
        } catch (error) {
          setCaregivers([])
        }
      }
    })()
  }, [caregivers, user])

  const redirectToTeamDetails = (teamId: string): void => {
    history.push(`/teams/${teamId}`)
    closeMenu()
  }

  const onTeamAction = (): void => {
    setShowJoinTeamDialog(true)
    closeMenu()
  }

  const redirectToCaregivers = (): void => {
    history.push('/caregivers')
    closeMenu()
  }

  const onJoinTeam = async (teamId: string): Promise<void> => {
    try {
      await joinTeam(teamId)
      alert.success(t('modal-patient-add-team-success'))
      setShowJoinTeamDialog(false)
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      alert.error(t('modal-patient-add-team-failure', { errorMessage }))
    }
  }
  return (
    <>
      <Box
        id="team-menu"
        data-testid="team-menu"
        display="flex"
        role="button"
        alignItems="center"
        className={clickableMenu}
        onClick={event => { setAnchorEl(event.currentTarget) }}
      >
        <Badge
          id="team-menu-count-badge"
          aria-label={t('open-team-menu')}
          badgeContent={filteredTeams.length}
          overlap="circular"
          className={teamIcon}
          classes={{ badge }}
        >
          <GroupOutlinedIcon />
        </Badge>
        {!isMobileBreakpoint &&
          <ArrowDropDownIcon />
        }
      </Box>

      <MenuLayout
        open={opened}
        anchorEl={anchorEl}
        onClose={closeMenu}
      >
        <Box className={menu}>
          <ListSubheader>
            <Box display="flex" justifyContent="space-between" alignItems="center" className={paddingBottom}>
              <Typography variant="caption">
                {t('care-team-membership')}
              </Typography>
              <div className={separator} />
            </Box>
          </ListSubheader>

          {filteredTeams.length
            ? filteredTeams.map(team => (
              <ListItemButton
                key={team.id}
                id={`team-menu-list-item-${team.id}`}
                className="team-menu-list-item"
                onClick={() => {
                  redirectToTeamDetails(team.id)
                }}
              >
                <Box marginX={1}>•</Box>
                <Typography>{team.name}</Typography>
              </ListItemButton>
            ))
            : <ListItem>
              <Typography>{t('care-team-no-membership')}</Typography>
            </ListItem>
          }

          <Box>
            <Box marginY={2}>
              <Divider variant="middle" />
            </Box>

            <Box className={paddingBottom}>
              <MenuItem id="team-menu-teams-link" data-testid="team-menu-teams-link" onClick={onTeamAction}>
                <ListItemIcon>
                  <GroupOutlinedIcon />
                </ListItemIcon>
                <Typography>
                  {t('join-care-team')}
                </Typography>
              </MenuItem>
            </Box>
          </Box>

          <Box>
            <ListSubheader>
              <Box display="flex" justifyContent="space-between" alignItems="center" className={paddingBottom}>
                <Typography variant="caption">
                  {t('my-caregivers')}
                </Typography>
                <div className={separator} />
              </Box>
            </ListSubheader>
            <MenuItem id="team-menu-caregivers-link" onClick={redirectToCaregivers}>
              <ListItemIcon>
                <GroupOutlinedIcon />
              </ListItemIcon>
              <Typography>
                {t('my-caregivers')} ({caregivers?.length})
              </Typography>
            </MenuItem>
          </Box>
        </Box>
      </MenuLayout>

      {showJoinTeamDialog &&
        <JoinTeamDialog
          onClose={() => { setShowJoinTeamDialog(false) }}
          onAccept={onJoinTeam}
        />
      }
    </>
  )
}

export const PatientTeamSettingsMenuMemoized = React.memo(PatientTeamSettingsMenu)
