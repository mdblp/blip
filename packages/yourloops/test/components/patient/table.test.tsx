/**
 * Copyright (c) 2021, Diabeloop
 * HCP patient list bar tests
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
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate, SyntheticEventData } from 'react-dom/test-utils'

import { PatientTableSortFields, SortDirection, UserInvitationStatus } from '../../../models/generic'
import * as authHookMock from '../../../lib/auth'
import * as teamHookMock from '../../../lib/team'

import PatientTable from '../../../components/patient/table'
import { ThemeProvider } from '@material-ui/core'
import { getTheme } from '../../../components/theme'
import { createPatient, createPatientTeam } from '../../common/utils'

jest.mock('../../../lib/auth')
jest.mock('../../../lib/team')
describe('Patient list table', () => {
  const clickPatientStub = jest.fn()
  const clickFlagPatientStub = jest.fn()
  const isOnlyPendingInvitationMock = jest.fn().mockReturnValue(false)
  const isInvitationPendingMock = jest.fn().mockReturnValue(false)
  const isInAtLeastATeamMock = jest.fn().mockReturnValue(true)

  const team1Id = 'team1Id'
  const patient1 = createPatient('id1', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient2 = createPatient('id2', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient3 = createPatient('id3', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient4 = createPatient('id4', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient5 = createPatient('id5', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient6 = createPatient('id6', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient7 = createPatient('id7', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient8 = createPatient('id8', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient9 = createPatient('id9', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient10 = createPatient('id10', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const patient11 = createPatient('id11', [createPatientTeam(team1Id, UserInvitationStatus.accepted)])
  const allPatients = [patient1, patient2, patient3, patient4, patient5, patient6, patient7, patient8, patient9, patient10, patient11]

  let container: HTMLElement | null = null

  beforeAll(() => {
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (authHookMock.useAuth as jest.Mock) = jest.fn().mockImplementation(() => {
      return {}
    });
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        isOnlyPendingInvitation: isOnlyPendingInvitationMock,
        isInvitationPending: isInvitationPendingMock,
        isInAtLeastATeam: isInAtLeastATeamMock
      }
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

  const PatientTableComponent = (): JSX.Element => {
    return (
      <ThemeProvider theme={getTheme()}>
        <PatientTable
          patients={allPatients}
          flagged={[]}
          order={SortDirection.asc}
          orderBy={PatientTableSortFields.patientFullName}
          onClickPatient={clickPatientStub}
          onFlagPatient={clickFlagPatientStub}
          onSortList={jest.fn()}
        />
      </ThemeProvider>
    )
  }

  function mountComponent(): void {
    act(() => {
      render(<PatientTableComponent />, container)
    })
  }

  it('should be able to render', () => {
    mountComponent()
    const table = document.getElementById('patients-list-table')
    expect(table).not.toBeNull()
  })

  it('should fetch and display patients', () => {
    mountComponent()
    const rows = document.querySelectorAll('.patients-list-row')
    expect(rows.length).not.toBeNull()
  })

  it('should call onClickPatient method when clicking on a row', () => {
    mountComponent()
    const firstRow = document.querySelector('.patients-list-row')
    Simulate.click(firstRow)
    expect(clickPatientStub).toHaveBeenCalledTimes(1)
  })

  it('should call onFlagPatient method when clicking on a flag', () => {
    mountComponent()
    const firstRow = document.querySelector('.patients-list-row')
    const flagButton = firstRow.querySelector('.patient-flag-button')
    Simulate.click(flagButton)
    expect(clickFlagPatientStub).toHaveBeenCalledTimes(1)
  })

  it('should display only 10 patients when number pagination is by 10', () => {
    mountComponent()
    const patientRows = container.querySelectorAll('#patient-table-body-id > tr')
    expect(patientRows).toHaveLength(10)
  })

  it('should display all patients when number pagination is by 100', () => {
    mountComponent()
    const tablePagination: HTMLInputElement = container.querySelector('#patient-table-pagination-id input')
    Simulate.change(tablePagination, { target: { value: 100 } } as unknown as SyntheticEventData)
    const patientRows = container.querySelectorAll('#patient-table-body-id > tr')
    expect(patientRows).toHaveLength(allPatients.length)
  })
})
