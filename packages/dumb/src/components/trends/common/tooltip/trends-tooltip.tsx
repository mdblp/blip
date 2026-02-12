/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'
import styles from './trends-tooltip.css'
import { type TimePrefs } from 'medical-domain'
import { computeDateValue } from '../../../../utils/tooltip/tooltip.util';
import { useTrendsTooltip } from './trends-tooltip.hook'
import { TooltipSide } from '../../../../models/enums/tooltip-side.enum'

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
  timePrefs: TimePrefs
}

// export type Side = 'top' | 'right' | 'bottom' | 'left'

export const COMMON_TOOLTIP_SIDE = TooltipSide.Right

export const DEFAULT_TOOLTIP_OFFSET = { top: 0, left: 0 }

interface TooltipProps {
  title?: string | JSX.Element
  dateTitle?: DateTitle
  content?: string | JSX.Element
  position: Position
  offset?: Offset
  tail?: boolean
  side: TooltipSide
  backgroundColor?: string
}

export const TrendsTooltip: FunctionComponent<TooltipProps> = (
  {
    side = COMMON_TOOLTIP_SIDE,
    offset: initialOffset = DEFAULT_TOOLTIP_OFFSET,
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
    calculateOffset,
  } = useTrendsTooltip({ position, offset: initialOffset, side })

  const elementRef = useRef<HTMLDivElement>(null)
  const tailElementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<Offset | null>(null)

  useEffect(() => {
    const { top, left } = calculateOffset(elementRef.current, tailElementRef.current)
    setOffset({ top, left })
  }, [calculateOffset, elementRef, tailElementRef])

  const dateValue = useMemo(() => {
    return computeDateValue(dateTitle)
  }, [dateTitle])

  return (
    <div
      className={styles.tooltip}
      data-testid="tooltip"
      style={{
        top: offset?.top ?? 0,
        left: offset?.left ?? 0,
        backgroundColor,
        visibility: offset ? 'visible' : 'hidden'
      }}
      ref={elementRef}
    >
      {(title ?? dateValue) &&
        <div id="tooltip-daily-title" className={styles.title}>
          <div id="tooltip-daily-title-content" className={styles.titleContent}>
            {dateValue && <span id="tooltip-daily-title-date" className={styles.titleDate}>{dateValue}</span>}
            {title && <span id="tooltip-daily-title-text">{title}</span>}
          </div>
        </div>
      }
      {content &&
        <div data-testid="tooltip-daily-content" className={styles.content}>
          <span>{content}</span>
        </div>
      }
    </div>
  )
}
