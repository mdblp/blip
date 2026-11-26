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

import { DatumType, type Fill } from '../../../../src'
import { splitFillsByHour } from '../../../../src/domains/repositories/medical/datum/fill.service'

describe('Fill service', () => {
  describe('splitFillsByHour', () => {
    const buildFill = (start: string, end?: string): Fill => ({
      id: `fill-${start}`,
      type: DatumType.Fill,
      normalTime: start,
      epoch: new Date(start).valueOf(),
      epochEnd: end ? new Date(end).valueOf() : undefined,
      timezone: 'UTC',
      startsAtMidnight: true
    }) as Fill
    const getUtc = (): string => 'UTC'

    it('should split each time slot into one-hour slots, only the first one starting at midnight', () => {
      const hourlyFills = splitFillsByHour([
        buildFill('2023-01-01T00:00:00.000Z', '2023-01-01T03:00:00.000Z'),
        buildFill('2023-01-01T03:00:00.000Z', '2023-01-01T06:00:00.000Z')
      ], getUtc)

      expect(hourlyFills.map((fill) => fill.id)).toEqual([
        'fill-2023-01-01T00:00:00.000Z',
        'fill-2023-01-01T00:00:00.000Z-h1',
        'fill-2023-01-01T00:00:00.000Z-h2',
        'fill-2023-01-01T03:00:00.000Z',
        'fill-2023-01-01T03:00:00.000Z-h1',
        'fill-2023-01-01T03:00:00.000Z-h2'
      ])
      expect(hourlyFills.map((fill) => fill.startsAtMidnight)).toEqual([true, false, false, true, false, false])
      expect(hourlyFills[1].epoch).toBe(new Date('2023-01-01T01:00:00.000Z').valueOf())
      expect(hourlyFills[0].epochEnd).toBe(new Date('2023-01-01T01:00:00.000Z').valueOf())
      expect(hourlyFills[2].epochEnd).toBe(new Date('2023-01-01T03:00:00.000Z').valueOf())
    })

    it('should follow the real duration of a time slot affected by a daylight saving time change', () => {
      // 2 real hours in Europe/Paris on 2023-03-26, from 00:00 to 03:00 local time
      const hourlyFills = splitFillsByHour([buildFill('2023-03-25T23:00:00.000Z', '2023-03-26T01:00:00.000Z')], getUtc)

      expect(hourlyFills).toHaveLength(2)
    })

    it('should give each one-hour slot the timezone in effect at its start', () => {
      const timezoneChange = new Date('2023-01-01T09:30:00.000Z').valueOf()
      const fill = { ...buildFill('2023-01-01T08:00:00.000Z', '2023-01-01T12:00:00.000Z'), timezone: 'Europe/Paris' }

      const hourlyFills = splitFillsByHour([fill], (epoch: number) => epoch < timezoneChange ? 'Europe/Paris' : 'UTC')

      expect(hourlyFills.map((hourlyFill) => hourlyFill.timezone)).toEqual(['Europe/Paris', 'Europe/Paris', 'UTC', 'UTC'])
    })

    it('should keep a time slot without end as is', () => {
      const fill = buildFill('2023-01-01T00:00:00.000Z')

      expect(splitFillsByHour([fill], getUtc)).toEqual([fill])
    })
  })
})
