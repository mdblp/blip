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

import React from 'react';
import { makeStyles } from 'tss-react/mui'
import { PatientView } from '../../enum/patient-view.enum'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import InsertChartIcon from '@mui/icons-material/InsertChart'
import ProfileIcon from '../icons/diabeloop/profile-icon'
import ProfileIconOutlined from '../icons/diabeloop/profile-icon-outlined'
import { DeviceSystemIcon } from '../icons/diabeloop/device-system-icon'
import DeviceSystemIconOutlined from '../icons/diabeloop/device-system-icon-outlined'
import { ChartIconOutlined } from '../icons/diabeloop/chart-icon-outlined'
import ChartIcon from '../icons/diabeloop/chart-icon'
import { useTranslation } from 'react-i18next'

interface BottomNavigationTabProps {
  value: PatientView
  dataTestId: string
  isSelected: boolean
  onChangePatientView: (patientView: PatientView) => void
}

const styles = makeStyles()(() => {
  return {

    bottomNavAction: {
      minWidth: 'auto',
      '&.Mui-selected': {
        backgroundColor: 'var(--info-color-20)',
        color: 'var(--text-color-primary)',
        borderRadius: '24px'
      }
    }
  }
})

export const BottomNavigationTab: React.FC<BottomNavigationTabProps> = (props) => {
  const {
    value,
    dataTestId,
    isSelected,
    onChangePatientView
  } = props
  const { classes } = styles()
  const { t } = useTranslation('yourloops')

  const getIcon = (view: PatientView): JSX.Element => {
    switch (view) {
      case PatientView.Daily:
        return isSelected ? <ChartIcon /> : <ChartIconOutlined />
      case PatientView.Dashboard:
        return isSelected ? <DashboardIcon /> : <DashboardOutlinedIcon />
      case PatientView.Trends:
        return isSelected ? <InsertChartIcon /> : <InsertChartOutlinedIcon />
      case PatientView.PatientProfile:
        return isSelected ? <ProfileIcon /> : <ProfileIconOutlined />
      case PatientView.Devices:
        return isSelected ? <DeviceSystemIcon /> : <DeviceSystemIconOutlined />
    }
  }

  return (
    <BottomNavigationAction
      value={value}
      icon={getIcon(value)}
      className={classes.bottomNavAction}
      onClick={() => {
        onChangePatientView(value)
      }}
      data-testid={dataTestId}
      aria-label={ value === PatientView.PatientProfile ? t("patient-profile") : t(value.toLowerCase())}
    />
  )
}
