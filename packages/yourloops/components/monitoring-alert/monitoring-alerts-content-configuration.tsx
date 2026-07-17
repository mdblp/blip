/*
 * Copyright (c) 2022-2026, Diabeloop
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

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { Unit } from 'medical-domain'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { HyperglycemiaIcon } from '../icons/diabeloop/hyperglycemia-icon'
import { HypoglycemiaIcon } from '../icons/diabeloop/hypoglycemia-icon'
import { NoDataIcon } from '../icons/diabeloop/no-data-icon'
import { TimeSpentOufOfRangeIcon } from '../icons/diabeloop/time-spent-ouf-of-range-icon'
import {
  buildThresholds,
  getErrorMessage,
  getPercentageLabel,
  getPercentageLabels
} from './monitoring-alert-content-configuration.util'
import { MonitoringValuesDisplayed } from './monitoring-alerts-content-configuration.hook'
import { DropdownParams, SingleAlertConfiguration, TextFieldParams } from './single-alert-configuration'

const useStyles = makeStyles()((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
}))

export interface MonitoringAlertsContentConfigurationProps {
  bgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
  displayInReadonly: boolean
  monitoringValuesDisplayed: MonitoringValuesDisplayed
  setMonitoringValuesDisplayed: React.Dispatch<MonitoringValuesDisplayed>
  onValueChange?: (newMonitoringParametersValuesToDisplay: MonitoringValuesDisplayed) => void
}

const TIME_SPENT_OFF_TARGET_THRESHOLD_PERCENT = 50
const TIME_SPENT_SEVERE_HYPOGLYCEMIA_THRESHOLD_PERCENT = 5
const TIME_SPENT_HYPERGLYCEMIA_THRESHOLD_PERCENT = 25
const TIME_SPENT_WITHOUT_UPLOADED_DATA_THRESHOLD_PERCENT = 50

// Extract the first numeric value (integer or decimal) from a string
const NUMERIC_VALUE_REGEX = /(\d+(?:[.,]\d+)?)/

export const MonitoringAlertsContentConfiguration: FC<MonitoringAlertsContentConfigurationProps> = (
  {
    bgUnit,
    displayInReadonly,
    monitoringValuesDisplayed,
    setMonitoringValuesDisplayed,
    onValueChange = () => {
    }
  }
) => {
  const { classes } = useStyles()
  const { t } = useTranslation()

  const {
    minLowBg,
    maxLowBg,
    minHighBg,
    maxHighBg,
    minVeryLowBg,
    maxVeryLowBg,
    minVeryHighBg,
    maxVeryHighBg
  } = buildThresholds(bgUnit)

  const updateValues = (patch: Partial<MonitoringValuesDisplayed>): void => {
    const newValues: MonitoringValuesDisplayed = { ...monitoringValuesDisplayed, ...patch }
    setMonitoringValuesDisplayed(newValues)
    onValueChange(newValues)
  }

  const getTextFieldParams = (
    key: 'lowBg' | 'highBg' | 'veryLowBg' | 'veryHighBg',
    label: string,
    dataTestId: string,
    ariaLabel: string,
    minValue: number,
    maxValue: number
  ): TextFieldParams => {
    return {
      label,
      dataTestId,
      ariaLabel,
      minValue,
      maxValue,
      value: monitoringValuesDisplayed[key].value,
      errorMessage: monitoringValuesDisplayed[key].errorMessage,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value
        updateValues({ [key]: { value, errorMessage: getErrorMessage(bgUnit, value, minValue, maxValue) } })
      }
    }
  }

  const getDropdownParams = (
    key: 'outOfRangeThreshold' | 'hypoThreshold' | 'hyperThreshold' | 'nonDataTxThreshold',
    label: string,
    id: string,
    dataTestId: string,
    thresholdPercent: number,
    sliceEnd?: number
  ): DropdownParams => {
    const values = getPercentageLabels(thresholdPercent)

    return {
      label,
      id,
      dataTestId,
      defaultValue: getPercentageLabel(monitoringValuesDisplayed[key].value, thresholdPercent),
      values: sliceEnd ? values.slice(0, sliceEnd) : values,
      error: monitoringValuesDisplayed[key].error,
      onSelect: (label: string) => {
        const match = new RegExp(NUMERIC_VALUE_REGEX).exec(label)
        const parsedValue = match ? Number.parseFloat(match[1].replace(',', '.')) : Number.NaN

        updateValues({ [key]: { value: parsedValue, error: false } })
      }
    }
  }

  const targetMinGlycemiaTextFieldParams = getTextFieldParams('lowBg', t('minimum'), 'low-bg-text-field-id', t('low-bg-input'), minLowBg, maxLowBg)
  const targetMaxGlycemiaTextFieldParams = getTextFieldParams('highBg', t('maximum'), 'high-bg-text-field-id', t('high-bg-input'), minHighBg, maxHighBg)
  const hyperglycemiaTextFieldParams = getTextFieldParams('veryHighBg', t('hyperglycemia-above'), 'very-high-bg-text-field-id', t('very-high-bg-input'), minVeryHighBg, maxVeryHighBg)
  const hypoglycemiaTextFieldParams = getTextFieldParams('veryLowBg', t('hypoglycemia-below'), 'very-low-bg-text-field-id', t('very-low-bg-input'), minVeryLowBg, maxVeryLowBg)

  const targetPercentageDropdown = getDropdownParams('outOfRangeThreshold', t('time-spent-off-target'), 'out-of-range', 'dropdown-out-of-range', TIME_SPENT_OFF_TARGET_THRESHOLD_PERCENT)
  const hyperglycemiaPercentageDropdown = getDropdownParams('hyperThreshold', t('time-spent-hyperglycemia'), 'hyper-threshold', 'dropdown-hyper', TIME_SPENT_HYPERGLYCEMIA_THRESHOLD_PERCENT)
  const hypoglycemiaPercentageDropdown = getDropdownParams('hypoThreshold', t('time-spent-hypoglycemia'), 'hypo-threshold', 'dropdown-hypo', TIME_SPENT_SEVERE_HYPOGLYCEMIA_THRESHOLD_PERCENT)
  const noDataPercentageDropdown = getDropdownParams('nonDataTxThreshold', t('time-spent-without-uploaded-data'), 'non-data', 'dropdown-nonData', TIME_SPENT_WITHOUT_UPLOADED_DATA_THRESHOLD_PERCENT, 10)

  return (
    <Box>
      <SingleAlertConfiguration
        title={t('time-away-from-target-range')}
        icon={<TimeSpentOufOfRangeIcon />}
        dataTestId="time-target"
        isReadonly={displayInReadonly}
        textFieldsSubtitle={t('glycemic-target')}
        dropdownSubTitle={t('event-trigger-threshold')}
        textFieldParams={targetMinGlycemiaTextFieldParams}
        textFieldParams2={targetMaxGlycemiaTextFieldParams}
        dropdownParams={targetPercentageDropdown}
        unit={bgUnit}
      />

      <Divider variant="middle" className={classes.divider} />

      <SingleAlertConfiguration
        title={t('hyperglycemia')}
        icon={<HyperglycemiaIcon color="warning" />}
        dataTestId="hyperglycemia"
        isReadonly={displayInReadonly}
        textFieldsSubtitle={t('hyperglycemia-threshold')}
        dropdownSubTitle={t('event-trigger-threshold')}
        textFieldParams={hyperglycemiaTextFieldParams}
        dropdownParams={hyperglycemiaPercentageDropdown}
        unit={bgUnit}
      />

      <Divider variant="middle" className={classes.divider} />

      <SingleAlertConfiguration
        title={t('hypoglycemia')}
        icon={<HypoglycemiaIcon color="error" />}
        dataTestId="hypoglycemia"
        isReadonly={displayInReadonly}
        textFieldsSubtitle={t('hypoglycemia-threshold')}
        dropdownSubTitle={t('event-trigger-threshold')}
        textFieldParams={hypoglycemiaTextFieldParams}
        dropdownParams={hypoglycemiaPercentageDropdown}
        unit={bgUnit}
      />

      <Divider variant="middle" className={classes.divider} />

      <SingleAlertConfiguration
        title={t('data-not-transmitted')}
        icon={<NoDataIcon />}
        dataTestId="data-not-transmitted"
        isReadonly={displayInReadonly}
        dropdownSubTitle={t('event-trigger-threshold')}
        dropdownParams={noDataPercentageDropdown}
        unit={bgUnit}
      />
    </Box>
  )
}

