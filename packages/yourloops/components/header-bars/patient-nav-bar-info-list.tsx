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

import React, { type FunctionComponent, useMemo } from 'react'
import { type Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import moment from 'moment-timezone'
import { PatientNavBarInfo } from './patient-nav-bar-info'

interface PatientNavBarInfosProps {
  patient: Patient
}

export const PatientNavBarInfoList: FunctionComponent<PatientNavBarInfosProps> = (props) => {
  const { patient } = props

  const { t } = useTranslation('yourloops')

  const trNaLabel = t('N/A')

  const gender = useMemo(() => {
    if (!patient.profile.sex) {
      return trNaLabel
    }
    return t(`gender-${patient.profile.sex.toLocaleLowerCase()}`)
  }, [patient.profile.sex, t, trNaLabel])

  const hbA1c = useMemo(() => {
    return patient.settings.a1c ? `${patient.settings.a1c.value}% (${moment(patient.settings.a1c?.date).format('L')})` : trNaLabel
  }, [patient.settings.a1c, trNaLabel])

  return (
    <Box display="flex" flexGrow="1">
      <Box display="flex" flexDirection="column" flexGrow="1" paddingTop={1}>
        <Box display="flex">
          <PatientNavBarInfo
            fieldName={t('colon', { label: t('date-of-birth') })}
            fieldValue={moment(patient.profile.birthdate).format('L')}
          />
          <PatientNavBarInfo
            fieldName={t('colon', { label: t('diabetes-type') })}
            fieldValue="Type 1"
          />
        </Box>
        <Box display="flex" marginTop={1}>
          <PatientNavBarInfo
            fieldName={t('colon', { label: t('gender') })}
            fieldValue={gender}
          />
          <PatientNavBarInfo
            fieldName={t('colon', { label: t('hba1c') })}
            fieldValue={hbA1c}
          />
          <PatientNavBarInfo
            fieldName={t('colon', { label: t('email') })}
            fieldValue={patient.profile.email}
          />
        </Box>
      </Box>
    </Box>
  )
}
