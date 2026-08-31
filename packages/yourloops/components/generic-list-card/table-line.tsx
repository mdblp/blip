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

import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React, { type FC } from 'react'
import { RemoteMonitoringAvatar } from '../../pages/user-account/remote-monitoring-avatar'
import { PartnerName } from '../../lib/external-consents/models/enum/partner-name.enum'

interface TableLineProps {
  label: string
  partner?: PartnerName
  value: string | null
  hideDivider?: boolean
  hideFallbackValue?: boolean
  remoteMonitoring?:boolean
}

export const TableLine: FC<TableLineProps> = (props) => {
  const { label, partner, value, hideDivider, hideFallbackValue = false, remoteMonitoring = false } = props
  const fallback_value = hideFallbackValue ? '' : '-'
  const { t } = useTranslation();
  const translationKey = label.toLowerCase().replaceAll('_', '-');

  return (
    <ListItem divider={!hideDivider} className="list-item">
      <ListItemText>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}>
          {remoteMonitoring ?
            <>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RemoteMonitoringAvatar src={partner} alt={partner} />
                <Typography variant="body2" component="span">
                  {t(translationKey)}
                </Typography>
              </Box>
            </>
            : <Typography variant="body2">{label}</Typography>
          }
          <Typography variant="body2" className="bold">{value || fallback_value}</Typography>
        </Box>
      </ListItemText>
    </ListItem>
  )
}
