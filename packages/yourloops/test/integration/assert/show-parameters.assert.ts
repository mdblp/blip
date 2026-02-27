/*
 * Copyright (c) 2026, Diabeloop
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

import { screen, within } from '@testing-library/react'
import { getTranslation } from '../../utils/i18n'

export const checkShowParametersButtonIsDisplayed = (): void => {
  const button = screen.getByTestId('show-parameters-at-button')
  expect(button).toBeVisible()
  expect(button).toHaveTextContent(getTranslation('show-parameters-at-title-button'))
}

export const checkShowParametersButtonIsNotDisplayed = (): void => {
  const button = screen.queryByTestId('show-parameters-at-button')
  expect(button).toBeNull()
}

export const checkParametersPopoverIsOpen = (): void => {
  const popover = screen.getByRole('presentation')
  expect(popover).toBeVisible()

  const header = within(popover).getByText(getTranslation('show-parameters-at-popover-header'))
  expect(header).toBeVisible()
}


export const checkParameterIsDisplayed = (paramName: string, value: string, unit: string): void => {
  const popover = screen.getByRole('presentation')
  const paramLabel = within(popover).getByText(getTranslation(paramName))
  expect(paramLabel).toBeVisible()

  const paramValue = within(popover).getByText(`${value} ${getTranslation(unit)}`)
  expect(paramValue).toBeVisible()
}
