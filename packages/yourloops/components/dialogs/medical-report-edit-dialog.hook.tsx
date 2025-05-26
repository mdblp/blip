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

import { type Dispatch, type SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MedicalFilesApi from '../../lib/medical-files/medical-files.api'
import { type CategoryProps } from '../dashboard-cards/medical-files/medical-files-card'
import { useAlert } from '../utils/snackbar'
import { useAuth } from '../../lib/auth'
import { type MedicalReport } from '../../lib/medical-files/models/medical-report.model'
import { useTeam } from '../../lib/team'
import { logError } from '../../utils/error.util'
import { errorTextFromException } from '../../lib/utils'

interface MedicalReportEditDialogHookProps extends CategoryProps {
  onSaved: (payload: MedicalReport) => void
  medicalReport?: MedicalReport
}

interface MedicalReportEditDialogHookReturn {
  saveMedicalReport: () => Promise<void>
  diagnosis: string
  dialogTitle: string
  setDiagnosis: Dispatch<SetStateAction<string>>
  progressionProposal: string
  setProgressionProposal: Dispatch<SetStateAction<string>>
  trainingSubject: string
  setTrainingSubject: Dispatch<SetStateAction<string>>
  inProgress: boolean
  isInReadOnly: boolean
  setInProgress: Dispatch<SetStateAction<boolean>>
  isSaveButtonDisabled: boolean
}

export function useMedicalReportEditDialog(props: MedicalReportEditDialogHookProps): MedicalReportEditDialogHookReturn {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { user } = useAuth()
  const { getTeam } = useTeam()
  const { onSaved, medicalReport, teamId, patientId } = props

  const [diagnosis, setDiagnosis] = useState<string>(medicalReport?.diagnosis || '')
  const [progressionProposal, setProgressionProposal] = useState<string>(medicalReport?.progressionProposal || '')
  const [trainingSubject, setTrainingSubject] = useState<string>(medicalReport?.trainingSubject || '')
  const [inProgress, setInProgress] = useState<boolean>(false)
  const isSaveButtonDisabled = inProgress || (!diagnosis && !trainingSubject && !progressionProposal)
  const isUserAuthor = medicalReport?.authorId === user.id
  const isInReadOnly = user.isUserPatient() || (user.isUserHcp() && !!medicalReport && !isUserAuthor)

  const getTitle = (): string => {
    if (!medicalReport) {
      return t('create-medical-report')
    }
    if (user.isUserHcp() && isUserAuthor) {
      return t('edit-medical-report', { number: medicalReport.number })
    }
    return t('consult-medical-report', { number: medicalReport.number })
  }

  const saveMedicalReport = async (): Promise<void> => {
    try {
      setInProgress(true)
      let payload: MedicalReport
      if (medicalReport) {
        payload = await MedicalFilesApi.updateMedicalReport({
          ...medicalReport,
          diagnosis,
          progressionProposal,
          trainingSubject
        })
      } else {
        const authorProfile = user.profile
        const teamName = getTeam(teamId).name
        payload = await MedicalFilesApi.createMedicalReport({
          teamId,
          patientId,
          diagnosis,
          progressionProposal,
          trainingSubject,
          authorFirstName: authorProfile.firstName,
          authorLastName: authorProfile.lastName,
          teamName
        })
      }
      setInProgress(false)
      alert.success(t('medical-report-save-success'))
      onSaved(payload)
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'medical-report-save')

      setInProgress(false)
      alert.error(t('medical-report-save-failed'))
    }
  }

  return {
    saveMedicalReport,
    diagnosis,
    dialogTitle: getTitle(),
    setDiagnosis,
    progressionProposal,
    setProgressionProposal,
    trainingSubject,
    setTrainingSubject,
    inProgress,
    isInReadOnly,
    setInProgress,
    isSaveButtonDisabled
  }
}
