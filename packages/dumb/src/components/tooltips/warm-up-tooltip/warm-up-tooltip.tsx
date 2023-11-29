/*
 * Copyright (c) 2023, Diabeloop
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
import moment from 'moment-timezone'
import { BgPrefs, Tooltip } from '../../../index'
import React, { FC } from 'react'
import { TimePrefs } from 'medical-domain'
import {
  COMMON_TOOLTIP_SIDE,
  COMMON_TOOLTIP_TAIL_HEIGHT,
  COMMON_TOOLTIP_TAIL_WIDTH,
  DEFAULT_TOOLTIP_BORDER_WIDTH,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_TOOLTIP_TAIL,
  Position,
  Side
} from '../common/tooltip/tooltip'
import { useTranslation } from 'react-i18next'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import styles from '../warm-up-tooltip/warm-up-tooltip.css'
import WarmUp from 'medical-domain/dist/src/domains/models/medical/datum/warm-up.model'
import { getHourMinuteFormat } from '../../../utils/datetime/datetime.util'

interface WarmupTooltipProps {
  warmup: WarmUp
  position: Position
  side: Side
  timePrefs: TimePrefs
}
export const WarmUpTooltip: FC<WarmupTooltipProps> = (props) => {
  const {  warmup, position, side, timePrefs } = props
  const { t } = useTranslation('main')
  const endTime = moment.tz(warmup.epochEnd, warmup.timezone).format(getHourMinuteFormat())

  return (
    <Tooltip
        position={position}
        dateTitle={getDateTitleForBaseDatum(warmup, timePrefs)}
        side={side || COMMON_TOOLTIP_SIDE}
        tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
        tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
        tail={DEFAULT_TOOLTIP_TAIL}
        borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
        offset={DEFAULT_TOOLTIP_OFFSET}
        content={
          <div id="sensor-warmup-container" className={styles.container}>
            <div id="sensor-warmup-title" className={styles.label}>{t('sensor-warmup')}</div>
            <div id="sensor-warmup-session-end" className={styles.labelEnd}>
              <span id="sensor-warmup-session-end-text" className={styles.labelEndText}>{t('sensor-warmup-session-end')}</span>
              <span id="sensor-warmup-session-end-hour" className={styles.labelEndTime}>{endTime}</span>
            </div>
          </div>
        }
    />
  )
}
