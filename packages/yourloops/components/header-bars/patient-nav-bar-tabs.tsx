/*
 * Copyright (c) 2022-2024, Diabeloop
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

import React, { type FunctionComponent, type MouseEventHandler } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { makeStyles } from 'tss-react/mui'
import { type Theme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import GetAppIcon from '@mui/icons-material/GetApp'
import { PatientView } from '../../enum/patient-view.enum'
import { useAuth } from '../../lib/auth'
import { useNavigate, useParams } from 'react-router-dom'
import TeamUtils from '../../lib/team/team.util'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { type Patient } from '../../lib/patient/models/patient.model'
import Typography from '@mui/material/Typography'
import { getUserName } from '../../lib/auth/user.util'
import Chip from '@mui/material/Chip'
import { DiabeticType } from 'medical-domain'

interface PatientNavBarTabsProps {
  currentPatient: Patient
  currentPatientView: PatientView
  onChangePatientView: (patientView: PatientView) => void
  onClickPrint: MouseEventHandler<HTMLButtonElement>
}

const styles = makeStyles()((theme: Theme) => {
  const TAB_HEIGHT = theme.spacing(6)
  return {
    root: {
      minHeight: TAB_HEIGHT,
      height: TAB_HEIGHT
    },
    tabsContainer: {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.common.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: theme.spacing(3)
    },
    tab: {
      fontWeight: 'bold',
      fontSize: theme.typography.htmlFontSize,
      color: 'var(--text-color-primary)'
    },
    backIcon: {
      cursor: 'pointer',
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    leftSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    centerSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    chip: {
      textTransform: 'none',
      borderRadius: theme.spacing(2),
      minWidth: 'auto',
      paddingX: theme.spacing(2),
      paddingY: theme.spacing(0.5),
      margin: theme.spacing(0, 0, 0, 4),
      height: '26px'
    }
  }
})

interface ChipConfig {
  label: string
  color: 'primary' | 'pink' | 'darkBlue'
}

export const PatientNavBarTabs: FunctionComponent<PatientNavBarTabsProps> = (props) => {
  const {
    currentPatient,
    currentPatientView,
    onChangePatientView,
    onClickPrint
  } = props
  const { t } = useTranslation()
  const { classes } = styles()
  const { user } = useAuth()
  const { teamId } = useParams()
  const navigate = useNavigate()

  const getSelectedTab = (): PatientView => {
    return currentPatientView ?? PatientView.Dashboard
  }

  const goBackHome = (): void => {
    navigate(`../..`, { relative: 'path' })
  }

  const getChipConfig = (type: DiabeticType): ChipConfig => {
    switch (type) {
      case DiabeticType.DT1DT2:
        return {
          label: t('range-profile-type-1-and-2'),
          color: 'primary'
        }
      case DiabeticType.DT1Pregnancy:
        return {
          label: t('range-profile-pregnancy-type-1'),
          color: 'pink'
        }
      case DiabeticType.Custom:
        return {
          label: t('range-profile-custom'),
          color: 'darkBlue'
        }
    }
  }

  const currentPatientDiabeticType = currentPatient.diabeticProfile?.type ?? DiabeticType.DT1DT2
  const chipConfig = getChipConfig(currentPatientDiabeticType)


  return (
    <Box className={classes.tabsContainer}>
      <Box data-testid="subnav-patient-info" className={classes.leftSection}>
        <ArrowBackIcon
          data-testid="subnav-arrow-back"
          className={classes.backIcon}
          onClick={goBackHome}
        />
        <Typography>
          {getUserName(currentPatient.profile.firstName, currentPatient.profile.lastName, currentPatient.profile.fullName)}
        </Typography>
        <Chip
          label={chipConfig.label}
          variant={'filled'}
          color={chipConfig.color}
          className={classes.chip}
        />
      </Box>
      <Box className={classes.centerSection}>
        <Tabs value={getSelectedTab()} classes={{ root: classes.root }}>
          <Tab
            className={classes.tab}
            value={PatientView.Dashboard}
            data-testid="dashboard-tab"
            iconPosition="start"
            label={t('dashboard')}
            onClick={() => {
              onChangePatientView(PatientView.Dashboard)
            }}
            classes={{
              root: classes.root
            }}
          />
          <Tab
            className={classes.tab}
            value={PatientView.Daily}
            data-testid="daily-tab"
            iconPosition="start"
            label={t('daily')}
            onClick={() => {
              onChangePatientView(PatientView.Daily)
            }}
            classes={{
              root: classes.root
            }}
          />
          <Tab
            className={classes.tab}
            value={PatientView.Trends}
            data-testid="trends-tab"
            iconPosition="start"
            label={t('trends')}
            onClick={() => {
              onChangePatientView(PatientView.Trends)
            }}
            classes={{
              root: classes.root
            }}
          />
          {user.isUserHcp() && !TeamUtils.isPrivate(teamId) &&
            <Tab
              className={classes.tab}
              value={PatientView.PatientProfile}
              data-testid="patient-profile-tab"
              iconPosition="start"
              label={t('patient-profile')}
              onClick={() => {
                onChangePatientView(PatientView.PatientProfile)
              }}
              classes={{
                root: classes.root
              }}
            />
          }
          <Tab
            className={classes.tab}
            value={PatientView.Devices}
            data-testid="device-tab"
            iconPosition="start"
            label={t('devices')}
            onClick={() => {
              onChangePatientView(PatientView.Devices)
            }}
            classes={{
              root: classes.root
            }}
          />
        </Tabs>
      </Box>
      <Box className={classes.rightSection}>
        <Button data-testid="download-report" onClick={onClickPrint}>
          <GetAppIcon />
          {t('button-pdf-download-report')}
        </Button>
      </Box>
    </Box>
  )
}
