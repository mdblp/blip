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
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import * as teamHookMock from '../../../../lib/team'
import { buildTeam, buildTeamMember } from '../../common/utils'
import * as alertHookMock from '../../../../components/utils/snackbar'
import TeamAlarmsConfiguration, {
  TeamAlarmsConfigurationProps
} from '../../../../components/team/team-alarms-configuration'
import { AlarmsContentConfigurationProps } from '../../../../components/alarm/alarms-content-configuration'
import { Monitoring } from '../../../../models/monitoring'

// eslint-disable-next-line react/display-name
jest.mock('../../../../components/alarm/alarms-content-configuration', () => (props: AlarmsContentConfigurationProps) => {
  return <button onClick={() => props.onSave({ enabled: true } as Monitoring)}>save-mock</button>
})
jest.mock('../../../../components/utils/snackbar')
jest.mock('../../../../lib/team')
describe('TeamMembers', () => {
  const updateTeamAlertsMock = jest.fn()
  const successMock = jest.fn()
  const errorMock = jest.fn()
  const teamId = 'teamId'
  const members = [
    buildTeamMember(teamId, 'userId1'),
    buildTeamMember(teamId, 'userId2')
  ]
  const team = buildTeam(teamId, members)

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { updateTeamAlerts: updateTeamAlertsMock }
    });
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successMock, error: errorMock }
    })
  })

  function getTeamAlarmConfigurationJSX(props: TeamAlarmsConfigurationProps = { team }) {
    return <TeamAlarmsConfiguration
      team={props.team}
    />
  }

  it('should throw error when given team as no monitoring', () => {
    const teamNoMonitoring = buildTeam(teamId, members)
    teamNoMonitoring.monitoring = undefined
    expect(() => render(getTeamAlarmConfigurationJSX({ team: teamNoMonitoring }))).toThrow()
  })

  it('should throw error when given team monitoring is not enabled', () => {
    const teamNoMonitoring = buildTeam(teamId, members)
    teamNoMonitoring.monitoring.enabled = false
    expect(() => render(getTeamAlarmConfigurationJSX({ team: teamNoMonitoring }))).toThrow()
  })

  function clickOnSaveButton() {
    render(getTeamAlarmConfigurationJSX({ team }))
    fireEvent.click(screen.getByRole('button'))
    expect(updateTeamAlertsMock).toHaveBeenCalled()
  }

  it('should update team alerts when saving', async () => {
    clickOnSaveButton()
    await waitFor(() => expect(successMock).toHaveBeenCalledWith('team-update-success'))
  })

  it('should not update team alerts when an error happen when saving', async () => {
    updateTeamAlertsMock.mockRejectedValue(Error('This error was thrown by a mock on purpose'))
    clickOnSaveButton()
    await waitFor(() => expect(errorMock).toHaveBeenCalledWith('team-update-error'))
  })
})
