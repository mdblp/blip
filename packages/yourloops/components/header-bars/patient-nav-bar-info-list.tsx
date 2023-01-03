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

import React, { FunctionComponent, useMemo, useState } from 'react'
import { Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import moment from 'moment-timezone'
import { PatientNavBarInfo } from './patient-nav-bar-info'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface PatientNavBarInfosProps {
  infoWidth: string
  patient: Patient
}
const LOCAL_STORAGE_SHOW_MORE_INFO_PATIENT_NAV_BAR_ID = 'showMoreInfoPatientNavBarId'

export const PatientNavBarInfoList: FunctionComponent<PatientNavBarInfosProps> = (props) => {
  const { infoWidth, patient } = props

  const { t } = useTranslation('yourloops')
  const localStorageShowMoreInfo = localStorage.getItem(LOCAL_STORAGE_SHOW_MORE_INFO_PATIENT_NAV_BAR_ID) === 'true'
  const [showMoreInfo, setShowMoreInfo] = useState(localStorageShowMoreInfo)

  const trNaLabel = t('N/A')

  const gender = useMemo(() => {
    if (patient.profile.sex === '') {
      return trNaLabel
    }
    return t(`gender-${patient.profile.sex.toLocaleLowerCase()}`)
  }, [patient.profile.sex, t, trNaLabel])

  const hbA1c = useMemo(() => {
    return patient.settings.a1c ? `${patient.settings.a1c.value} (${moment(patient.settings.a1c?.date).format('L')})` : trNaLabel
  }, [patient.settings.a1c, trNaLabel])

  const referringDoctor = useMemo(() => {
    const doctor = patient.profile.referringDoctor
    return !doctor || doctor === '' ? trNaLabel : doctor
  }, [patient.profile.referringDoctor, trNaLabel])

  const onShowMoreInfoClick = (): void => {
    localStorage.setItem(LOCAL_STORAGE_SHOW_MORE_INFO_PATIENT_NAV_BAR_ID, String(!showMoreInfo))
    setShowMoreInfo(!showMoreInfo)
  }

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" paddingTop={1}>
      <Box display="flex">
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('last-name') })}
          fieldValue={patient.profile.lastName}
          fieldWidth={infoWidth}
          id="patient-nav-bar-last-name"
        />
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('birthdate') })}
          fieldValue={moment(patient.profile.birthdate).format('L')}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('diabete-type') })}
          fieldValue={'Type 1'}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('referring-doctor') })}
          fieldValue={referringDoctor}
          fieldWidth={infoWidth}
        />
      </Box>
      <Box display="flex" marginTop={1}>
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('first-name') })}
          fieldValue={patient.profile.firstName}
          fieldWidth={infoWidth}
          id="patient-nav-bar-first-name"
        />
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('gender') })}
          fieldValue={gender}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('remote-monitoring') })}
          fieldValue={patient.monitoring?.enabled ? t('yes') : t('no')}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('colon', { label: t('email') })}
          fieldValue={patient.profile.email}
          fieldWidth={infoWidth}
        />
        <Box
          display="flex"
          marginLeft="auto"
          marginRight={5}
          sx={{ cursor: 'pointer' }}
          onClick={onShowMoreInfoClick}
        >
          <Typography variant="caption" marginRight={1} sx={{ textDecoration: 'underline' }}>{t('show-more')}</Typography>
          {showMoreInfo ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
        </Box>
      </Box>
      {showMoreInfo &&
        <Box display="flex" marginTop={1} marginBottom={2}>
          <PatientNavBarInfo
            fieldName={t('colon', { label: t('hba1c') })}
            fieldValue={hbA1c}
            fieldWidth={infoWidth}
          />
        </Box>}
    </Box>
  )
}
