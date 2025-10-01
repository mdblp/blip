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
import colors from '../../../styles/colors.css'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import commonStyles from '../../../styles/tooltip-common.css'
import { DEFAULT_TOOLTIP_OFFSET, type Position, Tooltip } from '../common/tooltip/tooltip'
import { Iob, type TimePrefs } from 'medical-domain'
import { useTranslation } from 'react-i18next'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { TooltipSide } from '../../../models/enums/tooltip-side.enum'
import { formatDecimalNumber } from '../../../utils/format/format.util'

interface IobTooltipProps {
  data: Iob
  position: Position
  side: TooltipSide
  timePrefs: TimePrefs
}

export const IobTooltip: FunctionComponent<IobTooltipProps> = (props) => {
  const { data, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const formattedValue = formatDecimalNumber(data.value, 2)

  return (
    <Tooltip
      position={position}
      side={side}
      backgroundColor={colors.blueBackground}
      title={t('active-insulin')}
      dateTitle={getDateTitleForBaseDatum(data, timePrefs)}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlexLarge}>
          <TooltipLine label={t('insulin-on-board')} />
          <TooltipLine label={t('insulin')} value={formattedValue} units={data.units} isBold />
        </div>
      }
    />
  )
}
