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
import { ThemeProvider } from '@mui/material/styles'
import * as authHookMock from '../../../../lib/auth'
import { getTheme } from '../../../../components/theme'
import TeamInformation, { type TeamInformationProps } from '../../../../components/team/team-information'
import { buildTeam, triggerMouseEvent } from '../../common/utils'
import type User from '../../../../lib/auth/models/user.model'
import TeamUtils from '../../../../lib/team/team.util'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import * as teamHookMock from '../../../../lib/team'
import * as alertHookMock from '../../../../components/utils/snackbar'
import { PhonePrefixCode } from '../../../../lib/utils'
import { MemoryRouter } from 'react-router-dom'
import ErrorApi from '../../../../lib/error/error.api'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
jest.mock('../../../../components/utils/snackbar')
describe('TeamInformation', () => {
  const refresh = jest.fn()
  const updateTeamMock = jest.fn()
  const successMock = jest.fn()
  const errorMock = jest.fn()

  const teamId = 'teamId'
  const team = buildTeam(teamId, [])
  team.phone = '012345678'
  team.address = {
    line1: 'line 1',
    line2: 'line 2',
    zip: '08130',
    city: 'Vouilly',
    country: 'FR'
  }
  beforeEach(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserPatient: () => true } as User }
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { updateTeam: updateTeamMock }
    })
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true)
  })

  beforeAll(() => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValue(true);
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { error: errorMock, success: successMock }
    })
  })

  async function editTeamInfo() {
    const editInfoButton = screen.getByRole('button', { name: 'button-edit-information' })
    await act(async () => {
      fireEvent.mouseDown(editInfoButton)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeNull()
    })
    const editTeamDialog = within(screen.getByRole('dialog'))
    const editTeamButton = editTeamDialog.getByRole('button', { name: 'button-save' })
    await act(async () => {
      fireEvent.mouseDown(editTeamButton)
    })
    await waitFor(() => {
      expect(updateTeamMock).toHaveBeenCalledWith(team)
    })
  }

  function getTeamInformationJSX(props: TeamInformationProps = { team }): JSX.Element {
    return (
      <MemoryRouter>
        <ThemeProvider theme={getTheme()}>
          <TeamInformation
            team={props.team}
          />
        </ThemeProvider>
      </MemoryRouter>
    )
  }

  function renderTeamInformation(props: TeamInformationProps = { team }) {
    render(getTeamInformationJSX(props))
  }

  it('should display correct team information', () => {
    const address = `${team.address?.line1}\n${team.address?.line2}\n${team.address?.zip}\n${team.address?.city}\n${team.address?.country}`
    renderTeamInformation()
    expect(document.getElementById(`team-information-${teamId}-name`).innerHTML).toEqual(team.name)
    expect(document.getElementById(`team-information-${teamId}-phone`).innerHTML).toEqual(`(${PhonePrefixCode[team.address.country] as PhonePrefixCode}) ${team.phone}`)
    expect(document.getElementById(`team-information-${teamId}-code`).innerHTML).toEqual(team.code)
    expect(document.getElementById(`team-information-${teamId}-address`).innerHTML).toEqual(address)
  })

  it('should display button to edit team when user is admin', () => {
    renderTeamInformation()
    expect(document.getElementById('edit-team-button')).not.toBeNull()
  })

  it('should open edit team dialog when clicking on edit team button', () => {
    renderTeamInformation()
    act(() => {
      triggerMouseEvent('click', document.getElementById('edit-team-button'))
    })
    expect(document.getElementById('team-edit-dialog')).not.toBeNull()
  })

  it('should not display button to edit team when user is not admin', () => {
    jest.spyOn(TeamUtils, 'isUserAdministrator').mockReturnValueOnce(false)
    renderTeamInformation()
    expect(document.getElementById('edit-team-button')).toBeNull()
  })

  it('should not display button to leave team when user is not patient', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserPatient: () => false } as User }
    })
    renderTeamInformation()
    expect(document.getElementById('leave-team-button')).toBeNull()
  })

  it('should save edited team', async () => {
    render(getTeamInformationJSX())
    await editTeamInfo()
    expect(successMock).toHaveBeenCalledWith('team-page-success-edit')
  })

  it('should not save edited team when user clicked on cancel', async () => {
    render(getTeamInformationJSX())
    const editInfoButton = screen.getByRole('button', { name: 'button-edit-information' })
    await act(async () => {
      fireEvent.mouseDown(editInfoButton)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeNull()
    })
    const editTeamDialog = within(screen.getByRole('dialog'))
    const editTeamButton = editTeamDialog.getByRole('button', { name: 'button-cancel' })
    await act(async () => {
      fireEvent.mouseDown(editTeamButton)
    })
    await waitFor(() => {
      expect(updateTeamMock).toHaveBeenCalledTimes(0)
    })
    expect(refresh).toHaveBeenCalledTimes(0)
  })

  it('should show error message when team edit failed', async () => {
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue()
    updateTeamMock.mockRejectedValue(Error('This error has been thrown by a mock on purpose'))
    render(getTeamInformationJSX())
    await editTeamInfo()
    expect(errorMock).toHaveBeenCalledWith('team-page-failed-edit')
  })

  it('should not show the phone prefix if the team has no address', () => {
    const teamWithNoAddress = buildTeam(teamId, [])
    const phone = '123456789'
    teamWithNoAddress.phone = phone
    renderTeamInformation({ team: teamWithNoAddress })
    expect(document.getElementById(`team-information-${teamId}-phone`).innerHTML).toEqual(phone)
  })
})
