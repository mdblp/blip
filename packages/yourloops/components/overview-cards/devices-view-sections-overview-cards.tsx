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

import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GenericListCard } from '../generic-list-card/generic-list-card'
import { makeStyles } from 'tss-react/mui'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { ViewMoreLink } from '../buttons/view-more-link'
import Typography from '@mui/material/Typography'
import { DblParameter, DeviceConfig, PumpSettings } from 'medical-domain'
import { formatDateWithMomentShortFormat } from '../../lib/utils'
import { useLocation } from 'react-router-dom'
import { ChangeValueSectionsOverview } from '../device/change-value-sections-overview'
import {
  formatParameterValue,
  getTranslationKeyForDeviceChange,
  sortDeviceChangeHistory,
  sortHistory
} from '../device/utils/device.utils'
import { cardStyle } from './card-style'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

interface DeviceViewSectionsOverviewCardsProps {
  pumpSettings: PumpSettings
}

export const deviceCardStyle = makeStyles()((theme) => {
  return {
    listOfParameters: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      flex: 1,
      maxWidth: '100%'
    },
    parameterChange: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1
    },
    dateLastUpdate: {
      paddingBottom: theme.spacing(2)
    }
  }
})

export const DeviceViewSectionsOverviewCards: FC<DeviceViewSectionsOverviewCardsProps> = ({ pumpSettings }) => {
  const { t } = useTranslation()
  const { classes: { parameterChange, listOfParameters, dateLastUpdate } } = deviceCardStyle()
  const { classes: { cards, cardsHeader } } = cardStyle()
  const { device, pump, parameters, cgm, history } = pumpSettings.payload
  const totalDailyInsulin = parameters.find(parameter => parameter.name === DblParameter.TotalDailyInsulin)
  const targetGlucoseLevel = parameters.find(parameter => parameter.name === DblParameter.TargetGlucoseLevel)
  const totalHypoglycemiaThreshold = parameters.find(parameter => parameter.name === DblParameter.HypoglycemiaThreshold)
  const lastParameterChange = history.parameters
  sortHistory(lastParameterChange)
  const lastDeviceChange = history.devices
  sortDeviceChangeHistory(lastDeviceChange)
  const { pathname } = useLocation()
  const urlPrefix = pathname.substring(0, pathname.lastIndexOf('/'))
  const timezone = pumpSettings.timezone
  const firstChange = lastParameterChange?.[0]
  const hasParameters = Boolean(firstChange?.parameters?.length)
  const firstDeviceChange = lastDeviceChange?.[0]
  const hasDevices = Boolean(firstDeviceChange?.devices?.length)
  const theme = useTheme()

  const isBasalSafetyProfileAvailable = (pumpSettings: PumpSettings): boolean => {
    return !isMobiGoDevice(pumpSettings.payload.device)
  }

  const isMobiGoDevice = (device: DeviceConfig): boolean => {
    return device.deviceId.toLowerCase().startsWith('mobigo')
  }

  const formattedDateForSettings = hasParameters
    ? formatDateWithMomentShortFormat(
      new Date(firstChange.changeDate),
      t('short-date-with-time'),
      timezone
    )
    : ''

  const formattedDateForDevice = hasDevices
    ? formatDateWithMomentShortFormat(
      new Date(firstDeviceChange.changeDate),
      t('short-date-with-time'),
      timezone
    )
    : ''

  const getTableLinesCurrentSettings = (): { label: string, value: string }[] => {
    return [
      { label: t('system'), value: device?.name },
      { label: t('Pump'), value: pump?.name },
      { label: t('CGM'), value: cgm?.manufacturer && cgm?.name ? `${cgm.manufacturer} ${cgm.name}` : "" },
      ...(totalDailyInsulin
        ? [{
          label: t(`params|${DblParameter.TotalDailyInsulin}`),
          value: totalDailyInsulin.value + " " + totalDailyInsulin.unit
        }]
        : []),

      ...(targetGlucoseLevel
        ? [{
          label: t(`params|${DblParameter.TargetGlucoseLevel}`),
          value: targetGlucoseLevel?.value + " " + targetGlucoseLevel?.unit
        }]
        : []),

      ...(totalHypoglycemiaThreshold
        ? [{
          label: t(`params|${DblParameter.HypoglycemiaThreshold}`),
          value: totalHypoglycemiaThreshold?.value + " " + totalHypoglycemiaThreshold?.unit
        }]
        : [])
    ]
  }

  return (
    <>
      <GenericListCard
        title={t('current-parameters')}
        data-testid="device-view-overview-card-current-settings"
        tableLines={getTableLinesCurrentSettings()}
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        headerAction={
          <ViewMoreLink
            dataTestId="link-device-current-settings"
            targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewCurrentSettings}`}
          />
        }
      />

      {isBasalSafetyProfileAvailable(pumpSettings) && (
        <GenericListCard
          title={t('basal-safety-profile-short')}
          data-testid="device-view-overview-card-basal-safety"
          cardClassName={cards}
          cardHeaderClassName={cardsHeader}
          headerAction={
            <ViewMoreLink
              dataTestId="link-device-basal-safety"
              targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewBasalSafety}`}
            />
          }
        >
          <Typography variant="body2">
            {t('basal-safety-card-text')}
          </Typography>
        </GenericListCard>
      )}

      <GenericListCard
        title={t('settings-change-history-short')}
        data-testid="device-view-overview-card-parameters-history"
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        headerAction={
          <ViewMoreLink
            dataTestId="link-device-parameters-history"
            targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewSettingsHistory}`}
          />
        }
      >
        {hasParameters ? (
          <Box className={listOfParameters}>
            <Typography variant="body2" className={dateLastUpdate}>
              {`${t('last-upload:')} ${formattedDateForSettings}`}
            </Typography>

            {firstChange.parameters.map((parameter) => (
              <Box key={`${parameter.name}-${parameter.value}`} className={parameterChange}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 'bold',
                    flexGrow: 1,
                    width: 0,
                    paddingRight: theme.spacing(2)
                  }}>
                  {t(`params|${parameter.name}`)}
                </Typography>
                <ChangeValueSectionsOverview
                  previousValue={
                    parameter.previousValue
                      ? `${formatParameterValue(parameter.previousValue, parameter.previousUnit)} `
                      : parameter.previousValue
                  }
                  previousUnit={parameter.previousUnit}
                  currentValue={`${formatParameterValue(parameter.value, parameter.unit)}`}
                  withFormatting={true}
                  currentUnit={parameter.unit}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">
            {t('no-data')}
          </Typography>
        )}
      </GenericListCard>

      <GenericListCard
        title={t('device-change-history-short')}
        data-testid="device-view-overview-card-devices-history"
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        headerAction={
          <ViewMoreLink
            dataTestId="link-device-devices-history"
            targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewDevicesHistory}`}
          />
        }
      >
        {hasDevices ? (
          <Box className={listOfParameters}>
            <Typography variant="body2" className={dateLastUpdate}>
              {`${t('last-upload:')} ${formattedDateForDevice}`}
            </Typography>

            {firstDeviceChange.devices.map((device) => (
              <Box key={device.name} className={parameterChange}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {t(getTranslationKeyForDeviceChange(device.name))}
                </Typography>
                <ChangeValueSectionsOverview
                  previousValue={device.previousValue}
                  currentValue={device.value}
                  withFormatting={false}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">
            {t('no-data')}
          </Typography>
        )}
      </GenericListCard>
    </>
  )
}
