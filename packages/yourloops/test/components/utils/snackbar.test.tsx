/**
 * Copyright (c) 2021, Diabeloop
 * useSnackbar hook tests
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

import React from 'react'

import { renderHook, act } from '@testing-library/react-hooks/dom'

import { SnackbarContext, Snackbar, DefaultSnackbarContext } from '../../../components/utils/snackbar'
import { render } from '@testing-library/react'

describe('Snackbar', () => {
  const spies = {
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
    clear: jest.fn(),
    remove: jest.fn(),
    has: jest.fn().mockReturnValue(false)
  }
  const context: SnackbarContext = {
    ...spies,
    alerts: []
  }

  beforeEach(() => {
    spies.error.mockReset()
    spies.warning.mockReset()
    spies.info.mockReset()
    spies.success.mockReset()
    spies.clear.mockReset()
    spies.remove.mockReset()
    spies.has.mockReset()
    context.alerts = []
  })

  it('should renders without crashing', () => {
    const { result } = renderHook(() => <Snackbar {...context} />)
    expect(result).toBeDefined()
  })

  it('hook should return the needed functions', () => {
    const hook = renderHook(DefaultSnackbarContext)
    expect(hook.result.current.error).toBeInstanceOf(Function)
    expect(hook.result.current.warning).toBeInstanceOf(Function)
    expect(hook.result.current.info).toBeInstanceOf(Function)
    expect(hook.result.current.success).toBeInstanceOf(Function)
    expect(hook.result.current.clear).toBeInstanceOf(Function)
    expect(hook.result.current.remove).toBeInstanceOf(Function)
    expect(hook.result.current.has).toBeInstanceOf(Function)
    expect(hook.result.current.alerts).toBeInstanceOf(Array)
  })

  it('should render the alert if any', () => {
    const hook = renderHook(DefaultSnackbarContext)
    act(() => {
      hook.result.current.info('test')
    })
    const { container } = render(<Snackbar {...hook.result.current} />)
    expect(container.querySelector('#alert-message')).not.toBeNull()
  })
})
