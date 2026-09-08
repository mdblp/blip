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
import { GenericListCard } from '../../../components/generic-list-card/generic-list-card'
import { makeStyles } from 'tss-react/mui'
import { AppUserRoute } from '../../../models/enums/routes.enum'
import { ViewMoreLink } from '../../../components/buttons/view-more-link'
import Typography from '@mui/material/Typography'
import { DblParameter, PumpSettings } from 'medical-domain'
import { formatDateWithMomentLongFormat } from '../../../lib/utils'
import { useLocation } from 'react-router-dom'
import { ChangeValue } from '../../../components/device/change-value'
import { formatParameterValue, getTranslationKeyForDeviceChange } from '../../../components/device/utils/device.utils'
import Box from '@mui/material/Box'

interface DeviceViewSectionsOverviewCardsProps {
  pumpSettings: PumpSettings
}

export const cardStyle = makeStyles()((theme) => {
  return {
    cards: {
      margin: theme.spacing(2),
      p: 1, '&:last-child': { pb: 1 }
    },
    cardsHeader: {
      lineHeight: 1
    },
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5
    },
    listOfParameters: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      flex: 1
    },
    parameters: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1
    }
  }
})

export const DeviceViewSectionsOverviewCards: FC<DeviceViewSectionsOverviewCardsProps> = ({ pumpSettings }) => {
  const { t } = useTranslation()
  const { classes } = cardStyle()
  const { device, pump, parameters, cgm, history } = pumpSettings.payload
  const totalDailyInsulin = parameters.find(parameter => parameter.name === DblParameter.TotalDailyInsulin)
  const targetGlucoseLevel = parameters.find(parameter => parameter.name === DblParameter.TargetGlucoseLevel)
  const totalHypoglycemiaThreshold = parameters.find(parameter => parameter.name === DblParameter.HypoglycemiaThreshold)
  const lastParameterChange = history.parameters
  const lastDeviceChange = history.devices
  const { pathname } = useLocation()
  const urlPrefix = pathname.substring(0, pathname.lastIndexOf('/'))
  const timezone = pumpSettings.timezone
  const truncate = (str: string, max: number) =>
    str.length > max ? str.slice(0, max).toString() + "..." : str

  const getTableLinesCurrentParameters = (): { label: string, value: string }[] => {
    return [
      { label: t('system'), value: device?.name },
      { label: t('Pump'), value: pump?.name },
      { label: t('CGM'), value: cgm?.manufacturer + " " + cgm?.name },
      {
        label: t(`params|${DblParameter.TotalDailyInsulin}`),
        value: totalDailyInsulin.value + " " + totalDailyInsulin.unit
      },
      {
        label: t(`params|${DblParameter.TargetGlucoseLevel}`),
        value: targetGlucoseLevel.value + " " + targetGlucoseLevel.unit
      },
      {
        label: t(`params|${DblParameter.HypoglycemiaThreshold}`),
        value: totalHypoglycemiaThreshold.value + " " + totalHypoglycemiaThreshold.unit
      }
    ]
  }

  return (
    <>
      <GenericListCard
        title={t('current-parameters')}
        data-testid="device-view-overview-card-current-parameters"
        tableLines={getTableLinesCurrentParameters()}
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink
            dataTestId="link-device-current-parameters"
            targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewCurrentSettings}`}
          />
        }
      />

      <GenericListCard
        title={t('safety-basal')}
        data-testid="device-view-overview-card-safety-basal"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
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

      <GenericListCard
        title={t('parameters-history')}
        data-testid="device-view-overview-card-parameters-history"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink
            dataTestId="link-device-parameters-history"
            targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewSettingsHistory}`}
          />
        }
      >
        <Box className={classes.listOfParameters}>
          <Typography variant="body2">
            {`${t('last-upload:')} ${formatDateWithMomentLongFormat(new Date(lastParameterChange[0].changeDate), 'llll', timezone)}`}
          </Typography>
          {lastParameterChange[0]?.parameters.map((parameter) => (
            <Box key={parameter.name}
                 className={classes.parameters}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {truncate(t(`params|${parameter.name}`), 10)}
              </Typography>
              <ChangeValue
                previousValue={parameter.previousValue ? `${formatParameterValue(parameter.previousValue, parameter.previousUnit)} ${parameter.previousUnit}` : parameter.previousValue}
                currentValue={`${formatParameterValue(parameter.value, parameter.unit)} ${parameter.unit}`}
                withFormatting={true} isOverviewCard={true}
              />
            </Box>
          ))}
        </Box>
      </GenericListCard>

      <GenericListCard
        title={t('device-history')}
        data-testid="device-view-overview-card-devices-history"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink
            dataTestId="link-device-devices-history"
            targetRoute={`${urlPrefix}${AppUserRoute.DevicesSectionsOverviewDevicesHistory}`}
          />
        }
      >

        <Box className={classes.listOfParameters}>
          <Typography variant="body2">
            {`${t('last-upload:')} ${formatDateWithMomentLongFormat(new Date(lastDeviceChange[0].changeDate), 'llll', timezone)}`}
          </Typography>
          {lastDeviceChange[0]?.devices.map((device) => (
            <Box key={device.name}
                 className={classes.parameters}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {t(`${getTranslationKeyForDeviceChange(device.name)}`)}
              </Typography>
              <ChangeValue previousValue={device.previousValue} currentValue={device.value} withFormatting={false} isOverviewCard={true}/>
            </Box>
          ))}
        </Box>
      </GenericListCard>
    </>
  )
}
