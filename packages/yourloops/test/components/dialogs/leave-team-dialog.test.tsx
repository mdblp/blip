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
import { render, screen } from '@testing-library/react'

import * as teamHookMock from '../../../lib/team'
import * as authHookMock from '../../../lib/auth'
import { buildTeam, buildTeamMember } from '../../common/utils'
import TeamUtils from '../../../lib/team/utils'
import LeaveTeamDialog, { LeaveTeamDialogProps } from '../../../components/dialogs/leave-team-dialog'

jest.mock('../../../components/utils/snackbar')
jest.mock('../../../lib/team')
jest.mock('../../../lib/auth')
describe('Leave team dialog', () => {
  const teamId = 'teamId'
  const members = [
    buildTeamMember(teamId, 'userId1'),
    buildTeamMember(teamId, 'userId2')
  ]
  const team = buildTeam(teamId, members)
  const onDialogResult = jest.fn()
  const teamLeaveDialogTitleTestId = 'team-leave-dialog-title'
  const teamLeaveDialogQuestionTestId = 'team-leave-dialog-question'
  const teamLeaveDialogConsequencesTestId = 'team-leave-dialog-consequences'

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { getTeam: jest.fn().mockReturnValue(team) }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      user: {
        isUserPatient: () => false,
        isUserHcp: () => true
      }
    }))
  })

  function mountComponent() {
    const props: LeaveTeamDialogProps = { team, onDialogResult }
    return render(<LeaveTeamDialog {...props} />)
  }

  it('should close the dialog when clicking on close button', () => {
    mountComponent()
    const leaveButton = screen.getByRole('button', { name: 'button-cancel' })
    leaveButton.click()
    expect(onDialogResult).toBeCalledWith(false)
  })

  it('should not be able to leave team when member is the only administrator', () => {
    jest.spyOn(TeamUtils, 'isUserTheOnlyAdministrator').mockReturnValueOnce(true)
    mountComponent()
    expect(screen.getByTestId(teamLeaveDialogTitleTestId).textContent).toEqual('team-leave-dialog-only-admin-title')
    expect(screen.queryByTestId(teamLeaveDialogQuestionTestId)).not.toBeInTheDocument()
    expect(screen.getByTestId(teamLeaveDialogConsequencesTestId).textContent).toEqual('team-leave-dialog-only-admin-consequences')
    expect(screen.getByRole('button', { name: 'button-ok' })).toBeInTheDocument()
  })

  it('should display a delete message when user is hcp and the only member and leave the team', () => {
    jest.spyOn(TeamUtils, 'teamHasOnlyOneMember').mockReturnValueOnce(true)
    jest.spyOn(TeamUtils, 'getNumMedicalMembers').mockReturnValueOnce(1)
    mountComponent()
    expect(screen.getByTestId(teamLeaveDialogTitleTestId).textContent).toEqual('team-leave-dialog-and-del-title')
    expect(screen.getByTestId(teamLeaveDialogQuestionTestId).textContent).toEqual('team-leave-dialog-and-del-question')
    expect(screen.getByTestId(teamLeaveDialogConsequencesTestId).textContent).toEqual('team-leave-dialog-and-del-consequences')
    const confirmButton = screen.getByRole('button', { name: 'team-leave-dialog-button-leave-and-del' })
    confirmButton.click()
    expect(onDialogResult).toBeCalledWith(true)
  })

  it('should display a leaving message when user is a patient', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      user: {
        isUserPatient: () => true,
        isUserHcp: () => false
      }
    }))
    mountComponent()
    expect(screen.getByTestId(teamLeaveDialogTitleTestId).textContent).toEqual('team-leave-dialog-title')
    expect(screen.getByTestId(teamLeaveDialogQuestionTestId).textContent).toEqual('team-leave-dialog-question')
    expect(screen.queryByRole(teamLeaveDialogConsequencesTestId)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'team-leave-dialog-button-leave' })).toBeInTheDocument()
  })
})
