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

import React, { FC } from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { formatBirthdate } from 'dumb'
import { Patient } from '../../../../lib/patient/models/patient.model'
import PatientUtils from '../../../../lib/patient/patient.util'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import CakeIcon from '@mui/icons-material/Cake'
import ScienceIcon from '@mui/icons-material/Science'
import ScaleIcon from '@mui/icons-material/Scale'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Divider from '@mui/material/Divider'

interface InformationSectionProps {
  patient: Patient
}

export const PatientPersonalInformation: FC<InformationSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { t } = useTranslation()

  const getGender = (): string => {
    return PatientUtils.getGenderLabel(patient.profile.sex)
  }

  const getPatientInitials = (): string => {
    const firstName = patient.profile.firstName || ''
    const lastName = patient.profile.lastName || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getHbA1c = (): string => {
    // Get HbA1c from patient settings if available
    const a1c = patient?.settings?.a1c?.value
    const a1cDate = patient?.settings?.a1c?.date

    if (!a1c || !a1cDate) {
      return t('N/A')
    }

    return `${a1c}% - (${a1cDate})`

  }

  const getDbUnits = (): string => {
    // TODO:
    //  will be replaced by the actual units from patient settings when patient settings are implemented
    //  as the same time as the patient profile
    return 'mg / dL'
  }

  const getAge = (): string => {
    if (!patient.profile.birthdate) {
      return t('N/A')
    }
    const birthDate = new Date(patient.profile.birthdate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return `${age} ${t('years old')}`
  }

  return (
    <Card variant="outlined" sx={{ padding: theme.spacing(2) }} data-testid="information-section">
      <CardContent>

        <Box display="flex" flexDirection="column" gap={3}>
          {/* Patient Header with Avatar */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: theme.palette.primary.main,
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {getPatientInitials()}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('patient')}
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                {`${patient.profile.firstName || ''} ${patient.profile.lastName || ''}`.trim() || t('N/A')}
              </Typography>
            </Box>
          </Box>
          <Divider variant="fullWidth" sx={{
            marginBottom: theme.spacing(5),
            marginTop: theme.spacing(2)
          }} />

          {/* Email */}
          <Box display="flex" alignItems="center" gap={2}>
            <EmailIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('email')}
              </Typography>
              <Typography variant="body2">
                {patient.profile.email || t('N/A')}
              </Typography>
            </Box>
          </Box>

          {/* Gender */}
          <Box display="flex" alignItems="center" gap={2}>
            <PersonIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('gender')}
              </Typography>
              <Typography variant="body2">
                {getGender()}
              </Typography>
            </Box>
          </Box>

          {/* Date of birth */}
          <Box display="flex" alignItems="center" gap={2}>
            <CakeIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('date-of-birth')}
              </Typography>
              <Typography variant="body2">
                {formatBirthdate(patient.profile.birthdate)}
              </Typography>
            </Box>
          </Box>

          {/* Age */}
          <Box display="flex" alignItems="center" gap={2}>
            <AccessTimeIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('age')}
              </Typography>
              <Typography variant="body2">
                {getAge()}
              </Typography>
            </Box>
          </Box>

          {/* HbA1c */}
          <Box display="flex" alignItems="center" gap={2}>
            <ScienceIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('hbA1c')}
              </Typography>
              <Typography variant="body2">
                {getHbA1c()}
              </Typography>
            </Box>
          </Box>
          {/* glycemia units */}
          <Box display="flex" alignItems="center" gap={2}>
            <ScaleIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('glycemia-units')}
              </Typography>
              <Typography variant="body2">
                {getDbUnits()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
