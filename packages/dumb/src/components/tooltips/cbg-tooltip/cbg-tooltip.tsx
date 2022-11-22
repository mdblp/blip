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
import { TimePrefs } from '../../../settings/models'
import colors from '../../../styles/colors.css'
import {
  getBgClass,
  getOutOfRangeThreshold,
  reshapeBgClassesToBgBounds
} from '../../../utils/blood-glucose.util'
import { getDateTitle } from '../../../utils/tooltip.util'
import i18next from 'i18next'
import styles from './cbg-tooltip.css'
import commonStyles from '../tooltip-common.css'
import { getOutOfRangeAnnotationMessages } from '../../../utils/annotations.util'
import { formatBgValue } from '../../../utils/format.util'
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
import { BgPrefs, Cbg, ClassificationType } from '../../../models/blood-glucose.model'

interface CbgTooltipProps {
  bgPrefs: BgPrefs
  cbg: Cbg
  position: Position
  side: Side
  timePrefs: TimePrefs
}

const t = i18next.t.bind(i18next)

export const CbgTooltip: FunctionComponent<CbgTooltipProps> = (props) => {
  const { bgPrefs, cbg, position, side, timePrefs } = props

  const hasAnnotations = cbg.annotations && cbg.annotations.length > 0
  const outOfRangeMessages = hasAnnotations ? getOutOfRangeAnnotationMessages(cbg.annotations) : []
  const outOfRangeThreshold = getOutOfRangeThreshold(cbg.annotations)
  const formattedValue = formatBgValue(cbg.value, bgPrefs, outOfRangeThreshold)
  const hasMessages = outOfRangeMessages.length !== 0

  const bgClass = getBgClass(
    reshapeBgClassesToBgBounds(bgPrefs),
    cbg.value,
    ClassificationType.FiveWay
  )

  const tooltipParams = {
    position,
    side: side || COMMON_TOOLTIP_SIDE,
    borderColor: colors[bgClass] || colors.bolus,
    dateTitle: getDateTitle(cbg, timePrefs)
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
          <div key={'bg'} className={styles.bg}>
            <div className={commonStyles.label}>{t('BG')}</div>
            <div className={commonStyles.value}>
              {formattedValue}
            </div>
          </div>
          {
            hasMessages &&
            <>
              <div
                key={'divider'}
                className={styles.dividerLarge}
                style={{ backgroundColor: colors[bgClass] }}
              />
              <div key={'outOfRange'} className={styles.annotation}>
                {outOfRangeMessages[0].message.value}
              </div>
            </>
          }
        </div>
      }
    />
  )
}
