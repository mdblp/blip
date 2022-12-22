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
import moment from 'moment-timezone'
import { act } from 'react-dom/test-utils'

import RemoteMonitoringWidget, { RemoteMonitoringWidgetProps } from '../../../../components/dashboard-widgets/remote-monitoring-widget'
import { buildTeam, buildTeamMember, createPatient } from '../../common/utils'
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
import i18n from '../../../../lib/language'
import * as authHookMock from '../../../../lib/auth'
import * as teamHookMock from '../../../../lib/team'
import * as patientHookMock from '../../../../lib/patient/patient.provider'
import * as notificationsHookMock from '../../../../lib/notifications/notification.hook'
import User from '../../../../lib/auth/models/user.model'
import { genderLabels } from '../../../../lib/auth/auth.helper'
import { Monitoring } from '../../../../lib/team/models/monitoring.model'
import * as RemoteMonitoringPatientDialogMock from '../../../../components/dialogs/remote-monitoring-dialog'
import { RemoteMonitoringPatientDialogProps } from '../../../../components/dialogs/remote-monitoring-dialog'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ConfirmDialogProps } from '../../../../components/dialogs/confirm-dialog'
import PatientUtils from '../../../../lib/patient/patient.util'
import { PatientTeam } from '../../../../lib/patient/models/patient-team.model'
import { MonitoringStatus } from '../../../../lib/team/models/enums/monitoring-status.enum'

/* eslint-disable-next-line react/display-name */
jest.mock('../../../../components/dialogs/confirm-dialog', () => (props: ConfirmDialogProps) => {
  return (<>
    <button onClick={props.onConfirm}>confirm-mock</button>
    <button onClick={props.onClose}>close-mock</button>
  </>)
})
jest.mock('../../../../components/dialogs/remote-monitoring-dialog')
jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/patient/patient.provider')
jest.mock('../../../../lib/notifications/notification.hook')
describe('PatientInfoWidget', () => {
  const patient = createPatient('fakePatientId')
  let container: HTMLElement | null = null
  const adminMember = buildTeamMember()
  const patientMember = buildTeamMember(patient.userid)
  const remoteMonitoringTeam = buildTeam('fakeTeamId', [adminMember, patientMember])
  patient.teams = [{ teamId: remoteMonitoringTeam.id } as PatientTeam]
  const cancelRemoteMonitoringInviteMock = jest.fn()
  const updatePatientMonitoringMock = jest.fn()
  const getPatientByIdMock = jest.fn().mockReturnValue(patient)

  beforeAll(() => {
    i18n.changeLanguage('en');
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserCaregiver: () => false, isUserHcp: () => true, id: adminMember.userId } as User }
    })
    jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue({ teamId: 'fakeTeamId' } as PatientTeam);
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        getRemoteMonitoringTeams: () => [remoteMonitoringTeam]
      }
    });
    (patientHookMock.usePatientContext as jest.Mock).mockImplementation(() => {
      return {
        updatePatientMonitoring: updatePatientMonitoringMock,
        getPatientById: getPatientByIdMock
      }
    });
    (RemoteMonitoringPatientDialogMock.default as jest.Mock).mockImplementation((props: RemoteMonitoringPatientDialogProps) => {
      return <button onClick={props.onClose}>save-mock</button>
    });
    (notificationsHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return { cancelRemoteMonitoringInvite: cancelRemoteMonitoringInviteMock }
    })
  })

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

  function getPatientInfoWidgetJSX(props: RemoteMonitoringWidgetProps = { patient }): JSX.Element {
    return <RemoteMonitoringWidget patient={props.patient} />
  }

  function mountComponent(props: RemoteMonitoringWidgetProps = { patient }) {
    act(() => {
      ReactDOM.render(getPatientInfoWidgetJSX(props), container)
    })
  }

  async function clickOnActionButtonAndSave(buttonName: string) {
    render(getPatientInfoWidgetJSX())
    fireEvent.click(screen.getByRole('button', { name: buttonName }))
    fireEvent.click(screen.getByRole('button', { name: 'save-mock' }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'save-mock' })).toBeNull())
  }

  it('should display correct patient information', () => {
    mountComponent()
    expect(document.getElementById('patient-info-remote-monitoring-value').innerHTML).toEqual('no')
    expect(document.getElementById('invite-button-id')).toBeNull()
    expect(document.getElementById('cancel-invite-button-id')).toBeNull()
    expect(document.getElementById('renew-button-id')).toBeNull()
    expect(document.getElementById('remove-button-id')).toBeNull()
  })

  it('should display cancel invite button when patient is not monitored and status is pending', () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.pending } as Monitoring
    mountComponent()
    expect(document.getElementById('patient-info-remote-monitoring-value').innerHTML).toEqual('no')
    expect(document.getElementById('invite-button-id')).toBeNull()
    expect(document.getElementById('cancel-invite-button-id')).not.toBeNull()
    expect(document.getElementById('renew-button-id')).toBeNull()
    expect(document.getElementById('remove-button-id')).toBeNull()
  })

  it('should display renew and remove button when patient is not monitored and status is accepted', () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.accepted } as Monitoring
    mountComponent()
    expect(document.getElementById('patient-info-remote-monitoring-value').innerHTML).toEqual('no')
    expect(document.getElementById('invite-button-id')).toBeNull()
    expect(document.getElementById('cancel-invite-button-id')).toBeNull()
    expect(document.getElementById('renew-button-id')).not.toBeNull()
    expect(document.getElementById('remove-button-id')).not.toBeNull()
  })

  it('should display invite button when patient is not monitored and status is undefined', () => {
    patient.monitoring = { enabled: false, status: undefined } as Monitoring
    mountComponent()
    expect(document.getElementById('patient-info-remote-monitoring-value').innerHTML).toEqual('no')
    expect(document.getElementById('invite-button-id')).not.toBeNull()
    expect(document.getElementById('cancel-invite-button-id')).toBeNull()
    expect(document.getElementById('renew-button-id')).toBeNull()
    expect(document.getElementById('remove-button-id')).toBeNull()
  })

  it('should display renew and remove button when patient is monitored', () => {
    patient.monitoring = { enabled: true, status: undefined } as Monitoring
    mountComponent()
    expect(document.getElementById('patient-info-remote-monitoring-value').innerHTML).toEqual('yes')
    expect(document.getElementById('invite-button-id')).toBeNull()
    expect(document.getElementById('cancel-invite-button-id')).toBeNull()
    expect(document.getElementById('renew-button-id')).not.toBeNull()
    expect(document.getElementById('remove-button-id')).not.toBeNull()
  })

  it('should open dialog to invite patient when clicking on invite button and close it when saving', async () => {
    patient.monitoring = { enabled: false, status: undefined } as Monitoring
    await clickOnActionButtonAndSave('invite')
  })

  it('should open dialog to renew patient when clicking on renew button and close it when saving', async () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.accepted } as Monitoring
    await clickOnActionButtonAndSave('renew')
  })

  it('should open dialog to confirm when clicking on cancel invite button and cancel the invite when clicking on confirm', async () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.pending } as Monitoring
    render(getPatientInfoWidgetJSX())
    fireEvent.click(screen.getByRole('button', { name: 'cancel-invite' }))
    fireEvent.click(screen.getByRole('button', { name: 'confirm-mock' }))
    expect(cancelRemoteMonitoringInviteMock).toHaveBeenCalled()
    await waitFor(() => expect(updatePatientMonitoringMock).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: 'confirm-mock' })).toBeNull()
  })

  it('should open dialog to confirm when clicking on cancel invite button and not cancel the invite when clicking on close', async () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.pending } as Monitoring
    render(getPatientInfoWidgetJSX())
    fireEvent.click(screen.getByRole('button', { name: 'cancel-invite' }))
    fireEvent.click(screen.getByRole('button', { name: 'close-mock' }))
    expect(cancelRemoteMonitoringInviteMock).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'close-mock' })).toBeNull())
  })

  it('should open dialog to confirm when clicking on delete button and edit the patient remote monitoring when clicking on confirm', async () => {
    patient.monitoring = { enabled: true, status: undefined } as Monitoring
    render(getPatientInfoWidgetJSX())
    fireEvent.click(screen.getByRole('button', { name: 'button-remove' }))
    fireEvent.click(screen.getByRole('button', { name: 'confirm-mock' }))
    expect(updatePatientMonitoringMock).toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'confirm-mock' })).toBeNull())
  })

  it('should open dialog to confirm when clicking on delete button and not edit the patient remote monitoring when clicking on close', async () => {
    patient.monitoring = { enabled: true, status: undefined } as Monitoring
    render(getPatientInfoWidgetJSX())
    fireEvent.click(screen.getByRole('button', { name: 'button-remove' }))
    fireEvent.click(screen.getByRole('button', { name: 'close-mock' }))
    expect(cancelRemoteMonitoringInviteMock).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'close-mock' })).toBeNull())
  })
})
