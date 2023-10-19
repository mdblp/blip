/*
 * Copyright (c) 2023, Diabeloop
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


import { isBrowserOfficiallySupported } from '../../../lib/browser'
import * as deviceDetect from 'react-device-detect'

describe('Browser', () => {

  it('isBrowserOfficiallySupported should return true when browser is chrome on desktop', () => {
    Object.defineProperty(deviceDetect, 'isChrome', { get: () => true })
    Object.defineProperty(deviceDetect, 'isDesktop', { get: () => true })
    expect(isBrowserOfficiallySupported()).toBeTruthy()
  })

  it('isBrowserOfficiallySupported should return false when browser is chrome but not on desktop', () => {
    Object.defineProperty(deviceDetect, 'isChrome', { get: () => true })
    Object.defineProperty(deviceDetect, 'isDesktop', { get: () => false })
    expect(isBrowserOfficiallySupported()).toBeFalsy()
  })

  it('isBrowserOfficiallySupported should return false when browser is not chrome but on desktop', () => {
    Object.defineProperty(deviceDetect, 'isChrome', { get: () => false })
    Object.defineProperty(deviceDetect, 'isDesktop', { get: () => true })
    expect(isBrowserOfficiallySupported()).toBeFalsy()
  })

  it('isBrowserOfficiallySupported should return false when browser is not chrome and not on desktop', () => {
    Object.defineProperty(deviceDetect, 'isChrome', { get: () => false })
    Object.defineProperty(deviceDetect, 'isDesktop', { get: () => false })
    expect(isBrowserOfficiallySupported()).toBeFalsy()
  })
})
