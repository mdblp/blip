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
import React, { FC } from 'react'
import { DevicesChangeHistory } from '../../../../components/device/devices-change-history'
import { PumpSettings } from 'medical-domain'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

interface ChangeHistorySectionProps {
  pumpSettings: PumpSettings
  goToDailySpecificDate: (date: number) => void
}

export const DeviceChangeHistorySection: FC<ChangeHistorySectionProps> = (props) => {
  const { goToDailySpecificDate, pumpSettings } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const history = pumpSettings.payload.history.devices
  const timezone = pumpSettings.timezone

  return (
    <Card variant="outlined" sx={{ padding: theme.spacing(2) }} data-testid="device-history-section">
      <CardHeader title={t('device-change-history')} />
      <CardContent>
        <DevicesChangeHistory
          goToDailySpecificDate={goToDailySpecificDate}
          history={history}
          timezone={timezone}
        />
      </CardContent>
    </Card>
  )
}
