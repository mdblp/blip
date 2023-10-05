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

import React, { FC, useState } from 'react'
import Container from '@mui/material/Container'
import MonitoringAlertsContentConfiguration
  from '../../../components/monitoring-alert/monitoring-alerts-content-configuration'
import { Patient } from '../../../lib/patient/models/patient.model'
import { MonitoringAlertsParameters } from '../../../lib/team/models/monitoring-alerts-parameters.model'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { useAlert } from '../../../components/utils/snackbar'
import { useTranslation } from 'react-i18next'
import { useSelectedTeamContext } from '../../../lib/selected-team/selected-team.provider'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

interface TargetAndAlertsPageProps {
  patient: Patient
}

export const TargetAndAlertsPage: FC<TargetAndAlertsPageProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const { updatePatientMonitoringAlertsParameters } = usePatientsContext()
  const { selectedTeam } = useSelectedTeamContext()
  const alert = useAlert()
  const monitoringAlertsParameters = patient.monitoringAlertsParameters ?? selectedTeam.monitoringAlertsParameters

  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)

  const save = async (monitoringAlertsParameters: MonitoringAlertsParameters): Promise<void> => {
    patient.monitoringAlertsParameters = monitoringAlertsParameters
    setSaveInProgress(true)
    try {
      await updatePatientMonitoringAlertsParameters(patient)
      alert.success(t('patient-update-success'))
      setSaveInProgress(false)
    } catch (error) {
      console.error(error)
      alert.error(t('patient-update-error'))
      setSaveInProgress(false)
    }
  }

  return (
    <Container>
      <Card variant="outlined" sx={{ padding: theme.spacing(2) }}>
        <CardHeader title={t('target-and-alerts')} />
        <CardContent>
          <Typography variant="h6" paddingBottom={theme.spacing(1)}>{t('monitoring-alerts')}</Typography>
          <Typography variant="body2" paddingBottom={theme.spacing(2)}>{t('monitoring-alerts-description')}</Typography>
          <MonitoringAlertsContentConfiguration
            displayInReadonly={false}
            monitoringAlertsParameters={monitoringAlertsParameters}
            saveInProgress={saveInProgress}
            onSave={save}
            patient={patient}
          />
        </CardContent>
      </Card>
    </Container>
  )
}