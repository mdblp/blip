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

import React, { FC, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useAuth } from '../../lib/auth'
import { Unit } from 'medical-domain'
import { type MonitoringAlertsParameters } from 'medical-domain'
import { Save } from '@mui/icons-material'
import { useMonitoringAlertsPatientConfiguration } from './monitoring-alerts-patient-configuration.hook'
import { MonitoringAlertsContentConfiguration } from './monitoring-alerts-content-configuration'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'

const useMonitoringAlertConfigurationStyles = makeStyles()((theme: Theme) => ({
  cancelButton: {
    marginRight: theme.spacing(2)
  }
}))

const useApplyTeamButtonStyles = makeStyles()((theme: Theme) => ({
  applyTeamValuesButtonCheckedSaved: {
    background: 'var(--button-care-team-values-applied-bg)',
    color: theme.palette.success.dark,
    fontWeight: 'bold'
  },
  applyTeamValuesButtonCheckedUnsaved: {
    background: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold'
  },
  applyTeamValuesButtonUnchecked: {
    background: theme.palette.common.white,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  }
}))

interface MonitoringAlertsPatientConfigurationProps {
  displayInReadonly: boolean
  monitoringAlertsParameters: MonitoringAlertsParameters
  saveInProgress: boolean
  wasInitiallyUsingTeamAlertParameters: boolean
  onResetToTeamParameters: () => void
  onSave: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
  onUnsavedChangesChange: (hasChanges: boolean) => void
}

interface MonitoringAlertsPatientApplyTeamButtonProps {
  useTeamValues: boolean
  areValuesSaved: boolean
  resetToTeamDefaultValues: () => void
}

const APPLY_CARE_TEAM_VALUES_SECTION_HEIGHT = "84px"

export const MonitoringAlertsPatientConfiguration: FC<MonitoringAlertsPatientConfigurationProps> = (
  {
    displayInReadonly,
    monitoringAlertsParameters,
    wasInitiallyUsingTeamAlertParameters,
    saveInProgress,
    onResetToTeamParameters,
    onSave,
    onUnsavedChangesChange
  }
) => {
  const { classes } = useMonitoringAlertConfigurationStyles()
  const { t } = useTranslation()
  const { user } = useAuth()

  const userBgUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter

  const {
    monitoringValuesDisplayed,
    resetToTeamDefaultValues,
    useTeamValues,
    saveButtonDisabled,
    discardChanges,
    save,
    setMonitoringValuesDisplayed,
    onValueChange,
  } = useMonitoringAlertsPatientConfiguration({
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    wasInitiallyUsingTeamAlertParameters,
    onSave
  })

  useEffect(() => {
      onUnsavedChangesChange(!saveButtonDisabled)
  }, [onUnsavedChangesChange, saveButtonDisabled])

  return (
    <>
      <MonitoringAlertsPatientApplyTeamButton
        useTeamValues={useTeamValues}
        areValuesSaved={saveButtonDisabled}
        resetToTeamDefaultValues={resetToTeamDefaultValues}
      />
      <MonitoringAlertsContentConfiguration
        bgUnit={userBgUnit}
        displayInReadonly={displayInReadonly}
        displayDefaultValues={false}
        monitoringValuesDisplayed={monitoringValuesDisplayed}
        setMonitoringValuesDisplayed={setMonitoringValuesDisplayed}
        onValueChange={onValueChange}
      />
      <Box display="flex" justifyContent="flex-end" margin={2}>
        {!saveButtonDisabled &&
          <Button
            className={classes.cancelButton}
            variant="outlined"
            onClick={discardChanges}
            data-testid="monitoring-alert-config-cancel"
          >
            {t('button-discard-changes')}
          </Button>
        }
        {!displayInReadonly &&
          <Button
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
          </Button>
        }
      </Box>
    </>
  )
}

const MonitoringAlertsPatientApplyTeamButton: FC<MonitoringAlertsPatientApplyTeamButtonProps> = (
  {
    useTeamValues,
    areValuesSaved,
    resetToTeamDefaultValues
  }
) => {
  const { classes } = useApplyTeamButtonStyles()
  const { t } = useTranslation()

  const applyCareTeamValuesChipLabel = useMemo(() => {
    if (!useTeamValues) {
      return t('button-care-team-values')
    }
    if (areValuesSaved) {
      return `${t('care-team-values-applied')} ✔`
    }
    return t('care-team-values-applied')
  }, [areValuesSaved, t, useTeamValues])

  const applyCareTeamValuesChipClassName = useMemo(() => {
    if (!useTeamValues) {
      return classes.applyTeamValuesButtonUnchecked
    }
    if (areValuesSaved) {
      return classes.applyTeamValuesButtonCheckedSaved
    }
    return classes.applyTeamValuesButtonCheckedSaved
  }, [useTeamValues, areValuesSaved, classes.applyTeamValuesButtonUnchecked, classes.applyTeamValuesButtonCheckedSaved])

  const applyCareTeamValuesChipVariant = useMemo(() => {
    if (useTeamValues) {
      return 'filled'
    }
    return 'outlined'
  }, [useTeamValues])

  const statusLabel = useMemo(() => {
    if (useTeamValues) {
      return t('care-team-values-entered')
    }
    return t('custom-values-entered')
  }, [t, useTeamValues])

  return (
    <Box height={APPLY_CARE_TEAM_VALUES_SECTION_HEIGHT} marginBottom={4}>
      <Chip
        className={applyCareTeamValuesChipClassName}
        variant={applyCareTeamValuesChipVariant}
        label={applyCareTeamValuesChipLabel}
        onClick={useTeamValues ? undefined : resetToTeamDefaultValues}
        data-testid="monitoring-alert-config-reset"
      />
      <Box marginTop={2}>
        { !areValuesSaved &&
          <Alert data-testid="monitoring-alerts-patient-status-label" severity="info">{statusLabel}</Alert>
        }
      </Box>

    </Box>
  )
}

