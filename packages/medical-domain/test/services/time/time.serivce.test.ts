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
import { defaultWeekDaysFilter } from '../../../src/domains/models/time/date-filter.model'
import WeekDays from '../../../src/domains/models/time/enum/weekdays.enum'
import * as TimeService from '../../../src/domains/repositories/time/time.service'

describe('TimeService numberOfDays', () => {
  it('should return number of days when no week days are filtered ', () => {
    const start = new Date('2018-02-01T00:00:00.000Z').valueOf()
    const end = new Date('2018-02-02T00:00:00.000Z').valueOf()
    const fullWeekFilter = defaultWeekDaysFilter

    const oneDay = TimeService.numberOfDays(start, end)
    expect(oneDay).toBe(1)
    const onDayWithFullWeekFilter = TimeService.numberOfDays(start, end, fullWeekFilter)
    expect(onDayWithFullWeekFilter).toBe(1)
    const weekend = new Date('2018-02-08T00:00:00.000Z').valueOf()
    const oneWeek = TimeService.numberOfDays(start, weekend)
    expect(oneWeek).toBe(7)
    const oneWeekWithFullWeekFilter = TimeService.numberOfDays(start, weekend, fullWeekFilter)
    expect(oneWeekWithFullWeekFilter).toBe(7)
  })

  it('should return number of days when some week days are filtered ', () => {
    const start = new Date('2018-02-01T00:00:00.000Z').valueOf()
    const end = new Date('2018-02-02T00:00:00.000Z').valueOf()
    const weekFilter = defaultWeekDaysFilter
    // 2018-02-01 is a Thursday
    weekFilter[WeekDays.Thursday] = false
    weekFilter[WeekDays.Sunday] = false
    const oneDayWithDaysFiltered = TimeService.numberOfDays(start, end, weekFilter)
    expect(oneDayWithDaysFiltered).toBe(0)
    const weekend = new Date('2018-02-08T00:00:00.000Z').valueOf()
    const oneWeekWithDayFiltered = TimeService.numberOfDays(start, weekend, weekFilter)
    expect(oneWeekWithDayFiltered).toBe(5)
  })
})
