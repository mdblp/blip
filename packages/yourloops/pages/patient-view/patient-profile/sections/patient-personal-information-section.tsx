/*
 * Copyright (c) 2023-2024, Diabeloop
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

import React, { FC, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import CakeIcon from '@mui/icons-material/Cake'
import ScaleIcon from '@mui/icons-material/Scale'
import HeightIcon from '@mui/icons-material/Height'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import StraightenIcon from '@mui/icons-material/Straighten'
import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Alert from '@mui/material/Alert'
import { formatBirthdate } from 'dumb'
import { Patient } from '../../../../lib/patient/models/patient.model'
import { BasalIcon } from '../../../../components/icons/diabeloop/basal-icon'
import { PatientDiabeticProfileChip } from '../../../../components/chips/patient-diabetic-profile-chip'
import { getUserName } from '../../../../lib/auth/user.util'
import { useAuth } from '../../../../lib/auth'
import { InfoRow } from '../box/patient-profile-information-info-row'
import { getPatientDisplayInfo } from './patient-profile-section.utils'
import { AdditionalInfoForm } from '../form/patient-profile-additional-info-form'

interface InformationSectionProps {
  patient: Patient
}

const useStyles = makeStyles()((theme: Theme) => ({
  separator: {
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginBottom: theme.spacing(1),
    width: '90%',
  },
  formField: {
    marginBottom: theme.spacing(3),
    width: '80%'
  },
  openCommentsField: {
    width: '90%'
  }
}))

export const PatientPersonalInformationSection: FC<InformationSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { classes } = useStyles()


  const patientInfo = useMemo(() => getPatientDisplayInfo(patient), [patient])

  return (
    <Card variant="outlined" sx={{ padding: theme.spacing(2) }} data-testid="information-section">
      <CardContent>

        <Box display="flex" flexDirection="column" gap={3}>
          {/* Patient Header with Avatar */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              data-testid="patient-avatar"
              sx={{
                width: 56,
                height: 56,
                backgroundColor: theme.palette.primary.main,
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {patientInfo.initials}
            </Avatar>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" fontWeight="medium">
                {getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName) || t('N/A')}
              </Typography>
              {user.isUserPatient() &&
                <PatientDiabeticProfileChip patientDiabeticType={patient.diabeticProfile.type} />
              }
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InfoRow icon={CakeIcon} dataTestId='date-of-birth' label={t('date-of-birth')} value={`${formatBirthdate(patient.profile.birthdate)} (${patientInfo.age})`} />
              <InfoRow icon={PersonIcon} dataTestId='gender' label={t('gender')} value={patientInfo.gender} />
              <InfoRow icon={MonitorWeightIcon} dataTestId='weight' label={t('params|WEIGHT')} value={patientInfo.weight} />
              <InfoRow icon={HeightIcon} dataTestId='height' label={t('params|HEIGHT')} value={patientInfo.height} />
              <InfoRow icon={EmailIcon} dataTestId='email' label={t('email')} value={patient.profile.email || t('N/A')} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow icon={PhoneAndroidIcon} dataTestId='equipment-date' label={t('equipment-date')} value={patientInfo.equipmentDate} />
              <InfoRow icon={StraightenIcon} dataTestId='hba1c' label={t('hba1c')} value={patientInfo.hba1c} />
              <InfoRow icon={ScaleIcon} dataTestId='glycemia-units' label={t('glycemia-units')} value={patientInfo.dbUnits} />
              <InfoRow icon={BasalIcon} dataTestId='insulin-type' label={t('params|INSULIN_TYPE')} value={patientInfo.insulinType} />
            </Grid>
          </Grid>
          <div className={classes.separator} />

          {/* Additional Information Section */}
          <Typography variant="h6" className={classes.sectionTitle}>
            {t('additional-information')}
          </Typography>

          {  user.isUserPatient() &&
            <Alert data-testid="additional-information-status-disclamer-label" severity="info" className={classes.alert}>
              {t('additional-information-disclaimer')}
            </Alert>
          }

          <AdditionalInfoForm
            patient={patient}
          />

        </Box>
      </CardContent>
    </Card>
  )
}
