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
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import PatientMonitoringPrescription, {
  PatientMonitoringPrescriptionProps
} from '../../../components/patient/patient-monitoring-prescription'
import { RemoteMonitoringDialogAction } from '../../../components/dialogs/remote-monitoring-dialog'
import * as teamHookMock from '../../../lib/team'
import { buildTeam, buildTeamMember } from '../../common/utils'
import { TeamMemberRole } from '../../../models/team'
import { ThemeProvider } from '@material-ui/core'
import { getTheme } from '../../../components/theme'
import userEvent from '@testing-library/user-event'

jest.mock('../../../lib/team')
describe('PatientMonitoringPrescription', () => {
  const teamId1 = 'teamId1'
  const teamId2 = 'teamId2'
  const teamName1 = 'teamName1'
  const teamName2 = 'teamName2'
  const member1Id = 'Member1Id'
  const member2Id = 'Member2Id'
  const member1FullName = 'Member 1 full name'
  const member2FullName = 'Member 2 full name'
  const member1 = buildTeamMember(teamId1, member1Id, undefined, TeamMemberRole.patient, 'fakeUserName', member1FullName)
  const member2 = buildTeamMember(teamId2, member2Id, undefined, TeamMemberRole.patient, 'fakeUserName', member2FullName)
  const team1 = buildTeam('teamId1', [member1], teamName1)
  const team2 = buildTeam('teamId2', [member2], teamName2)
  const file = new File(['hello'], 'hello.png', { type: 'image/png' })

  const setPrescriptionInfoMock = jest.fn()
  const getRemoteMonitoringTeamsMock = jest.fn().mockReturnValue([team1, team2])

  const defaultProps: PatientMonitoringPrescriptionProps = {
    defaultTeamId: undefined,
    action: RemoteMonitoringDialogAction.invite,
    setPrescriptionInfo: setPrescriptionInfoMock
  }

  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { getRemoteMonitoringTeams: getRemoteMonitoringTeamsMock }
    })
  })

  function getPatientMonitoringPrescriptionJSX(props: PatientMonitoringPrescriptionProps = defaultProps) {
    return (
      <ThemeProvider theme={getTheme()}>
        <PatientMonitoringPrescription {...props} />
      </ThemeProvider>
    )
  }

  function selectItem(button: HTMLElement, elementToSelect: string) {
    fireEvent.mouseDown(button)
    const items = within(screen.getByRole('listbox'))
    fireEvent.click(items.getByText(elementToSelect))
  }

  it('should call setPrescription with correct parameters', () => {
    render(getPatientMonitoringPrescriptionJSX())
    const allButtons = screen.getAllByRole('button')

    // Select a team
    selectItem(allButtons[0], teamName1)
    expect(setPrescriptionInfoMock).not.toHaveBeenCalled()

    // Select a team member
    selectItem(allButtons[1], member1FullName)
    expect(setPrescriptionInfoMock).not.toHaveBeenCalled()

    // Upload a prescription file
    userEvent.upload(screen.getByRole('button', { name: 'browse' }), file)
    waitFor(() => expect(setPrescriptionInfoMock).toHaveBeenCalledWith(teamId1, member1Id, file, 3))

    // Select a number of month
    selectItem(allButtons[3], '6 month')
    waitFor(() => expect(setPrescriptionInfoMock).toHaveBeenCalledWith(teamId1, member1Id, file, 6))
  })
})
