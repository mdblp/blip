/**
 * Copyright (c) 2022, Diabeloop
 * Switch role from caregiver to HCP dialog - Request profession tests
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

import { HcpProfession, HcpProfessionList } from '../../../models/hcp-profession'
import { SwitchRoleProfessionDialogProps } from '../../../components/switch-role/models'
import SwitchRoleProfessionDialog from '../../../components/switch-role/profession-dialog'

describe('Profession dialog', () => {
  const onAccept = jest.fn()
  const onCancel = jest.fn()
  const defaultProps: SwitchRoleProfessionDialogProps = {
    open: true,
    onAccept,
    onCancel
  }

  let container: HTMLDivElement | null = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    onAccept.mockReset()
    onCancel.mockReset()
    if (container) {
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
      container = null
    }
  })

  function render(props: SwitchRoleProfessionDialogProps) {
    return act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <SwitchRoleProfessionDialog
            {...props}
          />, container, resolve)
      })
    })
  }

  it('should not render when not opened', async () => {
    await render({ ...defaultProps, open: false })
    const component = document.getElementById('switch-role-profession-dialog')
    expect(component).toBeNull()
  })

  it('should be able to render', async () => {
    await render(defaultProps)
    const component = document.getElementById('switch-role-profession-dialog')
    expect(component).not.toBeNull()
  })

  it('should call onCancel', async () => {
    await render(defaultProps)
    const cancelButton = document.getElementById('switch-role-profession-dialog-button-decline')
    expect(cancelButton).not.toBeNull()
    cancelButton.click()
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should not allowed to validate when no profession is selected', async () => {
    await render(defaultProps)
    const okButton = document.getElementById('switch-role-profession-dialog-button-validate')
    expect(okButton).not.toBeNull()
    expect(okButton.getAttribute('disabled')).not.toBeNull()
  })

  it('should enable accept button when an option is selected', async () => {
    await render(defaultProps)
    const validProfessions = HcpProfessionList.filter(item => item !== HcpProfession.empty)
    const clickEvent = new MouseEvent('mousedown', { button: 0, buttons: 1, bubbles: true })
    document.getElementById('dropdown-profession-selector').dispatchEvent(clickEvent)
    for (const profession of validProfessions) {
      const opt = document.getElementById(`dropdown-profession-menuitem-${profession}`)
      expect(opt).not.toBeNull()
    }
    const selectedProfession = validProfessions[0]
    const oneOption = document.getElementById(`dropdown-profession-menuitem-${selectedProfession}`)
    oneOption.click()

    const okButton = document.getElementById('switch-role-profession-dialog-button-validate')
    expect(okButton.getAttribute('disabled')).toBeNull()
    okButton.click()

    expect(onAccept).toHaveBeenCalledTimes(1)
    expect(onAccept.mock.calls[0][0]).toBe(selectedProfession)
  })
})
