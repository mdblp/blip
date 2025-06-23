/*
 * Copyright (c) 2025, Diabeloop
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
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { DataCard } from '../../data-card/data-card'
import { useTranslation } from 'react-i18next'
import { PumpSettings } from 'medical-domain'
import { makeStyles } from 'tss-react/mui'
import { useTheme } from '@mui/material/styles'

interface DeviceListCardProps {
  pumpSettings: PumpSettings
}

const useStyles = makeStyles()(() => ({
  deviceValue: {
    fontWeight: 'bold',
  }
}))

export const DeviceListCard: FC<DeviceListCardProps> = (props) => {
  const { t } = useTranslation()
  const { pumpSettings } = props
  const { classes } = useStyles()
  const theme = useTheme()

  const deviceData = {
    cgm: {
      label: t('CGM'),
      value: pumpSettings?.payload.cgm ? `${pumpSettings.payload.cgm.manufacturer} ${pumpSettings.payload.cgm.name}` : ''
    },
    device: {
      label: t('dbl'),
      value: pumpSettings?.payload.device.manufacturer ?? ''
    },
    pump: {
      label: t('Pump'),
      value: pumpSettings?.payload.pump.manufacturer ?? ''
    }
  }

  return (
    <DataCard data-testid="device-usage-device-list">
      <Typography sx={{ fontWeight: 'bold', paddingBottom: theme.spacing(1) }}>
        {t('devices')}
      </Typography>
      {Object.keys(deviceData).map(
        (key) =>
          <React.Fragment key={key}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {deviceData[key].label}
              <Box
                display="flex"
                alignItems="center"
                className={classes.deviceValue}
              >
                  <span className={classes.deviceValue}>
                    {deviceData[key].value}
                  </span>
              </Box>
            </Box>
          </React.Fragment>
      )}
    </DataCard>
  )
}
