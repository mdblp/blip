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
import moment from 'moment-timezone'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import DesktopMacIcon from '@material-ui/icons/DesktopMac'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { commonComponentStyles } from '../common'
import { Patient } from '../../lib/data/patient'
import PatientInfo from '../patient/patient-info'
import PatientMonitoringPrescription, { PrescriptionInfo } from '../patient/patient-monitoring-prescription'
import { useNotification } from '../../lib/notifications/hook'
import { useTeam } from '../../lib/team'
import { MonitoringStatus } from '../../models/monitoring'
import MedicalFilesApi from '../../lib/medical-files/medical-files-api'
import { useAlert } from '../utils/snackbar'

const useStyles = makeStyles((theme: Theme) => ({
  categoryTitle: {
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  subCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%'
  },
  title: {
    alignSelf: 'center'
  },
  valueSelection: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(3)
  }
}))

export enum RemoteMonitoringDialogAction {
  invite = 'invite',
  renew = 'renew',
}

export interface RemoteMonitoringPatientDialogProps {
  patient: Patient
  action: RemoteMonitoringDialogAction
  onClose: () => void
}

function RemoteMonitoringPatientDialog(props: RemoteMonitoringPatientDialogProps): JSX.Element {
  const commonClasses = commonComponentStyles()
  const { patient, action, onClose } = props
  const classes = useStyles()
  const { t } = useTranslation('yourloops')
  const notificationHook = useNotification()
  const teamHook = useTeam()
  const alert = useAlert()
  const [teamId] = useState<string | undefined>(action === RemoteMonitoringDialogAction.renew ? teamHook.getPatientRemoteMonitoringTeam(patient).teamId : undefined)
  const [physician, setPhysician] = useState<string | undefined>(patient.profile?.referringDoctor)
  const [prescriptionInfo, setPrescriptionInfo] = useState<PrescriptionInfo>({
    teamId: undefined,
    memberId: undefined,
    file: undefined,
    numberOfMonth: 3
  })
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)

  const onSave = async (): Promise<void> => {
    try {
      setSaveButtonDisabled(true)
      const monitoringEnd = moment.utc(new Date()).add(prescriptionInfo.numberOfMonth, 'M').toDate()
      if (!prescriptionInfo.teamId || !prescriptionInfo.memberId || !prescriptionInfo.file) {
        throw Error('Cannot invite patient as prescription fields have not all be filled')
      }
      switch (action) {
        case RemoteMonitoringDialogAction.invite:
          patient.monitoring =
            {
              enabled: false,
              status: MonitoringStatus.pending,
              monitoringEnd
            }
          await notificationHook.inviteRemoteMonitoring(prescriptionInfo.teamId, patient.userid, monitoringEnd, physician)
          break
        case RemoteMonitoringDialogAction.renew:
        // enable and status are required
          patient.monitoring =
            {
              enabled: true,
              status: MonitoringStatus.accepted,
              monitoringEnd,
              parameters: patient.monitoring?.parameters
            }
          await teamHook.updatePatientMonitoring(patient)
          break
        default:
          break
      }

      teamHook.editPatientRemoteMonitoring(patient)
      await MedicalFilesApi.uploadPrescription(
        prescriptionInfo.teamId,
        patient.userid,
        prescriptionInfo.memberId,
        prescriptionInfo.numberOfMonth,
        prescriptionInfo.file
      )
      onClose()
      alert.success(t('alert-invitation-sent-success'))
    } catch (error) {
      setSaveButtonDisabled(false)
      alert.error(t('error-http-500'))
    }
  }

  const updatePrescriptionInfo = (prescriptionInformation: PrescriptionInfo): void => {
    if (prescriptionInformation.teamId !== prescriptionInfo.teamId ||
      prescriptionInformation.memberId !== prescriptionInfo.memberId ||
      prescriptionInformation.file !== prescriptionInfo.file ||
      prescriptionInformation.numberOfMonth !== prescriptionInfo.numberOfMonth) {
      setPrescriptionInfo({
        teamId: prescriptionInformation.teamId,
        memberId: prescriptionInformation.memberId,
        file: prescriptionInformation.file,
        numberOfMonth: prescriptionInformation.numberOfMonth
      })
      setSaveButtonDisabled(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      onClose={onClose}
      data-testid="remote-monitoring-dialog"
    >
      <DialogTitle id="remote-monitoring-dialog-title" className={classes.title}>
        <Box display="flex">
          <DesktopMacIcon />
          <Typography className={commonClasses.title}>
            {t('remote-monitoring-patient-dialog-title', { action: t(action) })}
          </Typography>
        </Box>
      </DialogTitle>

      <Box paddingX={4}>
        <PatientInfo patient={patient} />

        <Divider variant="middle" className={classes.divider} />

        <PatientMonitoringPrescription
          action={action}
          defaultTeamId={teamId}
          setPrescriptionInfo={updatePrescriptionInfo}
        />

        <Divider variant="middle" className={classes.divider} />

        <Typography className={classes.categoryTitle}>
          3. {t('attending-physician')} ({t('optional')})
        </Typography>
        <Box display="flex" marginTop={2}>
          <Box className={classes.subCategoryContainer}>
            <Box className={classes.valueSelection}>
              <Typography>{t('attending-physician')}</Typography>
              <Box marginX={2}>
                <TextField
                  defaultValue={physician}
                  variant="outlined"
                  size="small"
                  onChange={(e) => setPhysician(e.target.value)}
                  data-testid="remote-monitoring-dialog-referring-doctor"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <DialogActions>
        <Button
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          disabled={saveButtonDisabled}
          onClick={onSave}
          data-testid="remote-monitoring-dialog-save-button"
        >
          {t('button-save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoteMonitoringPatientDialog
