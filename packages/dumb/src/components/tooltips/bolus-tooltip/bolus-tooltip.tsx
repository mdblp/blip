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
import { Bolus, DatumType, Prescriptor, TimePrefs, Wizard, WizardInputMealFat } from 'medical-domain'
import { Tooltip } from '../../../index'
import { getDateTitle } from '../../../utils/tooltip/tooltip.util'
import {
  getBolusFromInsulinEvent,
  getBolusType,
  getDelivered,
  getProgrammed,
  getRecommended,
  isInterruptedBolus
} from '../../../utils/bolus/bolus.util'
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
} from '../common/tooltip/tooltip'
import { formatInputTime, formatInsulin } from '../../../utils/format/format.util'
import styles from './bolus-tooltip.css'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'

interface BolusTooltipProps {
  bolus: Bolus | Wizard
  side: Side
  position: Position
  timePrefs: TimePrefs
}

export const BolusTooltip: FunctionComponent<BolusTooltipProps> = (props) => {
  const { bolus, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const isWizard = bolus.type === DatumType.Wizard

  const bolusData = getBolusFromInsulinEvent(bolus)

  // Common properties
  const prescriptor = bolusData?.prescriptor
  const shouldDisplayPrescriptor = prescriptor && prescriptor !== Prescriptor.Manual
  const bolusSubType = bolusData?.subType
  const iob = bolusData?.insulinOnBoard
  const delivered = getDelivered(bolusData as Bolus)
  const isInterrupted = isInterruptedBolus(bolusData as Bolus)
  const programmed = getProgrammed(bolusData as Bolus) ?? 0
  const undeliveredValue = programmed - delivered

  // Wizard-specific properties
  const carbs = (bolus as Wizard).carbInput
  const fatMeal = (bolus as Wizard).inputMeal?.fat
  const isFatMeal = fatMeal === WizardInputMealFat.Yes
  const inputTime = (bolus as Wizard).inputTime
  const recommended = getRecommended(bolus as Wizard)
  const suggested = Number.isFinite(recommended) ? recommended : null
  const override = programmed - recommended
  const overrideValue = programmed > recommended ? `+${override}` : `-${override}`
  const shouldDisplayOverride = Number.isFinite(programmed) && Number.isFinite(recommended) && programmed !== recommended
  const shouldDisplayRecommended = (isInterrupted || shouldDisplayOverride) && suggested !== null

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

  const bolusType = getBolusType(bolus)
  const bolusTypeTitle = getTitleByBolusType(bolusType)
  const color = getColorByBolusType(bolusType)

  const insulinUnitLabel = t('U')

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
      content={
        <div className={styles.container} id="bolus-tooltip-content">
          {isWizard && carbs &&
            <TooltipLine label={t('Carbs')} value={carbs} units={t('g')}></TooltipLine>
          }
          {isWizard && isFatMeal &&
            <TooltipLine label={t('High fat meal')}></TooltipLine>
          }
          {isWizard && inputTime &&
            <TooltipLine label={`${t('Entered at')} ${formatInputTime(inputTime, timePrefs)}`}></TooltipLine>
          }
          {iob &&
            <TooltipLine label={t('IOB')} value={formatInsulin(iob)} units={insulinUnitLabel}></TooltipLine>
          }
          {isWizard && (shouldDisplayPrescriptor ?? bolusSubType) && <div className={styles.dividerSmall} />}
          {shouldDisplayPrescriptor &&
            <TooltipLine label={t('Prescribed by Loop Mode')}></TooltipLine>
          }
          {bolusSubType &&
            <TooltipLine label={t('bolus_type')} value={t(`bolus_${bolusSubType}`)}></TooltipLine>
          }
          {isWizard && (shouldDisplayOverride || shouldDisplayRecommended) && <div className={styles.dividerSmall} />}
          {isWizard && shouldDisplayRecommended &&
            <TooltipLine label={t('Recommended')} value={formatInsulin(recommended)} units={insulinUnitLabel} isBold={true}></TooltipLine>
          }
          {isWizard && shouldDisplayOverride &&
            <TooltipLine label={t('Override')} value={overrideValue} units={insulinUnitLabel} isBold={true} customColor={true}></TooltipLine>
          }
          {isInterrupted &&
            <TooltipLine label={t('Undelivered')} value={undeliveredValue} units={insulinUnitLabel} isBold={true} customColor={true}></TooltipLine>
          }
          {Number.isFinite(delivered) &&
            <TooltipLine label={t('Delivered')} value={formatInsulin(delivered)} units={insulinUnitLabel} isBold={true}></TooltipLine>
          }
        </div>
      }
    />
  )
}
