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

import { type Dispatch, type SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MedicalFilesApi from '../../lib/medical-files/medical-files.api'
import { type CategoryProps } from '../dashboard-widgets/medical-files/medical-files-widget'
import { useAlert } from '../utils/snackbar'
import { type MedicalRecord } from '../../lib/medical-files/models/medical-record.model'
import { useAuth } from '../../lib/auth'

interface MedicalRecordEditDialogHookProps extends CategoryProps {
  onSaved: (payload: MedicalRecord) => void
  medicalRecord?: MedicalRecord
  medicalRecordDate?: string
}

interface MedicalRecordEditDialogHookReturn {
  saveMedicalRecord: () => Promise<void>
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

export default function useMedicalRecordEditDialog(props: MedicalRecordEditDialogHookProps): MedicalRecordEditDialogHookReturn {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { user } = useAuth()
  const { onSaved, medicalRecord, teamId, patientId, medicalRecordDate } = props

  const [diagnosis, setDiagnosis] = useState<string>(medicalRecord?.diagnosis || '')
  const [progressionProposal, setProgressionProposal] = useState<string>(medicalRecord?.progressionProposal || '')
  const [trainingSubject, setTrainingSubject] = useState<string>(medicalRecord?.trainingSubject || '')
  const [inProgress, setInProgress] = useState<boolean>(false)
  const isSaveButtonDisabled = inProgress || (!diagnosis && !trainingSubject && !progressionProposal)
  const isUserAuthor = medicalRecord?.authorId === user.id
  const isInReadOnly = user.isUserPatient() || (user.isUserHcp() && !!medicalRecord && !isUserAuthor)

  const getTitle = (): string => {
    if (!medicalRecord) {
      return t('create-medical-record')
    }
    if (user.isUserHcp() && isUserAuthor) {
      return t('edit-medical-record', { date: medicalRecordDate })
    }
    return t('consult-medical-record', { date: medicalRecordDate })
  }

  const saveMedicalRecord = async (): Promise<void> => {
    try {
      setInProgress(true)
      let payload: MedicalRecord
      if (medicalRecord) {
        payload = await MedicalFilesApi.updateMedicalRecord({
          ...medicalRecord,
          diagnosis,
          progressionProposal,
          trainingSubject
        })
      } else {
        payload = await MedicalFilesApi.createMedicalRecord({
          teamId,
          patientId,
          diagnosis,
          progressionProposal,
          trainingSubject
        })
      }
      setInProgress(false)
      alert.success(t('medical-record-save-success'))
      onSaved(payload)
    } catch (err) {
      console.log(err)
      setInProgress(false)
      alert.error(t('medical-record-save-failed'))
    }
  }

  return {
    saveMedicalRecord,
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
