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
import { type DeviceConfig } from 'medical-domain'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GenericListCard } from './generic-list-card'

interface DeviceInfoProps {
  device: DeviceConfig
}

export const DeviceInfoTable: FC<DeviceInfoProps> = ({ device }) => {
  const { t } = useTranslation()

  return (
    <GenericListCard title={device.name} data-testid="settings-table-terminal">
      <ListItem divider className="list-item">
        <ListItemText>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}>
            <Typography variant="body2">{t('Manufacturer')}</Typography>
            <Typography variant="body2" className="bold">{device.manufacturer}</Typography>
          </Box>
        </ListItemText>
      </ListItem>
      <ListItem divider className="list-item">
        <ListItemText>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}>
            <Typography variant="body2">{t('Identifier')}</Typography>
            <Typography variant="body2" className="bold">{device.deviceId}</Typography>
          </Box>
        </ListItemText>
      </ListItem>
      <ListItem divider className="list-item">
        <ListItemText>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}>
            <Typography variant="body2">{t('IMEI')}</Typography>
            <Typography variant="body2" className="bold">{device.imei}</Typography>
          </Box>
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText className="list-item">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}>
            <Typography variant="body2">{t('Software version')}</Typography>
            <Typography variant="body2" className="bold">{device.swVersion}</Typography>
          </Box>
        </ListItemText>
      </ListItem>
    </GenericListCard>
  )
}
