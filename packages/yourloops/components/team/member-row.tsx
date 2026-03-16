/*
 * Copyright (c) 2022-2026, Diabeloop
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
import { makeStyles } from 'tss-react/mui'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

import { type Team, type TeamMember, useTeam } from '../../lib/team'
import { useAuth } from '../../lib/auth'
import { errorTextFromException } from '../../lib/utils'
import { useAlert } from '../utils/snackbar'
import PersonRemoveIcon from '../icons/mui/person-remove-icon'
import ConfirmDialog from '../dialogs/confirm-dialog'
import TeamUtils from '../../lib/team/team.util'
import { UserInviteStatus } from '../../lib/team/models/enums/user-invite-status.enum'
import { TeamMemberRole } from '../../lib/team/models/enums/team-member-role.enum'
import { logError } from '../../utils/error.util'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Avatar from '@mui/material/Avatar'
import { HourglassEmptyRounded } from '@mui/icons-material'
import Box from '@mui/material/Box'

const useStyles = makeStyles()(() => ({
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
  hideLastBorder: {
    '&:last-child td, &:last-child th': {
      border: 0
    }
  },
  pendingMemberName: {
    fontStyle: "italic"
  }
}))

export interface TeamMembersProps {
  team: Team
  teamMember: TeamMember
  refreshParent: () => void
}

function MemberRow(props: TeamMembersProps): JSX.Element {
  const { teamMember, team, refreshParent } = props
  const { classes } = useStyles()
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
  const currentUserIsPending = teamMember.status === UserInviteStatus.Pending
  const checkboxAdminDisabled = !loggedInUserIsAdmin || currentUserIsPending ||
    (loggedInUserId === currentUserId && TeamUtils.isUserTheOnlyAdministrator(team, loggedInUserId)) ||
    userUpdateInProgress
  const removeMemberDisabled = !loggedInUserIsAdmin || userUpdateInProgress || loggedInUserId === currentUserId ||
    (teamMember.status === UserInviteStatus.Pending && !teamMember.invitationId) // This condition basically means that the logged-in user did not invite the pending user

  const getInitials = (memberName: string): string => {
    if (!memberName) {
      return ''
    }

    const splitName = memberName.split(' ')
    const firstInitial = splitName[0]?.charAt(0) || ''
    const secondInitial = splitName[1]?.charAt(0) || ''

    const initials = `${firstInitial}${secondInitial}`

    return initials.toUpperCase()
  }

  const switchRole = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const isAdmin = event.target.checked
    setUserUpdateInProgress(true)

    try {
      await teamHook.changeMemberRole(teamMember, isAdmin ? TeamMemberRole.admin : TeamMemberRole.member, team.id)
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'update-member-role')

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
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'remove-member')

      alert.error(t('remove-member-failed'))
    } finally {
      setUserUpdateInProgress(false)
    }
    refreshParent()
  }

  return (
    <>
      <TableRow
        data-testid={`member-row-${rowId}`}
        className={classes.hideLastBorder}
      >
        <TableCell>
          {
            currentUserIsPending ?
              <Box sx={{ display: 'flex', justifyContent: 'center', color: 'var(--text-color-secondary)' }}>
                <HourglassEmptyRounded titleAccess="pending-user-icon" />
              </Box>
              : getInitials(teamMember.profile?.fullName) &&
              <Avatar sx={{ bgcolor: 'var(--text-color-secondary)' }}>
                {getInitials(teamMember.profile?.fullName)}
              </Avatar>
          }
        </TableCell>
        <TableCell
          data-testid={`${rowId}-member-full-name`}
          size="small"
        >
          {currentUserIsPending
            ? <span className={classes.pendingMemberName}>{t('pending-name')}</span>
            : teamMember.profile?.fullName
          }
        </TableCell>
        <TableCell
          size="small"
          data-testid={`${rowId}-member-email`}
        >
          {teamMember.email}
        </TableCell>
        <TableCell
          align={loggedInUserIsAdmin ? 'inherit' : 'right'}
          data-testid={`${rowId}-checkbox`}
        >
          <Checkbox
            disabled={checkboxAdminDisabled}
            // id={`members-row-${rowId}-role-checkbox`}
            data-testid="members-row-checkbox"
            checked={currentUserIsAdmin}
            onChange={switchRole}
          />
        </TableCell>
        {loggedInUserIsAdmin &&
          <TableCell
            size="small"
            data-testid={`${rowId}-delete`}
            className={classes.iconCell}
          >
            <IconButton
              color="inherit"
              data-testid="remove-member-button"
              disabled={removeMemberDisabled}
              aria-label={t('remove-member', { fullName: teamMember.profile?.fullName })}
              onClick={() => {
                setShowConfirmRemoveDialog(true)
              }}
              size="large">
              <PersonRemoveIcon />
            </IconButton>
          </TableCell>
        }
      </TableRow>
      {showConfirmRemoveDialog &&
        <ConfirmDialog
          open={showConfirmRemoveDialog}
          title={t('remove-member-from-team')}
          label={t('remove-member-confirm', { fullName: teamMember.profile?.fullName, teamName: team.name })}
          inProgress={userUpdateInProgress}
          onClose={() => {
            setShowConfirmRemoveDialog(false)
          }}
          onConfirm={deleteMember}
        />
      }
    </>
  )
}

export default MemberRow
