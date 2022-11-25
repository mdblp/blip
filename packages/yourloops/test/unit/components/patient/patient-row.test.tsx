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

import { FilterType, UserInvitationStatus } from '../../../../models/generic.model'
import * as authHookMock from '../../../../lib/auth'
import { User } from '../../../../lib/auth'
import { createPatient, createPatientTeam } from '../../common/utils'
import PatientRow from '../../../../components/patient/patient-row'
import { PatientRowProps } from '../../../../components/patient/models'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import userEvent from '@testing-library/user-event'
import PatientUtils from '../../../../lib/patient/utils'

const removePatientDialogMockId = 'remove-patient-dialog-id'
// eslint-disable-next-line react/display-name
jest.mock('../../../../components/patient/remove-patient-dialog', () => () => {
  return <div data-testid={removePatientDialogMockId} />
})
jest.mock('../../../../lib/auth')
describe('Patient row', () => {
  const flagPatientMock = jest.fn()
  const teamId = 'teamId'
  const teams = [createPatientTeam(teamId, UserInvitationStatus.accepted)]
  const patient = createPatient('id1', teams)
  const props: PatientRowProps = {
    patient,
    filter: undefined
  }

  beforeEach(() => {
    (authHookMock.useAuth as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        flagPatient: flagPatientMock,
        getFlagPatients: jest.fn().mockReturnValue([]),
        user: { isUserHcp: () => true, isUserCaregiver: () => false } as User
      }
    })
  })

  const getPatientRowJSX = (patientElementProps: PatientRowProps = props): JSX.Element => {
    return (
      <Table>
        <TableBody>
          <PatientRow
            patient={patientElementProps.patient}
            filter={patientElementProps.filter}
          />
        </TableBody>
      </Table>
    )
  }

  it('should open modal when clicking on remove patient icon', () => {
    render(getPatientRowJSX())
    const removeButton = screen.getByRole('button', { name: 'remove-patient-fake@email.com' })
    expect(screen.queryByTestId(removePatientDialogMockId)).not.toBeInTheDocument()
    fireEvent.click(removeButton)
    expect(screen.queryByTestId(removePatientDialogMockId)).toBeInTheDocument()
  })

  it('should flag patient when clicking on flag icon', () => {
    render(getPatientRowJSX())
    expect(screen.queryByTitle('flag-icon-active')).toBeNull()
    expect(screen.queryByTitle('flag-icon-inactive')).not.toBeNull()
    expect(screen.queryByTitle('pending-icon')).toBeNull()
    const flagButton = screen.getByRole('button', { name: 'flag-icon-inactive' })
    fireEvent.click(flagButton)
    expect(flagPatientMock).toHaveBeenCalledTimes(1)
  })

  it('should show pending icon when patient is pending and filter is pending', () => {
    jest.spyOn(PatientUtils, 'isInvitationPending').mockReturnValue(true)
    const componentProps: PatientRowProps = {
      patient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    expect(screen.queryByTitle('flag-icon-active')).toBeNull()
    expect(screen.queryByTitle('flag-icon-inactive')).toBeNull()
    expect(screen.queryByTitle('pending-icon')).not.toBeNull()
    expect(screen.queryByText(/pending-invitation/)).toBeNull()
    userEvent.hover(screen.getByTitle('pending-invitation'))
    expect(screen.findByText('pending-invitation')).not.toBeNull()
  })

  it('should display correct fields when logged in user is HCP', () => {
    render(getPatientRowJSX())
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(10)
    expect(within(cells[1]).queryByText(patient.profile.fullName)).not.toBeNull()
    expect(within(cells[2]).queryByText('N/A')).not.toBeNull()
    expect(within(cells[3]).queryByText('no')).not.toBeNull()
    expect(within(cells[4]).queryByText(`${patient.metadata.alarm.timeSpentAwayFromTargetRate}%`)).not.toBeNull()
    expect(within(cells[4]).queryByTitle('time-away-alert-icon')).toBeNull()
    expect(within(cells[5]).queryByText(`${patient.metadata.alarm.frequencyOfSevereHypoglycemiaRate}%`)).not.toBeNull()
    expect(within(cells[4]).queryByTitle('severe-hypo-alert-icon')).toBeNull()
    expect(within(cells[6]).queryByText(`${patient.metadata.alarm.nonDataTransmissionRate}%`)).not.toBeNull()
    expect(within(cells[4]).queryByTitle('no-data-alert-icon')).toBeNull()
    expect(within(cells[7]).queryByText('N/A')).not.toBeNull()
    expect(within(cells[8]).queryByTitle('unread-messages-icon')).toBeNull()
  })

  it('should display correct fields when logged in user is caregiver', () => {
    (authHookMock.useAuth as jest.Mock) = jest.fn().mockImplementation(() => {
      return {
        flagPatient: flagPatientMock,
        getFlagPatients: jest.fn().mockReturnValue([]),
        user: { isUserHcp: () => false, isUserCaregiver: () => true } as User
      }
    })
    render(getPatientRowJSX())
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(8)
    expect(within(cells[1]).queryByText(patient.profile.fullName)).not.toBeNull()
    expect(within(cells[2]).queryByText('N/A')).not.toBeNull()
    expect(within(cells[3]).queryByText(`${patient.metadata.alarm.timeSpentAwayFromTargetRate}%`)).not.toBeNull()
    expect(within(cells[4]).queryByText(`${patient.metadata.alarm.frequencyOfSevereHypoglycemiaRate}%`)).not.toBeNull()
    expect(within(cells[5]).queryByText(`${patient.metadata.alarm.nonDataTransmissionRate}%`)).not.toBeNull()
    expect(within(cells[6]).queryByText('N/A')).not.toBeNull()
  })

  it('should display remote monitoring to yes when logged in user is HCP and user is remote monitored', () => {
    const remoteMonitoredPatient = createPatient('fakePatient', teams)
    remoteMonitoredPatient.monitoring = { enabled: true }
    const componentProps: PatientRowProps = {
      patient: remoteMonitoredPatient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    const cells = screen.getAllByRole('cell')
    expect(within(cells[3]).queryByText('yes')).not.toBeNull()
  })

  it('should display correct remote monitoring label when logged in user is HCP and user is remote monitored and has a monitoring end date', () => {
    const remoteMonitoredPatient = createPatient('fakePatient', teams)
    remoteMonitoredPatient.monitoring = { enabled: true, monitoringEnd: new Date() }
    const componentProps: PatientRowProps = {
      patient: remoteMonitoredPatient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    const cells = screen.getAllByRole('cell')
    expect(within(cells[3]).queryByText(/yes \(until/)).not.toBeNull()
  })

  it('should display time away alert icon when logged in user is HCP and user has a time away alert', () => {
    const remoteMonitoredPatient = createPatient('fakePatient', teams)
    remoteMonitoredPatient.monitoring = { enabled: true, monitoringEnd: new Date() }
    remoteMonitoredPatient.metadata.alarm.timeSpentAwayFromTargetActive = true
    const componentProps: PatientRowProps = {
      patient: remoteMonitoredPatient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    const cells = screen.getAllByRole('cell')
    expect(within(cells[4]).queryByTitle('time-away-alert-icon')).not.toBeNull()
    expect(within(cells[5]).queryByTitle('severe-hypo-alert-icon')).toBeNull()
    expect(within(cells[6]).queryByTitle('no-data-alert-icon')).toBeNull()
  })

  it('should display severe hypo alert icon when logged in user is HCP and user has a severe hypo alert', () => {
    const remoteMonitoredPatient = createPatient('fakePatient', teams)
    remoteMonitoredPatient.monitoring = { enabled: true, monitoringEnd: new Date() }
    remoteMonitoredPatient.metadata.alarm.frequencyOfSevereHypoglycemiaActive = true
    const componentProps: PatientRowProps = {
      patient: remoteMonitoredPatient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    const cells = screen.getAllByRole('cell')
    expect(within(cells[4]).queryByTitle('time-away-alert-icon')).toBeNull()
    expect(within(cells[5]).queryByTitle('severe-hypo-alert-icon')).not.toBeNull()
    expect(within(cells[6]).queryByTitle('no-data-alert-icon')).toBeNull()
  })

  it('should display no data alert icon when logged in user is HCP and user has a no data alert', () => {
    const remoteMonitoredPatient = createPatient('fakePatient', teams)
    remoteMonitoredPatient.monitoring = { enabled: true, monitoringEnd: new Date() }
    remoteMonitoredPatient.metadata.alarm.nonDataTransmissionActive = true
    const componentProps: PatientRowProps = {
      patient: remoteMonitoredPatient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    const cells = screen.getAllByRole('cell')
    expect(within(cells[4]).queryByTitle('time-away-alert-icon')).toBeNull()
    expect(within(cells[5]).queryByTitle('severe-hypo-alert-icon')).toBeNull()
    expect(within(cells[6]).queryByTitle('no-data-alert-icon')).not.toBeNull()
  })

  it('should display unread messages icon when patient has unread messages and is monitored', () => {
    const remoteMonitoredPatient = createPatient('fakePatient', teams)
    remoteMonitoredPatient.monitoring = { enabled: true }
    remoteMonitoredPatient.metadata.unreadMessagesSent = 3
    const componentProps: PatientRowProps = {
      patient: remoteMonitoredPatient,
      filter: FilterType.pending
    }
    render(getPatientRowJSX(componentProps))
    const cells = screen.getAllByRole('cell')
    expect(within(cells[8]).queryByTitle('unread-messages-icon')).not.toBeNull()
  })
})
