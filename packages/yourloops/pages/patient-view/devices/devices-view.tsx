/*
 * Copyright (c) 2023-2024, Diabeloop
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
import MedicalDataService, { DeviceConfig } from 'medical-domain'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { CurrentParametersSection } from './sections/current-parameters-section'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { SafetyBasalProfileSection } from './sections/safety-basal-profile-section'
import { ChangeHistorySection } from './sections/change-history-section'
import { DevicesViewMenu } from './devices-view-menu'
import { DeviceViewSection } from '../../../models/enums/device-view-section.enum'

interface DeviceViewProps {
  goToDailySpecificDate: (date: number) => void
  medicalData: MedicalDataService
}

function isBasalSafetyProfileAvailable(device : DeviceConfig) : boolean {
  return !device.deviceId.startsWith('mobigo');
}

export const DevicesView: FC<DeviceViewProps> = ({ medicalData, goToDailySpecificDate }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectedSection, setSelectedSection] = useState(DeviceViewSection.CurrentParameters)
  const pumpSettings = medicalData.medicalData.pumpSettings.at(-1)

  const isSelected = (section: DeviceViewSection): boolean => {
    return section === selectedSection
  }

  const selectSection = (section: DeviceViewSection): void => {
    setSelectedSection(section)
  }

  return (
    <Container data-testid="device-settings-container" maxWidth="xl">
      {medicalData.medicalData.pumpSettings.length > 0
        ?
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <DevicesViewMenu
              selectedSection={selectedSection}
              selectSection={selectSection}
              shouldDisplaySafetyBasalProfile={isBasalSafetyProfileAvailable(pumpSettings.payload.device)}
            />
          </Grid>
          <Grid item xs={9}>
            {
              isSelected(DeviceViewSection.CurrentParameters) ?
                <CurrentParametersSection pumpSettings={pumpSettings} />
                : isSelected(DeviceViewSection.SafetyBasalProfile) ?
                  <SafetyBasalProfileSection
                    safetyBasalConfig={pumpSettings.payload.securityBasals}
                    deviceSystem={pumpSettings.payload.device.name}
                  />
                  : isSelected(DeviceViewSection.ChangeHistory) ?
                    <ChangeHistorySection
                      goToDailySpecificDate={goToDailySpecificDate}
                      pumpSettings={pumpSettings}
                    />
                    : <></>
            }

          </Grid>
        </Grid>
        : <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={theme.spacing(4)}
        >
          <Typography fontWeight={500}>{t('no-settings-on-device-alert-message')}</Typography>
        </Box>
      }
    </Container>
  )
}
