/*
 * Copyright (c) 2022-2023, Diabeloop
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
  COMMON_TOOLTIP_SIDE,
  COMMON_TOOLTIP_TAIL_HEIGHT,
  COMMON_TOOLTIP_TAIL_WIDTH,
  DEFAULT_TOOLTIP_BORDER_WIDTH,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_TOOLTIP_TAIL,
  type Position,
  type Side
} from '../common/tooltip/tooltip'
import { Tooltip } from '../../../index'
import commonStyles from '../../../styles/tooltip-common.css'
import { formatInputTime } from '../../../utils/format/format.util'
import colors from '../../../styles/colors.css'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { convertValueToMinutes } from '../../../utils/datetime/datetime.util'
import { DurationUnit, type DurationValue, type PhysicalActivity, type TimePrefs } from 'medical-domain'
import { useTranslation } from 'react-i18next'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'

interface PhysicalTooltipProps {
  physicalActivity: PhysicalActivity
  position: Position
  side: Side
  timePrefs: TimePrefs
}

export const PhysicalTooltip: FunctionComponent<PhysicalTooltipProps> = (props) => {
  const { physicalActivity, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const getDurationInMinutes = (): DurationValue => {
    const units = props.physicalActivity?.duration?.units
    const duration = props.physicalActivity?.duration?.value
    const value = convertValueToMinutes(duration, units)

    return {
      units: DurationUnit.Minutes,
      value
    }
  }

  const duration = getDurationInMinutes()

  return (
    <Tooltip
      position={position}
      side={side || COMMON_TOOLTIP_SIDE}
      borderColor={colors.physicalActivity}
      dateTitle={getDateTitleForBaseDatum(physicalActivity, timePrefs)}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tail={DEFAULT_TOOLTIP_TAIL}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlex}>
          <TooltipLine label={t('Physical Activity')} isBold />
          <TooltipLine label={t('Intensity')} value={t(`${physicalActivity.reportedIntensity}-pa`)} />
          <TooltipLine label={t('Duration')} value={`${duration.value} ${t(duration.units)}`} />
          {
            physicalActivity.inputTime &&
            <TooltipLine label={t('Entered at')} value={formatInputTime(physicalActivity.inputTime, timePrefs)} />
          }
        </div>
      }
    />
  )
}
