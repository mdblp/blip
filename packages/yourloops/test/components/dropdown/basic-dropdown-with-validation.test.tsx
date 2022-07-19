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

import { fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'

import BasicDropdownWithValidation, {
  BasicDropdownWithValidationProps
} from '../../../components/dropdown/basic-dropdown-with-validation'

describe('BasicDropdownWithValidation', () => {
  const spyOnSelect = jest.fn()

  const Dropdown = (props: { content: BasicDropdownWithValidationProps<string> }): JSX.Element => {
    return (
      <BasicDropdownWithValidation
        id={props.content.id}
        onSelect={props.content.onSelect}
        defaultValue={props.content.defaultValue}
        disabledValues={props.content.disabledValues}
        values={props.content.values}
        inputTranslationKey={props.content.inputTranslationKey}
        errorTranslationKey={props.content.errorTranslationKey}
      />
    )
  }

  const fakeDropdown = (props: BasicDropdownWithValidationProps<string>): JSX.Element => {
    return (
      <Dropdown content={props} />
    )
  }

  it('should call onSelect spy when an option is selected', () => {
    const defaultValue = 'defaultValue'
    const disabledValue = 'disabledValue'
    const valueToSelect = 'valueToSelect'
    const id = 'id'
    const errorTranslationKey = 'errorTranslationKey'
    const inputTranslationKey = 'inputTranslationKey'
    const values = [defaultValue, disabledValue, valueToSelect]
    const props: BasicDropdownWithValidationProps<string> = {
      onSelect: spyOnSelect,
      defaultValue,
      disabledValues: [disabledValue],
      values,
      id,
      errorTranslationKey,
      inputTranslationKey
    }
    render(fakeDropdown(props))
    fireEvent.mouseDown(screen.getByRole('button'))
    const menuItems = within(screen.getByRole('listbox'))
    fireEvent.click(menuItems.getByText(valueToSelect))
    expect(spyOnSelect).toHaveBeenCalledTimes(1)
  })
})
