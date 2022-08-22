/**
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

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TuneIcon from '@material-ui/icons/Tune'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'

import { useTeam } from '../../lib/team'
import { Monitoring } from '../../models/monitoring'
import { useAlert } from '../utils/snackbar'
import { Patient } from '../../lib/data/patient'
import { commonComponentStyles } from '../common'
import AlarmsContentConfiguration from './alarms-content-configuration'

const useStyles = makeStyles(() => ({
  title: {
    alignSelf: 'center'
  }
}))

interface PatientAlarmDialogProps {
  patient: Patient
  onClose: () => void
}

function PatientAlarmDialog(props: PatientAlarmDialogProps): JSX.Element {
  const { patient, onClose } = props
  const commonClasses = commonComponentStyles()
  const classes = useStyles()
  const { t } = useTranslation('yourloops')
  const teamHook = useTeam()
  const alert = useAlert()
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)

  if (!patient?.monitoring?.enabled) {
    throw Error(`Cannot show monitoring info of team ${patient.userid} as its monitoring is not enabled`)
  }

  const save = async (monitoring: Monitoring): Promise<void> => {
    patient.monitoring = monitoring
    setSaveInProgress(true)
    try {
      await teamHook.updatePatientMonitoring(patient)
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
    <Dialog id="patient-alarm-dialog-id" fullWidth={true} maxWidth="lg" open={true} onClose={onClose} data-testid="patient-alarm-dialog">
      <div className={commonClasses.root}>
        <DialogTitle id="remote-monitoring-dialog-invite-title" className={classes.title}>
          <div className={commonClasses.categoryHeader}>
            <div>
              <TuneIcon />
              <Typography className={commonClasses.title}>
                {t('events-configuration')}
              </Typography>
            </div>
          </div>
        </DialogTitle>

        <Box paddingX={3} marginBottom={2}>
          <AlarmsContentConfiguration
            monitoring={patient.monitoring}
            patient={patient}
            onSave={save}
            saveInProgress={saveInProgress}
            onClose={onClose} />
        </Box>
      </div>
    </Dialog>
  )
}

export default PatientAlarmDialog
