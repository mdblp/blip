/*
 * Copyright (c) 2023, Diabeloop
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
import Box from '@mui/material/Box'
import { makeStyles } from 'tss-react/mui'
import { type Theme, useTheme } from '@mui/material/styles'
import { type Team, useTeam } from '../../lib/team'
import PersonIcon from '@mui/icons-material/Person'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { TeamType } from '../../lib/team/models/enums/team-type.enum'
import { useTranslation } from 'react-i18next'
import { type TeamEditModalContentProps } from '../../pages/hcp/types'
import { useAlert } from '../utils/snackbar'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { useLocation, useNavigate } from 'react-router-dom'
import TeamUtils from '../../lib/team/team.util'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Typography from '@mui/material/Typography'
import MenuLayout from '../../layout/menu-layout'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import AddIcon from '@mui/icons-material/Add'
import TeamEditDialog from '../../pages/hcp/team-edit-dialog'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { usePatientContext } from '../../lib/patient/patient.provider'

const classes = makeStyles()((theme: Theme) => ({
  sectionTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  menu: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  typography: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}))

const MENU_MAX_WIDTH_PX = 250

export const TeamScopeMenu: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const {
    classes: {
      sectionTitle,
      menu,
      typography
    }
  } = classes()
  const { getMedicalTeams, getPrivateTeam } = useTeam()
  const { selectTeam, selectedTeam } = useSelectedTeamContext()
  const { createTeam } = useTeam()
  const { refresh } = usePatientContext()
  const alert = useAlert()
  const navigate = useNavigate()
  const [teamCreationDialogData, setTeamCreationDialogData] = React.useState<TeamEditModalContentProps | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpen = !!anchorEl
  const theme = useTheme()
  const isMobile: boolean = useMediaQuery(theme.breakpoints.only('xs'))
  const { pathname } = useLocation()

  const privateTeam = getPrivateTeam()
  const sortedMedicalTeams = TeamUtils.sortTeamsByName(getMedicalTeams())
  const hasMedicalTeams = sortedMedicalTeams.length > 0

  const isSelectedTeamPrivate = selectedTeam.type === TeamType.private
  const selectedTeamName = isSelectedTeamPrivate ? t('my-private-practice') : selectedTeam.name

  const privatePracticeIcon = <PersonIcon data-testid="private-practice-icon" />
  const medicalTeamIcon = <GroupsOutlinedIcon data-testid="medical-team-icon" />
  const selectedTeamIcon = isSelectedTeamPrivate ? privatePracticeIcon : medicalTeamIcon

  const onSelectTeam = (teamId: string): void => {
    if (teamId !== selectedTeam.id) {
      selectTeam(teamId)
      refresh()

      if (pathname !== AppUserRoute.Home) {
        navigate(AppUserRoute.Home)
      }
    }
    closeMenu()
  }

  const onCreateTeam = (): void => {
    setTeamCreationDialogData({ team: null, onSaveTeam })
    closeMenu()
  }

  const onSaveTeam = async (createdTeam: Partial<Team> | null): Promise<void> => {
    if (createdTeam) {
      try {
        await createTeam(createdTeam as Team)
        alert.success(t('team-page-success-create'))
      } catch (reason: unknown) {
        alert.error(t('team-page-failed-create'))
      }
    }
    setTeamCreationDialogData(null)
  }

  const openMenu = ({ currentTarget }: { currentTarget: HTMLElement }): void => {
    setAnchorEl(currentTarget)
  }

  const closeMenu = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      {isMobile
        ? <IconButton
          color="inherit"
          aria-label={t('open-team-selection-menu')}
          onClick={openMenu}>
          {selectedTeamIcon}
        </IconButton>
        : <Button
          color="inherit"
          aria-label={t('open-team-selection-menu')}
          data-testid="team-scope-menu-button"
          startIcon={selectedTeamIcon}
          endIcon={<ArrowDropDownIcon />}
          onClick={openMenu}
        >
          <Typography className={typography} maxWidth={MENU_MAX_WIDTH_PX}>{selectedTeamName}</Typography>
        </Button>
      }

      <MenuLayout open={isMenuOpen} anchorEl={anchorEl} onClose={closeMenu}>
        <Box className={menu} data-testid="team-scope-menu">
          <MenuItem
            data-testid="team-scope-menu-team-private-option"
            onClick={() => {
              onSelectTeam(privateTeam.id)
            }}>
            <ListItemIcon>
              {privatePracticeIcon}
            </ListItemIcon>
            <ListItemText>
              {t('my-private-practice')}
            </ListItemText>
          </MenuItem>

          {hasMedicalTeams &&
            <>
              <Box marginY={2}>
                <Divider variant="middle" />
              </Box>

              <Typography className={sectionTitle}
                          data-testid="team-scope-menu-care-teams-section">{t('care-teams')}</Typography>

              {sortedMedicalTeams.map((team: Team) => {
                const teamNameForTestId = team.name.replaceAll(' ', '-')
                return <MenuItem
                    key={team.id}
                    data-testid={`team-scope-menu-team-${teamNameForTestId}-option`}
                    onClick={() => {
                      onSelectTeam(team.id)
                    }}>
                    <ListItemIcon>
                      {medicalTeamIcon}
                    </ListItemIcon>
                    <ListItemText>
                      {team.name}
                    </ListItemText>
                  </MenuItem>
              }
              )}
            </>
          }

          <Box marginY={2}>
            <Divider variant="middle" />
          </Box>

          <MenuItem onClick={onCreateTeam} data-testid="team-scope-menu-new-care-team-button">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>
              {t('create-new-care-team')}
            </ListItemText>
          </MenuItem>
        </Box>
      </MenuLayout>

      {teamCreationDialogData &&
        <TeamEditDialog teamToEdit={teamCreationDialogData} />
      }
    </>
  )
}
