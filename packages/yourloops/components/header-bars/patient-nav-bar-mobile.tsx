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

import React, { type FunctionComponent, useState } from 'react'
import Box from '@mui/material/Box'
import { PatientNavBarTabsMobile } from './patient-nav-bar-tabs-mobile'
import { MainHeaderPatientNavMobile } from './main-header-patient-nav-mobile'
import { type PatientView } from '../../enum/patient-view.enum'
import { MainHeaderBottomBackButton } from './main-header-bottom-back-button'
import { DeviceViewSections } from '../../enum/patient-view-sections.enum'
import { useLocation } from 'react-router-dom'
import { AppUserRoute } from '../../models/enums/routes.enum'

interface PatientNavBarProps {
  currentPatientView: PatientView
  onChangePatientView: (patientView: PatientView) => void
  onClickPrint?: () => void
}

export const PatientNavBarMobile: FunctionComponent<PatientNavBarProps> = (props) => {
  const {
    currentPatientView,
    onChangePatientView,
    onClickPrint
  } = props

  const [mainHeaderHeight, setMainHeaderHeight] = useState<number>(0)
  const { pathname } = useLocation()

  const DEVICE_VIEW_SECTIONS_URL_MAPPING: Record<DeviceViewSections, string> = {
    [DeviceViewSections.CurrentSettings]: 'current-settings',
    [DeviceViewSections.BasalSafety]: 'basal-safety',
    [DeviceViewSections.SettingsHistory]: 'settings-history',
    [DeviceViewSections.DevicesHistory]: 'devices-history'
  }

  const isMatchingDeviceViewSections = Object.values(DEVICE_VIEW_SECTIONS_URL_MAPPING).some(viewValue =>
    pathname.includes(viewValue)
  )

  return (
    <>
      <Box sx={{ minHeight: mainHeaderHeight }}>
        {(pathname.includes(AppUserRoute.Patients) && isMatchingDeviceViewSections) ?
          <MainHeaderPatientNavMobile
            onClickPrint={onClickPrint}
            setMainHeaderHeight={setMainHeaderHeight}
          />
          : <MainHeaderBottomBackButton />
        }
      </Box>

      <Box>
        <PatientNavBarTabsMobile
          currentPatientView={currentPatientView}
          onChangePatientView={onChangePatientView}
        />
      </Box>
    </>
  )
}

