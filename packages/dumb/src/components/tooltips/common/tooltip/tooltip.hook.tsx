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

import { useCallback, useMemo } from 'react'
import { type Offset, type Position } from './tooltip'
import { TooltipSide } from '../../../../models/enums/tooltip-side.enum'

export interface TooltipHookProps {
  offset: Offset
  position: Position
  side: TooltipSide
}

export interface TooltipHookReturn {
  calculateOffset: (mainDiv: HTMLDivElement | null) => { top: number, left: number }
}

const DEFAULT_PADDING = 10

const useTooltip = (props: TooltipHookProps): TooltipHookReturn => {
  const {
    offset,
    position,
    side
  } = props

  const getOffestBySide = (side: TooltipSide, width: number, height: number): { left: number, top: number } => {
    switch (side) {
      case TooltipSide.Top:
        return {
          left: -width / 2,
          top: -height
        }
      case TooltipSide.Bottom:
        return {
          left: -width / 2,
          top: 0
        }
      case TooltipSide.Right:
        return {
          left: 0,
          top: -height / 2
        }
      case TooltipSide.Left:
      default:
        return {
          left: -width,
          top: -height / 2
        }
    }
  }

  const getHorizontalOffset = (side: TooltipSide, offset: Offset): number => {
    const horizontalOffset = offset.left ?? (offset.horizontal ?? 0)
    return side === TooltipSide.Left ? -horizontalOffset : horizontalOffset
  }

  const getHorizontalPadding = (side: TooltipSide): number => {
    if (side === TooltipSide.Left) {
      return -DEFAULT_PADDING
    }
    if (side === TooltipSide.Right) {
      return DEFAULT_PADDING
    }
    return 0
  }

  const calculateOffset = useCallback((mainDiv: HTMLDivElement | null) => {
    if (!mainDiv) {
      return { top: 0, left: 0 }
    }

    const computedOffset = { top: 0, left: 0 }
    const tooltipRect = mainDiv.getBoundingClientRect()

    const horizontalOffset = getHorizontalOffset(side, offset)

    const offsetBySide = getOffestBySide(side, tooltipRect.width, tooltipRect.height)

    computedOffset.top = offsetBySide.top + offset.top
    computedOffset.left = offsetBySide.left + horizontalOffset

    const padding = getHorizontalPadding(side)

    const top = position.top + computedOffset.top
    const left = position.left + computedOffset.left + padding

    return { top, left }
  }, [offset, position.left, position.top, side])

  return useMemo(() => ({
    calculateOffset
  }), [
    calculateOffset
  ])
}

export default useTooltip
