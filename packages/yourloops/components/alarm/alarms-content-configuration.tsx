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

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import BasicDropdown from '../dropdown/basic-dropdown'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Monitoring } from '../../lib/team/models/monitoring.model'
import ProgressIconButtonWrapper from '../buttons/progress-icon-button-wrapper'
import { Patient } from '../../lib/patient/models/patient.model'
import { UnitsType } from '../../lib/units/models/enums/units-type.enum'
import useAlarmsContentConfiguration, { PERCENTAGES } from './alarms-content-configuration.hook'
import { onBasicDropdownSelect } from './alarm-content-configuration.utils'
import FormHelperText from '@mui/material/FormHelperText'

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

export interface AlarmsContentConfigurationProps {
  monitoring?: Monitoring
  saveInProgress: boolean
  patient?: Patient
  onClose?: () => void
  onSave: (monitoring: Monitoring) => void
}

function AlarmsContentConfiguration(props: AlarmsContentConfigurationProps): JSX.Element {
  const { saveInProgress, patient, onClose } = props
  const { classes } = useStyles()
  const { t } = useTranslation('yourloops')
  const {
    lowBg,
    veryLowBg,
    highBg,
    nonDataTxThreshold,
    hypoThreshold,
    outOfRangeThreshold,
    resetToTeamDefaultValues,
    onChange,
    saveButtonDisabled,
    save,
    setHighBg,
    setLowBg,
    setVeryLowBg,
    setOutOfRangeThreshold,
    setHypoThreshold,
    setNonDataTxThreshold,
    bgUnit,
    thresholds
  } = useAlarmsContentConfiguration(props)
  const { MIN_LOW_BG, MAX_LOW_BG, MIN_HIGH_BG, MAX_HIGH_BG, MIN_VERY_LOW_BG, MAX_VERY_LOW_BG } = thresholds

  return (
    <React.Fragment>
      <Box paddingX={3}>
        <Typography className={classes.categoryTitle}>
          1. {t('time-away-from-target')}
        </Typography>
        <Typography variant="caption" className={classes.categoryInfo}>
          {t('current-trigger-setting-tir', {
            tir: outOfRangeThreshold.value,
            lowBg: lowBg.value,
            highBg: highBg.value,
            bgUnit
          })}
        </Typography>
        <Box display="flex">
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
                  id="low-bg-text-field-id"
                  value={lowBg.value}
                  error={!!lowBg.errorMessage}
                  type="number"
                  className={classes.textField}
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: MIN_LOW_BG,
                      max: MAX_LOW_BG,
                      step: bgUnit === UnitsType.MGDL ? '1' : '0.1',
                      'aria-label': t('low-bg-input')
                    }
                  }}
                  onChange={(event) => onChange(+event.target.value, MIN_LOW_BG, MAX_LOW_BG, setLowBg)}
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
                  id="high-bg-text-field-id"
                  value={highBg.value}
                  error={!!highBg.errorMessage}
                  type="number"
                  className={classes.textField}
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: MIN_HIGH_BG,
                      max: MAX_HIGH_BG,
                      step: bgUnit === UnitsType.MGDL ? '1' : '0.1',
                      'aria-label': t('high-bg-input')
                    }
                  }}
                  onChange={(event) => onChange(+event.target.value, MIN_HIGH_BG, MAX_HIGH_BG, setHighBg)}
                />
                <Typography>{bgUnit}</Typography>
                {!!highBg.errorMessage &&
                  <FormHelperText error className={classes.inputHelperText}>
                    {highBg.errorMessage}
                  </FormHelperText>
                }
              </Box>
            </div>
            {!patient &&
              <Typography className={classes.defaultLabel}>{t('default-min-max')}</Typography>
            }
          </div>
          <div>
            <Typography className={classes.subCategoryTitle}>B. {t('event-trigger-threshold')}</Typography>
            <div className={classes.valueSelection}>
              <Typography>{t('time-spent-off-target')}</Typography>
              <div className={classes.dropdown}>
                <BasicDropdown
                  key={`out-of-range-${outOfRangeThreshold.value}`}
                  id="out-of-range"
                  defaultValue={`${outOfRangeThreshold.value}%` ?? ''}
                  values={PERCENTAGES}
                  error={outOfRangeThreshold.error}
                  onSelect={(value) => onBasicDropdownSelect(value, setOutOfRangeThreshold)}
                />
              </div>
            </div>
            {!patient &&
              <Typography className={classes.defaultLabel}>{t('default', { value: '50%' })}</Typography>
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
        <Box display="flex">
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
                id="very-low-bg-text-field-id"
                value={veryLowBg.value}
                error={!!veryLowBg.errorMessage}
                type="number"
                className={classes.textField}
                size="small"
                InputProps={{
                  inputProps: {
                    min: MIN_VERY_LOW_BG,
                    max: MAX_VERY_LOW_BG,
                    step: bgUnit === UnitsType.MGDL ? '1' : '0.1',
                    'aria-label': t('very-low-bg-input')
                  }
                }}
                onChange={(event) => onChange(+event.target.value, MIN_VERY_LOW_BG, MAX_VERY_LOW_BG, setVeryLowBg)}
              />
              <Typography data-testid="bgUnits-severalHypo">{bgUnit}</Typography>
              {!!veryLowBg.errorMessage &&
                <FormHelperText error className={classes.inputHelperText}>
                  {veryLowBg.errorMessage}
                </FormHelperText>
              }
            </Box>
            {!patient &&
              <Typography className={classes.defaultLabel}>{t('default', { value: `54${bgUnit}` })}</Typography>
            }
          </div>
          <div>
            <Typography className={classes.subCategoryTitle}>
              B. {t('event-trigger-threshold')}
            </Typography>
            <div className={classes.valueSelection}>
              <Typography>{t('time-spent-severe-hypoglycemia')}</Typography>
              <div className={classes.dropdown}>
                <BasicDropdown
                  key={`hypo-threshold-${hypoThreshold.value}`}
                  id="hypo-threshold"
                  defaultValue={`${hypoThreshold.value}%` ?? ''}
                  values={PERCENTAGES}
                  error={hypoThreshold.error}
                  onSelect={(value) => onBasicDropdownSelect(value, setHypoThreshold)}
                  data-testid="hypo-threshold"
                />
              </div>
            </div>
            {!patient &&
              <Typography className={classes.defaultLabel}>{t('default', { value: '5%' })}</Typography>
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
              <div className={classes.dropdown}>
                <BasicDropdown
                  key={`tir-dropdown-${nonDataTxThreshold.value}`}
                  id="non-data"
                  defaultValue={`${nonDataTxThreshold.value}%` ?? ''}
                  values={PERCENTAGES.slice(0, 10)}
                  error={nonDataTxThreshold.error}
                  onSelect={(value) => onBasicDropdownSelect(value, setNonDataTxThreshold)}
                  data-testid="non-data"
                />
              </div>
            </div>
            {!patient &&
              <Typography className={classes.defaultLabel}>{t('default', { value: '50%' })}</Typography>
            }
          </div>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" margin={2}>
        <Box>
          {patient &&
            <Button
              id="default-values-button-id"
              variant="contained"
              color="primary"
              disableElevation
              onClick={resetToTeamDefaultValues}
              data-testid="alarm-config-reset"
            >
              {t('default-values')}
            </Button>
          }
        </Box>
        <Box display="flex">
          {patient &&
            <Button
              id="cancel-button-id"
              className={classes.cancelButton}
              onClick={onClose}
              data-testid="alarm-config-cancel"
            >
              {t('button-cancel')}
            </Button>
          }
          <ProgressIconButtonWrapper inProgress={saveInProgress}>
            <Button
              id="save-button-id"
              variant="contained"
              color="primary"
              disableElevation
              disabled={saveButtonDisabled}
              onClick={save}
              data-testid="alarm-config-save"
            >
              {t('button-save')}
            </Button>
          </ProgressIconButtonWrapper>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default AlarmsContentConfiguration
