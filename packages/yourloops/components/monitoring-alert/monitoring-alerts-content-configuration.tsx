/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import BasicDropdown from '../dropdown/basic-dropdown'
import TextField from '@mui/material/TextField'
import {
  buildBgValues,
  buildThresholds,
  onBasicDropdownSelect,
  PERCENTAGES
} from './monitoring-alert-content-configuration.util'
import FormHelperText from '@mui/material/FormHelperText'
import { useAuth } from '../../lib/auth'
import { Unit } from 'medical-domain'
import { ValueErrorMessagePair, ValueErrorPair } from './monitoring-alerts-content-configuration.hook'

const useStyles = makeStyles()((theme: Theme) => ({
  cancelButton: {
    marginRight: theme.spacing(2)
  },
  categoryInfo: {
    marginLeft: theme.spacing(3)
  },
  categoryTitle: {
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  defaultLabel: {
    marginTop: theme.spacing(2),
    fontSize: '10px',
    fontStyle: 'italic',
    marginLeft: theme.spacing(3)
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  dropdown: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  inputHelperText: {
    width: '100%',
    position: 'absolute',
    bottom: '-15px'
  },
  subCategoryContainer: {
    width: '55%'
  },
  subCategoryTitle: {
    fontWeight: 600,
    fontSize: '13px',
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  valueSelection: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(3)
  }
}))

export interface MonitoringAlertsContentConfigurationProps {
  displayInReadonly: boolean
  displayDefaultValues: boolean
  lowBg: ValueErrorMessagePair
  setLowBg: React.Dispatch<ValueErrorMessagePair>
  veryLowBg: ValueErrorMessagePair
  setVeryLowBg: React.Dispatch<ValueErrorMessagePair>
  highBg: ValueErrorMessagePair
  setHighBg: React.Dispatch<ValueErrorMessagePair>
  nonDataTxThreshold: ValueErrorPair
  setNonDataTxThreshold: React.Dispatch<ValueErrorPair>
  outOfRangeThreshold: ValueErrorPair
  setOutOfRangeThreshold: React.Dispatch<ValueErrorPair>
  hypoThreshold: ValueErrorPair
  setHypoThreshold: React.Dispatch<ValueErrorPair>
  onChange: (value: number, lowValue: number, highValue: number, setValue: React.Dispatch<ValueErrorPair>) => void
}

const INPUT_STEP_MGDL = 1
const INPUT_STEP_MMOLL = 0.1

const TIME_SPENT_OFF_TARGET_THRESHOLD_PERCENT = 50
const TIME_SPENT_SEVERE_HYPOGLYCEMIA_THRESHOLD_PERCENT = 5
const TIME_SPENT_WITHOUT_UPLOADED_DATA_THRESHOLD_PERCENT = 50

export const MonitoringAlertsContentConfiguration: FC<MonitoringAlertsContentConfigurationProps> = (
  {
    displayInReadonly,
    displayDefaultValues,
    lowBg,
    setLowBg,
    veryLowBg,
    setVeryLowBg,
    highBg,
    setHighBg,
    nonDataTxThreshold,
    setNonDataTxThreshold,
    outOfRangeThreshold,
    setOutOfRangeThreshold,
    hypoThreshold,
    setHypoThreshold,
    onChange
  }
) => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const { user } = useAuth()

  const bgUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter

  const { minLowBg, maxLowBg, minHighBg, maxHighBg, minVeryLowBg, maxVeryLowBg } = buildThresholds(bgUnit)
  const { highBgDefault, lowBgDefault, veryLowBgDefault } = buildBgValues(bgUnit)

  const inputStep = bgUnit === Unit.MilligramPerDeciliter ? INPUT_STEP_MGDL : INPUT_STEP_MMOLL

  return (
    <React.Fragment>
      <Box>
        <Typography className={classes.categoryTitle}>
          1. {t('time-away-from-target-range')}
        </Typography>
        <Typography variant="caption" className={classes.categoryInfo}>
          {t('current-trigger-setting-tir', {
            tir: outOfRangeThreshold.value,
            lowBg: lowBg.value,
            highBg: highBg.value,
            bgUnit
          })}
        </Typography>
        <Box display="flex" data-testid="time-target">
          <div className={classes.subCategoryContainer}>
            <Typography className={classes.subCategoryTitle}>
              A. {t('glycemic-target')}
            </Typography>
            <div className={classes.valueSelection}>
              <Box
                display="flex"
                alignItems="center"
                marginRight={2}
                paddingBottom={1}
                position="relative"
                data-testid="low-bg-text-field-id"
              >
                <Typography>{t('minimum')}</Typography>
                <TextField
                  disabled={displayInReadonly}
                  value={lowBg.value}
                  error={!!lowBg.errorMessage}
                  type="number"
                  className={classes.textField}
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: minLowBg,
                      max: maxLowBg,
                      step: inputStep,
                      'aria-label': t('low-bg-input')
                    }
                  }}
                  onChange={(event) => {
                    onChange(+event.target.value, minLowBg, maxLowBg, setLowBg)
                  }}
                />
                <Typography>{bgUnit}</Typography>
                {!!lowBg.errorMessage &&
                  <FormHelperText error className={classes.inputHelperText}>
                    {lowBg.errorMessage}
                  </FormHelperText>
                }
              </Box>
              <Box
                display="flex"
                alignItems="center"
                paddingBottom={1}
                position="relative"
                data-testid="high-bg-text-field-id"
              >
                <Typography>{t('maximum')}</Typography>
                <TextField
                  disabled={displayInReadonly}
                  value={highBg.value}
                  error={!!highBg.errorMessage}
                  type="number"
                  className={classes.textField}
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: minHighBg,
                      max: maxHighBg,
                      step: inputStep,
                      'aria-label': t('high-bg-input')
                    }
                  }}
                  onChange={(event) => {
                    onChange(+event.target.value, minHighBg, maxHighBg, setHighBg)
                  }}
                />
                <Typography>{bgUnit}</Typography>
                {!!highBg.errorMessage &&
                  <FormHelperText error className={classes.inputHelperText}>
                    {highBg.errorMessage}
                  </FormHelperText>
                }
              </Box>
            </div>
            {displayDefaultValues &&
              <Typography
                className={classes.defaultLabel}>{t('default-min-max', {
                min: `${lowBgDefault} ${bgUnit}`,
                max: `${highBgDefault} ${bgUnit}`
              })}</Typography>
            }
          </div>
          <div>
            <Typography className={classes.subCategoryTitle}>B. {t('event-trigger-threshold')}</Typography>
            <div className={classes.valueSelection}>
              <Typography>{t('time-spent-off-target')}</Typography>
              <div className={classes.dropdown} data-testid="dropdown-out-of-range">
                <BasicDropdown
                  disabled={displayInReadonly}
                  key={`out-of-range-${outOfRangeThreshold.value}`}
                  id="out-of-range"
                  defaultValue={`${outOfRangeThreshold.value}%` ?? ''}
                  values={PERCENTAGES}
                  error={outOfRangeThreshold.error}
                  onSelect={(value) => {
                    onBasicDropdownSelect(value, setOutOfRangeThreshold)
                  }}

                />
              </div>
            </div>
            {displayDefaultValues &&
              <Typography
                className={classes.defaultLabel}>{t('default', { value: `${TIME_SPENT_OFF_TARGET_THRESHOLD_PERCENT}%` })}</Typography>
            }
          </div>
        </Box>
        <Divider variant="middle" className={classes.divider} />
        <Typography className={classes.categoryTitle}>
          2. {t('severe-hypoglycemia')}
        </Typography>
        <Typography variant="caption" className={classes.categoryInfo}>
          {t('current-trigger-setting-hypoglycemia', {
            hypoThreshold: hypoThreshold.value,
            veryLowBg: veryLowBg.value,
            bgUnit
          })}
        </Typography>
        <Box display="flex" data-testid="severe-hypoglycemia">
          <div className={classes.subCategoryContainer}>
            <Typography className={classes.subCategoryTitle}>A. {t('severe-hypoglycemia-threshold', {
              hypoThreshold: hypoThreshold.value,
              veryLowBg: veryLowBg.value
            })}:</Typography>
            <Box
              className={classes.valueSelection}
              data-testid="very-low-bg-text-field-id"
              position="relative"
              paddingBottom={2}
            >
              <Typography>{t('severe-hypoglycemia-below')}</Typography>
              <TextField
                disabled={displayInReadonly}
                value={veryLowBg.value}
                error={!!veryLowBg.errorMessage}
                type="number"
                className={classes.textField}
                size="small"
                InputProps={{
                  inputProps: {
                    min: minVeryLowBg,
                    max: maxVeryLowBg,
                    step: inputStep,
                    'aria-label': t('very-low-bg-input')
                  }
                }}
                onChange={(event) => {
                  onChange(+event.target.value, minVeryLowBg, maxVeryLowBg, setVeryLowBg)
                }}
              />
              <Typography data-testid="bgUnits-severalHypo">{bgUnit}</Typography>
              {!!veryLowBg.errorMessage &&
                <FormHelperText error className={classes.inputHelperText}>
                  {veryLowBg.errorMessage}
                </FormHelperText>
              }
            </Box>
            {displayDefaultValues &&
              <Typography
                className={classes.defaultLabel}>{t('default', { value: `${veryLowBgDefault} ${bgUnit}` })}</Typography>
            }
          </div>
          <div>
            <Typography className={classes.subCategoryTitle}>
              B. {t('event-trigger-threshold')}
            </Typography>
            <div className={classes.valueSelection} data-testid="dropdown-hypo">
              <Typography>{t('time-spent-severe-hypoglycemia')}</Typography>
              <div className={classes.dropdown}>
                <BasicDropdown
                  disabled={displayInReadonly}
                  key={`hypo-threshold-${hypoThreshold.value}`}
                  id="hypo-threshold"
                  defaultValue={`${hypoThreshold.value}%` ?? ''}
                  values={PERCENTAGES}
                  error={hypoThreshold.error}
                  onSelect={(value) => {
                    onBasicDropdownSelect(value, setHypoThreshold)
                  }}
                />
              </div>
            </div>
            {displayDefaultValues &&
              <Typography
                className={classes.defaultLabel}>{t('default', { value: `${TIME_SPENT_SEVERE_HYPOGLYCEMIA_THRESHOLD_PERCENT}%` })}</Typography>
            }
          </div>
        </Box>
        <Divider variant="middle" className={classes.divider} />

        <Typography className={classes.categoryTitle}>
          3. {t('data-not-transmitted')}
        </Typography>
        <Typography variant="caption" className={classes.categoryInfo}>
          {t('current-trigger-setting-data', { nonDataThreshold: nonDataTxThreshold.value })}
        </Typography>
        <Box display="flex">
          <div className={classes.subCategoryContainer}>
            <Typography className={classes.subCategoryTitle}>A. {t('event-trigger-threshold')}</Typography>
            <div className={classes.valueSelection}>
              <Typography>{t('time-spent-without-uploaded-data')}</Typography>
              <div className={classes.dropdown} data-testid="dropdown-nonData">
                <BasicDropdown
                  disabled={displayInReadonly}
                  key={`tir-dropdown-${nonDataTxThreshold.value}`}
                  id="non-data"
                  defaultValue={`${nonDataTxThreshold.value}%` ?? ''}
                  values={PERCENTAGES.slice(0, 10)}
                  error={nonDataTxThreshold.error}
                  onSelect={(value) => {
                    onBasicDropdownSelect(value, setNonDataTxThreshold)
                  }}
                />
              </div>
            </div>
            {displayDefaultValues &&
              <Typography
                className={classes.defaultLabel}>{t('default', { value: `${TIME_SPENT_WITHOUT_UPLOADED_DATA_THRESHOLD_PERCENT}%` })}</Typography>
            }
          </div>
        </Box>
      </Box>
    </React.Fragment>
  )
}

