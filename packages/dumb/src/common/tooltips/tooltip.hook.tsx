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

import { LegacyRef, useCallback, useMemo, useState } from 'react'
import { DateTitle, Offset, Position } from './tooltip'
import { formatLocalizedFromUTC, getHourMinuteFormat } from '../../utils/datetime'
import moment from 'moment-timezone'

interface TooltipHookProps {
  borderWidth: number
  dateTitle?: DateTitle
  offset: Offset
  position: Position
  side: 'top' | 'right' | 'bottom' | 'left'
  tail?: boolean
  tailWidth: number
}

interface TooltipHookReturn {
  borderSide: string
  dateValue?: string
  left: number
  marginOuterValue: string
  setElementRef: LegacyRef<HTMLDivElement> | undefined
  setTailElementRef: LegacyRef<HTMLDivElement> | undefined
  top: number
}

const useTooltip = (props: TooltipHookProps): TooltipHookReturn => {
  const {
    borderWidth,
    dateTitle,
    offset,
    position,
    side,
    tail,
    tailWidth
  } = props

  const [elementRef, setElementRef] = useState<Element | null>(null)
  const [tailElementRef, setTailElementRef] = useState<Element | null>(null)

  const calculateOffset = useCallback(() => {
    if (elementRef) {
      const computedOffset = { top: 0, left: 0 }
      const tooltipRect = elementRef.getBoundingClientRect()

      let horizontalOffset = offset.left ?? (offset.horizontal ?? 0)

      if (side === 'left') {
        horizontalOffset = -horizontalOffset
      }

      if (tail && tailElementRef) {
        const tailRect = tailElementRef.getBoundingClientRect()
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
      const left = position.left + (computedOffset.left ?? 0)
      return { top, left }
    }
    return { top: 0, left: 0 }
  }, [elementRef, offset.horizontal, offset.left, offset.top, position.left, position.top, side, tail, tailElementRef])

  const computeDateValue = useCallback(() => {
    if (!dateTitle) {
      return { dateValue: undefined }
    }
    let dateValue
    if (dateTitle.source === 'Diabeloop') {
      // For diabeloop device, use the timezone of the object
      const { timezoneName } = dateTitle.timePrefs
      const { timezone: datumTimezone } = dateTitle
      const mNormalTime = moment.tz(dateTitle.normalTime, datumTimezone === 'UTC' ? timezoneName : datumTimezone)
      dateValue = mNormalTime.format(getHourMinuteFormat())
    } else {
      dateValue = formatLocalizedFromUTC(dateTitle.normalTime, dateTitle.timePrefs, getHourMinuteFormat())
    }
    return { dateValue }
  }, [dateTitle])

  const computeTailData = useCallback(() => {
    const tailSide = (side === 'left') ? 'right' : 'left'
    const padding = 10
    let marginOuterValue
    if (tailSide === 'left') {
      marginOuterValue = `calc(-100% - (4 * ${tailWidth}px - ${padding}px)`
    } else {
      marginOuterValue = `calc(${padding}px + ${borderWidth}px)`
    }
    const borderSide = (tailSide === 'left') ? 'right' : 'left'
    return { marginOuterValue, borderSide }
  }, [side, tailWidth, borderWidth])

  const { top, left } = useMemo(() => {
    return calculateOffset()
  }, [calculateOffset])

  const { marginOuterValue, borderSide } = useMemo(() => {
    return computeTailData()
  }, [computeTailData])

  const { dateValue } = useMemo(() => {
    return computeDateValue()
  }, [computeDateValue])

  return useMemo(() => ({
    borderSide,
    dateValue,
    left,
    marginOuterValue,
    setElementRef,
    setTailElementRef,
    top
  }), [borderSide, dateValue, left, marginOuterValue, top])
}

export default useTooltip
