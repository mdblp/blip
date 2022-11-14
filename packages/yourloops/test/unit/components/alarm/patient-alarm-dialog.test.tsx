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
import { act } from 'react-dom/test-utils'

import { PatientInfoWidgetProps } from '../../../../components/dashboard-widgets/patient-info-widget'
import { createPatient, triggerMouseEvent } from '../../common/utils'
import { render, unmountComponentAtNode } from 'react-dom'
import * as patientHook from '../../../../lib/patient/provider'
import { Alarm } from '../../../../models/alarm'
import { Monitoring } from '../../../../models/monitoring'
import { ThemeProvider } from '@material-ui/core'
import { getTheme } from '../../../../components/theme'
import PatientAlarmDialog from '../../../../components/alarm/patient-alarm-dialog'
import { UNITS_TYPE } from '../../../../lib/units/utils'
import { MIN_HIGH_BG, MIN_LOW_BG, MIN_VERY_LOW_BG } from '../../../../components/alarm/alarms-content-configuration'

jest.mock('../../../../lib/patient/provider')
describe('PatientAlarmDialog', () => {
  const patient = createPatient('fakePatientId')
  let container: HTMLElement | null = null
  const onClose = jest.fn()
  const alarm: Alarm = {
    timeSpentAwayFromTargetRate: 10,
    timeSpentAwayFromTargetActive: false,
    frequencyOfSevereHypoglycemiaRate: 20,
    frequencyOfSevereHypoglycemiaActive: false,
    nonDataTransmissionRate: 30,
    nonDataTransmissionActive: false
  }
  const monitoring: Monitoring = {
    enabled: true,
    parameters: {
      bgUnit: UNITS_TYPE.MGDL,
      lowBg: MIN_LOW_BG,
      highBg: MIN_HIGH_BG,
      outOfRangeThreshold: 20,
      veryLowBg: MIN_VERY_LOW_BG,
      hypoThreshold: 25,
      nonDataTxThreshold: 30,
      reportingPeriod: 15
    }
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
  })

  function mountComponent(props: PatientInfoWidgetProps = { patient }) {
    act(() => {
      render(
        <ThemeProvider theme={getTheme()}>
          <PatientAlarmDialog
            patient={props.patient}
            onClose={onClose}
          />
        </ThemeProvider>, container)
    })
  }

  it('should throw error when given patient has no monitoring enabled', () => {
    const patientNoMonitoring = createPatient('fakePatientId')
    expect(() => mountComponent({ patient: patientNoMonitoring })).toThrow()
  })

  it('should execute close when clicking on cancel button', () => {
    const patientWithMonitoring = createPatient('fakePatientId', [], monitoring, undefined, undefined, { alarm })
    mountComponent({ patient: patientWithMonitoring })
    const cancelButton = document.getElementById('cancel-button-id')
    triggerMouseEvent('click', cancelButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should execute updatePatientAlerts when clicking on save button', async () => {
    const updatePatientMonitoring = jest.fn();
    (patientHook.usePatientContext as jest.Mock).mockImplementation(() => {
      return { updatePatientMonitoring }
    })
    const patientWithMonitoring = createPatient('fakePatientId', [], monitoring, undefined, undefined, { alarm })
    mountComponent({ patient: patientWithMonitoring })
    const saveButton = document.getElementById('save-button-id')
    await act(async () => {
      triggerMouseEvent('click', saveButton)
      await new Promise(process.nextTick)
    })
    expect(updatePatientMonitoring).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should execute onClose when updatePatientAlerts throws an error', async () => {
    const updatePatientMonitoring = jest.fn().mockImplementation(() => {
      throw Error()
    });
    (patientHook.usePatientContext as jest.Mock).mockImplementation(() => {
      return { updatePatientMonitoring }
    })
    const patientWithMonitoring = createPatient('fakePatientId', [], monitoring, undefined, undefined, { alarm })
    mountComponent({ patient: patientWithMonitoring })
    const saveButton = document.getElementById('save-button-id')
    await act(async () => {
      triggerMouseEvent('click', saveButton)
      await new Promise(process.nextTick)
    })
    expect(updatePatientMonitoring).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })
})
