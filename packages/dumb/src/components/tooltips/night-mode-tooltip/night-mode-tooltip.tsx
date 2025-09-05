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

import { type NightMode, TimePrefs } from 'medical-domain'
import Tooltip, { DEFAULT_TOOLTIP_OFFSET, Position } from '../common/tooltip/tooltip'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import colors from '../../../styles/colors.css'
import commonStyles from '../../../styles/tooltip-common.css'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { getDuration } from '../../../utils/datetime/datetime.util'
import { TooltipSide } from '../../../models/enums/tooltip-side.enum'

interface NightModeTooltipProps {
  nightMode: NightMode
  position: Position
  side: TooltipSide
  timePrefs: TimePrefs
}

export const NightModeTooltip: FC<NightModeTooltipProps> = (props) => {
  const { nightMode, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const duration = getDuration(nightMode)

  return (
    <Tooltip
      position={position}
      backgroundColor={colors.darkBlueBackground}
      title={t('night-mode')}
      dateTitle={getDateTitleForBaseDatum(nightMode, timePrefs)}
      side={side}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlex}>
          <TooltipLine label={t('Duration')} value={`${duration.value} ${t(duration.units)}`} />
        </div>
      }
    />
  )
}
