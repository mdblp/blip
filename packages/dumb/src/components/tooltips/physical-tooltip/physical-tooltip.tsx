/*
 * Copyright (c) 2022-2026, Diabeloop
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

import { DurationUnit, type DurationValue, type PhysicalActivity, PhysicalActivityName } from 'medical-domain'
import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { DailyTooltipProps } from '../../../models/daily-tooltip-props.model'
import colors from '../../../styles/colors.css'
import commonStyles from '../../../styles/tooltip-common.css'
import { convertValueToMinutes } from '../../../utils/datetime/datetime.util'
import { formatInputTime } from '../../../utils/format/format.util'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { DEFAULT_TOOLTIP_OFFSET, Tooltip } from '../common/tooltip/tooltip'

export const PhysicalTooltip: FunctionComponent<DailyTooltipProps<PhysicalActivity>> = (props) => {
  const { datum: physicalActivity, position, side, timePrefs } = props
  const { t } = useTranslation()

  const getDurationInMinutes = (): DurationValue => {
    const units = physicalActivity.duration.units
    const duration = physicalActivity.duration.value
    const value = convertValueToMinutes(duration, units)

    return {
      units: DurationUnit.Minutes,
      value
    }
  }

  const duration = getDurationInMinutes()

  const getDisplayName = (name: string): string => {
    const nameUppercase = name.toUpperCase()
    if (name && Object.values(PhysicalActivityName).includes(nameUppercase as PhysicalActivityName)) {
      return t(`params|${nameUppercase}`)
    }
    return t(`params|${PhysicalActivityName.AerobicDefault}`)
  }

  return (
    <Tooltip
      position={position}
      side={side}
      title={t('Physical Activity')}
      backgroundColor={colors.blueBackground}
      dateTitle={getDateTitleForBaseDatum(physicalActivity, timePrefs)}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlexLarge}>
          {
            physicalActivity.name && physicalActivity.name !== "" &&
            <TooltipLine label={t('Name')} value={getDisplayName(physicalActivity.name)} />
          }
          <TooltipLine label={t('Intensity')} value={t(`${physicalActivity.reportedIntensity}-pa`)} />
          <TooltipLine label={t('Duration')} value={`${duration.value} ${t(duration.units)}`} />
          {
            physicalActivity.inputTime &&
            <TooltipLine label={t('Entered at')} value={formatInputTime(physicalActivity.inputTime, timePrefs)} />
          }
          {
            physicalActivity.updateTime && physicalActivity.updateTime != physicalActivity.inputTime &&
            <TooltipLine label={t('Updated at')} value={formatInputTime(physicalActivity.updateTime, timePrefs)} />
          }
        </div>
      }
    />
  )
}
