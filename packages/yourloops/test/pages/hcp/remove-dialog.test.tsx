/**
 * Copyright (c) 2021, Diabeloop
 * HCP remove patient dialog tests
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
import { act, Simulate, SyntheticEventData } from 'react-dom/test-utils'
import { render, unmountComponentAtNode } from 'react-dom'

import RemoveDialog from '../../../components/patient/remove-dialog'
import { waitTimeout } from '../../../lib/utils'
import { Patient, PatientTeam } from '../../../lib/data/patient'
import { createPatient, createPatientTeam } from '../../common/utils'
import { UserInvitationStatus } from '../../../models/generic'
import * as teamHookMock from '../../../lib/team'

jest.mock('../../../lib/team')
describe('RemoveDialog', () => {
  let container: HTMLElement | null = null
  let patient: Patient | undefined
  const onCloseStub = jest.fn()

  function mountComponent(props: { dialogOpened: boolean }): void {
    act(() => {
      return render(
        <RemoveDialog
          isOpen={props.dialogOpened}
          onClose={onCloseStub}
          patient={patient}
        />, container)
    })
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
      patient = undefined
    }
  })

  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { removePatient: jest.fn() }
    })
  })

  it('should be closed if isOpen is false', () => {
    mountComponent({ dialogOpened: false })
    const dialog = document.getElementById('remove-hcp-patient-dialog')
    expect(dialog).toBeNull()
  })

  it('should be opened if isOpen is true', () => {
    mountComponent({ dialogOpened: true })
    const dialog = document.getElementById('remove-hcp-patient-dialog')
    expect(dialog).not.toBeNull()
  })

  it('should not allow to validate if no team is selected', () => {
    mountComponent({ dialogOpened: true })
    const validateButton: HTMLButtonElement = document.querySelector('#remove-patient-dialog-validate-button')
    expect(validateButton.disabled).toBe(true)
  })

  it('should be able to remove patient after selecting a team', async () => {
    const patientTeams: PatientTeam[] = [
      createPatientTeam('fakePatientTeam1Id', UserInvitationStatus.accepted, 'team1'),
      createPatientTeam('fakePatientTeam2Id', UserInvitationStatus.accepted, 'team2')
    ]
    patient = createPatient('fakePatientId', patientTeams)
    mountComponent({ dialogOpened: true })
    const validateButton: HTMLButtonElement = document.querySelector('#remove-patient-dialog-validate-button')
    const teamSelect = document.querySelector('#patient-team-selector + input')

    Simulate.change(teamSelect, { target: { value: patientTeams[0].teamId } } as unknown as SyntheticEventData)
    expect(validateButton.disabled).toBe(false)

    Simulate.click(validateButton)
    await waitTimeout(1)
    expect(onCloseStub).toHaveBeenCalledTimes(1)
  })
})
