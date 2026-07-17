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
import { useParams } from 'react-router-dom'
import { BottomNavigationTab } from './bottom-navigation-tab'

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

  const isSelected = (view: PatientView): boolean => {
    return currentPatientView === view
  }

  return (
    <BottomNavigation
      className={classes.bottomNav}
      value={getSelectedTab()}
      onChange={(_, newValue) => onChangePatientView(newValue)}
      data-testid="subnav-patient-info-mobile"
    >
      <BottomNavigationTab
        value={PatientView.Dashboard}
        dataTestId="dashboard-tab"
        isSelected={isSelected(PatientView.Dashboard)}
        onChangePatientView={onChangePatientView}
      />
      <BottomNavigationTab
        value={PatientView.Daily}
        dataTestId="daily-tab"
        isSelected={isSelected(PatientView.Daily)}
        onChangePatientView={onChangePatientView}
      />
      <BottomNavigationTab
        value={PatientView.Trends}
        dataTestId="trends-tab"
        isSelected={isSelected(PatientView.Trends)}
        onChangePatientView={onChangePatientView}
      />
      {user.isUserHcpOrPatient() && !TeamUtils.isPrivate(teamId) &&
        <BottomNavigationTab
          value={PatientView.PatientProfile}
          dataTestId="patient-profile-tab"
          isSelected={isSelected(PatientView.PatientProfile)}
          onChangePatientView={onChangePatientView}
        />
      }
      <BottomNavigationTab
        value={PatientView.Devices}
        dataTestId="device-tab"
        isSelected={isSelected(PatientView.Devices)}
        onChangePatientView={onChangePatientView}
      />
    </BottomNavigation>
  )
}
