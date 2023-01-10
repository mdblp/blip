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

import React, { FunctionComponent } from 'react'

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { useUserName } from '../../lib/custom-hooks/user-name.hook'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { usePatientContext } from '../../lib/patient/patient.provider'

interface PatientNavBarSelectProps {
  currentPatient?: Patient
  onSwitchPatient: Function
}

const styles = makeStyles()((theme: Theme) => ({
  iconStandard: { color: theme.palette.primary.main }
}))

export const PatientNavBarSelect: FunctionComponent<PatientNavBarSelectProps> = (props) => {
  const {
    currentPatient,
    onSwitchPatient
  } = props

  const { t } = useTranslation('yourloops')
  const { getUserName } = useUserName()

  const { classes, theme } = styles()
  const { patients } = usePatientContext()

  const onPatientSelected = (event: SelectChangeEvent<string>): void => {
    onSwitchPatient(patients.find(patient => patient.userid === event.target.value))
  }

  return (
    <Box
      data-testid="patient-dropdown"
      display="flex"
      flexDirection="column"
      marginRight={5}
      marginBottom={3}
      width="20%"
    >
      <Typography variant="caption">{t('patient')}</Typography>
      <FormControl data-testid="subnav-patient-list">
        <Select
          data-testid="drop-down-patient"
          defaultValue={currentPatient.userid}
          IconComponent={KeyboardArrowDownIcon}
          onChange={onPatientSelected}
          variant="standard"
          disableUnderline
          sx={{ fontSize: theme.typography.h6.fontSize, color: theme.palette.primary.main }}
          classes={{ iconStandard: classes.iconStandard }}
        >
          {
            patients.map((patient, index) => {
              return (
                <MenuItem
                  key={index}
                  value={patient.userid}>{getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName)}
                </MenuItem>)
            })
          }
        </Select>
      </FormControl>
    </Box>
  )
}
