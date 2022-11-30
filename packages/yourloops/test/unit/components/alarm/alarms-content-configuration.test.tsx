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

import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import ThemeProvider from '@mui/styles/ThemeProvider'

import { getTheme } from '../../../../components/theme'
import { buildTeam, createPatient, triggerMouseEvent } from '../../common/utils'
import { convertBG, UNITS_TYPE } from '../../../../lib/units/utils'
import AlarmsContentConfiguration, {
  AlarmsContentConfigurationProps,
  MIN_HIGH_BG,
  MIN_LOW_BG,
  MIN_VERY_LOW_BG
} from '../../../../components/alarm/alarms-content-configuration'
import { fireEvent, render, screen } from '@testing-library/react'
import * as teamHookMock from '../../../../lib/team'
import { PatientTeam } from '../../../../lib/data/patient'
import { Monitoring } from '../../../../models/monitoring'
import PatientUtils from '../../../../lib/patient/utils'

jest.mock('../../../../lib/team')
describe('AlarmsContentConfiguration', () => {
  const onSave = jest.fn()
  const getTeamMock = jest.fn()
  const monitoring = {
    enabled: true,
    parameters: {
      bgUnit: UNITS_TYPE.MGDL,
      lowBg: MIN_LOW_BG,
      highBg: MIN_HIGH_BG,
      outOfRangeThreshold: 5,
      veryLowBg: MIN_VERY_LOW_BG,
      hypoThreshold: 10,
      nonDataTxThreshold: 15,
      reportingPeriod: 7
    }
  }
  const patient = createPatient()
  const teamId = 'teamId'
  const team = buildTeam(teamId)
  team.monitoring = {
    enabled: true,
    parameters: {
      bgUnit: UNITS_TYPE.MGDL,
      lowBg: 1,
      highBg: 2,
      outOfRangeThreshold: 10,
      veryLowBg: 40,
      hypoThreshold: 45,
      nonDataTxThreshold: 50,
      reportingPeriod: 7
    }
  }

  let container: HTMLDivElement | null = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
      container = null
    }
  })

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        getTeam: getTeamMock
      }
    })
  })

  function getTeamAlarmsContentJSX(props: AlarmsContentConfigurationProps = {
    monitoring,
    onSave,
    saveInProgress: false
  }) {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={getTheme()}>
          <AlarmsContentConfiguration {...props} />
        </ThemeProvider>
      </StyledEngineProvider>
    )
  }

  function renderTeamAlarmsContent(props: AlarmsContentConfigurationProps = {
    monitoring,
    onSave,
    saveInProgress: false
  }) {
    act(() => {
      ReactDOM.render(getTeamAlarmsContentJSX(props), container)
    })
  }

  function checkSaveButtonDisabled() {
    const saveButton = document.getElementById('save-button-id')
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy()
  }

  function initRenderingWithPatient() {
    jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue({ teamId } as PatientTeam)
    getTeamMock.mockReturnValue(team)
    render(getTeamAlarmsContentJSX({ monitoring, onSave, saveInProgress: false, patient }))
  }

  function checkMonitoringValues(monitoring: Monitoring) {
    const allInputs = screen.getAllByRole('spinbutton')
    expect(allInputs).toHaveLength(3)
    expect(allInputs[0].value).toBe(monitoring.parameters.lowBg.toString())
    expect(allInputs[1].value).toBe(monitoring.parameters.highBg.toString())
    expect(allInputs[2].value).toBe(monitoring.parameters.veryLowBg.toString())
    expect(screen.getByRole('button', { name: `${monitoring.parameters.outOfRangeThreshold}%` })).not.toBeNull()
    expect(screen.getByRole('button', { name: `${monitoring.parameters.hypoThreshold}%` })).not.toBeNull()
    expect(screen.getByRole('button', { name: `${monitoring.parameters.nonDataTxThreshold}%` })).not.toBeNull()
  }

  it('should display correct alarm information and execute save function on click', () => {
    renderTeamAlarmsContent()
    expect((document.getElementById('low-bg-text-field-id') as HTMLInputElement).value).toEqual(monitoring.parameters.lowBg.toString())
    expect((document.getElementById('high-bg-text-field-id') as HTMLInputElement).value).toEqual(monitoring.parameters.highBg.toString())
    expect((document.getElementById('very-low-bg-text-field-id') as HTMLInputElement).value).toEqual(monitoring.parameters.veryLowBg.toString())
    expect(document.getElementById('basic-dropdown-out-of-range-selector').innerHTML).toEqual(`${monitoring.parameters.outOfRangeThreshold}%`)
    expect(document.getElementById('basic-dropdown-hypo-threshold-selector').innerHTML).toEqual(`${monitoring.parameters.hypoThreshold}%`)
    expect(document.getElementById('basic-dropdown-non-data-selector').innerHTML).toEqual(`${monitoring.parameters.nonDataTxThreshold}%`)
    const saveButton = document.getElementById('save-button-id')
    expect((saveButton as HTMLButtonElement).disabled).toBeFalsy()
    triggerMouseEvent('click', saveButton)
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith(monitoring)
  })

  it('should display correct alarm information in mg/dL when given mmol/L', () => {
    const monitoringInMMOLL = {
      enabled: true,
      parameters: {
        bgUnit: UNITS_TYPE.MMOLL,
        lowBg: convertBG(MIN_LOW_BG, UNITS_TYPE.MGDL),
        highBg: convertBG(MIN_HIGH_BG, UNITS_TYPE.MGDL),
        outOfRangeThreshold: 5,
        veryLowBg: convertBG(MIN_VERY_LOW_BG + 1, UNITS_TYPE.MGDL),
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7
      }
    }
    monitoring.parameters.veryLowBg = MIN_VERY_LOW_BG + 1
    renderTeamAlarmsContent({ monitoring: monitoringInMMOLL, onSave, saveInProgress: false })
    expect((document.getElementById('low-bg-text-field-id') as HTMLInputElement).value).toEqual(MIN_LOW_BG.toString())
    expect((document.getElementById('high-bg-text-field-id') as HTMLInputElement).value).toEqual(MIN_HIGH_BG.toString())
    expect(+(document.getElementById('very-low-bg-text-field-id') as HTMLInputElement).value).toBeCloseTo(MIN_VERY_LOW_BG + 1)
    expect(document.getElementById('basic-dropdown-out-of-range-selector').innerHTML).toEqual(`${monitoringInMMOLL.parameters.outOfRangeThreshold}%`)
    expect(document.getElementById('basic-dropdown-hypo-threshold-selector').innerHTML).toEqual(`${monitoringInMMOLL.parameters.hypoThreshold}%`)
    expect(document.getElementById('basic-dropdown-non-data-selector').innerHTML).toEqual(`${monitoringInMMOLL.parameters.nonDataTxThreshold}%`)
    const saveButton = document.getElementById('save-button-id')
    expect((saveButton as HTMLButtonElement).disabled).toBeFalsy()
    triggerMouseEvent('click', saveButton)
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith(monitoring)
  })

  it('save button should be disabled when low bg value is not in correct range', () => {
    const incorrectMonitoring = monitoring
    incorrectMonitoring.parameters.lowBg--
    renderTeamAlarmsContent({ monitoring: incorrectMonitoring, onSave, saveInProgress: false })
    checkSaveButtonDisabled()
  })

  it('save button should be disabled when high bg value is not in correct range', () => {
    const incorrectMonitoring = monitoring
    incorrectMonitoring.parameters.highBg--
    renderTeamAlarmsContent({ monitoring: incorrectMonitoring, onSave, saveInProgress: false })
    checkSaveButtonDisabled()
  })

  it('save button should be disabled when very low bg value is not in correct range', () => {
    const incorrectMonitoring = monitoring
    incorrectMonitoring.parameters.veryLowBg--
    renderTeamAlarmsContent({ monitoring: incorrectMonitoring, onSave, saveInProgress: false })
    checkSaveButtonDisabled()
  })

  it('save button should be disabled when outOfRangeThreshold is not correct', () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: UNITS_TYPE.MGDL,
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 8,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7
      }
    }
    renderTeamAlarmsContent({ monitoring: incorrectMonitoring, onSave, saveInProgress: false })
    checkSaveButtonDisabled()
  })

  it('save button should be disabled when hypoThreshold is not correct', () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: UNITS_TYPE.MGDL,
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 11,
        nonDataTxThreshold: 15,
        reportingPeriod: 7
      }
    }
    renderTeamAlarmsContent({ monitoring: incorrectMonitoring, onSave, saveInProgress: false })
    checkSaveButtonDisabled()
  })

  it('save button should be disabled when nonDataTxThreshold is not correct', () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: UNITS_TYPE.MGDL,
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 150,
        reportingPeriod: 7
      }
    }
    renderTeamAlarmsContent({ monitoring: incorrectMonitoring, onSave, saveInProgress: false })
    checkSaveButtonDisabled()
  })

  it('save button should be disabled when save in progress is true', () => {
    renderTeamAlarmsContent({ monitoring, onSave, saveInProgress: true })
    checkSaveButtonDisabled()
  })

  it('default values button should not be displayed when no patient has been given as props', () => {
    render(getTeamAlarmsContentJSX())
    expect(screen.queryByRole('button', { name: 'default-values' })).toBeNull()
  })

  it('default values button should be displayed when a patient has been given as props', () => {
    initRenderingWithPatient()
    expect(screen.queryByRole('button', { name: 'default-values' })).not.toBeNull()
  })

  it('clicking on default values button should set the team values', () => {
    initRenderingWithPatient()
    checkMonitoringValues(monitoring)
    fireEvent.click(screen.getByRole('button', { name: 'default-values' }))
    checkMonitoringValues(team.monitoring)
  })

  it('default label should not be displayed when a patient has been given as props', () => {
    initRenderingWithPatient()
    expect(screen.queryByText('default-min-max')).toBeNull()
    expect(screen.queryByText('default')).toBeNull()
  })

  it('default label should be displayed when no patient has been given as props', () => {
    render(getTeamAlarmsContentJSX())
    expect(screen.queryByText('default-min-max')).not.toBeNull()
    expect(screen.queryAllByText('default')).toHaveLength(4)
  })
})
