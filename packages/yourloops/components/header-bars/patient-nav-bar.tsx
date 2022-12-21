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

import React, { FunctionComponent, MouseEventHandler, useMemo } from 'react'

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Today from '@mui/icons-material/Today'
import TrendingUp from '@mui/icons-material/TrendingUp'
import { Patient } from '../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { useAuth } from '../../lib/auth'
import { useUserName } from '../../lib/custom-hooks/user-name.hook'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import moment from 'moment-timezone'
import { PatientNavBarInfo } from './patient-nav-bar-info'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface PatientNavBarProps {
  patient: Patient
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
    },
    tabs: {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.common.white
    },
    tab: {
      fontWeight: 'bold',
      marginRight: theme.spacing(5),
      textTransform: 'capitalize',
      fontSize: '16px',
      color: 'var(--text-base-color)'
    },
    tabsRoot: {
      minHeight: '48px',
      height: '48px'
    },
    tabRoot: {
      minHeight: '48px',
      height: '48px'

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

  const selectedTab = (): number => {
    switch (chartType) {
      case 'dashboard':
        return 0
      case 'daily':
        return 1
      case 'trends':
        return 2
    }
  }

  const gender = useMemo(() => {
    if (patient.profile.sex === '') {
      return t('N/A')
    }
    return t(patient.profile.sex)
  }, [patient, t])

  return (
    <Box display="flex" flexDirection="column" marginBottom={3}>
      <Box className={classes.topContainer} borderBottom={`1px solid ${theme.palette.divider}`} width="100%">
        {user.isUserPatient()
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
                          return (<MenuItem key={i} value={patient.userid}>{patient.profile.fullName}</MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>
                <Box display="flex" flexDirection="column" flexGrow="1" paddingTop={1}>
                  <Box display="flex">
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('last-name') })}
                      fieldValue={patient.profile.lastName}
                    />
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('birthdate') })}
                      fieldValue={moment(patient.profile.birthdate).format('L')}
                    />
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('diabete-type') })}
                      fieldValue={'Type 1'}
                    />
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('referring-doctor') })}
                      fieldValue={patient.profile.referringDoctor ?? t('N/A')}
                    />
                  </Box>
                  <Box display="flex" marginTop={1}>
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('first-name') })}
                      fieldValue={patient.profile.firstName}
                    />
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('gender') })}
                      fieldValue={gender}
                    />
                    <PatientNavBarInfo
                      fieldName={t('double-dot', { label: t('remote-monitoring') })}
                      fieldValue={patient.monitoring?.enabled ? 'Oui' : 'Non'}
                    />
                  </Box>
                </Box>
              </Box>
            </div>
            )
        }
      </Box>
      <Box className={classes.tabs} width="100%" paddingLeft={7}>
        <Tabs value={selectedTab()} classes={{
          root: classes.tabsRoot
        }}>
          <Tab
            className={classes.tab}
            data-testid="dashboard-tab"
            href={`${prefixURL}/dashboard`}
            iconPosition="start"
            label={t('dashboard')}
            icon={<DashboardOutlinedIcon />}
            onClick={onClickDashboard}
            classes={{
              root: classes.tabRoot
            }}
          />
          <Tab
            className={classes.tab}
            data-testid="daily-tab"
            href={`${prefixURL}/daily`}
            iconPosition="start"
            label={t('Daily')}
            icon={<Today />}
            onClick={onClickOneDay}
            classes={{
              root: classes.tabRoot
            }}
          />
          <Tab
            className={classes.tab}
            data-testid="trends-tab"
            href={`${prefixURL}/trends`}
            iconPosition="start"
            label={t('Trends')}
            icon={<TrendingUp />}
            onClick={onClickTrends}
            classes={{
              root: classes.tabRoot
            }}
          />
        </Tabs>
      </Box>
    </Box>
  )
}
