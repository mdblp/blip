/*
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

export const PatientNavBarInfos: FunctionComponent<PatientNavBarInfosProps> = (props) => {
  const { infoWidth, patient } = props

  const { t } = useTranslation('yourloops')
  const localStorageShowMoreInfo = localStorage.getItem(LOCAL_STORAGE_SHOW_MORE_INFO_PATIENT_NAV_BAR_ID) === 'true' ?? false
  const [showMoreInfo, setShowMoreInfo] = useState(localStorageShowMoreInfo)

  const gender = useMemo(() => {
    if (patient.profile.sex === '') {
      return t('N/A')
    }
    return t(`gender-${patient.profile.sex.toLocaleLowerCase()}`)
  }, [patient, t])

  const hbA1c = useMemo(() => {
    return patient.settings.a1c ? `${patient.settings.a1c.value} (${patient.settings.a1c?.date})` : t('N/A')
  }, [patient, t])

  const referringDoctor = useMemo(() => {
    const doctor = patient.profile.referringDoctor
    return !doctor || doctor === '' ? t('N/A') : doctor
  }, [patient, t])

  const onShowMoreInfoClick = (): void => {
    localStorage.setItem(LOCAL_STORAGE_SHOW_MORE_INFO_PATIENT_NAV_BAR_ID, String(!showMoreInfo))
    setShowMoreInfo(!showMoreInfo)
  }

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" paddingTop={1}>
      <Box display="flex">
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('last-name') })}
          fieldValue={patient.profile.lastName}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('birthdate') })}
          fieldValue={moment(patient.profile.birthdate).format('L')}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('diabete-type') })}
          fieldValue={'Type 1'}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('referring-doctor') })}
          fieldValue={referringDoctor}
          fieldWidth={infoWidth}
        />
      </Box>
      <Box display="flex" marginTop={1}>
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('first-name') })}
          fieldValue={patient.profile.firstName}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('gender') })}
          fieldValue={gender}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('remote-monitoring') })}
          fieldValue={patient.monitoring?.enabled ? t('yes') : t('no')}
          fieldWidth={infoWidth}
        />
        <PatientNavBarInfo
          fieldName={t('double-dot', { label: t('email') })}
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
          <Typography fontSize="13px" marginRight={1} sx={{ textDecoration: 'underline' }}>{t('show-more')}</Typography>
          {showMoreInfo ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
        </Box>
      </Box>
      {showMoreInfo &&
        <Box display="flex" marginTop={1} marginBottom={2}>
          <PatientNavBarInfo
            fieldName={t('double-dot', { label: t('hba1c') })}
            fieldValue={hbA1c}
            fieldWidth={infoWidth}
          />
        </Box>}
    </Box>
  )
}
