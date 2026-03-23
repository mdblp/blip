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

import React, { FC } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getUserName } from '../../../../../lib/auth/user.util'
import { PatientDiabeticProfileChip } from '../../../../../components/chips/patient-diabetic-profile-chip'
import { useTheme } from '@mui/material/styles'
import { Patient } from '../../../../../lib/patient/models/patient.model'
import { useAuth } from '../../../../../lib/auth'
import { useTranslation } from 'react-i18next'

interface PatientTitleProps {
  patient: Patient
}

export const PatientTitle: FC<PatientTitleProps> = (props) => {
  const { patient } = props
  const { t } = useTranslation()
  const { user } = useAuth()
  const theme = useTheme()

  const firstName = patient.profile.firstName || ''
  const lastName = patient.profile.lastName || ''
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2
      }}>
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
        {initials}
      </Avatar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center"
        }}>
        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
          {getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName) || t('N/A')}
        </Typography>
        {user.isUserPatient() &&
          <PatientDiabeticProfileChip patientDiabeticType={patient.diabeticProfile.type} />
        }
      </Box>
    </Box>
  )
}
