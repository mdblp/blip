/*
 * Copyright (c) 2021-2022, Diabeloop
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

import React from 'react'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Box, Typography } from '@mui/material'
import { Patient } from '../../lib/data/patient'
import { useTranslation } from 'react-i18next'
import { genderLabels } from '../../lib/auth/helpers'

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  categoryTitle: {
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  label: {
    fontWeight: 600,
    fontSize: '13px',
    width: '180px'
  },
  patientInfo: {
    display: 'flex',
    alignItems: 'top',
    width: '50%',
    marginBottom: theme.spacing(1),
    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  value: {
    fontSize: '13px'
  }
}))

export interface PatientInfoProps {
  patient: Patient
}

function PatientInfo(props: PatientInfoProps): JSX.Element {
  const { patient } = props
  const { t } = useTranslation('yourloops')
  const trNA = t('N/A')
  const classes = useStyles()

  return (
    <>
      <Typography className={classes.categoryTitle}>
        1. {t('patient-info-reminder')}
      </Typography>
      <Box display="flex" marginTop={2}>
        <div className={classes.body}>
          <Box className={classes.patientInfo}>
            <Typography className={classes.label}>
              {t('patient')}
            </Typography>
            <Typography id={`patient-${patient.userid}-full-name`} className={classes.value}>
              {patient.profile.fullName}
            </Typography>
          </Box>
          <Box className={classes.patientInfo}>
            <Typography className={classes.label}>
              {t('email')}
            </Typography>
            <Typography id={`patient-${patient.userid}-email`} className={classes.value}>
              {patient.profile.email}
            </Typography>
          </Box>
          <Box className={classes.patientInfo}>
            <Typography className={classes.label}>
              {t('gender')}
            </Typography>
            <Typography id={`patient-${patient.userid}-gender`} className={classes.value}>
              {genderLabels()[patient.profile.sex ?? '']}
            </Typography>
          </Box>
          <Box className={classes.patientInfo}>
            <Typography className={classes.label}>
              {t('birthdate')}
            </Typography>
            <Typography id={`patient-${patient.userid}-birthdate`} className={classes.value}>
              {patient.profile.birthdate?.toDateString()}
            </Typography>
          </Box>
          <Box className={classes.patientInfo}>
            <Typography className={classes.label}>
              {t('initial-hba1c')}
            </Typography>
            <Typography id={`patient-${patient.userid}-a1c`} className={classes.value}>
              {patient.settings.a1c?.value ?? trNA}
            </Typography>
          </Box>
        </div>
      </Box>
    </>
  )
}

export default PatientInfo
