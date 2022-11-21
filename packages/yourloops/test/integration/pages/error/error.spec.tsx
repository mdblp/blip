/*
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

import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import React from 'react'
import OnError from '../../../../app/error'
import ErrorApi from '../../../../lib/error/error-api'
import { act, render, screen } from '@testing-library/react'

import crypto from 'crypto'
import userEvent from '@testing-library/user-event'

// window.crypto is not defined in jest...
Object.defineProperty(global, 'crypto', {
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
})

describe('Error page', () => {
  const event = 'fakeEvent'
  const source = 'fakeSource'
  const lineno = 12
  const colno = 56
  const error = 'This is the error we are supposed to throw to harbour'
  const url = '/daily'

  function renderErrorPage() {
    const history = createMemoryHistory({ initialEntries: [url] })
    render(
      <Router history={history}>
        <OnError event={event} source={source} lineno={lineno} colno={colno} error={Error(error)} />
      </Router>
    )
  }

  it('should display correct information and send error to bff', async () => {
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)

    const expectPayload = {
      browserName: expect.any(String),
      browserVersion: expect.any(String),
      date: expect.any(String),
      err: error,
      errorId: expect.any(String),
      path: url
    }

    await act(async () => {
      renderErrorPage()
    })
    expect(screen.getByText('Sorry! Something went wrong.')).toBeVisible()
    expect(screen.getByText('Please contact yourloops support and forward them the error id:')).toBeVisible()
    const showMoreInfoButton = screen.getByText('Show more information')
    userEvent.click(showMoreInfoButton)
    expect(screen.getByTestId('error-stacktrace')).toHaveTextContent(/fakeEvent Source: fakeSource:12:56 Error: This is the error we are supposed to throw to harbour Stack: Error: This is the error we are supposed to throw to harbour/)
    expect(ErrorApi.sendError).toBeCalledWith(expectPayload)
    expect(screen.queryByText('Show more information')).not.toBeInTheDocument()
  })
})
