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
import { DblParameter, PumpSettings } from 'medical-domain'
import { formatDateWithMomentShortFormat } from '../../lib/utils'
import { useLocation } from 'react-router-dom'
import { ChangeValueDeviceOverview } from '../device/change-value-device-overview'
import { formatParameterValue, getTranslationKeyForDeviceChange, sortHistory } from '../device/utils/device.utils'
import { cardStyle } from './card-style'
import Box from '@mui/material/Box'

interface DeviceViewSectionsOverviewCardsProps {
  pumpSettings: PumpSettings
}

export const deviceCardStyle = makeStyles()(() => {
  return {
    listOfParameters: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      flex: 1
    },
    parameterChange: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1
    }
  }
})

export const DeviceViewSectionsOverviewCards: FC<DeviceViewSectionsOverviewCardsProps> = ({ pumpSettings }) => {
  const { t } = useTranslation()
  const { classes: { parameterChange, listOfParameters } } = deviceCardStyle()
  const { classes: { cards, cardsHeader } } = cardStyle()
  const { device, pump, parameters, cgm, history } = pumpSettings.payload
  const totalDailyInsulin = parameters.find(parameter => parameter.name === DblParameter.TotalDailyInsulin)
  const targetGlucoseLevel = parameters.find(parameter => parameter.name === DblParameter.TargetGlucoseLevel)
  const totalHypoglycemiaThreshold = parameters.find(parameter => parameter.name === DblParameter.HypoglycemiaThreshold)
  const lastParameterChange = history.parameters
  sortHistory(lastParameterChange)
  const lastDeviceChange = history.devices
  const { pathname } = useLocation()
  const urlPrefix = pathname.substring(0, pathname.lastIndexOf('/'))
  const timezone = pumpSettings.timezone
  const firstChange = lastParameterChange?.[0]
  const hasParameters = Boolean(firstChange?.parameters?.length)
  const firstDeviceChange = lastDeviceChange?.[0]
  const hasDevices = Boolean(firstDeviceChange?.devices?.length)

  const truncate = (str: string, max: number) =>
    str.length > max ? str.slice(0, max).toString() + "..." : str

  const hasSafetyBasalData = Boolean(
    totalDailyInsulin || targetGlucoseLevel || totalHypoglycemiaThreshold
  )

  const getTableLinesCurrentSettings = (): { label: string, value: string }[] => {
    return [
      { label: t('system'), value: device?.name },
      { label: t('Pump'), value: pump?.name },
      { label: t('CGM'), value: cgm?.manufacturer + " " + cgm?.name },
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
  if (hasParameters) {
    console.log('Noms seulement :', firstChange.parameters.map((p) => p.name));
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

      {hasSafetyBasalData && (
        <GenericListCard
          title={t('safety-basal')}
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
        title={t('parameters-history')}
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
            <Typography variant="body2">
              {`${t('last-upload:')} ${formatDateWithMomentShortFormat(new Date(firstChange.changeDate), 'DD/MM/YY - h:mm a', timezone)}`}
            </Typography>

            {firstChange.parameters.map((parameter) => (
              <Box key={parameter.name} className={parameterChange}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {truncate(t(`params|${parameter.name}`), 10)}
                </Typography>
                <ChangeValueDeviceOverview
                  previousValue={
                    parameter.previousValue
                      ? `${formatParameterValue(parameter.previousValue, parameter.previousUnit)} ${parameter.previousUnit}`
                      : parameter.previousValue
                  }
                  currentValue={`${formatParameterValue(parameter.value, parameter.unit)} ${parameter.unit}`}
                  withFormatting={true}
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
        title={t('device-history')}
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
            <Typography variant="body2">
              {`${t('last-upload:')} ${formatDateWithMomentShortFormat(new Date(firstChange.changeDate), 'DD/MM/YY - h:mm a', timezone)}`}
            </Typography>

            {firstDeviceChange.devices.map((device) => (
              <Box key={device.name} className={parameterChange}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {t(getTranslationKeyForDeviceChange(device.name))}
                </Typography>
                <ChangeValueDeviceOverview
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
