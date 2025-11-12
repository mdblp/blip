/*
 * Copyright (c) 2023-2025, Diabeloop
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
import {
  type Bolus,
  BolusSubtype,
  DatumType,
  Prescriptor,
  type TimePrefs,
  type Wizard,
  WizardInputMealFat
} from 'medical-domain'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
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
import { DEFAULT_TOOLTIP_OFFSET, type Position, Tooltip } from '../common/tooltip/tooltip'
import { formatInputTime, formatInsulin } from '../../../utils/format/format.util'
import styles from './bolus-tooltip.css'
import commonStyles from '../../../styles/tooltip-common.css'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { TooltipColor } from '../../../models/enums/tooltip-color.enum'
import { TooltipSide } from '../../../models/enums/tooltip-side.enum'

interface BolusTooltipProps {
  bolus: Bolus | Wizard
  side: TooltipSide
  position: Position
  timePrefs: TimePrefs
}

const HIDDEN_PRESCRIPTORS = [Prescriptor.EatingShortlyManagement, Prescriptor.Manual]

const MINIMAL_OVERRIDE = 0.1

export const BolusTooltip: FunctionComponent<BolusTooltipProps> = (props) => {
  const { bolus, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const isWizard = bolus.type === DatumType.Wizard

  const bolusData = getBolusFromInsulinEvent(bolus)

  // Common properties
  const prescriptor = bolusData?.prescriptor
  const shouldDisplayPrescriptor = prescriptor && !HIDDEN_PRESCRIPTORS.includes(prescriptor)
  const bolusSubType = bolusData?.subType
  const iob = bolusData?.insulinOnBoard
  const delivered = getDelivered(bolusData as Bolus)
  const isInterrupted = isInterruptedBolus(bolusData as Bolus)
  const programmed = getProgrammed(bolusData as Bolus) ?? 0
  const undeliveredValue = formatInsulin(programmed - delivered)

  // Wizard-specific properties
  const carbs = (bolus as Wizard).carbInput
  const fatMeal = (bolus as Wizard).inputMeal?.fat
  const isFatMeal = fatMeal === WizardInputMealFat.Yes
  const inputTime = (bolus as Wizard).inputTime
  const recommended = getRecommended(bolus as Wizard)
  const suggested = Number.isFinite(recommended) ? recommended : null

  const rawOverride = programmed - recommended
  const override = formatInsulin(rawOverride)
  const overrideValue = programmed > recommended ? `+${override}` : override.toString()
  const shouldDisplayOverride = Number.isFinite(programmed) && Number.isFinite(recommended) && Math.abs(rawOverride) >= MINIMAL_OVERRIDE
  const shouldDisplayRecommended = (isInterrupted || shouldDisplayOverride) && suggested !== null

  const getTitleByBolusType = (bolusType: BolusType): string => {
    switch (bolusType) {
      case BolusType.Manual:
        return t('Manual Bolus')
      case BolusType.Meal:
      case BolusType.EatingShortly:
        return t('Meal Bolus')
      case BolusType.Correction:
        return t('Correction')
      case BolusType.Pen:
        return t('bolus_pen')
      default:
        return ''
    }
  }

  const getColorByBolusType = (bolusType: BolusType): string => {
    switch (bolusType) {
      case BolusType.Manual:
        return colors.darkBlueBackground
      case BolusType.Meal:
      case BolusType.EatingShortly:
        return colors.greenBackground
      case BolusType.Correction:
        return colors.blueBackground
      case BolusType.Pen:
        return colors.purpleBackground
      default:
        return ''
    }
  }

  const bolusType = getBolusType(bolus)
  const bolusTypeTitle = getTitleByBolusType(bolusType)
  const color = getColorByBolusType(bolusType)

  const isEatingShortlyBolus = bolusType === BolusType.EatingShortly

  const insulinUnitLabel = t('U')

  return (
    <Tooltip
      dateTitle={getDateTitleForBaseDatum(bolus, timePrefs)}
      title={bolusTypeTitle}
      backgroundColor={color}
      position={position}
      side={side}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlexLarge} id="bolus-tooltip-content">
          {isWizard && carbs &&
            <TooltipLine label={t('Carbs')} value={carbs} units={t('g')} />
          }
          {isWizard && isFatMeal &&
            <TooltipLine label={t('High fat meal')} />
          }
          {isEatingShortlyBolus &&
            <TooltipLine label={t('meal-without-carb-counting')} />
          }
          {isWizard && inputTime &&
            <TooltipLine label={`${t('Entered at')} ${formatInputTime(inputTime, timePrefs)}`} />
          }
          {iob &&
            <TooltipLine label={t('IOB')} value={formatInsulin(iob)} units={insulinUnitLabel} />
          }
          {isWizard && (shouldDisplayPrescriptor ?? bolusSubType) && <div className={styles.dividerSmall} />}
          {shouldDisplayPrescriptor &&
            <TooltipLine label={t('Prescribed by Loop Mode')} />
          }
          {bolusSubType && bolusSubType !== BolusSubtype.Pen &&
            <TooltipLine label={t('bolus_type')} value={t(`bolus_${bolusSubType}`)} />
          }
          {isWizard && (shouldDisplayOverride || shouldDisplayRecommended) && <div className={styles.dividerSmall} />}
          {isWizard && shouldDisplayRecommended &&
            <TooltipLine label={t('Recommended')} value={formatInsulin(recommended)} units={insulinUnitLabel} isBold />
          }
          {isWizard && shouldDisplayOverride &&
            <TooltipLine label={t('Override')} value={overrideValue} units={insulinUnitLabel} isBold
                         customColor={TooltipColor.Undelivered} />
          }
          {isInterrupted &&
            <TooltipLine label={t('Undelivered')} value={undeliveredValue} units={insulinUnitLabel} isBold
                         customColor={TooltipColor.Undelivered} />
          }
          {Number.isFinite(delivered) &&
            <TooltipLine label={t('Delivered')} value={formatInsulin(delivered)} units={insulinUnitLabel} isBold />
          }
        </div>
      }
    />
  )
}
