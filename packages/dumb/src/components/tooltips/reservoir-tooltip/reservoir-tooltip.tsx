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
import commonStyles from '../../../styles/tooltip-common.css'
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
import { Manufacturer, TimePrefs } from '../../../settings/models'
import { Tooltip } from '../../../index'
import colors from '../../../styles/colors.css'
import { getDateTitle } from '../../../utils/tooltip.util'
import { Reservoir } from '../../../models/reservoir.model'

interface ReservoirTooltipProps {
  reservoir: Reservoir
  position: Position
  side: Side
  timePrefs: TimePrefs
}

enum ChangeType {
  InfusionSite = 'site',
  Reservoir = 'reservoir'
}

const t = i18next.t.bind(i18next)

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
    ? t('Reservoir Change')
    : t('Infusion site change')

  const tooltipParams = {
    position,
    side: side || COMMON_TOOLTIP_SIDE,
    borderColor: colors.deviceEvent,
    dateTitle: getDateTitle(reservoir, timePrefs)
  }

  return (
    <Tooltip
      position={tooltipParams.position}
      side={tooltipParams.side}
      borderColor={tooltipParams.borderColor}
      dateTitle={tooltipParams.dateTitle}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tail={DEFAULT_TOOLTIP_TAIL}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlex}>
          <div key={'title'} className={commonStyles.rowBold}>
            <div className={commonStyles.label}>{label}</div>
          </div>
        </div>
      }
    />
  )
}
