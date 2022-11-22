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
import { Tooltip } from '../../../index'
import { getDateTitle } from '../../../utils/tooltip/tooltip.util'
import { TimePrefs } from '../../../models/settings.model'
import {
  convertBgClassesToBgBounds,
  getBgClass,
  getOutOfRangeThreshold
} from '../../../utils/blood-glucose/blood-glucose.util'
import { BgPrefs, BloodGlucoseData, ClassificationType } from '../../../models/blood-glucose.model'
import i18next from 'i18next'
import { formatBgValue } from '../../../utils/format/format.util'
import { getOutOfRangeAnnotationMessages } from '../../../utils/annotations/annotations.util'
import commonStyles from '../../../styles/tooltip-common.css'
import colors from '../../../styles/colors.css'
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

interface SmbgTooltipProps {
  bgPrefs: BgPrefs
  position: Position
  side: Side
  smbg: BloodGlucoseData
  timePrefs: TimePrefs
}

const t = i18next.t.bind(i18next)

export const SmbgTooltip: FunctionComponent<SmbgTooltipProps> = (props) => {
  const { bgPrefs, position, side, smbg, timePrefs } = props

  const hasAnnotations = smbg.annotations && smbg.annotations.length > 0
  const outOfRangeMessages = hasAnnotations ? getOutOfRangeAnnotationMessages(smbg.annotations) : []
  const hasMessages = outOfRangeMessages.length !== 0
  const formattedValue = formatBgValue(smbg.value, bgPrefs, getOutOfRangeThreshold(smbg.annotations))

  const bgClass = getBgClass(
    convertBgClassesToBgBounds(bgPrefs.bgClasses),
    smbg.value,
    ClassificationType.FiveWay
  )

  const tooltipParams = {
    position,
    side: side || COMMON_TOOLTIP_SIDE,
    borderColor: colors[bgClass] || colors.bolus,
    dateTitle: getDateTitle(smbg, timePrefs)
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
        <div className={commonStyles.container}>
          <div key={'bg'} className={commonStyles.rowBold}>
            <div className={commonStyles.label}>{t('BG')}</div>
            <div className={commonStyles.value}>
              {formattedValue}
            </div>
          </div>
          <div key={'source'} className={commonStyles.rowColorDarkGray}>
            <div className={commonStyles.label}>{t('Calibration')}</div>
          </div>
          {
            hasMessages &&
            <>
              <div
                key={'divider'}
                className={commonStyles.dividerLarge}
                style={{ backgroundColor: colors[bgClass] }}
              />
              <div key={'outOfRange'} className={commonStyles.rowColorDarkGray}>
                {outOfRangeMessages[0].message.value}
              </div>
            </>
          }
        </div>
      }
    />
  )
}
