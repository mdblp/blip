/*
 * Copyright (c) 2025-2026, Diabeloop
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

import { BgUnit, ZenMode } from 'medical-domain'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DailyTooltipProps } from '../../../models/daily-tooltip-props.model'
import colors from '../../../styles/colors.css'
import commonStyles from '../../../styles/tooltip-common.css'
import { getConvertedValue } from '../../../utils/blood-glucose/blood-glucose.util'
import { getDuration } from '../../../utils/datetime/datetime.util'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { DEFAULT_TOOLTIP_OFFSET, Tooltip } from '../common/tooltip/tooltip'

const getFormattedGlycemiaOffset = (offset: number): string => {
  return offset > 0 ? `+${offset}` : offset.toString()
}

interface ZenModeTooltipProps extends DailyTooltipProps<ZenMode> {
  bgUnit: BgUnit
}

export const ZenModeTooltip: FC<ZenModeTooltipProps> = (props) => {
  const { datum: zenMode, position, side, timePrefs, bgUnit } = props
  const { t } = useTranslation('main')
  const duration = getDuration(zenMode)

  const { glycemiaTarget } = zenMode
  const glycemiaTargetUnits = glycemiaTarget?.units
  const targetGlucoseLevel = glycemiaTarget ? getConvertedValue(glycemiaTarget.value, bgUnit, glycemiaTargetUnits) : undefined
  const setTarget = glycemiaTarget ? getConvertedValue(glycemiaTarget.initialValue, bgUnit, glycemiaTargetUnits) : undefined
  const difference = glycemiaTarget
    ? getFormattedGlycemiaOffset(getConvertedValue(glycemiaTarget.offset, bgUnit, glycemiaTargetUnits))
    : undefined

  return (
    <Tooltip
      position={position}
      backgroundColor={colors.greenBackground}
      title={t('zen-mode')}
      dateTitle={getDateTitleForBaseDatum(zenMode, timePrefs)}
      side={side}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={glycemiaTarget ? commonStyles.containerFlexLarge : commonStyles.containerFlex}>
          {glycemiaTarget &&
            <>
              <TooltipLine label={t('target-glucose-level')} value={targetGlucoseLevel}
                           units={bgUnit} isBold={true} />
              <TooltipLine label={t('set-target')} value={setTarget} units={bgUnit} />
              <TooltipLine label={t('difference')} value={difference} units={bgUnit} />
            </>
          }
          <TooltipLine label={t('Duration')} value={duration.value} units={t(duration.units)} />
        </div>
      }
    />
  )
}
