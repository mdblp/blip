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

import { useCallback, useEffect, useState } from 'react'
import PatientApi from './patient.api'
import { useAuth } from '../auth'
import { errorTextFromException } from '../utils'
import { type PatientResult } from './models/patient-context-result.model'
import { type Patient } from './models/patient.model'
import { useAlert } from '../../components/utils/snackbar'
import { useTranslation } from 'react-i18next'
import { logError } from '../../utils/error.util'
import { ProfilePatient } from './models/patient-profile.model'

// Custom hook to manage retrieve and actions for the patient
export default function usePatient(): PatientResult {
  const { user } = useAuth()
  const { t } = useTranslation()
  const alert = useAlert()
  const [patient, setPatient] = useState<Patient>()
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)

  const getPatientInfo = useCallback((userid: string) => {
    setRefreshInProgress(true)
    PatientApi.getPatientInfo(userid)
      .then((patientInfos) => {
        setPatient(patientInfos)
      }).catch((err) => {
        const errorMessage = errorTextFromException(err)
        logError(errorMessage, 'fetch-patient-infos')
        alert.error(t('error-http-40x'))
    }).finally(() => {
      setRefreshInProgress(false)
    })
  }, [alert, t])

  const refresh = (): void => {
    getPatientInfo(user.id)
  }

  useEffect(() => {
    if (user && user.isUserPatient()) {
      getPatientInfo(user.id)
    }
  }, [getPatientInfo, user])


  const updatePatientProfile = async (patientId: string, patientProfile: ProfilePatient): Promise<void> => {
    try {
      await PatientApi.updatePatientProfile(patientId, patientProfile)
      refresh()
    } catch (error) {
      throw Error(`updatePatientProfile: failed to update patient with id ${patientId}`)
    }
  }

  return {
    patient,
    refreshInProgress,
    getPatientInfo,
    updatePatientProfile,
    refresh
  }
}
