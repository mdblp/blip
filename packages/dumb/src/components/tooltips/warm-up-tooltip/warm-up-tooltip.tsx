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
import { Tooltip } from '../../../index'
import React, { FC } from 'react'
import { TimePrefs, WarmUp } from 'medical-domain'
import { DEFAULT_TOOLTIP_OFFSET, Position } from '../common/tooltip/tooltip'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import colors from '../../../styles/colors.css'
import { getWarmUpDescription, getWarmUpEndTime, getWarmUpTitle } from '../../../utils/warm-up/warm-up.util'
import { TooltipSide } from '../../../models/enums/tooltip-side.enum'
import commonStyles from '../../../styles/tooltip-common.css'

interface WarmupTooltipProps {
  warmup: WarmUp
  position: Position
  side: TooltipSide
  timePrefs: TimePrefs
}

export const WarmUpTooltip: FC<WarmupTooltipProps> = (props) => {
  const { warmup, position, side, timePrefs } = props
  const endTime = getWarmUpEndTime(warmup.epochEnd, warmup.timezone)

  return (
    <Tooltip
      position={position}
      backgroundColor={colors.greyBackground}
      title={getWarmUpTitle()}
      dateTitle={getDateTitleForBaseDatum(warmup, timePrefs)}
      side={side}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlexLarge}>
          <TooltipLine label={getWarmUpDescription()} value={endTime} />
        </div>
      }
    />
  )
}
