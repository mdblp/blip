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
import { act } from 'react-dom/test-utils'
import { render, unmountComponentAtNode } from 'react-dom'
import { ThemeProvider } from '@mui/material/styles'
import { type RemoteMonitoringWidgetProps } from '../../../../components/dashboard-widgets/remote-monitoring-widget'
import { createPatient, triggerMouseEvent } from '../../common/utils'
import i18n from '../../../../lib/language'
import * as authHookMock from '../../../../lib/auth'
import AlarmCard from '../../../../components/monitoring-alert/monitoring-alert-card'
import type User from '../../../../lib/auth/models/user.model'
import { type Alarms } from '../../../../lib/patient/models/monitoring-alerts.model'
import { type Monitoring } from '../../../../lib/team/models/monitoring.model'
import { getTheme } from '../../../../components/theme'
import { Unit } from 'medical-domain'

jest.mock('../../../../lib/auth')
describe('AlarmCard', () => {
  const patient = createPatient('fakePatientId')
  let container: HTMLElement | null = null

  beforeAll(() => {
    i18n.changeLanguage('en')
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container);
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          id: 'id',
          settings: { units: { bg: Unit.MilligramPerDeciliter } },
          isUserPatient: () => false,
          isUserHcp: () => true
        } as User
      }
    })
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
  })

  function mountComponent(props: RemoteMonitoringWidgetProps = { patient }) {
    act(() => {
      render(
        <ThemeProvider theme={getTheme()}>
          <AlarmCard
            patient={props.patient}
          />
        </ThemeProvider>, container)
    })
  }

  it('should display configure button when logged in user is not a patient', () => {
    mountComponent()
    expect(document.getElementById('configure-icon-button-id')).not.toBeNull()
  })

  it('should not display configure button when logged in user is a patient', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          isUserPatient: () => true,
          isUserHcp: () => false
        } as User
      }
    })
    mountComponent()
    expect(document.getElementById('configure-icon-button-id')).toBeNull()
  })

  it('should display correct title when patient has no alarms', () => {
    mountComponent()
    expect(document.querySelector('[data-testid="alarm-card"] .MuiCardHeader-title').innerHTML).toEqual('events')
  })

  it('should display correct title patient has 2 alarms', () => {
    const alarm: Alarms = {
      timeSpentAwayFromTargetRate: 0,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 5,
      frequencyOfSevereHypoglycemiaActive: true,
      nonDataTransmissionRate: 10,
      nonDataTransmissionActive: true
    }
    const patientWithAlarms = createPatient('fakePatientId', [], undefined, undefined, undefined, undefined, alarm)
    mountComponent({ patient: patientWithAlarms })
    expect(document.querySelector('[data-testid="alarm-card"] .MuiCardHeader-title').innerHTML).toEqual('events (+2)')
  })

  it('should open dialog when clicking on configure button and close it when clicking on cancel', () => {
    const alarm: Alarms = {
      timeSpentAwayFromTargetRate: 10,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 20,
      frequencyOfSevereHypoglycemiaActive: false,
      nonDataTransmissionRate: 30,
      nonDataTransmissionActive: false
    }
    const monitoring: Monitoring = {
      enabled: true
    }
    const patientWithMonitoring = createPatient('fakePatientId', [], monitoring, undefined, undefined, undefined, alarm)
    mountComponent({ patient: patientWithMonitoring })
    const configureButton = document.getElementById('configure-icon-button-id')
    triggerMouseEvent('click', configureButton)
    expect(document.getElementById('patient-alarm-dialog-id')).not.toBeNull()
    const cancelButton = document.getElementById('cancel-button-id')
    triggerMouseEvent('click', cancelButton)
    expect(document.getElementById('patient-alarm-dialog-id')).toBeNull()
  })
})
