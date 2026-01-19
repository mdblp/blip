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

import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import EditIcon from '@mui/icons-material/Edit'

import { type Team, useTeam } from '../../lib/team'
import TeamInformationEditDialog from '../../pages/hcp/team-information-edit-dialog'
import { type TeamEditModalContentProps } from '../../pages/hcp/types'
import { commonComponentStyles } from '../common'
import { useAlert } from '../utils/snackbar'
import { useAuth } from '../../lib/auth'
import LeaveTeamButton from './leave-team-button'
import TeamUtils from '../../lib/team/team.util'
import { errorTextFromException, PhonePrefixCode } from '../../lib/utils'
import { logError } from '../../utils/error.util'

const useStyles = makeStyles()((theme) => ({
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  label: {
    fontWeight: 600,
    fontSize: '13px',
    width: '180px'
  },
  value: {
    fontSize: '13px'
  },
  teamInfo: {
    display: 'flex',
    alignItems: 'top',
    width: '50%',
    marginBottom: theme.spacing(4),
    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  }
}))

export interface TeamInformationProps {
  team: Team
}

function TeamInformation(props: TeamInformationProps): JSX.Element {
  const { team } = props
  const teamHook = useTeam()
  const alert = useAlert()
  const { classes } = useStyles()
  const authContext = useAuth()
  const loggedInUserId = authContext.user?.id
  const isUserPatient = authContext.user?.isUserPatient()
  const isUserAdmin = TeamUtils.isUserAdministrator(team, loggedInUserId)
  const { classes: commonTeamClasses } = commonComponentStyles()
  const { t } = useTranslation('yourloops')
  const address = `${team.address?.line1}\n${team.address?.line2}\n${team.address?.zip}\n${team.address?.city}\n${team.address?.country}`
  const [teamToEdit, setTeamToEdit] = React.useState<TeamEditModalContentProps | null>(null)

  const onSaveTeam = async (editedTeam: Partial<Team> | null): Promise<void> => {
    if (editedTeam) {
      try {
        await teamHook.updateTeam(editedTeam as Team)
        alert.success(t('team-page-success-edit'))
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason)
        logError(errorMessage, 'team-information-edit')

        alert.error(t('team-page-failed-edit'))
      }
    }

    setTeamToEdit(null)
  }

  const editTeam = (): void => {
    setTeamToEdit({ team, onSaveTeam })
  }

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root} data-testid="team-information">
        <div className={commonTeamClasses.categoryHeader}>
          <div data-stonlyid="care-team-settings-information-title">
            <InfoOutlinedIcon />
            <Typography className={commonTeamClasses.title}>
              {t('information')}
            </Typography>
          </div>
          {isUserAdmin &&
            <Button
              id="edit-team-button"
              data-testid="edit-team-button"
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              disableElevation
              onClick={editTeam}
            >
              {t('button-edit-information')}
            </Button>
          }
          {isUserPatient &&
            <div id="leave-team-button">
              <LeaveTeamButton team={team} />
            </div>
          }
        </div>

        <div className={classes.body}>
          <div className={classes.teamInfo}>
            <div>
              <FolderSharedOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t('team-name')}
              </Typography>
            </div>
            <Typography
              id={`team-information-${team.id}-name`}
              data-testid="team-information-name"
              className={classes.value}
            >
              {team.name}
            </Typography>
          </div>
          <div className={classes.teamInfo}>
            <div>
              <LocalPhoneOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t('phone-number')}
              </Typography>
            </div>
            <Typography
              id={`team-information-${team.id}-phone`}
              data-testid="team-information-phone"
              className={classes.value}
            >
              {team.address ? `(${PhonePrefixCode[team.address.country] as PhonePrefixCode}) ` : undefined}{team.phone}
            </Typography>
          </div>
          <div className={classes.teamInfo}>
            <div>
              <VerifiedUserOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t('identification-code')}
              </Typography>
            </div>
            <Typography
              id={`team-information-${team.id}-code`}
              data-testid="team-information-code"
              className={classes.value}
            >
              {team.code}
            </Typography>
          </div>
          <div className={classes.teamInfo}>
            <div>
              <LocationOnOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t('address')}
              </Typography>
            </div>
            <Typography
              id={`team-information-${team.id}-address`}
              data-testid="team-information-address"
              className={classes.value}
            >
              {address}
            </Typography>
          </div>
        </div>
      </div>
      {teamToEdit &&
        <TeamInformationEditDialog teamToEdit={teamToEdit} />
      }
    </React.Fragment>
  )
}

export default TeamInformation
