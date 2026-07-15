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

import React, { type FunctionComponent, memo, useState } from 'react'
import { type Patient } from '../../lib/patient/models/patient.model'
import Box from '@mui/material/Box'
import { PatientNavBarTabs } from './patient-nav-bar-tabs'
import { MainHeaderPatientNavMobile } from './main-header-patient-nav-mobile'
import { type PatientView } from '../../enum/patient-view.enum'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles'

interface PatientNavBarProps {
  currentPatientView: PatientView
  currentPatient: Patient
  onChangePatientView: (patientView: PatientView) => void
  onClickDashboard?: () => void
  onClickDaily?: () => void
  onClickPrint?: () => void
  onClickTrends?: () => void
}

const PatientNavBar: FunctionComponent<PatientNavBarProps> = (props) => {
  const {
    currentPatientView,
    currentPatient,
    onChangePatientView,
    onClickPrint
  } = props

  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mainHeaderHeight, setMainHeaderHeight] = useState<number>(0)

  return (
    <Box
      data-testid="patient-nav-bar"
      sx={{
        display: "flex",
        flexDirection: "column",
        marginBottom: 3
      }}>
      {
        isMobile && (
          <Box sx={{ minHeight: mainHeaderHeight }}>
            <MainHeaderPatientNavMobile
              onClickPrint={onClickPrint}
              setMainHeaderHeight={setMainHeaderHeight}
            />
          </Box>
        )
      }
      <Box
      >
        <PatientNavBarTabs
          currentPatient={currentPatient}
          currentPatientView={currentPatientView}
          onChangePatientView={onChangePatientView}
          onClickPrint={onClickPrint}
        />
      </Box>
    </Box>
  )
}

export const PatientNavBarMemoized = memo(PatientNavBar)
