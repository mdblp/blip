/*
 * Copyright (c) 2023-2025, Diabeloop
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

import {
  addDuration, convertValueToHours,
  convertValueToMinutes,
  formatClocktimeFromMsPer24,
  formatDate,
  formatDuration,
  formatLocalizedFromUTC,
  getTimezoneFromTimePrefs,
  ONE_HOUR_MS
} from './datetime.util'
import { DurationUnit, type TimePrefs } from 'medical-domain'

const ONE_MIN_MS = 6e4

describe('DatetimeUtil', () => {
  describe('addDuration', () => {
    it('should add a specified duration to a date string fdsfsd', () => {
      const start = '2017-11-10T00:00:00.000Z'
      const expectedDate = '2017-11-10T00:01:00.000Z'
      const receivedDate = addDuration(start, ONE_MIN_MS)
      expect(receivedDate).toEqual(expectedDate)
    })
  })

  describe('getTimezoneFromTimePrefs', () => {
    it('should return the `timezoneName` when timezoneAware is true', () => {
      const tz = 'Europe/Budapest'
      const timePrefs = {
        timezoneAware: true,
        timezoneName: tz
      } as TimePrefs
      const timezoneReceived = getTimezoneFromTimePrefs(timePrefs)
      expect(timezoneReceived).toEqual(tz)
    })

    it('should return `UTC` if timezoneAware is true but no timezoneName given', () => {
      const timePrefs = {
        timezoneAware: true
      } as TimePrefs
      const expectedTimezone = 'UTC'

      jest.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
        resolvedOptions: () => ({ timeZone: undefined })
      } as unknown as Intl.DateTimeFormat)

      const receivedTimezone = getTimezoneFromTimePrefs(timePrefs)
      expect(receivedTimezone).toEqual(expectedTimezone)
    })
  })

  describe('formatDuration', () => {
    const condensed = true

    it('should properly format a 30 minute duration', () => {
      expect(formatDuration(36e5 / 2)).toEqual('30 min')
      expect(formatDuration(36e5 / 2, condensed)).toEqual('30m')
    })

    it('should properly format a 1 hr duration', () => {
      expect(formatDuration(36e5)).toEqual('1 h')
      expect(formatDuration(36e5, condensed)).toEqual('1h')
    })

    it('should properly format a 1.25 hr duration', () => {
      expect(formatDuration(36e5 + 36e5 / 4)).toEqual('1¼ h')
      expect(formatDuration(36e5 + 36e5 / 4, condensed)).toEqual('1h 15m')
    })

    it('should properly format a 1.33333 hr duration', () => {
      expect(formatDuration(36e5 + 36e5 / 3)).toEqual('1⅓ h')
      expect(formatDuration(36e5 + 36e5 / 3, condensed)).toEqual('1h 20m')
    })

    it('should properly format a 1.5 hr duration', () => {
      expect(formatDuration(36e5 + 36e5 / 2)).toEqual('1½ h')
      expect(formatDuration(36e5 + 36e5 / 2, condensed)).toEqual('1h 30m')
    })

    it('should properly format a 1.66667 hr duration', () => {
      expect(formatDuration(36e5 + 36e5 * (2 / 3))).toEqual('1⅔ h')
      expect(formatDuration(36e5 + 36e5 * (2 / 3), condensed)).toEqual('1h 40m')
    })

    it('should properly format a 1.75 hr duration', () => {
      expect(formatDuration(36e5 + 36e5 * (3 / 4))).toEqual('1¾ h')
      expect(formatDuration(36e5 + 36e5 * (3 / 4), condensed)).toEqual('1h 45m')
    })

    it('should properly format a 1.1 hr duration', () => {
      expect(formatDuration(36e5 + 36e5 / 10)).toEqual('1 h 6 min')
      expect(formatDuration(36e5 + 36e5 / 10, condensed)).toEqual('1h 6m')
    })

    it('should properly format a 2 hr duration', () => {
      expect(formatDuration(2 * 36e5)).toEqual('2 h')
      expect(formatDuration(2 * 36e5, condensed)).toEqual('2h')
    })

    it('should properly format a 2.25 hr duration', () => {
      expect(formatDuration(2 * 36e5 + 36e5 / 4)).toEqual('2¼ h')
      expect(formatDuration(2 * 36e5 + 36e5 / 4, condensed)).toEqual('2h 15m')
    })

    it('should properly format a 2.33333 hr duration', () => {
      expect(formatDuration(2 * 36e5 + 36e5 / 3)).toEqual('2⅓ h')
      expect(formatDuration(2 * 36e5 + 36e5 / 3, condensed)).toEqual('2h 20m')
    })

    it('should properly format a 2.5 hr duration', () => {
      expect(formatDuration(2 * 36e5 + 36e5 / 2)).toEqual('2½ h')
      expect(formatDuration(2 * 36e5 + 36e5 / 2, condensed)).toEqual('2h 30m')
    })

    it('should properly format a 2.66667 hr duration', () => {
      expect(formatDuration(2 * 36e5 + 36e5 * (2 / 3))).toEqual('2⅔ h')
      expect(formatDuration(2 * 36e5 + 36e5 * (2 / 3), condensed)).toEqual('2h 40m')
    })

    it('should properly format a 2.75 hr duration', () => {
      expect(formatDuration(2 * 36e5 + 36e5 * (3 / 4))).toEqual('2¾ h')
      expect(formatDuration(2 * 36e5 + 36e5 * (3 / 4), condensed)).toEqual('2h 45m')
    })

    it('should properly format a 2.1 hr duration', () => {
      expect(formatDuration(2 * 36e5 + 36e5 / 10)).toEqual('2 h 6 min')
      expect(formatDuration(2 * 36e5 + 36e5 / 10, condensed)).toEqual('2h 6m')
    })

    it('should properly format a 2.5 day duration with condensed formatting', () => {
      expect(formatDuration(60 * 36e5, condensed)).toEqual('2d 12h')
    })

    it('should properly round minute durations with condensed formatting', () => {
      expect(formatDuration(ONE_MIN_MS * 1.49, condensed)).toEqual('1m')
      expect(formatDuration(ONE_MIN_MS * 1.5, condensed)).toEqual('2m')
      expect(formatDuration(ONE_MIN_MS * 59.4, condensed)).toEqual('59m')
      expect(formatDuration(ONE_MIN_MS * 59.5, condensed)).toEqual('1h')
    })

    it('should properly round 23+ hour durations to the next day when within 30 seconds of the next day with condensed formatting', () => {
      const ONE_SEC_MS = 1e3

      expect(formatDuration(ONE_HOUR_MS * 23 + ONE_MIN_MS * 59 + ONE_SEC_MS * 29, condensed)).toEqual('23h 59m')
      expect(formatDuration(ONE_HOUR_MS * 23 + ONE_MIN_MS * 59 + ONE_SEC_MS * 30, condensed)).toEqual('1d')
    })

    it('should properly format a 2.55 day duration with condensed formatting', () => {
      expect(formatDuration(60 * 36e5 + 36e5 / 2, condensed)).toEqual('2d 12h 30m')
    })

    it('should return number of seconds when there is < 1m with condensed formatting', () => {
      expect(formatDuration(36e5 / 60 / 60 * 30, condensed)).toEqual('30s')
    })

    it('should return `0m` when zero time is passed in with condensed formatting', () => {
      expect(formatDuration(0, condensed)).toEqual('0m')
    })
  })

  describe('formatLocalizedFromUTC', () => {
    const tzAwareLA = {
      timezoneAware: true,
      timezoneName: 'America/Los_Angeles'
    } as TimePrefs
    const tzAwareNY = {
      timezoneAware: true,
      timezoneName: 'America/New_York'
    } as TimePrefs
    const tzUnaware = {
      timezoneAware: false
    } as TimePrefs
    const utcString = '2016-09-05T04:00:00Z'
    const utcAsNumber = Date.parse(utcString)

    it('should return "Sunday, September 4" for utcAsNumber tzAware LA', () => {
      expect(formatLocalizedFromUTC(utcAsNumber, tzAwareLA))
        .toEqual('Sunday, September 4')
    })

    it('should return "Sunday, September 4" for utcString tzAware LA', () => {
      expect(formatLocalizedFromUTC(utcString, tzAwareLA))
        .toEqual('Sunday, September 4')
    })

    it('should return "Monday, September 5" for utcAsNumber tzAware NY', () => {
      expect(formatLocalizedFromUTC(utcAsNumber, tzAwareNY))
        .toEqual('Monday, September 5')
    })

    it('should return "Monday, September 5" for utcString tzAware NY', () => {
      expect(formatLocalizedFromUTC(utcString, tzAwareNY))
        .toEqual('Monday, September 5')
    })

    it('should return "Monday, September 5" for utcAsNumber tzUnaware', () => {
      expect(formatLocalizedFromUTC(utcAsNumber, tzUnaware))
        .toEqual('Monday, September 5')
    })

    it('should return "Monday, September 5" for utcString tzUnaware', () => {
      expect(formatLocalizedFromUTC(utcString, tzUnaware))
        .toEqual('Monday, September 5')
    })

    it('should return "Sep 4" for utcAsNumber tzAware LA "MMM D"', () => {
      expect(formatLocalizedFromUTC(utcAsNumber, tzAwareLA, 'MMM D'))
        .toEqual('Sep 4')
    })

    it('should return "Sep 4" for utcString tzAware LA "MMM D"', () => {
      expect(formatLocalizedFromUTC(utcString, tzAwareLA, 'MMM D'))
        .toEqual('Sep 4')
    })

    it('should return "Sep 5" for utcAsNumber tzAware NY "MMM D"', () => {
      expect(formatLocalizedFromUTC(utcAsNumber, tzAwareNY, 'MMM D'))
        .toEqual('Sep 5')
    })

    it('should return "Sep 5" for utcString tzAware NY "MMM D"', () => {
      expect(formatLocalizedFromUTC(utcString, tzAwareNY, 'MMM D'))
        .toEqual('Sep 5')
    })

    it('should return "Sep 5" for utcAsNumber tzUnaware "MMM D"', () => {
      expect(formatLocalizedFromUTC(utcAsNumber, tzUnaware, 'MMM D'))
        .toEqual('Sep 5')
    })

    it('should return "Sep 5" for utcString tzUnaware "MMM D"', () => {
      expect(formatLocalizedFromUTC(utcString, tzUnaware, 'MMM D'))
        .toEqual('Sep 5')
    })

    it('should error if passed a JavaScript Date for the `utc` param', () => {
      expect(formatLocalizedFromUTC(new Date(utcString), tzUnaware, 'MMM D'))
        .toEqual('Sep 5')
    })
  })

  describe('formatClocktimeFromMsPer24', () => {
    const twoTwentyAfternoonMs = 1000 * 60 * 60 * 14 + 1000 * 60 * 20 // 2:20PM in milliseconds
    const errorMessage = 'First argument must be a value in milliseconds per twenty-four hour day'

    it('should throw an error if no `milliseconds` provided', () => {
      const undefinedValueCase = () => {
        formatClocktimeFromMsPer24(undefined as unknown as number)
      }
      expect(undefinedValueCase).toThrow(errorMessage)
    })

    it('should throw an error if milliseconds < 0 or >= 864e5', () => {
      const belowRangeValueCase = () => {
        formatClocktimeFromMsPer24(-1)
      }
      expect(belowRangeValueCase).toThrow(errorMessage)
      const aboveRangeValueCase = () => {
        formatClocktimeFromMsPer24(864e5 + 1)
      }
      expect(aboveRangeValueCase).toThrow(errorMessage)
    })

    it('should throw an error if JavaScript Date provided', () => {
      const jsDateValueCase = () => {
        formatClocktimeFromMsPer24(new Date() as unknown as number)
      }
      expect(jsDateValueCase).toThrow(errorMessage)
    })

    it('should translate durations of 0 and 864e5 to `12:00 am`', () => {
      expect(formatClocktimeFromMsPer24(0)).toEqual('12:00 am')
      expect(formatClocktimeFromMsPer24(864e5)).toEqual('12:00 am')
    })

    it('should translate duration of 1000 * 60 * 60 * 14 ⅓ to `2:20 pm`', () => {
      expect(formatClocktimeFromMsPer24(twoTwentyAfternoonMs)).toEqual('2:20 pm')
    })

    it('should use a custom format string passed as second arg', () => {
      expect(formatClocktimeFromMsPer24(twoTwentyAfternoonMs, 'kk🙃mm')).toEqual('14🙃20')
    })
  })

  describe('formatDate', () => {
    it('should return correct date', () => {
      expect(formatDate('1983-01-31')).toBe('Jan 31, 1983')
    })

    it('should return empty string when given param is undefined', () => {
      expect(formatDate(undefined)).toBe('')
    })
  })

  describe('convertValueToMinutes', () => {
    it('should convert milliseconds to minutes', () => {
      expect(convertValueToMinutes(120000, DurationUnit.Milliseconds)).toBe(2)
    })

    it('should convert seconds to minutes', () => {
      expect(convertValueToMinutes(120, DurationUnit.Seconds)).toBe(2)
    })

    it('should convert hours to minutes', () => {
      expect(convertValueToMinutes(2, DurationUnit.Hours)).toBe(120)
    })

    it('should return the same value for minutes', () => {
      expect(convertValueToMinutes(30, DurationUnit.Minutes)).toBe(30)
    })
  })

  describe('convertValueToHours', () => {
    it('should convert milliseconds to hours', () => {
      expect(convertValueToHours(7200000, DurationUnit.Milliseconds)).toBe(2)
    })

    it('should convert seconds to hours', () => {
      expect(convertValueToHours(7200, DurationUnit.Seconds)).toBe(2)
    })

    it('should convert minutes to hours', () => {
      expect(convertValueToHours(120, DurationUnit.Minutes)).toBe(2)
    })

    it('should return the same value for hours', () => {
      expect(convertValueToHours(2, DurationUnit.Hours)).toBe(2)
    })
  })
})
