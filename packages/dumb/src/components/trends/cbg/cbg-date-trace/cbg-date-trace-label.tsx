/*
 * Copyright (c) 2017-2025, Diabeloop
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

import styles from './cbg-date-trace-label.css'
import { useTranslation } from 'react-i18next'
import { formatDateToUtc } from '../../../../utils/datetime/datetime.util'
import { useTrendsContext } from '../../../../provider/trends.provider'
import { TooltipSide } from '../../../../models/enums/tooltip-side.enum'
import { TrendsTooltip } from '../../common/tooltip/trends-tooltip'

export const CbgDateTraceLabel: FunctionComponent = () => {
  const { focusedCbgDateTrace } = useTrendsContext()
  const { t } = useTranslation()

  if (!focusedCbgDateTrace) {
    return null
  }

  const localDate = focusedCbgDateTrace.data.localDate
  const formattedDate = localDate ? formatDateToUtc(localDate, t('dddd, MMMM D')) : ''
  const tooltipPosition = {
    left: focusedCbgDateTrace.position.left,
    top: 2.25 * focusedCbgDateTrace.position.yPositions.topMargin
  }

  return (
    <div className={styles.container} data-testid="cbg-date-trace-tooltip">
      <TrendsTooltip
        title={<span className={styles.dateLabel}>{formattedDate}</span>}
        position={tooltipPosition}
        side={TooltipSide.Bottom}
      />
    </div>
  )
}
