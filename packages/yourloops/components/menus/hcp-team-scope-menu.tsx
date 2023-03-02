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
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { makeStyles } from 'tss-react/mui'
import { type Theme } from '@mui/material/styles'
import MenuLayout from '../../layout/menu-layout'
import GroupIcon from '@mui/icons-material/Group'
import { type Team, useTeam } from '../../lib/team'
import PersonIcon from '@mui/icons-material/Person'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { TeamType } from '../../lib/team/models/enums/team-type.enum'
import { useTranslation } from 'react-i18next'
import { type TeamEditModalContentProps } from '../../pages/hcp/types'
import { useAlert } from '../utils/snackbar'
import TeamEditDialog from '../../pages/hcp/team-edit-dialog'
import AddIcon from '@mui/icons-material/Add'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { useHistory } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import TeamUtils from '../../lib/team/team.util'

const classes = makeStyles()((theme: Theme) => ({
  clickableMenu: {
    cursor: 'pointer'
  },
  typography: {
    margin: `0 ${theme.spacing(1)}`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  sectionTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  menu: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

export const HcpTeamScopeMenu: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const {
    classes: {
      clickableMenu,
      sectionTitle,
      typography,
      menu
    }
  } = classes()
  const { getMedicalTeams, getPrivateTeam } = useTeam()
  const { selectTeam, selectedTeamId } = useSelectedTeamContext()
  const { createTeam } = useTeam()
  const alert = useAlert()
  const history = useHistory()
  const [teamCreationDialogData, setTeamCreationDialogData] = React.useState<TeamEditModalContentProps | null>(null)

  const privateTeam = getPrivateTeam()
  const sortedMedicalTeams = TeamUtils.sortTeamsByName(getMedicalTeams())
  const hasMedicalTeams = sortedMedicalTeams.length > 0
  const availableTeams = [privateTeam, ...sortedMedicalTeams]

  const selectedTeam = availableTeams.find((team: Team) => team.id === selectedTeamId)
  // TODO Add/use translation key
  const selectedTeamName = selectedTeam.type === TeamType.private ? 'My private practice' : selectedTeam.name

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpen = !!anchorEl

  const onSelectTeam = (teamId: string): void => {
    if (teamId !== selectedTeamId) {
      selectTeam(teamId)
      history.push('/')
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

  const closeMenu = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        className={clickableMenu}
        maxWidth={250}
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <Box display="flex">
          <GroupIcon />
        </Box>
        <React.Fragment>
          <Typography className={typography}>
            {selectedTeamName}
          </Typography>
          <ArrowDropDownIcon />
        </React.Fragment>
      </Box>

      <MenuLayout open={isMenuOpen} anchorEl={anchorEl} onClose={closeMenu}>
        <Box className={menu}>
          <MenuItem onClick={() => {
            onSelectTeam(privateTeam.id)
          }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>
              {/* TODO Add/use translation key */}
              My private practice
            </ListItemText>
          </MenuItem>

          <Box marginY={2}>
            <Divider variant="middle" />
          </Box>

          {/* TODO Add translation key */}
          <Typography className={sectionTitle}>Care teams</Typography>

          {hasMedicalTeams
            ? sortedMedicalTeams.map((team: Team) =>
              <MenuItem key={team.id} onClick={() => {
                onSelectTeam(team.id)
              }}>
                <ListItemIcon>
                  <GroupsOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  {team.name}
                </ListItemText>
              </MenuItem>
            )
            : <ListItem>
              <Typography>{t('care-team-no-membership')}</Typography>
            </ListItem>
          }

          <Box marginY={2}>
            <Divider variant="middle" />
          </Box>

          <MenuItem onClick={onCreateTeam}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>
              {t('new-care-team')}
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
