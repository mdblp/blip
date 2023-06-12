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

import React from 'react'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import * as teamHookMock from '../../../../lib/team'
import * as patientsHookMock from '../../../../lib/patient/patients.provider'
import * as authHookMock from '../../../../lib/auth'
import * as alertHookMock from '../../../../components/utils/snackbar'
import { buildTeam, buildTeamMember } from '../../common/utils'
import LeaveTeamButton, { type LeaveTeamButtonProps } from '../../../../components/team/leave-team-button'
import TeamUtils from '../../../../lib/team/team.util'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

jest.mock('../../../../components/utils/snackbar')
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/patient/patient.provider')
jest.mock('../../../../lib/auth')
describe('TeamMembers', () => {
  const leaveTeamMock = jest.fn()
  const patientLeaveTeamMock = jest.fn()
  const successMock = jest.fn()
  const errorMock = jest.fn()
  const teamId = 'teamId'
  const members = [
    buildTeamMember(teamId, 'userId1'),
    buildTeamMember(teamId, 'userId2')
  ]
  const team = buildTeam(teamId, members)
  const initialRoute = '/fakeRoute'

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { leaveTeam: leaveTeamMock, getTeam: jest.fn().mockReturnValue(team) }
    });
    (patientsHookMock.usePatientsContext as jest.Mock).mockImplementation(() => {
      return { leaveTeam: patientLeaveTeamMock }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      user: {
        isUserPatient: () => false,
        isUserHcp: () => true
      }
    }));
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successMock, error: errorMock }
    })
  })

  beforeEach(() => {
    jest.spyOn(TeamUtils, 'teamHasOnlyOneMember').mockReturnValue(false)
  })

  async function leaveTeam(mockToBeCalled = leaveTeamMock) {
    const leaveButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(leaveButton)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeNull()
    })
    const leaveDialog = within(screen.getByRole('dialog'))
    const confirmButton = leaveDialog.getByRole('button', { name: 'team-leave-dialog-button-leave' })
    await act(async () => {
      fireEvent.click(confirmButton)
    })
    expect(mockToBeCalled).toHaveBeenCalled()
  }

  const renderLeaveTeamButton = (props: LeaveTeamButtonProps = { team }) => {
    const router = createMemoryRouter(
      [
        {
          path: '*',
          element: <LeaveTeamButton
            team={props.team}
          />
        }
      ],
      {
        initialEntries: [initialRoute],
        initialIndex: 0
      }
    )

    render(<RouterProvider router={router} />)
    return router
  }

  it('should successfully remove member from team and display proper message when member was the last one', async () => {
    jest.spyOn(TeamUtils, 'teamHasOnlyOneMember').mockReturnValue(true)
    const router = renderLeaveTeamButton()
    await leaveTeam()
    expect(successMock).toHaveBeenCalledWith('team-page-success-deleted')
    expect(router.state.location.pathname).toBe('/')
  })

  it('should successfully remove member from team and display proper message when member was not the last one', async () => {
    renderLeaveTeamButton()
    await leaveTeam()
    expect(successMock).toHaveBeenCalledWith('team-page-leave-success')
  })

  it('should throw an error when failing and member was the last one', async () => {
    jest.spyOn(TeamUtils, 'teamHasOnlyOneMember').mockReturnValue(true)
    leaveTeamMock.mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
    const router = renderLeaveTeamButton()
    await leaveTeam()
    expect(errorMock).toHaveBeenCalledWith('team-page-failure-deleted')
    expect(router.state.location.pathname).toBe(initialRoute)
  })

  it('should throw an error when failing and member was not the last one', async () => {
    leaveTeamMock.mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
    renderLeaveTeamButton()
    await leaveTeam()
    expect(errorMock).toHaveBeenCalledWith('team-page-failed-leave')
  })

  it('should not leave team when user has clicked on cancel', async () => {
    leaveTeamMock.mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
    const router = renderLeaveTeamButton()
    const leaveButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(leaveButton)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeNull()
    })
    const leaveDialog = within(screen.getByRole('dialog'))
    const cancelButton = leaveDialog.getByRole('button', { name: 'button-cancel' })
    await act(async () => {
      fireEvent.click(cancelButton)
    })
    expect(leaveTeamMock).toHaveBeenCalledTimes(0)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe(initialRoute)
    leaveTeamMock.mockReset()
  })

  it('should display a leaving message when user is a patient', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      user: {
        isUserPatient: () => true,
        isUserHcp: () => false
      }
    }))
    renderLeaveTeamButton()
    await leaveTeam(patientLeaveTeamMock)
    expect(successMock).toHaveBeenCalledWith('team-page-leave-success')
  })
})
