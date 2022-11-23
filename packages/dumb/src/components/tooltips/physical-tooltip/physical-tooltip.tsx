/*
 * Copyright (c) 2022, Diabeloop
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

import React, { FunctionComponent } from 'react'
import {
  COMMON_TOOLTIP_SIDE,
  COMMON_TOOLTIP_TAIL_HEIGHT,
  COMMON_TOOLTIP_TAIL_WIDTH,
  DEFAULT_TOOLTIP_BORDER_WIDTH,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_TOOLTIP_TAIL,
  Position,
  Side
} from '../tooltip/tooltip'
import { TimePrefs } from '../../../models/settings.model'
import { Tooltip } from '../../../index'
import styles from './physical-tooltip.css'
import commonStyles from '../../../styles/tooltip-common.css'
import i18next from 'i18next'
import { formatInputTime } from '../../../utils/format/format.util'
import colors from '../../../styles/colors.css'
import { getDateTitle } from '../../../utils/tooltip/tooltip.util'
import { convertValueToMinutes } from '../../../utils/datetime/datetime.util'
import { DurationUnit, DurationValue, PhysicalActivity } from 'medical-domain'

interface PhysicalTooltipProps {
  physicalActivity: PhysicalActivity
  position: Position
  side: Side
  timePrefs: TimePrefs
}

const t = i18next.t.bind(i18next)

export const PhysicalTooltip: FunctionComponent<PhysicalTooltipProps> = (props) => {
  const { physicalActivity, position, side, timePrefs } = props

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

  const tooltipParams = {
    position,
    side: side || COMMON_TOOLTIP_SIDE,
    borderColor: colors.physicalActivity,
    dateTitle: getDateTitle(physicalActivity, timePrefs)
  }

  return (
    <Tooltip
      position={tooltipParams.position}
      side={tooltipParams.side}
      borderColor={tooltipParams.borderColor}
      dateTitle={tooltipParams.dateTitle}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tail={DEFAULT_TOOLTIP_TAIL}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlex}>
          <div key={'title'} className={commonStyles.row}>
            <div id="tooltip-physical-activity-title" className={styles.title}>{t('Physical Activity')}</div>
          </div>
          <div key={'physical'} className={commonStyles.row}>
            <div className={commonStyles.label}>{t('Intensity')}</div>
            <div className={styles.value}>
              {t(`${physicalActivity.reportedIntensity}-pa`)}
            </div>
          </div>
          <div key={'duration'} className={commonStyles.row}>
            <div className={commonStyles.label}>{t('Duration')}</div>
            <div className={styles.value}>{`${duration.value} ${t(duration.units)}`}</div>
          </div>
          {
            physicalActivity.inputTime &&
            <div key={'inputTime'} className={commonStyles.row}>
              <div className={commonStyles.label}>
                {t('Entered at')}
              </div>
              <div className={styles.value}>
                {formatInputTime(physicalActivity.inputTime, timePrefs)}
              </div>
            </div>
          }
        </div>
      }
    />
  )
}
