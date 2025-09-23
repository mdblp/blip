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
import styles from './tooltip.css'
import useTooltip from './tooltip.hook'
import { type TimePrefs } from 'medical-domain'
import { computeDateValue } from '../../../../utils/tooltip/tooltip.util';
import Box from '@mui/material/Box'
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

export const COMMON_TOOLTIP_SIDE = TooltipSide.Right

export const DEFAULT_TOOLTIP_OFFSET = { top: 0, left: 0 }

interface TooltipProps {
  title?: string | JSX.Element
  dateTitle?: DateTitle
  content?: string | JSX.Element
  position: Position
  offset?: Offset
  side: TooltipSide
  backgroundColor?: string
}

export const Tooltip: FunctionComponent<TooltipProps> = (
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
  } = useTooltip({ position, offset: initialOffset, side })

  const elementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<Offset | null>(null)

  useEffect(() => {
    const { top, left } = calculateOffset(elementRef.current)
    setOffset({ top, left })
  }, [calculateOffset, elementRef])

  const dateValue = useMemo(() => {
    return computeDateValue(dateTitle)
  }, [dateTitle])

  return (
    <Box
      data-testid="tooltip"
      className={styles.tooltip}
      ref={elementRef}
      sx={{
        top: offset?.top ?? 0,
        left: offset?.left ?? 0,
        visibility: offset ? 'visible' : 'hidden'
      }}
    >
      {(title ?? dateValue) &&
        <Box className={styles.content} sx={{
          backgroundColor,
          paddingY: 2
        }}>
          {title && <span className={styles.titleValue}>{title}</span>}
          {dateValue && <span className={styles.titleDate} data-testid="tooltip-title-date">{dateValue}</span>}
        </Box>
      }
      {content &&
        <Box data-testid="tooltip-daily-content" className={styles.content} sx={{ paddingY: 1 }}>
          <span>{content}</span>
        </Box>
      }
    </Box>
  )
}

// export default Tooltip
