/*
 * Copyright (c) 2022, Diabeloop
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

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import IconButton from '@material-ui/core/IconButton'

import { Team, TeamMember, useTeam } from '../../lib/team'
import { UserInvitationStatus } from '../../models/generic'
import { TeamMemberRole } from '../../models/team'
import { useAuth } from '../../lib/auth'
import { StyledTableCell, StyledTableRow } from '../styled-components'
import { errorTextFromException } from '../../lib/utils'
import { useAlert } from '../utils/snackbar'
import PersonRemoveIcon from '../icons/PersonRemoveIcon'
import ConfirmDialog from '../dialogs/confirm-dialog'
import TeamUtils from '../../lib/team/utils'

const useStyles = makeStyles((theme: Theme) => ({
  checkboxTableCellBody: {
    padding: `0 ${theme.spacing(2)}px !important`
  },
  deleteCell: {
    color: theme.palette.primary.main
  },
  icon: {
    width: '56px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconCell: {
    alignItems: 'center',
    width: '67px',
    justifyContent: 'center'
  },
  tableRow: {
    height: '55px'
  },
  typography: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: theme.palette.common.black
  }
}))

export interface TeamMembersProps {
  team: Team
  teamMember: TeamMember
  refreshParent: () => void
}

function MemberRow(props: TeamMembersProps): JSX.Element {
  const { teamMember, team, refreshParent } = props
  const classes = useStyles()
  const rowId = teamMember.userId.replace(/@/g, '_')
  const teamHook = useTeam()
  const authContext = useAuth()
  const alert = useAlert()
  const { t } = useTranslation('yourloops')
  const [userUpdateInProgress, setUserUpdateInProgress] = useState<boolean>(false)
  const [showConfirmRemoveDialog, setShowConfirmRemoveDialog] = useState(false)
  const currentUserId = teamMember.userId
  const loggedInUserId = authContext.user?.id
  const loggedInUserIsAdmin = TeamUtils.isUserAdministrator(team, loggedInUserId)
  const currentUserIsAdmin = TeamUtils.isUserAdministrator(team, currentUserId)
  const currentUserIsPending = teamMember.status === UserInvitationStatus.pending
  const checkboxAdminDisabled = !loggedInUserIsAdmin || currentUserIsPending ||
    (loggedInUserId === currentUserId && TeamUtils.isUserTheOnlyAdministrator(team, loggedInUserId)) ||
    userUpdateInProgress
  const removeMemberDisabled = !loggedInUserIsAdmin || userUpdateInProgress || loggedInUserId === currentUserId ||
    (teamMember.status === UserInvitationStatus.pending && (!teamMember.invitation || team.id !== teamMember.invitation.target?.id)) // This condition basically means that the logged in user did not invite the pending user

  const switchRole = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const isAdmin = event.target.checked
    setUserUpdateInProgress(true)

    try {
      await teamHook.changeMemberRole(teamMember, isAdmin ? TeamMemberRole.admin : TeamMemberRole.member, team.id)
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      alert.error(t('team-page-failed-update-role', { errorMessage }))
    } finally {
      setUserUpdateInProgress(false)
    }
    refreshParent()
  }

  const deleteMember = async (): Promise<void> => {
    setUserUpdateInProgress(true)
    try {
      await teamHook.removeMember(teamMember, team.id)
      alert.success(t('remove-member-success'))
    } catch (reason: unknown) {
      console.error(reason)
      alert.error(t('remove-member-failed'))
    } finally {
      setUserUpdateInProgress(false)
    }
    refreshParent()
  }

  return (
    <React.Fragment>
      <StyledTableRow
        id={`member-row-${rowId}`}
        className={classes.tableRow}
        hover
      >
        <StyledTableCell
          id={`${rowId}-member-full-name`}
          className={classes.typography}
          size="small"
        >
          {currentUserIsPending
            ? ('--')
            : (teamMember.profile?.fullName)
          }
        </StyledTableCell>
        <StyledTableCell
          size="small"
          id={`${rowId}-icon`}
          className={classes.iconCell}
        >
          {currentUserIsPending &&
            <AccessTimeIcon id={`${rowId}-pending-icon`} aria-label={t('team-member-pending-status')} titleAccess="pending-user-icon" className={classes.icon} />
          }
        </StyledTableCell>
        <StyledTableCell
          size="small"
          id={`${rowId}-member-email`}
          className={classes.typography}
        >
          {teamMember.email}
        </StyledTableCell>
        <StyledTableCell
          size="small"
          id={`${rowId}-checkbox`}
          className={`${classes.typography} ${classes.checkboxTableCellBody}`}
          padding="checkbox"
        >
          <Checkbox
            disabled={checkboxAdminDisabled}
            id={`members-row-${rowId}-role-checkbox`}
            data-testid="members-row-checkbox"
            color="primary"
            checked={currentUserIsAdmin}
            onChange={switchRole}
          />
        </StyledTableCell>
        {loggedInUserIsAdmin &&
          <StyledTableCell
            size="small"
            id={`${rowId}-delete`}
            className={classes.iconCell}
          >
            <IconButton
              data-testid="remove-member-button"
              className={classes.deleteCell}
              disabled={removeMemberDisabled}
              aria-label="remove-member-button"
              onClick={() => setShowConfirmRemoveDialog(true)}
            >
              <PersonRemoveIcon />
            </IconButton>
          </StyledTableCell>
        }
      </StyledTableRow>
      {showConfirmRemoveDialog &&
        <ConfirmDialog
          title={t('remove-member-from-team')}
          label={t('remove-member-confirm', { fullName: teamMember.profile?.fullName, teamName: team.name })}
          inProgress={userUpdateInProgress}
          onClose={() => setShowConfirmRemoveDialog(false)}
          onConfirm={deleteMember}
        />
      }
    </React.Fragment>
  )
}

export default MemberRow
