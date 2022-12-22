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

import React, { FunctionComponent, memo, MouseEventHandler } from 'react'
import { Patient } from '../../lib/patient/models/patient.model'
import Box from '@mui/material/Box'
import { useAuth } from '../../lib/auth'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { PatientNavBarTabs } from './patient-nav-bar-tabs'
import { PatientNavBarInfos } from './patient-nav-bar-infos'
import { PatientNavBarSelect } from './patient-nav-bar-select'

interface PatientNavBarProps {
  chartType: string
  onClickDashboard: MouseEventHandler<HTMLAnchorElement>
  onClickDaily: MouseEventHandler<HTMLAnchorElement>
  onSwitchPatient: Function
  onClickPrint: MouseEventHandler<HTMLButtonElement>
  onClickTrends: MouseEventHandler<HTMLAnchorElement>
  patient: Patient
  patients: Patient[]
  prefixURL: string
}

const styles = makeStyles()((theme: Theme) => {
  return {
    topContainer: {
      backgroundColor: theme.palette.common.white
    }
  }
})

const PatientNavBar: FunctionComponent<PatientNavBarProps> = (
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
    onClickDaily,
    onClickPrint,
    onSwitchPatient
  } = props

  const { user } = useAuth()

  const { classes, theme } = styles()

  return (
    <Box data-testid="patient-nav-bar" display="flex" flexDirection="column" marginBottom={3}>
      <Box className={classes.topContainer} borderBottom={`1px solid ${theme.palette.divider}`} width="100%">
        {user.isUserPatient()
          ? (
            <Box data-testid="patient-dropdown" paddingTop={3} paddingLeft={7} marginBottom={3}>
              <PatientNavBarInfos patient={patient} infoWidth="18%" />
            </Box>
            ) : (
            <Box display="flex" paddingTop={2}>
              <PatientNavBarSelect patient={patient} patients={patients} onSwitchPatient={onSwitchPatient} />
              <PatientNavBarInfos patient={patient} infoWidth="20%" />
            </Box>
            )
        }
      </Box>
      <PatientNavBarTabs
        chartType={chartType}
        prefixURL={prefixURL}
        onClickDashboard={onClickDashboard}
        onClickTrends={onClickTrends}
        onClickDaily={onClickDaily}
        onClickPrint={onClickPrint}
      />
    </Box>
  )
}

export const PatientNavBarMemoized = memo(PatientNavBar)
