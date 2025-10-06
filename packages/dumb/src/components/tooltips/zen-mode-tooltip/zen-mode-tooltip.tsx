/*
 * Copyright (c) 2025, Diabeloop
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

import React, { FC } from 'react'
import { DEFAULT_TOOLTIP_OFFSET, Position, Tooltip } from '../common/tooltip/tooltip'
import colors from '../../../styles/colors.css'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import commonStyles from '../../../styles/tooltip-common.css'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { TimePrefs, ZenMode } from 'medical-domain'
import { getDuration } from '../../../utils/datetime/datetime.util'
import { useTranslation } from 'react-i18next'
import { TooltipSide } from '../../../models/enums/tooltip-side.enum'

interface ZenModeTooltipProps {
  zenMode: ZenMode
  position: Position
  side: TooltipSide
  timePrefs: TimePrefs
}

export const ZenModeTooltip: FC<ZenModeTooltipProps> = (props) => {
  const { zenMode, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const duration = getDuration(zenMode)
  let tooltipContent = (
    <div className={commonStyles.containerFlex}>
      <TooltipLine label={t('Duration')} value={`${duration.value} ${t(duration.units)}`} />
    </div>
  )

  if (zenMode.glycemiaTarget !== null && zenMode.glycemiaOffset !== null) {
    const glycemiaUnits = zenMode.glycemiaUnits ? zenMode.glycemiaUnits : 'N/A'
    const glycemiaInitialTarget = zenMode.glycemiaTarget - zenMode.glycemiaOffset;
    const glyOffset = zenMode.glycemiaOffset > 0 ? `+${zenMode.glycemiaOffset}` : `${zenMode.glycemiaOffset}`
    tooltipContent = (
      <div className={commonStyles.containerFlex}>
        <TooltipLine label={t('ZenModeGlycemiaTarget')} value={`${zenMode.glycemiaTarget} ${t(glycemiaUnits)}`} isBold={true} />
        <TooltipLine label={t('ZenModeInitialGlycemiaTarget')} value={`${glycemiaInitialTarget} ${t(glycemiaUnits)}`} />
        <TooltipLine label={t('ZenModeGlycemiaOffset')} value={`${glyOffset} ${t(glycemiaUnits)}`} />
        <TooltipLine label={t('Duration')} value={`${duration.value} ${t(duration.units)}`} />
      </div>
    )
  }

  return (
    <Tooltip
      position={position}
      backgroundColor={colors.greenBackground}
      title={t('zen-mode')}
      dateTitle={getDateTitleForBaseDatum(zenMode, timePrefs)}
      side={side}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={tooltipContent}
    />
  )
}
