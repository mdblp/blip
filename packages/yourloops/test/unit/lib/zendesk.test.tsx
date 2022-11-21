/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { isZendeskActive, zendeskLogin, zendeskLogout, zendeskAllowCookies } from '../../../lib/zendesk'

describe('Zendesk', () => {
  beforeEach(() => {
    delete window.zE
    zendeskAllowCookies(false)
  })

  afterAll(() => {
    delete window.zE
  })

  it('should see zendesk as inactive if window.zE function is missing', () => {
    expect(isZendeskActive()).toBe(false)
  })

  it('should see zendesk as active if window.zE function is present', () => {
    window.zE = jest.fn()
    expect(isZendeskActive()).toBe(true)
  })

  it('should completely logout the zendesk user on logout', () => {
    const s = jest.fn()
    window.zE = s
    zendeskLogout()
    expect(s).toHaveBeenCalledTimes(3)
    expect(s.mock.calls[0]).toEqual(['webWidget', 'logout'])
    expect(s.mock.calls[1]).toEqual(['webWidget', 'clear'])
    expect(s.mock.calls[2]).toEqual(['webWidget', 'reset'])
  })

  it('should not ask zendesk to login if cookies are not accepted', () => {
    const s = jest.fn()
    window.zE = s
    zendeskLogin()
    expect(s).toHaveBeenCalledTimes(0)
  })

  it('should ask zendesk login if cookies are accepted', () => {
    zendeskAllowCookies(true)
    const s = jest.fn()
    window.zE = s
    zendeskLogin()
    expect(s).toHaveBeenCalledTimes(1)
    expect(s.mock.calls[0]).toEqual(['webWidget', 'helpCenter:reauthenticate'])
  })

  it('should notice zendesk about the cookies policy: accept', () => {
    const s = jest.fn()
    window.zE = s
    zendeskAllowCookies(true)
    expect(s).toHaveBeenCalledTimes(1)
    expect(s.mock.calls[0]).toEqual(['webWidget', 'updateSettings', { cookies: true }])
  })

  it('should notice zendesk about the cookies policy: decline', () => {
    const s = jest.fn()
    window.zE = s
    zendeskAllowCookies(false)
    expect(s).toHaveBeenCalledTimes(4)
    expect(s.mock.calls[0]).toEqual(['webWidget', 'updateSettings', { cookies: false }])
    expect(s.mock.calls[1]).toEqual(['webWidget', 'logout'])
    expect(s.mock.calls[2]).toEqual(['webWidget', 'clear'])
    expect(s.mock.calls[3]).toEqual(['webWidget', 'reset'])
  })
})
