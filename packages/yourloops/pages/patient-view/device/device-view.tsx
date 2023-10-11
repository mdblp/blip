/*
 * Copyright (c) 2023, Diabeloop
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

import React, { type FC } from 'react'
import type MedicalDataService from 'medical-domain'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { DeviceSettings } from '../../../components/device/device-settings'
import Typography from '@mui/material/Typography'

interface DeviceViewProps {
  goToDailySpecificDate: (date: number) => void
  medicalData: MedicalDataService
}

export const DeviceView: FC<DeviceViewProps> = ({ medicalData, goToDailySpecificDate }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Container data-testid="device-settings-container">
      {medicalData.grouped.pumpSettings.length > 0
        ? <DeviceSettings
          goToDailySpecificDate={goToDailySpecificDate}
          medicalData={medicalData}
        />
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
