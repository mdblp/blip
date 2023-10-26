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

import { type Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useAuth } from '../../lib/auth'
import { LoadingButton } from '@mui/lab'
import { Unit } from 'medical-domain'
import { type MonitoringAlertsParameters } from 'lib/team/models/monitoring-alerts-parameters.model'
import { Save } from '@mui/icons-material'
import { useMonitoringAlertsPatientConfiguration } from './monitoring-alerts-patient-configuration.hook'
import { MonitoringAlertsContentConfiguration } from './monitoring-alerts-content-configuration'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles()((theme: Theme) => ({
  cancelButton: {
    marginRight: theme.spacing(2)
  }
}))

export interface MonitoringAlertsPatientConfigurationProps {
  displayInReadonly: boolean
  monitoringAlertsParameters: MonitoringAlertsParameters
  saveInProgress: boolean
  isInitiallyUsingTeamAlertParameters: boolean
  onResetToTeamParameters: () => void
  onSave: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
}

const APPLY_CARE_TEAM_VALUES_SECTION_HEIGHT = "84px"

export const MonitoringAlertsPatientConfiguration: FC<MonitoringAlertsPatientConfigurationProps> = (
  {
    displayInReadonly,
    monitoringAlertsParameters,
    isInitiallyUsingTeamAlertParameters,
    saveInProgress,
    onResetToTeamParameters,
    onSave
  }
) => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const { user } = useAuth()
  const theme = useTheme()

  const userBgUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter

  const {
    lowBg,
    veryLowBg,
    highBg,
    nonDataTxThreshold,
    hypoThreshold,
    outOfRangeThreshold,
    resetToTeamDefaultValues,
    onChange,
    useTeamValues,
    saveButtonDisabled,
    discardChanges,
    save,
    setHighBg,
    setLowBg,
    setVeryLowBg,
    setOutOfRangeThreshold,
    setHypoThreshold,
    setNonDataTxThreshold
  } = useMonitoringAlertsPatientConfiguration({
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    isInitiallyUsingTeamAlertParameters,
    onSave
  })

  return (
    <>
      <Box height={APPLY_CARE_TEAM_VALUES_SECTION_HEIGHT}>
        <Button
          id="default-values-button-id"
          variant={useTeamValues ? "contained" : "outlined"}
          color="primary"
          disableElevation
          onClick={resetToTeamDefaultValues}
          data-testid="monitoring-alert-config-reset"
        >
          {t('button-care-team-values')}
        </Button>
        {useTeamValues &&
          <Typography fontSize="12px" lineHeight="16px" color={theme.palette.info.main}>
            {
              saveButtonDisabled ?
                t('The care team values are being used.') :
                t('The care team values have been entered. Please save the changes')
            }
          </Typography>
        }
      </Box>
      <MonitoringAlertsContentConfiguration
        displayInReadonly={displayInReadonly}
        displayDefaultValues={false}
        lowBg={lowBg}
        setLowBg={setLowBg}
        veryLowBg={veryLowBg}
        setVeryLowBg={setVeryLowBg}
        highBg={highBg}
        setHighBg={setHighBg}
        nonDataTxThreshold={nonDataTxThreshold}
        setNonDataTxThreshold={setNonDataTxThreshold}
        outOfRangeThreshold={outOfRangeThreshold}
        setOutOfRangeThreshold={setOutOfRangeThreshold}
        hypoThreshold={hypoThreshold}
        setHypoThreshold={setHypoThreshold}
        onChange={onChange}
      />
      <Box display="flex" justifyContent="flex-end" margin={2}>
        <Button
          className={classes.cancelButton}
          variant="outlined"
          onClick={discardChanges}
          data-testid="monitoring-alert-config-cancel"
        >
          {t('button-discard-changes')}
        </Button>
        {!displayInReadonly &&
          <LoadingButton
            loading={saveInProgress}
            id="save-button-id"
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<Save />}
            disabled={saveButtonDisabled}
            onClick={useTeamValues ? onResetToTeamParameters : save}
            data-testid="monitoring-alert-config-save"
          >
            {t('button-save')}
          </LoadingButton>
        }
      </Box>
    </>
  )
}

