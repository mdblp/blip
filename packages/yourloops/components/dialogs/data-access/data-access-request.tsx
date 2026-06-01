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
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import { CheckCircleOutlined, SwapHoriz } from '@mui/icons-material'
import config from '../../../lib/config/config'
import DialogContentText from '@mui/material/DialogContentText'
import { Trans, useTranslation } from 'react-i18next'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { PartnerName } from '../../../lib/external-consents/models/enum/partner-name.enum'
import myDiabbyLogo from 'my-diabby-logo.svg'
import glookoLogo from 'glooko-logo.svg'
import {
  getRemoteMonitoringToolLabel
} from '../../../pages/user-account/sections/data-sharing-section/remote-monitoring.util'

interface DataAccessRequestProps {
  partnerName: PartnerName
  onAcceptAccess: () => void
  onDenyAccess: () => void
  isLoading: boolean
}

export const DataAccessRequest: FC<DataAccessRequestProps> = (props) => {
  const { partnerName, onAcceptAccess, onDenyAccess, isLoading } = props
  const { t } = useTranslation()

  const partnerLabel = getRemoteMonitoringToolLabel(partnerName)

  const dataList = [
    { key: 'glucose-levels', label: t('glucose-levels') },
    { key: 'insulin-delivery', label: t('insulin-delivery-information') },
    { key: 'meal-rescue-carb', label: t('meal-rescue-carb-information') },
    { key: 'alarms-alerts', label: t('alarms-alerts-data-transmission-time-outside-target') },
    { key: 'physical-activity', label: t('physical-activity-data') },
    { key: 'system-settings', label: t('some-system-settings') }
  ]

  const getPartnerLogo = (partnerName: PartnerName) => {
    switch (partnerName) {
      case PartnerName.GlookoXT:
        return glookoLogo
      case PartnerName.MyDiabby:
        return myDiabbyLogo
      default:
        return ''
    }
  }

  return (
    <>
      <DialogTitle>
        {t('data-access-request')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          mb: 6,
          mt: 3
        }}>
          <Box
            component="img"
            src={getPartnerLogo(partnerName)}
            alt={partnerLabel}
            sx={{ width: 200, height: 'auto' }}
          />

          <SwapHoriz sx={{ color: 'text.secondary', fontSize: 'xxx-large' }} />

          <Box
            component="img"
            src={`/branding_${config.BRANDING}_logo.svg`}
            alt={t('alt-img-logo')}
            sx={{ width: 200, height: 'auto' }}
          />
        </Box>


        <DialogContentText>
          <Trans
            i18nKey={'data-access-request-description1'}
            t={t}
            components={{ strong: <strong /> }}
            values={{ partnerName: partnerLabel }}
            parent={React.Fragment}
          />
        </DialogContentText>

        <DialogContentText sx={{ marginTop: 2 }}>
          {t('data-access-request-description2')}
        </DialogContentText>

        <List>
          {dataList.map((item) => (
            <ListItem
              disableGutters
              key={item.key}
              sx={{ py: 0 }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <CheckCircleOutlined />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>

        <DialogContentText sx={{ marginTop: 2 }}>
          {t('data-access-request-description3')}
        </DialogContentText>


      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onDenyAccess}
          disabled={isLoading}
        >
          {t('deny-access')}
        </Button>

        <Button
          loading={isLoading}
          variant="contained"
          onClick={onAcceptAccess}
        >
          {t('allow-access')}
        </Button>
      </DialogActions>
    </>
  )
}
