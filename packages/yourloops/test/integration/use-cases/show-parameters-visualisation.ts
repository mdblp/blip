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

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  checkShowParametersButtonIsDisplayed,
  checkShowParametersButtonIsNotDisplayed,
  checkParametersPopoverIsOpen,
  checkParameterIsDisplayed,
} from '../assert/show-parameters.assert'

export const testShowParametersButtonIsDisplayed = async (): Promise<void> => {
  checkShowParametersButtonIsDisplayed()
}

export const testShowParametersButtonIsNotDisplayed = async (): Promise<void> => {
  checkShowParametersButtonIsNotDisplayed()
}

export const testOpenParametersPopover = async (): Promise<void> => {
  checkShowParametersButtonIsDisplayed()

  const button = screen.getByTestId('show-parameters-at-button')
  await userEvent.click(button)

  checkParametersPopoverIsOpen()
}

export const testDisplayEffectiveParametersWithAllData = async (): Promise<void> => {
  await testOpenParametersPopover()

  checkParameterIsDisplayed('PATIENT_GLY_HYPO_LIMIT', '60.0', 'mg/dL')
  checkParameterIsDisplayed('MEAL_RATIO_BREAKFAST_FACTOR', '110', '%')
  checkParameterIsDisplayed('MEAL_RATIO_DINNER_FACTOR', '90', '%')
}

export const testDisplayEffectiveParametersFromHistory = async (): Promise<void> => {
  await testOpenParametersPopover()

  checkParameterIsDisplayed('WEIGHT', '68.0', 'kg')
}
