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

import { createIdGenerator } from './id-generator.util'

describe('createIdGenerator', () => {
  const idGen = createIdGenerator('nightMode')

  it('should generate the ids from the prefix', () => {
    expect(idGen.groupId({ id: 'abc' })).toBe('nightMode_group_abc')
    expect(idGen.elementId({ id: 'abc' }, 'rect')).toBe('nightMode_rect_abc')
    expect(idGen.testId({ id: 'abc', guid: 'xyz' })).toBe('nightMode_group_xyz')
    expect(idGen.groupSelector()).toBe('d3-nightMode-group')
  })

  it('should prefix the ids with the scope', () => {
    const ids = idGen.scoped('poolBG')

    expect(ids.groupId({ id: 'abc' })).toBe('poolBG_nightMode_group_abc')
    expect(ids.elementId({ id: 'abc' }, 'rect')).toBe('poolBG_nightMode_rect_abc')
    expect(ids.testId({ id: 'abc' })).toBe('poolBG_nightMode_group_abc')
    expect(ids.testId({ id: 'abc' }, 'line')).toBe('poolBG_nightMode_line_abc')
  })
})
