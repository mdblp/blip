/*
 * Copyright (c) 2021-2026, Diabeloop
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

import config from '../../../lib/config/config'
import metrics from '../../../lib/metrics'
import { loggedInUsers } from '../common'

describe('Metrics', () => {
  afterAll(() => {
    delete window._paq
    config.METRICS_SERVICE = 'disabled'
  })
  beforeEach(() => {
    config.METRICS_SERVICE = 'matomo'
    window._paq = []
  })

  it('should do nothing if metrics is not available', () => {
    delete window._paq
    metrics.send('metrics', 'enabled')
    expect(window._paq).toBeUndefined()
  })

  it('should disable the metrics', () => {
    metrics.send('metrics', 'disabled')
    metrics.send('test', 'you should not see me')
    expect(window._paq).toEqual([
      ['forgetConsentGiven'],
      ['setDoNotTrack', true]
    ])
  })

  it('should enable the metrics', () => {
    metrics.send('metrics', 'enabled')
    metrics.send('test', 'you should see me')
    expect(window._paq).toBeInstanceOf(Array)
    if (window._paq) { // Make typescript happy
      // eslint-disable-next-line no-magic-numbers,jest/no-conditional-expect
      expect(window._paq.length).toBe(8)
    }
  })

  it('should update matomo page URL', () => {
    metrics.send('metrics', 'setCustomUrl', location.pathname)
    expect(window._paq).toBeInstanceOf(Array)
    if (window._paq) { // Make typescript happy
      // eslint-disable-next-line jest/no-conditional-expect
      expect(window._paq.length).toBe(1)
      // eslint-disable-next-line jest/no-conditional-expect
      expect(window._paq[0].length).toBe(2)
      // eslint-disable-next-line jest/no-conditional-expect
      expect(window._paq[0][0]).toBe('setCustomUrl')
      // eslint-disable-next-line jest/no-conditional-expect
      expect(typeof window._paq[0][1]).toBe('string')
    }
  })

  it('should set trackPageView', () => {
    metrics.send('metrics', 'trackPageView')
    expect(window._paq.length).toBe(1)
    expect(window._paq[0].length).toBe(1)
    expect(window._paq[0][0]).toBe('trackPageView')
  })

  it('trackSiteSearch should have a specific call', () => {
    metrics.send('trackSiteSearch', 'action', 'value', 2)
    expect(window._paq.length).toBe(1)
    expect(window._paq[0].length).toBe(4)
    expect(window._paq[0][0]).toBe('trackSiteSearch')
    expect(window._paq[0][1]).toBe('action')
    expect(window._paq[0][2]).toBe('value')
    expect(window._paq[0][3]).toBe(2)
  })

  it('should set the userId', () => {
    const user = loggedInUsers.getCaregiver()
    metrics.setUser(user)
    expect(window._paq).toEqual([
      ['setUserId', user.id],
      ['setCustomVariable', 1, 'UserRole', user.role, 'page'],
      ['trackEvent', 'registration', 'login', user.role]
    ])
  })

  it('shouldmockReset() the userId', () => {
    metrics.resetUser()
    expect(window._paq).toEqual([
      ['trackEvent', 'registration', 'logout'],
      ['deleteCustomVariable', 1, 'page'],
      ['resetUserId'],
      ['deleteCookies']
    ])
  })

  it('should set the setDocumentTitle', () => {
    metrics.send('metrics', 'setDocumentTitle', 'title')
    expect(window._paq).toEqual([['setDocumentTitle', 'title']])
  })

  it('should set the properties to a default value', () => {
    metrics.send('test_category', 'test_action', 'test_name', 2)
    expect(window._paq).toEqual([['trackEvent', 'test_category', 'test_action', 'test_name', 2]])
  })

  it('should set the global language var', () => {
    metrics.setLanguage('de')
    expect(window._paq).toEqual([['setCustomVariable', 1, 'UserLang', 'de', 'visit']])
  })

  it('should measure performance with the timer functions', () => {
    metrics.startTimer('test')
    metrics.endTimer('test')
    expect(window._paq.length).toBe(1)
    expect(window._paq[0].length).toBe(5)
    expect(window._paq[0][0]).toBe('trackEvent')
    expect(window._paq[0][1]).toBe('performance')
    expect(window._paq[0][2]).toBe('test')
    expect(typeof window._paq[0][3]).toBe('string')
    expect(window._paq[0][3]).toMatch(/\/.*/)
    expect(window._paq[0][4]).toBeGreaterThanOrEqual(0)
  })
})
