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

import React, { type FunctionComponent } from 'react'
import { makeStyles } from 'tss-react/mui'
import { PatientView } from '../../enum/patient-view.enum'
import { useAuth } from '../../lib/auth'
import TeamUtils from '../../lib/team/team.util'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { useParams } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import InsertChartIcon from '@mui/icons-material/InsertChart'
import ProfileIcon from '../icons/profile-second-nav-bar-icon'
import DeviceIcon from '../icons/device-icon'
import DailyIcon from '../icons/daily-icon'
import ProfileIconOutlined from '../icons/profile-second-nav-bar-icon-outlined'
import DeviceIconOutlined from '../icons/device-icon-outlined'
import DailyIconOutlined from '../icons/daily-icon-outlined'

interface PatientNavBarTabsProps {
  currentPatientView: PatientView
  onChangePatientView: (patientView: PatientView) => void
}

const styles = makeStyles()((theme) => {
  const TAB_HEIGHT = theme.spacing(9)

  return {
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      zIndex: theme.zIndex.drawer + 2,
      backgroundColor: 'var(--info-color-5)',
      height: TAB_HEIGHT
    },

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

export const PatientNavBarTabsMobile: FunctionComponent<PatientNavBarTabsProps> = (props) => {
  const {
    currentPatientView,
    onChangePatientView
  } = props
  const { classes } = styles()
  const { user } = useAuth()
  const { teamId } = useParams()

  const getSelectedTab = (): PatientView => {
    return currentPatientView ?? PatientView.Dashboard
  }

  return (
    <BottomNavigation
      showLabels
      className={classes.bottomNav}
      value={getSelectedTab()}
      onChange={(event, newValue) => onChangePatientView(newValue)}
      data-testid="subnav-patient-info-mobile"
    >
      <BottomNavigationAction
        icon={getSelectedTab() === PatientView.Dashboard ? (
          <DashboardIcon />
        ) : (
          <DashboardOutlinedIcon />
        )}
        className={classes.bottomNavAction}
        onClick={() => {
          onChangePatientView(PatientView.Dashboard)
        }}
        value={PatientView.Dashboard}
        data-testid="dashboard-tab"
        aria-label="Dashboard"
      />
      <BottomNavigationAction
        icon={getSelectedTab() === PatientView.Daily ? (
          <DailyIcon />
        ) : (
          <DailyIconOutlined />
        )}
        className={classes.bottomNavAction}
        onClick={() => {
          onChangePatientView(PatientView.Daily)
        }}
        value={PatientView.Daily}
        data-testid="daily-tab"
        aria-label="Daily"
      />
      <BottomNavigationAction
        icon={getSelectedTab() === PatientView.Trends ? (
          <InsertChartIcon />
        ) : (
          <InsertChartOutlinedIcon />
        )}
        className={classes.bottomNavAction}
        onClick={() => {
          onChangePatientView(PatientView.Trends)
        }}
        value={PatientView.Trends}
        data-testid="trends-tab"
        aria-label="Trends"
      />
      {user.isUserHcpOrPatient() && !TeamUtils.isPrivate(teamId) &&
        <BottomNavigationAction
          icon={getSelectedTab() === PatientView.PatientProfile ? (
            <ProfileIcon />
          ) : (
            <ProfileIconOutlined />
          )}
          className={classes.bottomNavAction}
          onClick={() => {
            onChangePatientView(PatientView.PatientProfile)
          }}
          value={PatientView.PatientProfile}
          data-testid="patient-profile-tab"
          aria-label="Profile"
        />
      }
      <BottomNavigationAction
        icon={getSelectedTab() === PatientView.Devices ? (
          <DeviceIcon />
        ) : (
          <DeviceIconOutlined />
        )}
        className={classes.bottomNavAction}
        onClick={() => {
          onChangePatientView(PatientView.Devices)
        }}
        value={PatientView.Devices}
        data-testid="device-tab"
        aria-label="Devices"
      />
    </BottomNavigation>
  )
}
