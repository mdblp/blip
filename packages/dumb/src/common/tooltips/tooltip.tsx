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

import React, { FunctionComponent } from 'react'
import _ from 'lodash'
import styles from './tooltip.css'
import useTooltip from './tooltip.hook'

export interface Offset {
  top: number
  left?: number
  horizontal?: number
}

export interface Position {
  top: number
  left: number
}

export interface DateTitle {
  normalTime: string
  timezone: string
  source: string
  timePrefs: {
    timezoneAware: boolean
    timezoneName: string
  }
}

interface TooltipProps {
  title?: string
  dateTitle?: DateTitle
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

  const {
    setElementRef,
    setTailElementRef,
    top,
    left,
    marginOuterValue,
    borderSide,
    dateValue
  } = useTooltip({ position, offset: initialOffset, tail, side, dateTitle, borderWidth, tailWidth })

  return (
    <div
      className={styles.tooltip}
      style={{ top, left, backgroundColor, borderColor, borderWidth: `${borderWidth}px` }}
      ref={setElementRef}
    >
      {(title ?? dateValue) &&
        <div id="tooltip-daily-title" className={styles.title}>
          <div id="tooltip-daily-title-content" className={styles.titleContent}>
            {dateValue && <span id="tooltip-daily-title-date" className={styles.titleDate}>{dateValue}</span>}
            {title && <span id="tooltip-daily-title-text">{title}</span>}
          </div>
          {tail && !content &&
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
          }
        </div>
      }
      {content &&
        <div id="tooltip-daily-content" className={styles.content}>
          <span>{content}</span>
          {
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
          }
        </div>
      }
    </div>
  )
}

export default Tooltip
