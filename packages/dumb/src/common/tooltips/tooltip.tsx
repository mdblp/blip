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

import React, { FunctionComponent, useEffect, useState } from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'

import { formatLocalizedFromUTC, getHourMinuteFormat } from '../../utils/datetime'
import styles from './Tooltip.css'

interface Offset {
  top: number
  left?: number
  horizontal?: number
}

interface Position {
  top: number
  left: number
}

interface TooltipProps {
  title?: string
  dateTitle?: {
    normalTime: string
    timezone: string
    source: string
    timePrefs: {
      timezoneAware: boolean
      timezoneName: string
    }
  }
  content?: string
  position: Position
  offset: Offset
  tail?: boolean
  side: 'top' | 'right' | 'bottom' | 'left'
  tailWidth: number
  tailHeight: number
  backgroundColor?: string
  borderColor: string
  borderWidth: number
}

const Tooltip: FunctionComponent<TooltipProps> = (
  {
    tail = true,
    side = 'left',
    tailWidth = 7,
    tailHeight = 8,
    borderColor = 'black',
    borderWidth = 2,
    offset: initialOffset = { top: 0, left: 0 },
    ...props
  }) => {
  const {
    backgroundColor,
    content,
    dateTitle,
    position,
    title
  } = props
  const [offset, setOffset] = useState<Offset>({
    top: initialOffset.top,
    left: initialOffset.left,
    horizontal: initialOffset.horizontal
  })
  const [elementRef, setElementRef] = useState<Element | null>(null)
  const [tailElementRef, setTailElementRef] = useState<Element | null>(null)
  const top = position.top + offset.top
  const left = position.left + (offset.left ?? 0)

  const calculateOffset = (): void => {
    if (elementRef) {
      const computedOffset = { top: 0, left: 0 }
      const tooltipRect = elementRef.getBoundingClientRect()

      let horizontalOffset = !_.isNil(offset.left)
        ? offset.left
        : (offset.horizontal ?? 0)

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
      setOffset(computedOffset)
    }
  }

  useEffect(() => {
    calculateOffset()
  }, [elementRef])

  const renderTail = (): JSX.Element => {
    const tailSide = (side === 'left') ? 'right' : 'left'
    const padding = 10
    let marginOuterValue
    if (tailSide === 'left') {
      marginOuterValue = `calc(-100% - (4 * ${tailWidth}px - ${padding}px)`
    } else {
      marginOuterValue = `calc(${padding}px + ${borderWidth}px)`
    }
    const borderSide = (tailSide === 'left') ? 'right' : 'left'
    // The two child divs form the solid color tail and the border around it by layering
    // on one another offset by the border width adjusted slightly for the angle
    return (
      <div>
        <div
          ref={setTailElementRef}
          className={styles.tail}
          style={{
            marginTop: `-${tailHeight}px`,
            marginLeft: marginOuterValue,
            borderWidth: `${tailHeight}px ${2 * tailWidth}px`,
            [`border${_.upperFirst(borderSide)}Color`]: borderColor
          }}
        />
      </div>
    )
  }

  const renderTitle = (): JSX.Element => {
    let renderedTitle = null
    let renderedDateTitle = null
    let tailNode = null
    if (tail && content === null) {
      tailNode = renderTail()
    }
    if (title) {
      renderedTitle = <span id="tooltip-daily-title-text">{title}</span>
    }
    if (dateTitle) {
      let dateValue = null
      if (dateTitle.source === 'Diabeloop') {
        // For diabeloop device, use the timezone of the object
        const { timezoneName } = dateTitle.timePrefs
        const { timezone: datumTimezone } = dateTitle
        const mNormalTime = moment.tz(dateTitle.normalTime, datumTimezone === 'UTC' ? timezoneName : datumTimezone)
        dateValue = mNormalTime.format(getHourMinuteFormat())
      } else {
        dateValue = formatLocalizedFromUTC(dateTitle.normalTime, dateTitle.timePrefs, getHourMinuteFormat())
      }
      renderedDateTitle = <span id="tooltip-daily-title-date" className={styles.titleDate}>{dateValue}</span>
    }

    if (renderedDateTitle === null && renderedTitle === null) {
      return <></>
    }

    return (
      <div id="tooltip-daily-title" className={styles.title}>
        <div id="tooltip-daily-title-content" className={styles.titleContent}>
          {renderedDateTitle}
          {renderedTitle}
        </div>
        {tailNode}
      </div>
    )
  }

  const renderContent = (): JSX.Element => {
    let renderedContent = <></>
    if (content) {
      let tailNode = null
      if (tail) {
        tailNode = renderTail()
      }
      renderedContent = (
        <div id="tooltip-daily-content" className={styles.content}>
          <span>{content}</span>
          {tailNode}
        </div>
      )
    }
    return renderedContent
  }

  return (
    <div
      className={styles.tooltip}
      style={{ top, left, backgroundColor, borderColor, borderWidth: `${borderWidth}px` }}
      ref={setElementRef}
    >
      {renderTitle()}
      {renderContent()}
    </div>
  )
}

export default Tooltip
