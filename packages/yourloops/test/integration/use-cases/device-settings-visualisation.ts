/*
 * Copyright (c) 2023-2025, Diabeloop
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

import {
  checkChangeHistoryContent,
  checkCopyTextButton,
  checkCurrentParametersContent,
  checkDevicesMenuLayout, checkG2CopyTextButton, checkG2CurrentParametersContent,
  checkSafetyBasalProfileContent,
  checkSafetyBasalProfileErrorMessage
} from '../assert/device-view.assert'

export const testDevicesVisualisation = async () => {
  testDevicesMenuLayout()
  await testCurrentParametersVisualisation()
  await testBasalSafetyProfileVisualisation()
  await testChangeHistoryVisualisation()
}

export const testG2DevicesVisualisation = async () => {
  testDevicesMenuLayout()
  await testG2CurrentParametersVisualisation()
  await testBasalSafetyProfileVisualisation()
  await testChangeHistoryVisualisation()
}

export const testEmptySafetyBasalProfileGenericErrorMessage = async () => {
  await checkSafetyBasalProfileErrorMessage('The basal safety profile values are not available.')
}

export const testEmptySafetyBasalProfileDblg1ErrorMessage = async () => {
  await checkSafetyBasalProfileErrorMessage('The basal safety profile values are not available due to an outdated software version of the DBLG1. Updating the software version may resolve the issue.')
}

const testDevicesMenuLayout = () => {
  checkDevicesMenuLayout()
}

const testCurrentParametersVisualisation = async () => {
  checkCurrentParametersContent()
  await checkCopyTextButton()
}

const testG2CurrentParametersVisualisation = async () => {
  checkG2CurrentParametersContent()
  await checkG2CopyTextButton()
}

const testBasalSafetyProfileVisualisation = async () => {
  await checkSafetyBasalProfileContent()
}

const testChangeHistoryVisualisation = async () => {
  await checkChangeHistoryContent()
}
