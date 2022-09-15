/**
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

import React from 'react'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'

import * as teamHookMock from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import { User } from '../../../../lib/auth'
import MemberRow, { TeamMembersProps } from '../../../../components/team/member-row'
import { TeamMemberRole } from '../../../../models/team'
import { UserInvitationStatus } from '../../../../models/generic'
import { getTheme } from '../../../../components/theme'
import { buildInvite, buildTeam, buildTeamMember } from '../../common/utils'
import TeamApi from '../../../../lib/team/team-api'
import TeamUtils from '../../../../lib/team/utils'
import * as alertHookMock from '../../../../components/utils/snackbar'
import { ConfirmDialogProps } from '../../../../components/dialogs/confirm-dialog'

// eslint-disable-next-line react/display-name
jest.mock('../../../../components/dialogs/confirm-dialog', () => (props: ConfirmDialogProps) => {
  return (
    <tr>
      <td>
        <button onClick={props.onConfirm}>confirm-mock</button>
        <button onClick={props.onClose}>close-mock</button>
      </td>
    </tr>
  )
})
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/auth')
jest.mock('../../../../components/utils/snackbar')
describe('MemberRow', () => {
  const refreshParent = jest.fn()
  const loggedInUserId = 'loggedInUserId'
  const changeMemberRoleMock = jest.fn()
  const removeMemberMock = jest.fn()
  const errorMock = jest.fn()
  const successMock = jest.fn()
  let props: TeamMembersProps = {} as TeamMembersProps

  const teamId = 'teamId'
  const teamMember = buildTeamMember(
    'fakeUserId',
    buildInvite(teamId, 'fakeUserId', TeamMemberRole.member),
    TeamMemberRole.member,
    'fake@username.com',
    'fake full name',
    UserInvitationStatus.accepted
  )

  const pendingTeamMemberWithNoInvite = buildTeamMember(
    'fakeUserId',
    undefined,
    TeamMemberRole.member,
    'fake@username.com',
    'fake full name',
    UserInvitationStatus.pending
  )

  const pendingTeamMemberWithInviteFromAnotherUser = buildTeamMember(
    'fakeUserId',
    buildInvite(teamId, 'fakeUserId', TeamMemberRole.member),
    TeamMemberRole.member,
    'fake@username.com',
    'fake full name',
    UserInvitationStatus.pending
  )
  pendingTeamMemberWithInviteFromAnotherUser.invitation.target = { id: 'wrongId', name: 'wrongTeam' }

  const pendingTeamMemberWithInviteFromCurrentLoggedInUser = buildTeamMember(
    'fakeUserId',
    buildInvite(teamId, 'fakeUserId', TeamMemberRole.member),
    TeamMemberRole.member,
    'fake@username.com',
    'fake full name',
    UserInvitationStatus.pending
  )
  pendingTeamMemberWithInviteFromCurrentLoggedInUser.invitation.target = { id: teamId, name: 'correctTeam' }

  const loggedInUserAdmin = buildTeamMember(
    loggedInUserId,
    buildInvite(teamId, loggedInUserId, TeamMemberRole.admin),
    TeamMemberRole.admin,
    'fake@admin.com',
    'fake admin full name',
    UserInvitationStatus.accepted
  )

  const loggedInUserNotAdmin = buildTeamMember(
    loggedInUserId,
    buildInvite(teamId, loggedInUserId, TeamMemberRole.member),
    TeamMemberRole.member,
    'fake@admin.com',
    'fake admin full name',
    UserInvitationStatus.accepted
  )

  const pendingTeamMember = buildTeamMember(
    'fakeUserId',
    buildInvite(teamId, 'fakeUserId', TeamMemberRole.member),
    TeamMemberRole.member,
    'fake@username.com',
    'fake full name',
    UserInvitationStatus.pending
  )

  const pendingAdminTeamMember = buildTeamMember('fakeUserId', buildInvite())
  const adminTeamMember = buildTeamMember(
    'fakeUserId',
    buildInvite(),
    TeamMemberRole.admin,
    'fake@username.com',
    'fake full name',
    UserInvitationStatus.accepted)

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { changeMemberRole: changeMemberRoleMock, removeMember: removeMemberMock }
    });
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { error: errorMock, success: successMock }
    })
  })

  beforeEach(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { id: loggedInUserAdmin.userId } as User }
    })
  })

  async function clickRemoveMemberButton(teamId: string) {
    const removeMemberButton = screen.getByRole('button', { name: 'remove-member-button' })
    await act(async () => {
      fireEvent.click(removeMemberButton)
      await waitFor(() => expect(screen.getByRole('button', { name: 'confirm-mock' })).toBeInTheDocument())
      const confirmButton = screen.getByRole('button', { name: 'confirm-mock' })
      fireEvent.click(confirmButton)
      await waitFor(() => expect(removeMemberMock).toHaveBeenCalledWith(teamMember, teamId))
      expect(refreshParent).toHaveBeenCalled()
    })
  }

  function getMemberRowJSX(memberProps: TeamMembersProps = props): JSX.Element {
    return <ThemeProvider theme={getTheme()}>
      <Table>
        <TableBody>
          <MemberRow
            team={memberProps.team}
            teamMember={memberProps.teamMember}
            refreshParent={memberProps.refreshParent}
          />
        </TableBody>
      </Table>
    </ThemeProvider>
  }

  it('should display correct information when user is a pending admin', () => {
    const team = buildTeam(teamId, [pendingAdminTeamMember])
    props = {
      team,
      teamMember: pendingAdminTeamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(4)
    const roleCheckbox = within(cells[3]).getByRole('checkbox')
    expect(cells[0].innerHTML).toEqual('--')
    expect(screen.queryByTitle('pending-user-icon')).not.toBeNull()
    expect(cells[2].innerHTML).toEqual(teamMember.email)
    expect(roleCheckbox).toBeChecked()
    expect(roleCheckbox).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'remove-member-button' })).toBeNull()
  })

  it('should display correct information when user is a pending non admin', () => {
    const team = buildTeam(teamId, [pendingTeamMember])
    props = {
      team,
      teamMember: pendingTeamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    const cells = screen.getAllByRole('cell')
    const roleCheckbox = within(cells[3]).getByRole('checkbox')
    expect(roleCheckbox).not.toBeChecked()
    expect(roleCheckbox).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'remove-member-button' })).toBeNull()
  })

  it('should display correct information when user is a not pending and not admin', () => {
    const team = buildTeam(teamId, [teamMember])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(4)
    const roleCheckbox = within(cells[3]).getByRole('checkbox')
    expect(cells[0].innerHTML).toEqual(teamMember.profile.fullName)
    expect(screen.queryByTitle('pending-user-icon')).toBeNull()
    expect(cells[2].innerHTML).toEqual(teamMember.email)
    expect(roleCheckbox).not.toBeChecked()
    expect(roleCheckbox).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'remove-member-button' })).toBeNull()
  })

  it('should enable role checkbox when current user is admin and is not the only team member', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValueOnce(true).mockReturnValueOnce(false)
    const team = buildTeam(teamId, [teamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(5)
    const roleCheckbox = within(cells[3]).getByRole('checkbox')
    expect(cells[0].innerHTML).toEqual(teamMember.profile.fullName)
    expect(screen.queryByTitle('pending-user-icon')).toBeNull()
    expect(cells[2].innerHTML).toEqual(teamMember.email)
    expect(roleCheckbox).not.toBeChecked()
    expect(roleCheckbox).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'remove-member-button' })).not.toBeNull()
  })

  it('should switch user role to member when ticking checkbox', async () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    jest.spyOn(TeamApi, 'changeMemberRole').mockResolvedValue()
    const team = buildTeam(teamId, [teamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    const cells = screen.getAllByRole('cell')
    const roleCheckbox = within(cells[3]).getByRole('checkbox')
    expect(roleCheckbox).toBeChecked()
    await act(async () => {
      fireEvent.click(roleCheckbox)
      await waitFor(() => expect(changeMemberRoleMock).toHaveBeenCalledWith(teamMember, TeamMemberRole.member, team.id))
      expect(refreshParent).toHaveBeenCalled()
    })
  })

  it('should try to switch user role to admin when ticking checkbox and fail when throwing an error', async () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(false)
    jest.spyOn(TeamApi, 'changeMemberRole').mockResolvedValue()
    changeMemberRoleMock.mockRejectedValue(Error('This error has been thrown by a mock on purpose'))
    const team = buildTeam(teamId, [adminTeamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember: adminTeamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    const cells = screen.getAllByRole('cell')
    const roleCheckbox = within(cells[3]).getByRole('checkbox')
    expect(roleCheckbox).not.toBeChecked()
    await act(async () => {
      fireEvent.click(roleCheckbox)
      await waitFor(() => expect(changeMemberRoleMock).toHaveBeenCalledWith(adminTeamMember, TeamMemberRole.admin, team.id))
      expect(refreshParent).toHaveBeenCalled()
      expect(errorMock).toHaveBeenCalledWith('team-page-failed-update-role')
    })
  })

  it('should remove member when clicking on remove member icon', async () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    const team = buildTeam(teamId, [teamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    await clickRemoveMemberButton(team.id)
    expect(errorMock).toHaveBeenCalledTimes(0)
  })

  it('should try to remove member when clicking on remove member icon and fail when an error is thrown', async () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    removeMemberMock.mockRejectedValue(Error('This error has been thrown by a mock on purpose'))
    const team = buildTeam(teamId, [teamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    await clickRemoveMemberButton(team.id)
    expect(errorMock).toHaveBeenCalledWith('remove-member-failed')
  })

  it('remove member icon should not be visible when logged in user is not admin', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(false)
    const team = buildTeam(teamId, [teamMember, loggedInUserNotAdmin])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    expect(screen.queryByRole('button', { name: 'remove-member-button' })).not.toBeInTheDocument()
  })

  it('remove member icon should not be visible when logged in user not admin', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    const team = buildTeam(teamId, [teamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember,
      refreshParent
    }
    render(getMemberRowJSX())
    expect(screen.getByRole('button', { name: 'remove-member-button' })).toBeInTheDocument()
  })

  it('remove member icon should be disabled when logged in is the user that we want to remove', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    const team = buildTeam(teamId, [teamMember, loggedInUserAdmin])
    props = {
      team,
      teamMember: loggedInUserAdmin,
      refreshParent
    }
    render(getMemberRowJSX())
    expect(screen.getByRole('button', { name: 'remove-member-button' })).toBeDisabled()
  })

  it('remove member icon should be disabled when user is pending and has no invite', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    const team = buildTeam(teamId, [pendingTeamMemberWithNoInvite, loggedInUserAdmin])
    props = {
      team,
      teamMember: pendingTeamMemberWithNoInvite,
      refreshParent
    }
    render(getMemberRowJSX())
    expect(screen.getByRole('button', { name: 'remove-member-button' })).toBeDisabled()
  })

  it('remove member icon should be disabled when user is pending and was not invited by the current user', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    const team = buildTeam(teamId, [pendingTeamMemberWithInviteFromAnotherUser, loggedInUserAdmin])
    props = {
      team,
      teamMember: pendingTeamMemberWithInviteFromAnotherUser,
      refreshParent
    }
    render(getMemberRowJSX())
    expect(screen.getByRole('button', { name: 'remove-member-button' })).toBeDisabled()
  })

  it('remove member icon should be enabled when user all the conditions are met for a pending user', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
    const team = buildTeam(teamId, [pendingTeamMemberWithInviteFromCurrentLoggedInUser, loggedInUserAdmin])
    props = {
      team,
      teamMember: pendingTeamMemberWithInviteFromCurrentLoggedInUser,
      refreshParent
    }
    render(getMemberRowJSX())
    expect(screen.getByRole('button', { name: 'remove-member-button' })).toBeEnabled()
  })
})
