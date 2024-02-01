/*
 * Copyright (c) 2022-2024, Diabeloop
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

import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import OnError from '../../../../app/error'
import ErrorApi from '../../../../lib/error/error.api'
import { act, render, screen } from '@testing-library/react'
import * as uuidMocked from 'uuid'
import * as deviceDetect from 'react-device-detect'
import userEvent from '@testing-library/user-event'

jest.mock('uuid')
describe('Error page', () => {
  const event = 'fakeEvent'
  const source = 'fakeSource'
  const lineno = 12
  const colno = 56
  const error = 'This is the error we are supposed to throw to harbour'
  const url = '/daily'

  function renderErrorPage() {
    render(
      <MemoryRouter initialEntries={[url]}>
        <OnError event={event} source={source} lineno={lineno} colno={colno} error={Error(error)} />
      </MemoryRouter>
    )
  }

  it('should display correct information and send error to bff', async () => {
    const errorId = 'FakeErrorId'
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)
    jest.spyOn(uuidMocked, 'v4').mockReturnValueOnce(errorId)
    jest.spyOn(uuidMocked, 'v4').mockReturnValueOnce('wrongErrorId')
    Object.defineProperty(deviceDetect, 'isChrome', { get: () => false })
    Object.defineProperty(deviceDetect, 'isDesktop', { get: () => true })

    const expectPayload = {
      browserName: expect.any(String),
      browserVersion: expect.any(String),
      date: expect.any(String),
      err: expect.stringContaining(error),
      errorId: errorId,
      path: url
    }

    await act(async () => {
      renderErrorPage()
    })
    expect(screen.getByRole('dialog')).toHaveTextContent(`Sorry! Something went wrong.For a better user experience, it is advised to use Google Chrome on desktop.Please contact YourLoops support and forward the error ID to them:${errorId}`)
    const showMoreInfoButton = screen.getByText('Show more information')
    await userEvent.click(showMoreInfoButton)
    expect(screen.getByRole('dialog')).toHaveTextContent(`Sorry! Something went wrong.For a better user experience, it is advised to use Google Chrome on desktop.Please contact YourLoops support and forward the error ID to them:${errorId}`)
    expect(screen.getByTestId('error-stacktrace')).toHaveTextContent(/fakeEvent Source: fakeSource:12:56 Error: This is the error we are supposed to throw to harbour Stack: Error: This is the error we are supposed to throw to harbour/)
    expect(ErrorApi.sendError).toHaveBeenCalledWith(expectPayload)
    expect(screen.queryByText('Show more information')).not.toBeInTheDocument()
    jest.spyOn(uuidMocked, 'v4').mockReset()
  })

  it('should not display message about using chrome when already on chrome desktop', async () => {
    const errorId = 'FakeErrorId'
    jest.spyOn(ErrorApi, 'sendError').mockResolvedValue(null)
    jest.spyOn(uuidMocked, 'v4').mockReturnValueOnce(errorId)

    Object.defineProperty(deviceDetect, 'isChrome', { get: () => true })
    Object.defineProperty(deviceDetect, 'isDesktop', { get: () => true })

    await act(async () => {
      renderErrorPage()
    })
    expect(screen.getByRole('dialog')).toHaveTextContent(`Sorry! Something went wrong.Please contact YourLoops support and forward the error ID to them:${errorId}`)
  })
})
