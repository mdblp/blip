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

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { makeStyles } from 'tss-react/mui'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import TableBody from '@mui/material/TableBody'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

import { type Team, type TeamMember, useTeam } from '../../lib/team'
import MemberRow from './member-row'
import AddMemberDialog from '../../pages/hcp/team-member-add-dialog'
import { type AddMemberDialogContentProps } from '../../pages/hcp/types'
import { commonComponentStyles } from '../common'
import LeaveTeamButton from './leave-team-button'
import { useAuth } from '../../lib/auth'
import { StyledTableCell } from '../styled-components'
import { useAlert } from '../utils/snackbar'
import { errorTextFromException } from '../../lib/utils'
import TeamUtils from '../../lib/team/team.util'
import { TeamMemberRole, type TypeTeamMemberRole } from '../../lib/team/models/enums/team-member-role.enum'
import { logError } from '../../utils/error.util'

const useStyles = makeStyles()((theme) => ({
  checkboxTableCellHeader: {
    padding: `0 ${theme.spacing(1)} !important`
  },
  tableCellHeader: {
    backgroundColor: theme.palette.common.white,
    fontWeight: 600
  },
  tableCellIcon: {
    width: '67px'
  },
  tableHeaderDelete: {
    width: '56px',
    padding: 0
  }
}))

export interface TeamMembersProps {
  team: Team
}

function TeamMembers(props: TeamMembersProps): JSX.Element {
  const { team } = props
  const teamHook = useTeam()
  const { classes } = useStyles()
  const authContext = useAuth()
  const alert = useAlert()
  const loggedInUserId = authContext.user?.id
  const isUserAdmin = TeamUtils.isUserAdministrator(team, loggedInUserId)
  const { classes: commonTeamClasses } = commonComponentStyles()
  const { t } = useTranslation('yourloops')
  const [addMember, setAddMember] = React.useState<AddMemberDialogContentProps | null>(null)

  const getNonPatientMembers = (team?: Team): TeamMember[] => {
    return team ? team.members.filter(teamMember => teamMember.role === TeamMemberRole.admin || teamMember.role === TeamMemberRole.member) : []
  }

  const [members, setMembers] = React.useState<TeamMember[]>(getNonPatientMembers(team))

  const onMemberInvited = async (member: { email: string, role: Exclude<TypeTeamMemberRole, 'patient'>, team: Team } | null): Promise<void> => {
    if (member) {
      try {
        await teamHook.inviteMember(member.team, member.email, member.role)
        setMembers(getNonPatientMembers(teamHook.getTeam(team.id) as Team))
        alert.success(t('team-page-success-invite-hcp', { email: member.email }))
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason)
        logError(errorMessage, 'team-invite-hcp')

        alert.error(t('team-page-failed-invite-hcp', { errorMessage }))
      }
    }
    setAddMember(null)
  }

  const openInviteMemberDialog = (): void => {
    setAddMember({ team, onMemberInvited })
  }

  useEffect(() => {
    setMembers(getNonPatientMembers(team))
  }, [team])

  const refresh = (): void => {
    setMembers(getNonPatientMembers(teamHook.getTeam(team.id) ?? undefined))
  }

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root} data-testid="team-members">
        <div className={commonTeamClasses.categoryHeader}>
          <div data-stonlyid="care-team-settings-members-title">
            <GroupOutlinedIcon />
            <Typography className={commonTeamClasses.title}>
              {t('members')} ({members.length})
            </Typography>
          </div>
          <div>
            <LeaveTeamButton team={team} />
            {isUserAdmin &&
              <Button
                name="add-member"
                data-testid="add-member-button"
                variant="contained"
                color="primary"
                startIcon={<GroupAddIcon />}
                disableElevation
                onClick={openInviteMemberDialog}
              >
                {t('button-team-add-member')}
              </Button>
            }
          </div>
        </div>
        <Box sx={{ paddingX: 3 }}>
          <TableContainer component={Paper}>
            <Table
              id="team-members-list-table"
              data-testid="team-members-list-table"
              aria-label={t('aria-table-list-members')}
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    id="team-members-full-name"
                    className={classes.tableCellHeader}
                  >
                    {t('member')}
                  </StyledTableCell>
                  <StyledTableCell
                    id="team-members-status"
                    className={`${classes.tableCellHeader} ${classes.tableCellIcon}`}
                  >
                  </StyledTableCell>
                  <StyledTableCell
                    id="team-members-email"
                    className={classes.tableCellHeader}
                  >
                    {t('email')}
                  </StyledTableCell>
                  <StyledTableCell
                    id="team-members-admin"
                    className={`${classes.tableCellHeader} ${classes.checkboxTableCellHeader}`}
                    padding="checkbox"
                  >
                    {t('admin')}
                  </StyledTableCell>
                  {isUserAdmin &&
                    <StyledTableCell
                      id="team-members-delete"
                      className={classes.tableHeaderDelete}
                    />
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map(
                  (teamMember: TeamMember): JSX.Element => (
                    <MemberRow
                      key={teamMember.userId}
                      teamMember={teamMember}
                      team={team}
                      refreshParent={refresh}
                    />)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
      <AddMemberDialog addMember={addMember} />
    </React.Fragment>
  )
}

export default TeamMembers
