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
import { TimePrefs } from '../../../models/settings.model'
import styles from './parameter-tooltip.css'
import commonStyles from '../../../styles/tooltip-common.css'
import moment from 'moment-timezone'
import i18next from 'i18next'
import { Tooltip } from '../../../index'
import { formatParameterValue } from '../../../utils/format.util'
import { getHourMinuteFormat } from '../../../utils/datetime.util'
import { getDateTitle } from '../../../utils/tooltip.util'
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
import colors from '../../../styles/colors.css'
import { Parameter, ParameterData } from '../../../models/parameter.model'

interface ParameterTooltipProps {
  parameter: ParameterData
  position: Position
  side: Side
  timePrefs: TimePrefs
}

export const ParameterTooltip: FunctionComponent<ParameterTooltipProps> = (props) => {
  const { parameter, position, side, timePrefs } = props

  const hourMinuteFormat = getHourMinuteFormat()

  const tooltipParams = {
    position,
    side: side || COMMON_TOOLTIP_SIDE,
    borderColor: colors.deviceEvent,
    dateTitle: getDateTitle(parameter, timePrefs)
  }

  const renderParameter = (parameter: Parameter): JSX.Element => {
    const parameterId = parameter.id
    const hasPreviousValue = !!parameter.previousValue
    const formattedPreviousValue = hasPreviousValue && formatParameterValue(parameter.previousValue, parameter.units)
    const valueClasses = hasPreviousValue ? styles.value : `${styles.value} ${styles['value-no-prev']}`
    const displayHour = moment.tz(parameter.epoch, parameter.timezone).format(hourMinuteFormat)
    const value = formatParameterValue(parameter.value, parameter.units)

    return (
      <React.Fragment key={parameterId}>
        <span id={`tooltip-daily-parameter-${parameterId}-date`} className={styles.date}
              key={`${parameterId}-date`}>{displayHour}</span>
        <span id={`tooltip-daily-parameter-${parameterId}-name`} className={styles.label} key={`${parameterId}-name`}>
        {i18next.t(`params|${parameter.name}`)}
      </span>
        {
          hasPreviousValue &&
          <>
            <span id={`tooltip-daily-parameter-${parameterId}-prev`} className={styles.previous}
                  key={`${parameterId}-prev`}>{formattedPreviousValue}</span>
            <span id={`tooltip-daily-parameter-${parameterId}-arrow`} key={`${parameterId}-arrow`}>&rarr;</span>
          </>
        }
        <span id={`tooltip-daily-parameter-${parameterId}-value`} className={valueClasses}
              key={`${parameterId}-value`}>{value}</span>
        <span id={`tooltip-daily-parameter-${parameterId}-units`} className={commonStyles.units}
              key={`${parameterId}-units`}>{i18next.t(parameter.units)}</span>
      </React.Fragment>
    )
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
        <div id="tooltip-daily-parameters" className={styles.container}>
          {parameter.params.map((parameter: Parameter) => renderParameter(parameter))}
        </div>
      }
    />
  )
}
