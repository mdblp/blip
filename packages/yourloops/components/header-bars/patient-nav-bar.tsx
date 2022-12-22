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

import React, { FunctionComponent, MouseEventHandler } from 'react'

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { useAuth } from '../../lib/auth'
import { useUserName } from '../../lib/custom-hooks/user-name.hook'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { PatientNavBarTabs } from './patient-nav-bar-tabs'
import { PatientNavBarInfos } from './patient-nav-bar-infos'
import PatientUtils from '../../lib/patient/patient.util'

interface PatientNavBarProps {
  patient?: Patient
  patients: Patient[]
  chartType: string
  prefixURL: string
  onClickDashboard: MouseEventHandler<HTMLAnchorElement>
  onClickTrends: MouseEventHandler<HTMLAnchorElement>
  onClickOneDay: MouseEventHandler<HTMLAnchorElement>
  onClickPrint: MouseEventHandler<HTMLButtonElement>
  onSwitchPatient: Function
}

const styles = makeStyles()((theme: Theme) => {
  return {
    select: {
      fontSize: '22px'
    },
    iconStandard: { color: theme.palette.primary.main },
    topContainer: {
      backgroundColor: theme.palette.common.white
    }
  }
})

export const PatientNavBar: FunctionComponent<PatientNavBarProps> = (
  {
    prefixURL = '',
    ...props
  }) => {
  const {
    patient,
    patients,
    chartType,
    onClickDashboard,
    onClickTrends,
    onClickOneDay,
    onSwitchPatient
  } = props

  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { getUserName } = useUserName()

  const { classes, theme } = styles()

  return (
    <Box display="flex" flexDirection="column" marginBottom={3}>
      <Box className={classes.topContainer} borderBottom={`1px solid ${theme.palette.divider}`} width="100%">
        {patient && user.isUserPatient()
          ? (
            <div data-testid="patient-dropdown">
              {getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName)}
            </div>
            ) : (
            <div>
              <Box display="flex" paddingTop={2}>
                <Box
                  data-testid="patient-dropdown"
                  display="flex"
                  flexDirection="column"
                  paddingLeft={7}
                  marginRight={5}
                  marginBottom={3}
                  width="20%"
                >
                  <Typography fontSize="13px">{t('patient')}</Typography>
                  <FormControl data-testid="subnav-patient-list">
                    <Select
                      data-testid="drop-down-patient"
                      defaultValue={patient.userid}
                      IconComponent={KeyboardArrowDownIcon}
                      onChange={event => onSwitchPatient(patients.find(patient => patient.userid === event.target.value))}
                      variant="standard"
                      disableUnderline
                      sx={{ fontSize: '22px', color: theme.palette.primary.main }}
                      classes={{ iconStandard: classes.iconStandard }}
                    >
                      {
                        patients.map((patient, i) => {
                          return (
                            <MenuItem
                              key={i}
                              value={patient.userid}>{getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName)}
                            </MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>
                <PatientNavBarInfos patient={patient} />
              </Box>
            </div>
            )
        }
      </Box>
      <PatientNavBarTabs
        chartType={chartType}
        prefixURL={prefixURL}
        onClickDashboard={onClickDashboard}
        onClickTrends={onClickTrends}
        onClickOneDay={onClickOneDay}
      />
    </Box>
  )
}
