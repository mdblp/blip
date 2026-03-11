/*
 * Copyright (c) 2023-2026, Diabeloop
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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { makeStyles } from 'tss-react/mui'
import { Patient } from '../../../../../lib/patient/models/patient.model'
import { PatientAdditionalInformation } from './patient-additional-information'
import { PatientInformation } from './patient-information'
import { PatientTitle } from './patient-title'
import { PatientClinicians } from './clinicians/patient-clinicians'

interface InformationSectionProps {
  patient: Patient
}

const useStyles = makeStyles()((theme) => ({
  separator: {
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
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
  const { classes } = useStyles()


  return (
    <Card variant="outlined" sx={{ padding: theme.spacing(2) }} data-testid="information-section">
      <CardContent>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}>
          <PatientTitle patient={patient} />

          <PatientInformation patient={patient} />

          <div className={classes.separator} />

          <PatientClinicians
            patientId={patient.userid}
            patientProfile={patient.profile}
            clinicians={patient.referringHcps}
          />

          <div className={classes.separator} />

          <PatientAdditionalInformation patient={patient} />
        </Box>
      </CardContent>
    </Card>
  )
}
