/*
 * Copyright (c) 2023-2026, Diabeloop
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

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../utils/snackbar'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { type AlertReactivationDates } from '../../../lib/patient/models/monitoring-alerts-parameters.model'
import { MonitoringAlertType } from './ack-monitoring-alert-dialog'
import { AppUserRoute } from '../../../models/enums/routes.enum'
import { errorTextFromException } from '../../../lib/utils'
import { logError } from '../../../utils/error.util'
import { getUserName } from '../../../lib/auth/user.util'

const INACTIVE_PERIOD_MS = 48 * 60 * 60 * 1000

interface AckMonitoringAlertDialogHookProps {
  patient: Patient
  alertType: MonitoringAlertType
  onClose: () => void
}

interface AckMonitoringAlertDialogHookReturn {
  handleAnalyse: () => void
  handleAcknowledge: () => Promise<void>
}

const useAckMonitoringAlertDialog = ({ patient, alertType, onClose }: AckMonitoringAlertDialogHookProps): AckMonitoringAlertDialogHookReturn => {
  const { t } = useTranslation()
  const alert = useAlert()
  const navigate = useNavigate()
  const { acknowledgePatientAlerts } = usePatientsContext()

  const patientName = getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName)
  const alertName = t(alertType)

  const handleAnalyse = (): void => {
    navigate(`${patient.userid}${AppUserRoute.Dashboard}`)
    onClose()
  }

  const handleAcknowledge = async (): Promise<void> => {
    const nextActivationDate = new Date(Date.now() + INACTIVE_PERIOD_MS)
    const reactivationDates: AlertReactivationDates = {
      hyperglycemia: alertType === MonitoringAlertType.Hyperglycemia ? nextActivationDate : null,
      hypoglycemia: alertType === MonitoringAlertType.Hypoglycemia ? nextActivationDate : null,
      nonDataTransmission: alertType === MonitoringAlertType.DataNotTransmitted ? nextActivationDate : null,
      timeOutOfRange: alertType === MonitoringAlertType.TimeSpentOutOfRange ? nextActivationDate : null,
    }
    try {
      await acknowledgePatientAlerts(patient.userid, reactivationDates)
      alert.success(t('alert-acknowledge-monitoring-alert-success', {  alertName, patientName }))
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'acknowledge-monitoring-alert')
      alert.error(t('alert-acknowledge-monitoring-alert-failure', { alertName, patientName }))
    }
    onClose()
  }

  return { handleAnalyse, handleAcknowledge }
}

export default useAckMonitoringAlertDialog

