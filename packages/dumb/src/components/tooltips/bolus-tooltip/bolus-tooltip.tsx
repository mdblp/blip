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

import React, { FunctionComponent } from 'react'
import { Bolus, Prescriptor, TimePrefs, Wizard } from 'medical-domain'
import { Tooltip } from '../../../index'
import { getDateTitle } from '../../../utils/tooltip/tooltip.util'
import { getBolusType, getDelivered, getProgrammed, isInterruptedBolus } from '../../../utils/bolus/bolus.util'
import { BolusType } from '../../../models/enums/bolus-type.enum'
import { useTranslation } from 'react-i18next'
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
import { formatInsulin } from '../../../utils/format/format.util'

interface BolusTooltipProps {
  bolus: Bolus | Wizard
  side: Side
  position: Position
  timePrefs: TimePrefs
}

export const BolusTooltip: FunctionComponent<BolusTooltipProps> = (props) => {
  const { bolus, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const getTitleByBolusType = (bolusType: BolusType): string => {
    switch (bolusType) {
      case BolusType.Manual:
        return t('Manual Bolus')
      case BolusType.Meal:
        return t('Meal Bolus')
      case BolusType.Micro:
        return t('Micro Bolus')
    }
  }

  const getColorByBolusType = (bolusType: BolusType): string => {
    switch (bolusType) {
      case BolusType.Manual:
        return colors.bolusManual
      case BolusType.Meal:
        return colors.bolusMeal
      case BolusType.Micro:
        return colors.bolusMicro
    }
  }

  const renderNormal = (bolus: Bolus): JSX.Element => {
    const prescriptor = bolus.prescriptor
    const bolusType = bolus.subType
    const iob = bolus.insulinOnBoard
    const delivered = getDelivered(bolus)
    const isInterrupted = isInterruptedBolus(bolus)
    const programmed = getProgrammed(bolus) ?? 0
    const undeliveredValue = programmed - delivered

    return (
      <div className={styles.container} id="bolus-tooltip-content">
        {iob &&
          <div className={styles.iob} id="bolus-tooltip-line-iob">
            <div className={styles.label} id="bolus-tooltip-line-iob-label">{t('IOB')}</div>
            <div className={styles.value} id="bolus-tooltip-line-iob-value">{formatInsulin(iob)}</div>
            <div className={styles.units} id="bolus-tooltip-line-iob-units">{t('U')}</div>
          </div>
        }
        {prescriptor && prescriptor !== Prescriptor.Manual &&
          <div className={styles.prescriptor} id="bolus-tooltip-line-prescriptor">
            <div className={styles.label} id="bolus-tooltip-line-prescriptor-label">{t('Prescribed by Loop Mode')}</div>
          </div>
        }
        {bolusType &&
          <div className={styles.bolus} id="bolus-tooltip-line-type">
            <div className={styles.label} id="bolus-tooltip-line-type-label">{t('bolus_type')}</div>
            <div className={styles.value} id="bolus-tooltip-line-type-value">{t(`bolus_${bolusType}`)}</div>
          </div>
        }
        {isInterrupted &&
          <div className={styles.undelivered} id="bolus-tooltip-line-undelivered">
            <div className={styles.label} id="bolus-tooltip-line-undelivered-label">{t('Undelivered')}</div>
            <div className={styles.value} id="bolus-tooltip-line-undelivered-value">{undeliveredValue}</div>
            <div className={styles.units} id="bolus-tooltip-line-undelivered-units">{t('U')}</div>
          </div>
        }
        {Number.isFinite(delivered) &&
          <div className={styles.delivered} id="bolus-tooltip-line-delivered">
            <div className={styles.label} id="bolus-tooltip-line-delivered-label">{t('Delivered')}</div>
            <div className={styles.value} id="bolus-tooltip-line-delivered-value">{`${formatInsulin(delivered)}`}</div>
            <div className={styles.units} id="bolus-tooltip-line-delivered-units">{t('U')}</div>
          </div>
        }
      </div>
    )
  }

  const renderWizard = (wizard: Wizard): JSX.Element => {
    // const recommended = bolusUtils.getRecommended(wizard)
    // const suggested = _.isFinite(recommended) ? recommended : null
    const prescriptor = wizard.bolus?.prescriptor
    const inputTime = null
    const bolusType = wizard.bolus?.subType
    // FIXME no inputMeal on Wizard type
    // const fatMeal = wizard.inputMeal.fat
    // const fatMeal = _.get(wizard, 'inputMeal.fat', 'no')
    const iob = wizard.bolus?.insulinOnBoard
    const carbs = wizard.carbInput
    const delivered = getDelivered(wizard)
    const isInterrupted = isInterruptedBolus(wizard)
    const programmed = getProgrammed(wizard.bolus)

    const overrideLine = this.getOverrideLine(programmed, recommended)
    const deliveredLine = this.getDeliveredLine(delivered)
    const undeliveredLine = isInterrupted ? this.getUndeliveredLine(programmed - delivered) : null
    // const recommendedLine = (isInterrupted || overrideLine !== null) && suggested !== null ? this.getRecommendedLine(suggested) : null
    const carbsLine = this.getCarbsLine(carbs)

    const iobLine = this.getIobLine(iob)
    const bolusTypeLine = this.getBolusTypeLine(bolusType)
    const prescriptorLine = this.getPrescriptorLine(prescriptor)

    // const mealLine = this.getMealLine(fatMeal)
    const inputLine = this.getInputTimeLine(inputTime, timePrefs)

    return (
      <div className={styles.container}>
        {carbsLine}
        {/*{mealLine}*/}
        {inputLine}
        {iobLine}
        {(prescriptorLine || bolusTypeLine) && <div className={styles.dividerSmall} />}
        {prescriptorLine}
        {bolusTypeLine}
        {/*{(overrideLine || recommendedLine) && <div className={styles.dividerSmall} />}*/}
        {overrideLine && <div className={styles.dividerSmall} />}
        {/*{recommendedLine}*/}
        {overrideLine}
        {undeliveredLine}
        {deliveredLine}
      </div>
    )
  }

  const renderBolus = (): JSX.Element => {
    return bolus.type === 'wizard' ? renderWizard() : renderNormal()
  }

  const bolusType = getBolusType(bolus)
  const bolusTypeTitle = getTitleByBolusType(bolusType)
  const color = getColorByBolusType(bolusType)

  return (
    <Tooltip
      dateTitle={getDateTitle(bolus, timePrefs)}
      title={bolusTypeTitle}
      borderColor={color}
      position={position}
      side={side || COMMON_TOOLTIP_SIDE}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tail={DEFAULT_TOOLTIP_TAIL}
      offset={DEFAULT_TOOLTIP_OFFSET}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      content={this.renderBolus()}
    />
  )
}
