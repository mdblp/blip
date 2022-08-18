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

import { renderHook } from '@testing-library/react-hooks'
import { useInvalidRoute } from '../../components/invalid-route.hook'
import * as utils from '../../lib/utils'

const mockPush = jest.fn()
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush
  })
}))

describe('Invalid Route hook', () => {
  const preventDefaultMock = jest.fn()
  const setPageTitleSpy = jest.spyOn(utils, 'setPageTitle').mockReturnValue(null)
  const event = { preventDefault: preventDefaultMock } as unknown as React.MouseEvent<HTMLAnchorElement>

  describe('handleRedirect', () => {
    it('should redirect to / when no defaultValue is given', () => {
      const { result } = renderHook(() => useInvalidRoute())

      result.current.handleRedirect(event)

      expect(preventDefaultMock).toBeCalled()
      expect(mockPush).toBeCalledWith('/')
      expect(setPageTitleSpy).toBeCalled()
    })

    it('should redirect to defaultValue when defaultValue is given', () => {
      const defaultValue = 'defaultValue'
      const { result } = renderHook(() => useInvalidRoute(defaultValue))

      result.current.handleRedirect(event)

      expect(preventDefaultMock).toBeCalled()
      expect(mockPush).toBeCalledWith(defaultValue)
      expect(setPageTitleSpy).toBeCalled()
    })
  })
})
