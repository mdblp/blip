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
import { type Offset, type Position } from './trends-tooltip'
import { TooltipSide } from '../../../../models/enums/tooltip-side.enum'

export interface TooltipHookProps {
  offset: Offset
  position: Position
  side: TooltipSide
}

export interface TooltipHookReturn {
  calculateOffset: (mainDiv: HTMLDivElement | null, tailDiv: HTMLDivElement | null) => { top: number, left: number }
}

export const useTrendsTooltip = (props: TooltipHookProps): TooltipHookReturn => {
  const {
    offset,
    position,
    side,
  } = props

  const calculateOffset = useCallback((mainDiv: HTMLDivElement | null, tailElement: HTMLDivElement | null) => {
    if (mainDiv) {
      const computedOffset = { top: 0, left: 0 }
      const tooltipRect = mainDiv.getBoundingClientRect()

      let horizontalOffset = offset.left ?? (offset.horizontal ?? 0)

      if (side === TooltipSide.Left) {
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
          case TooltipSide.Top:
            leftOffset = -tooltipRect.width / 2
            topOffset = -tooltipRect.height
            break
          case TooltipSide.Bottom:
            leftOffset = -tooltipRect.width / 2
            topOffset = 0
            break
          case TooltipSide.Right:
            leftOffset = 0
            topOffset = -tooltipRect.height / 2
            break
          case TooltipSide.Left:
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

  return useMemo(() => ({
    calculateOffset,
  }), [
    calculateOffset,
  ])
}
