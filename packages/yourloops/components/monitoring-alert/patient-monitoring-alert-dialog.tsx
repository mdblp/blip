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

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import TuneIcon from '@mui/icons-material/Tune'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { makeStyles } from 'tss-react/mui'
import { useAlert } from '../utils/snackbar'
import { commonComponentStyles } from '../common'
import MonitoringAlertsContentConfiguration from './monitoring-alerts-content-configuration'
import { usePatientContext } from '../../lib/patient/patient.provider'
import DialogContent from '@mui/material/DialogContent'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type MonitoringAlertsParameters } from '../../lib/team/models/monitoring-alerts-parameters.model'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'

const useStyles = makeStyles()(() => ({
  title: {
    alignSelf: 'center'
  }
}))

interface PatientMonitoringAlertDialogProps {
  patient: Patient
  onClose: () => void
}

function PatientMonitoringAlertDialog(props: PatientMonitoringAlertDialogProps): JSX.Element {
  const { patient, onClose } = props
  const { classes: commonClasses } = commonComponentStyles()
  const { classes } = useStyles()
  const { t } = useTranslation('yourloops')
  const patientHook = usePatientContext()
  const alert = useAlert()
  const { selectedTeam } = useSelectedTeamContext()
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)
  const monitoringAlertsParameters = patient.monitoringAlertsParameters ?? selectedTeam.monitoringAlertsParameters

  const save = async (monitoringAlertsParameters: MonitoringAlertsParameters): Promise<void> => {
    patient.monitoringAlertsParameters = monitoringAlertsParameters
    setSaveInProgress(true)
    try {
      await patientHook.updatePatientMonitoringAlertsParameters(patient)
      alert.success(t('patient-update-success'))
      setSaveInProgress(false)
      onClose()
    } catch (error) {
      console.error(error)
      alert.error(t('patient-update-error'))
      setSaveInProgress(false)
    }
  }
  return (
    <Dialog
      id="patient-monitoring-alert-dialog-id"
      fullWidth={true}
      maxWidth="lg"
      open={true}
      onClose={onClose}
      data-testid="patient-monitoring-alert-dialog"
    >
      <DialogTitle id="remote-monitoring-dialog-invite-title" className={classes.title}>
        <div className={commonClasses.categoryHeader}>
          <div>
            <TuneIcon />
            <Typography className={commonClasses.title}>
              {t('monitoring-alerts-configuration')}
            </Typography>
          </div>
        </div>
      </DialogTitle>

      <DialogContent className={'no-padding'}>
        <MonitoringAlertsContentConfiguration
          monitoringAlertsParameters={monitoringAlertsParameters}
          patient={patient}
          onSave={save}
          saveInProgress={saveInProgress}
          onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export default PatientMonitoringAlertDialog
