/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { useState } from 'react'
import { useAlert } from '../../utils/snackbar'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { useTeam } from '../../../lib/team'
import TeamUtils from '../../../lib/team/team.util'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { useParams } from 'react-router-dom'
import { errorTextFromException } from '../../../lib/utils'
import { logError } from '../../../utils/error.util'

interface RemovePatientDialogHookProps {
  onClose: () => void
  patient: Patient
}

interface RemovePatientDialogHookReturn {
  handleOnClickRemove: () => Promise<void>
  patientName: string
  processing: boolean
}

const useRemovePatientDialog = ({ patient, onClose }: RemovePatientDialogHookProps): RemovePatientDialogHookReturn => {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { removePatient } = usePatientsContext()
  const { getTeam } = useTeam()
  const { teamId } = useParams()

  const [processing, setProcessing] = useState<boolean>(false)

  const userName = patient?.profile?.firstName ? {
    firstName: patient.profile.firstName,
    lastName: patient.profile.lastName
  } : null
  const patientName = userName ? t('user-name', userName) : patient.profile.email

  const getSuccessAlertMessage = (): string => {
    const team = getTeam(teamId)
    if (TeamUtils.isPrivate(team.id)) {
      return t('alert-remove-private-practice-success', { patientName })
    }
    return t('alert-remove-patient-from-team-success', { teamName: team.name, patientName })
  }

  const handleOnClickRemove = async (): Promise<void> => {
    try {
      setProcessing(true)
      await removePatient(patient)
      const message = getSuccessAlertMessage()
      alert.success(message)
      onClose()
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'remove-patient')

      alert.error(t('alert-remove-patient-failure'))
      setProcessing(false)
    }
  }

  return { processing, patientName, handleOnClickRemove }
}

export default useRemovePatientDialog
