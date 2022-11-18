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
import i18next from 'i18next'
import styles from './reservoir-tooltip.css'
import { DEFAULT_TOOLTIP_OFFSET, Position, Side } from '../tooltip/tooltip'
import { Manufacturer, Pump, Source, TimePrefs, TIMEZONE_UTC } from '../../../settings/models'
import { Tooltip } from '../../../index'
import colors from '../../../styles/colors.css'

interface ReservoirTooltipProps {
  reservoir: {
    source: Source
    normalTime: string
    timezone: string
    pump: Pump
  }
  position: Position
  side: Side
  timePrefs: TimePrefs
}

enum ChangeType {
  InfusionSite = 'site',
  Reservoir = 'reservoir'
}

export const ReservoirTooltip: FunctionComponent<ReservoirTooltipProps> = (props) => {
  const { reservoir, position, side, timePrefs } = props

  const getChangeTypeByManufacturer = (manufacturer: Manufacturer): ChangeType => {
    switch (manufacturer) {
      case Manufacturer.Vicentra:
      case Manufacturer.Roche:
        return ChangeType.Reservoir
      case Manufacturer.Default:
      default:
        return ChangeType.InfusionSite
    }
  }

  const manufacturer = reservoir.pump?.manufacturer || Manufacturer.Default
  const changeType: ChangeType = getChangeTypeByManufacturer(manufacturer)
  const label = (changeType === ChangeType.Reservoir)
    ? i18next.t('Reservoir Change')
    : i18next.t('Infusion site change')

  const tooltipParams = {
    position,
    side: side || 'right',
    tail: true,
    tailWidth: 9,
    tailHeight: 17,
    borderColor: colors.deviceEvent,
    borderWidth: 2,
    dateTitle: {
      source: reservoir.source || Source.Diabeloop,
      normalTime: reservoir.normalTime,
      timezone: reservoir.timezone || TIMEZONE_UTC,
      timePrefs
    }
  }

  return (
    <Tooltip
      position={tooltipParams.position}
      side={tooltipParams.side}
      tail={tooltipParams.tail}
      tailHeight={tooltipParams.tailHeight}
      tailWidth={tooltipParams.tailWidth}
      borderColor={tooltipParams.borderColor}
      borderWidth={tooltipParams.borderWidth}
      dateTitle={tooltipParams.dateTitle}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={styles.container}>
          <div key={'title'} className={styles.pa}>
            <div className={styles.label}>{label}</div>
          </div>
        </div>
      }
    />
  )
}
