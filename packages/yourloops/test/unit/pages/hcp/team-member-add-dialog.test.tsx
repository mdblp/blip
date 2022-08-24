/**
 * Copyright (c) 2021, Diabeloop
 * HCP team add dialog member
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

import { Team } from '../../../../lib/team'
import AddMemberDialog, { AddMemberDialogProps } from '../../../../pages/hcp/team-member-add-dialog'
import { AddMemberDialogContentProps } from '../../../../pages/hcp/types'
import ReactDOM from 'react-dom'
import { act, Simulate, SyntheticEventData } from 'react-dom/test-utils'
import { triggerMouseEvent } from '../../common/utils'
import { TeamMemberRole } from '../../../../models/team'

describe('AddMemberDialog', () => {
  const addMember: AddMemberDialogContentProps = {
    team: {} as Team,
    onMemberInvited: jest.fn()
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

  function renderComponent(props: AddMemberDialogProps) {
    act(() => {
      ReactDOM.render(<AddMemberDialog addMember={props.addMember} />, container)
    })
  }

  it('should be closed if addMember is null', () => {
    renderComponent({ addMember: null })
    expect(document.getElementById('team-add-member-dialog-title')).toBeNull()
  })

  it('should not be closed if addMember exists', () => {
    renderComponent({ addMember })
    expect(document.getElementById('team-add-member-dialog-title')).not.toBeNull()
  })

  it('should return an empty email if cancel', () => {
    renderComponent({ addMember })
    const email = 'test@example.com'
    expect((document.getElementById('team-add-member-dialog-button-add') as HTMLButtonElement).disabled).toBeTruthy()
    const emailInput = document.getElementById('team-add-member-dialog-field-email') as HTMLInputElement
    Simulate.change(emailInput, { target: { value: email } } as unknown as SyntheticEventData)
    expect((document.getElementById('team-add-member-dialog-button-add') as HTMLButtonElement).disabled).toBeFalsy()
    const cancelButton = document.getElementById('team-add-member-dialog-button-cancel')
    triggerMouseEvent('click', cancelButton)
    expect(addMember.onMemberInvited).toHaveBeenCalledTimes(1)
    expect(addMember.onMemberInvited).toHaveBeenCalledWith(null)
  })

  it('should return the email if validated', () => {
    renderComponent({ addMember })
    const email = 'test@example.com'
    expect((document.getElementById('team-add-member-dialog-button-add') as HTMLButtonElement).disabled).toBeTruthy()
    const emailInput = document.getElementById('team-add-member-dialog-field-email') as HTMLInputElement
    const adminCheckbox = document.getElementById('team-add-member-dialog-checkbox-admin')
    Simulate.change(emailInput, { target: { value: email } } as unknown as SyntheticEventData)
    triggerMouseEvent('click', adminCheckbox)
    expect((document.getElementById('team-add-member-dialog-button-add') as HTMLButtonElement).disabled).toBeFalsy()
    const addButton = document.getElementById('team-add-member-dialog-button-add')
    triggerMouseEvent('click', addButton)
    expect(addMember.onMemberInvited).toHaveBeenCalledTimes(1)
    expect(addMember.onMemberInvited).toHaveBeenCalledWith({ email, role: TeamMemberRole.admin, team: addMember.team })
  })
})
