/**
 * Copyright (c) 2021, Diabeloop
 * HCP team edit dialog tests
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

import _ from 'lodash'
import React from 'react'

import { Team, TeamMember } from '../../../../lib/team'
import TeamEditDialog, { TeamEditModalProps } from '../../../../pages/hcp/team-edit-dialog'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate, SyntheticEventData } from 'react-dom/test-utils'
import { triggerMouseEvent } from '../../common/utils'

describe('TeamEditDialog', () => {
  const defaultProps: TeamEditModalProps = {
    teamToEdit: {
      team: {
        name: 'fakeTeamName',
        phone: 'fakeTeamPhone',
        email: 'fake@team.email',
        address: {
          line1: 'fakeLine1',
          line2: 'fakeLine2',
          zip: 'fakeZip',
          city: 'fakeCity',
          country: 'FR'
        }
      } as Team,
      onSaveTeam: jest.fn()
    }
  }
  const textFieldIds = [
    'team-edit-dialog-field-name',
    'team-edit-dialog-field-line1',
    'team-edit-dialog-field-line2',
    'team-edit-dialog-field-zip',
    'team-edit-dialog-field-city',
    'team-edit-dialog-field-phone',
    'team-edit-dialog-field-email'
  ]
  /** paths to be used with lodash.get(...) */
  const textFieldTeamPath = ['name', 'address.line1', 'address.line2', 'address.zip', 'address.city', 'phone', 'email']

  let container: HTMLElement | null = null

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

  function mountComponent(props: TeamEditModalProps = defaultProps): void {
    act(() => {
      render(<TeamEditDialog teamToEdit={props.teamToEdit} />, container)
    })
  }

  it('should be closed if teamToEdit is null', () => {
    mountComponent({ teamToEdit: null })
    expect(document.getElementById('team-edit-dialog')).toBeNull()
  })

  it('should not be closed if teamToEdit exists', () => {
    mountComponent()
    expect(document.getElementById('team-edit-dialog')).not.toBeNull()
  })

  it('should fill fields when editing a team', () => {
    mountComponent()
    textFieldIds.forEach((id: string, index: number) => {
      const field: HTMLInputElement = document.getElementById(id) as HTMLInputElement
      expect(field.value).toBe(_.get(defaultProps.teamToEdit.team, textFieldTeamPath[index]))
    })
    expect((document.getElementById('team-edit-dialog-button-validate') as HTMLButtonElement).disabled).toBeFalsy()
  })

  it('should have empty fields when creating a new team', () => {
    mountComponent({ teamToEdit: { team: null, onSaveTeam: jest.fn() } })
    textFieldIds.forEach((id: string) => {
      const field: HTMLInputElement = document.getElementById(id) as HTMLInputElement
      expect(field.value).toBe('')
    })
  })

  it('should not allow to validate if a require info is missing', () => {
    mountComponent()
    const event = {
      target: {
        name: 'name',
        value: ''
      }
    }
    const nameInput = document.getElementById('team-edit-dialog-field-name')
    Simulate.change(nameInput, event as unknown as SyntheticEventData)
    expect((document.getElementById('team-edit-dialog-button-validate') as HTMLButtonElement).disabled).toBeTruthy()
  })

  it('should call the onSaveTeam callback method with null if cancel', () => {
    mountComponent()
    const closeButton = document.getElementById('team-edit-dialog-button-close')
    triggerMouseEvent('click', closeButton)

    expect((defaultProps.teamToEdit.onSaveTeam as jest.Mock)).toHaveBeenCalledTimes(1)
    expect((defaultProps.teamToEdit.onSaveTeam as jest.Mock)).toHaveBeenCalledWith(null)
  })

  it('should call the onSaveTeam callback method with the changes if validated', () => {
    mountComponent()
    const event = {
      target: {
        name: 'name',
        value: 'Updated name'
      }
    }
    const updatedTeam = { ...defaultProps.teamToEdit.team, members: [] as TeamMember[], name: event.target.value }

    const nameInput = document.getElementById('team-edit-dialog-field-name')
    Simulate.change(nameInput, event as unknown as SyntheticEventData)
    const saveButton = document.getElementById('team-edit-dialog-button-validate') as HTMLButtonElement
    expect(saveButton.disabled).toBeFalsy()

    triggerMouseEvent('click', saveButton)
    const spy = defaultProps.teamToEdit.onSaveTeam as jest.Mock
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(updatedTeam)
  })
})
