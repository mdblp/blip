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

import React, { type FunctionComponent, memo } from 'react'
import { type Patient } from '../../lib/patient/models/patient.model'
import Box from '@mui/material/Box'
import { useAuth } from '../../lib/auth'
import { makeStyles } from 'tss-react/mui'
import { type Theme } from '@mui/material/styles'
import { PatientNavBarTabs } from './patient-nav-bar-tabs'
import { PatientNavBarSelect } from './patient-nav-bar-select'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { type PatientView } from '../../enum/patient-view.enum'

interface PatientNavBarProps {
  currentPatientView: PatientView
  currentPatient: Patient
  onChangePatientView: (patientView: PatientView) => void
  onClickDashboard?: () => void
  onClickDaily?: () => void
  onClickPrint?: () => void
  onClickTrends?: () => void
  onSwitchPatient: (patient: Patient) => void
}

const styles = makeStyles()((theme: Theme) => {
  return {
    topContainer: {
      backgroundColor: theme.palette.common.white,
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingBlock: theme.spacing(1),
      width: '100%'
    },
    backIcon: {
      cursor: 'pointer',
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      marginTop: theme.spacing(2)
    }
  }
})

const PatientNavBar: FunctionComponent<PatientNavBarProps> = (props) => {
  const {
    currentPatientView,
    currentPatient,
    onChangePatientView,
    onClickPrint,
    onSwitchPatient
  } = props

  const { user } = useAuth()
  const navigate = useNavigate()
  const { classes } = styles()

  const goBackHome = (): void => {
    navigate(`../..`, { relative: 'path' })
  }

  return (
    <Box data-testid="patient-nav-bar" display="flex" flexDirection="column" marginBottom={3}>
      {!user.isUserPatient() &&
        <Box className={classes.topContainer}>
          <Box display="flex" paddingTop={2}>
            <ArrowBackIcon
              data-testid="subnav-arrow-back"
              className={classes.backIcon}
              onClick={goBackHome}
            />
            <PatientNavBarSelect
              currentPatient={currentPatient}
              onSwitchPatient={onSwitchPatient}
            />
          </Box>
        </Box>
      }
      <PatientNavBarTabs
        currentPatientView={currentPatientView}
        onChangePatientView={onChangePatientView}
        onClickPrint={onClickPrint}
      />
    </Box>
  )
}

export const PatientNavBarMemoized = memo(PatientNavBar)
