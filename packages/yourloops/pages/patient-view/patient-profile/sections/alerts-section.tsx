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

import React, { FC, useEffect, useRef, useState } from 'react'
import Container from '@mui/material/Container'
import { Patient } from '../../../../lib/patient/models/patient.model'
import { MonitoringAlertsParameters } from '../../../../lib/team/models/monitoring-alerts-parameters.model'
import { usePatientsContext } from '../../../../lib/patient/patients.provider'
import { useAlert } from '../../../../components/utils/snackbar'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import {
  MonitoringAlertsPatientConfiguration
} from '../../../../components/monitoring-alert/monitoring-alerts-patient-configuration'
import { logError } from '../../../../utils/error.util'
import { errorTextFromException } from '../../../../lib/utils'

interface AlertsSectionProps {
  patient: Patient
}

export const MONITORING_ALERTS_SECTION_ID = 'monitoring-alerts'

export const AlertsSection: FC<AlertsSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const { deletePatientMonitoringAlertsParameters, updatePatientMonitoringAlertsParameters } = usePatientsContext()
  const alert = useAlert()

  const monitoringAlertsSection = useRef<HTMLElement>(null)

  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)

  const save = async (monitoringAlertsParameters: MonitoringAlertsParameters): Promise<void> => {
    patient.monitoringAlertsParameters = monitoringAlertsParameters
    setSaveInProgress(true)
    try {
      await updatePatientMonitoringAlertsParameters(patient)
      alert.success(t('patient-update-success'))
      setSaveInProgress(false)
    } catch (error) {
      const errorMessage = errorTextFromException(error)
      logError(errorMessage, 'update-patient-monitoring-alerts-parameters')

      alert.error(t('patient-update-error'))
      setSaveInProgress(false)
    }
  }

  const deletePatientAlertsParameters = async (): Promise<void> => {
    setSaveInProgress(true)
    try {
      await deletePatientMonitoringAlertsParameters(patient.userid)
      alert.success(t('patient-update-success'))
      setSaveInProgress(false)
    } catch (error) {
      const errorMessage = errorTextFromException(error)
      logError(errorMessage, 'patient-update-monitoring-parameters')

      alert.error(t('patient-update-error'))
      setSaveInProgress(false)
    }
  }

  return (
    <Container data-testid="alerts-container">
      <Card variant="outlined" sx={{ padding: theme.spacing(2) }}>
        <CardHeader title={t('monitoring-alerts')} />
        <CardContent>
          <section
            data-testid="monitoring-alerts-configuration-section"
            ref={monitoringAlertsSection}
          >
            <Typography
              variant="body2"
              paddingBottom={theme.spacing(2)}
            >
              {t('monitoring-alerts-description')}
            </Typography>
            <MonitoringAlertsPatientConfiguration
              displayInReadonly={false}
              monitoringAlertsParameters={patient.monitoringAlertsParameters}
              saveInProgress={saveInProgress}
              onSave={save}
              onResetToTeamParameters={deletePatientAlertsParameters}
              wasInitiallyUsingTeamAlertParameters={!!patient.isUsingTeamAlertParameters}
            />
          </section>
        </CardContent>
      </Card>
    </Container>
  )
}
