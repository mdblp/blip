/*
 * Copyright (c) 2026, Diabeloop
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

import Grid from '@mui/material/Grid'
import { InfoRow } from '../../box/patient-profile-information-info-row'
import CakeIcon from '@mui/icons-material/Cake'
import { formatBirthdate } from 'dumb'
import PersonIcon from '@mui/icons-material/Person'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import HeightIcon from '@mui/icons-material/Height'
import EmailIcon from '@mui/icons-material/Email'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import StraightenIcon from '@mui/icons-material/Straighten'
import ScaleIcon from '@mui/icons-material/Scale'
import { BasalIcon } from '../../../../../components/icons/diabeloop/basal-icon'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Patient } from '../../../../../lib/patient/models/patient.model'
import { getPatientDisplayInfo } from './patient-personal-information.util'
import { DblParameter } from 'medical-domain'
import { formatNumberForLang } from '../../../../../lib/language'

interface PatientInformationProps {
  patient: Patient
}

export const PatientInformation: FC<PatientInformationProps> = (props) => {
  const { patient } = props
  const { t } = useTranslation()

  const patientInfo = useMemo(() => getPatientDisplayInfo(patient), [patient])

  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <InfoRow icon={CakeIcon} dataTestId='date-of-birth' label={t('date-of-birth')} value={`${formatBirthdate(patient.profile.birthdate)} (${patientInfo.age})`} />
        <InfoRow icon={PersonIcon} dataTestId='gender' label={t('gender')} value={patientInfo.gender} />
        <InfoRow icon={MonitorWeightIcon} dataTestId='weight' label={t(`params|${DblParameter.Weight}`)} value={formatNumberForLang(patientInfo.weight)} />
        <InfoRow icon={HeightIcon} dataTestId='height' label={t(`params|${DblParameter.Height}`)} value={formatNumberForLang(patientInfo.height)} />
        <InfoRow icon={EmailIcon} dataTestId='email' label={t('email')} value={patient.profile.email || t('N/A')} />
      </Grid>
      <Grid size={6}>
        <InfoRow icon={PhoneAndroidIcon} dataTestId='equipment-date' label={t('equipment-date')} value={patientInfo.equipmentDate} />
        <InfoRow icon={StraightenIcon} dataTestId='hba1c' label={t('hba1c')} value={formatNumberForLang(patientInfo.hba1c)} />
        <InfoRow icon={ScaleIcon} dataTestId='glycemia-units' label={t('glycemia-units')} value={patientInfo.dbUnits} />
        <InfoRow icon={BasalIcon} dataTestId='insulin-type' label={t(`params|${DblParameter.InsulinType}`)} value={patientInfo.insulinType} />
      </Grid>
    </Grid>
  )
}
