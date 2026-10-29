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

import { getDisplayVersion } from '../../../../lib/config/version'

describe('getDisplayVersion', () => {
  it('should remove the commit id suffix of a tagged build', () => {
    expect(getDisplayVersion('v3.11.0-a1b2c3d')).toBe('v3.11.0')
  })

  it('should handle a version without leading v', () => {
    expect(getDisplayVersion('3.11.0-a1b2c3d')).toBe('v3.11.0')
  })

  it('should keep a pre-release tag', () => {
    expect(getDisplayVersion('v3.11.0-beta-a1b2c3d')).toBe('v3.11.0-beta')
  })

  it('should display an untagged build as is', () => {
    expect(getDisplayVersion('460db25')).toBe('460db25')
  })

  it('should add a single v to a plain version', () => {
    expect(getDisplayVersion('3.11.0')).toBe('v3.11.0')
    expect(getDisplayVersion('v3.11.0')).toBe('v3.11.0')
  })
})
