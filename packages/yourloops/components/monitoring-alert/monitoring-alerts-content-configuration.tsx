/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import BasicDropdown from '../dropdown/basic-dropdown'
import TextField from '@mui/material/TextField'
import {
  buildBgValues,
  buildThresholds,
  getErrorMessage,
  PERCENTAGES
} from './monitoring-alert-content-configuration.util'
import FormHelperText from '@mui/material/FormHelperText'
import { Unit } from 'medical-domain'
import { MonitoringValuesDisplayed } from './monitoring-alerts-content-configuration.hook'

const useStyles = makeStyles()((theme) => ({
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
  bgUnit: Unit.MilligramPerDeciliter | Unit.MmolPerLiter
  displayInReadonly: boolean
  displayDefaultValues: boolean
  monitoringValuesDisplayed: MonitoringValuesDisplayed
  setMonitoringValuesDisplayed: React.Dispatch<MonitoringValuesDisplayed>
  onValueChange?: (newMonitoringParametersValuesToDisplay: MonitoringValuesDisplayed) => void
}

const INPUT_STEP_MGDL = 1
const INPUT_STEP_MMOLL = 0.1

const TIME_SPENT_OFF_TARGET_THRESHOLD_PERCENT = 50
const TIME_SPENT_SEVERE_HYPOGLYCEMIA_THRESHOLD_PERCENT = 5
const TIME_SPENT_WITHOUT_UPLOADED_DATA_THRESHOLD_PERCENT = 50

export const MonitoringAlertsContentConfiguration: FC<MonitoringAlertsContentConfigurationProps> = (
  {
    bgUnit,
    displayInReadonly,
    displayDefaultValues,
    monitoringValuesDisplayed,
    setMonitoringValuesDisplayed,
    onValueChange = () => {
    }
  }
) => {
  const { classes } = useStyles()
  const { t } = useTranslation()

  const { minLowBg, maxLowBg, minHighBg, maxHighBg, minVeryLowBg, maxVeryLowBg } = buildThresholds(bgUnit)
  const { highBgDefault, lowBgDefault, veryLowBgDefault } = buildBgValues(bgUnit)

  const inputStep = bgUnit === Unit.MilligramPerDeciliter ? INPUT_STEP_MGDL : INPUT_STEP_MMOLL

  return (
    <Box>
      <Typography className={classes.categoryTitle}>
        1. {t('time-away-from-target-range')}
      </Typography>
      <Typography variant="caption" className={classes.categoryInfo}>
        {t('current-trigger-setting-tir', {
          tir: monitoringValuesDisplayed.outOfRangeThreshold.value,
          lowBg: monitoringValuesDisplayed.lowBg.value,
          highBg: monitoringValuesDisplayed.highBg.value,
          bgUnit
        })}
      </Typography>
      <Box data-testid="time-target" sx={{ display: "flex" }}>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>
            A. {t('glycemic-target')}
          </Typography>
          <div className={classes.valueSelection}>
            <Box
              data-testid="low-bg-text-field-id"
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: 2,
                paddingBottom: 1,
                position: "relative"
              }}>
              <Typography>{t('minimum')}</Typography>
              <TextField
                disabled={displayInReadonly}
                value={monitoringValuesDisplayed.lowBg.value}
                error={!!monitoringValuesDisplayed.lowBg.errorMessage}
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
                  const value = +event.target.value
                  const newValuesToDisplay: MonitoringValuesDisplayed = {
                    ...monitoringValuesDisplayed,
                    lowBg: {
                      value,
                      errorMessage: getErrorMessage(bgUnit, value, minLowBg, maxLowBg)
                    }
                  }
                  setMonitoringValuesDisplayed(newValuesToDisplay)
                  onValueChange(newValuesToDisplay)
                }}
              />
              <Typography>{bgUnit}</Typography>
              {!!monitoringValuesDisplayed.lowBg.errorMessage &&
                <FormHelperText error className={classes.inputHelperText}>
                  {monitoringValuesDisplayed.lowBg.errorMessage}
                </FormHelperText>
              }
            </Box>
            <Box
              data-testid="high-bg-text-field-id"
              sx={{
                display: "flex",
                alignItems: "center",
                paddingBottom: 1,
                position: "relative"
              }}>
              <Typography>{t('maximum')}</Typography>
              <TextField
                disabled={displayInReadonly}
                value={monitoringValuesDisplayed.highBg.value}
                error={!!monitoringValuesDisplayed.highBg.errorMessage}
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
                  const value = +event.target.value
                  const newValuesToDisplay: MonitoringValuesDisplayed = {
                    ...monitoringValuesDisplayed,
                    highBg: {
                      value,
                      errorMessage: getErrorMessage(bgUnit, value, minHighBg, maxHighBg)
                    }
                  }
                  setMonitoringValuesDisplayed(newValuesToDisplay)
                  onValueChange(newValuesToDisplay)
                }}
              />
              <Typography>{bgUnit}</Typography>
              {!!monitoringValuesDisplayed.highBg.errorMessage &&
                <FormHelperText error className={classes.inputHelperText}>
                  {monitoringValuesDisplayed.highBg.errorMessage}
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
                key={`out-of-range-${monitoringValuesDisplayed.outOfRangeThreshold.value}`}
                id="out-of-range"
                defaultValue={`${monitoringValuesDisplayed.outOfRangeThreshold.value}%`}
                values={PERCENTAGES}
                error={monitoringValuesDisplayed.outOfRangeThreshold.error}
                onSelect={(value) => {
                  const newValuesToDisplay: MonitoringValuesDisplayed = {
                    ...monitoringValuesDisplayed,
                    outOfRangeThreshold: {
                      value: parseFloat(value),
                      error: false
                    }
                  }
                  setMonitoringValuesDisplayed(newValuesToDisplay)
                  onValueChange(newValuesToDisplay)
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
          hypoThreshold: monitoringValuesDisplayed.hypoThreshold.value,
          veryLowBg: monitoringValuesDisplayed.veryLowBg.value,
          bgUnit
        })}
      </Typography>
      <Box data-testid="severe-hypoglycemia" sx={{ display: "flex" }}>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>A. {t('severe-hypoglycemia-threshold', {
            hypoThreshold: monitoringValuesDisplayed.hypoThreshold.value,
            veryLowBg: monitoringValuesDisplayed.veryLowBg.value
          })}:</Typography>
          <Box
            className={classes.valueSelection}
            data-testid="very-low-bg-text-field-id"
            sx={{
              position: "relative",
              paddingBottom: 2
            }}>
            <Typography>{t('severe-hypoglycemia-below')}</Typography>
            <TextField
              disabled={displayInReadonly}
              value={monitoringValuesDisplayed.veryLowBg.value}
              error={!!monitoringValuesDisplayed.veryLowBg.errorMessage}
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
                const value = +event.target.value
                const newValuesToDisplay: MonitoringValuesDisplayed = {
                  ...monitoringValuesDisplayed,
                  veryLowBg: {
                    value,
                    errorMessage: getErrorMessage(bgUnit, value, minVeryLowBg, maxVeryLowBg)
                  }
                }
                setMonitoringValuesDisplayed(newValuesToDisplay)
                onValueChange(newValuesToDisplay)
              }}
            />
            <Typography data-testid="bgUnits-severalHypo">{bgUnit}</Typography>
            {!!monitoringValuesDisplayed.veryLowBg.errorMessage &&
              <FormHelperText error className={classes.inputHelperText}>
                {monitoringValuesDisplayed.veryLowBg.errorMessage}
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
                key={`hypo-threshold-${monitoringValuesDisplayed.hypoThreshold.value}`}
                id="hypo-threshold"
                defaultValue={`${monitoringValuesDisplayed.hypoThreshold.value}%`}
                values={PERCENTAGES}
                error={monitoringValuesDisplayed.hypoThreshold.error}
                onSelect={(value) => {
                  const newValuesToDisplay: MonitoringValuesDisplayed = {
                    ...monitoringValuesDisplayed,
                    hypoThreshold: {
                      value: parseFloat(value),
                      error: false
                    }
                  }
                  setMonitoringValuesDisplayed(newValuesToDisplay)
                  onValueChange(newValuesToDisplay)
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
        {t('current-trigger-setting-data', { nonDataThreshold: monitoringValuesDisplayed.nonDataTxThreshold.value })}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>A. {t('event-trigger-threshold')}</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t('time-spent-without-uploaded-data')}</Typography>
            <div className={classes.dropdown} data-testid="dropdown-nonData">
              <BasicDropdown
                disabled={displayInReadonly}
                key={`tir-dropdown-${monitoringValuesDisplayed.nonDataTxThreshold.value}`}
                id="non-data"
                defaultValue={`${monitoringValuesDisplayed.nonDataTxThreshold.value}%`}
                values={PERCENTAGES.slice(0, 10)}
                error={monitoringValuesDisplayed.nonDataTxThreshold.error}
                onSelect={(value) => {
                  const newValuesToDisplay: MonitoringValuesDisplayed = {
                    ...monitoringValuesDisplayed,
                    nonDataTxThreshold: {
                      value: parseFloat(value),
                      error: false
                    }
                  }
                  setMonitoringValuesDisplayed(newValuesToDisplay)
                  onValueChange(newValuesToDisplay)
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
  )
}

