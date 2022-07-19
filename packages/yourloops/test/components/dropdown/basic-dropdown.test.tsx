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

import ThemeProvider from '@material-ui/styles/ThemeProvider'
import React from 'react'
import renderer from 'react-test-renderer'
import BasicDropdown, { BasicDropdownProps } from '../../../components/dropdown/basic-dropdown'
import { getTheme } from '../../../components/theme'

describe('BasicDropdown', () => {
  const spyOnSelect = jest.fn()

  function renderBasicDropdown(props: BasicDropdownProps) {
    return renderer.create(
      <ThemeProvider theme={getTheme()}>
        <BasicDropdown
          id={props.id}
          onSelect={props.onSelect}
          defaultValue={props.defaultValue}
          values={props.values}
        />
      </ThemeProvider>
    )
  }

  it('should call onSelect spy when an option is selected', () => {
    const defaultValue = 'defaultValue'
    const valueToSelect = 'valueToSelect'
    const id = 'id'
    const values = [defaultValue, valueToSelect]
    const props: BasicDropdownProps = {
      onSelect: spyOnSelect,
      defaultValue,
      values,
      id
    }
    const component = renderBasicDropdown(props)
    component.root.findByProps({ id: `basic-dropdown-${id}-selector` }).props.onChange({ target: { value: valueToSelect } })
    expect(spyOnSelect).toHaveBeenCalledWith(valueToSelect)
  })
})
