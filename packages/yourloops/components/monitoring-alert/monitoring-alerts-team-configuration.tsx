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

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { useAuth } from '../../lib/auth'
import { LoadingButton } from '@mui/lab'
import { Unit } from 'medical-domain'
import { type MonitoringAlertsParameters } from 'lib/team/models/monitoring-alerts-parameters.model'
import { Save } from '@mui/icons-material'
import { MonitoringAlertsContentConfiguration } from './monitoring-alerts-content-configuration'
import { useMonitoringAlertsContentConfiguration } from './monitoring-alerts-content-configuration.hook'

export interface MonitoringAlertsTeamConfigurationProps {
  displayInReadonly: boolean
  monitoringAlertsParameters: MonitoringAlertsParameters
  onSave: (monitoringAlertsParameters: MonitoringAlertsParameters) => void
  saveInProgress: boolean
}

export const MonitoringAlertsTeamConfiguration: FC<MonitoringAlertsTeamConfigurationProps> = (
  {
    displayInReadonly,
    monitoringAlertsParameters,
    saveInProgress,
    onSave
  }
) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const userBgUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter

  const {
    monitoringValuesDisplayed,
    save,
    saveButtonDisabled,
    setMonitoringValuesDisplayed
  } = useMonitoringAlertsContentConfiguration({
    monitoringAlertsParameters,
    saveInProgress,
    userBgUnit,
    onSave
  })

  return (
    <>
      <MonitoringAlertsContentConfiguration
        bgUnit={userBgUnit}
        displayInReadonly={displayInReadonly}
        displayDefaultValues
        monitoringValuesDisplayed={monitoringValuesDisplayed}
        setMonitoringValuesDisplayed={setMonitoringValuesDisplayed}
      />
      <Box display="flex" justifyContent="flex-end" margin={2}>
        {!displayInReadonly &&
          <LoadingButton
            loading={saveInProgress}
            id="save-button-id"
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<Save />}
            disabled={saveButtonDisabled}
            onClick={save}
            data-testid="monitoring-alert-config-save"
          >
            {t('button-save')}
          </LoadingButton>
        }
      </Box>
    </>
  )
}
