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

import React, { type FunctionComponent } from 'react'
import {
  COMMON_TOOLTIP_TAIL_HEIGHT,
  COMMON_TOOLTIP_TAIL_WIDTH,
  DEFAULT_TOOLTIP_BORDER_WIDTH,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_TOOLTIP_TAIL,
  type Position,
  type Side
} from '../common/tooltip/tooltip'
import commonStyles from '../../../styles/tooltip-common.css'
import { Tooltip } from '../../../index'
import colors from '../../../styles/colors.css'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { type Meal, Prescriptor, type TimePrefs } from 'medical-domain'
import { useTranslation } from 'react-i18next'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'

interface FoodTooltipProps {
  food: Meal
  position: Position
  side: Side
  timePrefs: TimePrefs
}

export const FoodTooltip: FunctionComponent<FoodTooltipProps> = (props) => {
  const { food, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const actualCarbs = food.nutrition?.carbohydrate?.net || 0
  const prescribedCarbs = food.prescribedNutrition?.carbohydrate?.net
  const prescriptor = food.prescriptor
  const recommendedValue = (prescriptor === Prescriptor.Hybrid) ? prescribedCarbs : actualCarbs
  const hasPrescriptor = prescriptor && (prescriptor !== Prescriptor.Manual)

  const gramLabel = t('g')

  return (
    <Tooltip
      position={position}
      side={side}
      borderColor={colors.rescuecarbs}
      dateTitle={getDateTitleForBaseDatum(food, timePrefs)}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tail={DEFAULT_TOOLTIP_TAIL}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlex}>
          {
            hasPrescriptor &&
            <TooltipLine label={t('Recommended')} value={recommendedValue} units={gramLabel} />
          }
          <TooltipLine label={t('Confirmed')} value={actualCarbs} units={gramLabel} isBold />
        </div>
      }
    />
  )
}
