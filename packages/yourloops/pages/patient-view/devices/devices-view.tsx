/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { type FC, useState } from 'react'
import MedicalDataService, { DeviceConfig, DeviceSystem, PumpSettings, SecurityBasalConfig } from 'medical-domain'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { CurrentParametersSection } from './sections/current-parameters-section'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { SafetyBasalProfileSection } from './sections/safety-basal-profile-section'
import { ParametersChangeHistorySection } from './sections/parameters-change-history-section'
import { DevicesViewMenu } from './devices-view-menu'
import { DeviceViewSection } from './device-view-section.enum'
import { DeviceChangeHistorySection } from './sections/device-change-history-section'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MainHeaderMobileMemoized } from '../../../components/header-bars/main-header-mobile'
import { MainHeaderDesktopMemoized } from '../../../components/header-bars/main-header-desktop'
import { DevicesViewDesktop } from './devices-view-desktop'
import { DeviceViewSectionsOverview } from './devices-view-sections-overview'

interface DeviceViewProps {
  goToDailySpecificDate: (date: number) => void
  medicalData: MedicalDataService
  pumpSettings: PumpSettings
}

export const DevicesView: FC<DeviceViewProps> = (props) => {

  const { medicalData, goToDailySpecificDate, pumpSettings } = props
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      {isMobile
        ? <DeviceViewSectionsOverview pumpSettings={pumpSettings} />
        : <DevicesViewDesktop
          goToDailySpecificDate={goToDailySpecificDate}
          medicalData={medicalData}
        />
      }
    </>
  )
}
