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

import { useCallback, useMemo } from 'react'
import { DateTitle, Offset, Position } from './tooltip'
import { formatLocalizedFromUTC, getHourMinuteFormat } from '../../../utils/datetime'
import moment from 'moment-timezone'
import { Source, TIMEZONE_UTC } from '../../../settings/models'

export interface TooltipHookProps {
  borderWidth: number
  dateTitle?: DateTitle
  offset: Offset
  position: Position
  side: 'top' | 'right' | 'bottom' | 'left'
  tailWidth: number
}

export interface TooltipHookReturn {
  calculateOffset: (mainDiv: HTMLDivElement | null, tailDiv: HTMLDivElement | null) => { top: number, left: number }
  computeDateValue: () => string | undefined
  computeTailData: () => { marginOuterValue: string, borderSide: string }
}

const useTooltip = (props: TooltipHookProps): TooltipHookReturn => {
  const {
    borderWidth,
    dateTitle,
    offset,
    position,
    side,
    tailWidth
  } = props

  const calculateOffset = useCallback((mainDiv: HTMLDivElement | null, tailElement: HTMLDivElement | null) => {
    if (mainDiv) {
      const computedOffset = { top: 0, left: 0 }
      const tooltipRect = mainDiv.getBoundingClientRect()

      let horizontalOffset = offset.left ?? (offset.horizontal ?? 0)

      if (side === 'left') {
        horizontalOffset = -horizontalOffset
      }

      if (tailElement) {
        const tailRect = tailElement.getBoundingClientRect()
        const tailCenter = {
          top: tailRect.top + (tailRect.height / 2),
          left: tailRect.left + (tailRect.width / 2)
        }
        computedOffset.top = -tailCenter.top + tooltipRect.top + offset.top
        computedOffset.left = -tailCenter.left + tooltipRect.left + horizontalOffset
      } else {
        let leftOffset
        let topOffset
        switch (side) {
          case 'top':
            leftOffset = -tooltipRect.width / 2
            topOffset = -tooltipRect.height
            break
          case 'bottom':
            leftOffset = -tooltipRect.width / 2
            topOffset = 0
            break
          case 'right':
            leftOffset = 0
            topOffset = -tooltipRect.height / 2
            break
          case 'left':
          default:
            leftOffset = -tooltipRect.width
            topOffset = -tooltipRect.height / 2
        }
        computedOffset.top = topOffset + offset.top
        computedOffset.left = leftOffset + horizontalOffset
      }
      const top = position.top + computedOffset.top
      const left = position.left + computedOffset.left
      return { top, left }
    }
    return { top: 0, left: 0 }
  }, [offset.horizontal, offset.left, offset.top, position.left, position.top, side])

  const computeDateValue = useCallback(() => {
    if (!dateTitle) {
      return undefined
    }
    let dateValue
    if (dateTitle.source === Source.Diabeloop) {
      // For diabeloop device, use the timezone of the object
      const timezoneName = dateTitle ? dateTitle?.timePrefs?.timezoneName : ''
      const { timezone: datumTimezone } = dateTitle
      const mNormalTime = moment.tz(dateTitle.normalTime, datumTimezone === TIMEZONE_UTC ? timezoneName : datumTimezone)
      dateValue = mNormalTime.format(getHourMinuteFormat())
    } else {
      dateValue = formatLocalizedFromUTC(dateTitle.normalTime, dateTitle.timePrefs, getHourMinuteFormat())
    }
    return dateValue
  }, [dateTitle])

  const computeTailData = useCallback(() => {
    const padding = 10
    let marginOuterValue
    if (side !== 'left') {
      marginOuterValue = `calc(-100% - (4 * ${tailWidth}px - ${padding}px)`
    } else {
      marginOuterValue = `calc(${padding}px + ${borderWidth}px)`
    }
    const borderSide = side !== 'left' ? 'right' : 'left'
    return { marginOuterValue, borderSide }
  }, [side, tailWidth, borderWidth])

  return useMemo(() => ({
    calculateOffset,
    computeDateValue,
    computeTailData
  }), [
    calculateOffset,
    computeDateValue,
    computeTailData
  ])
}

export default useTooltip
