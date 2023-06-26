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
import { CgmTable, HistoryParameterTable, PumpTable, Table, TerminalTable } from 'dumb'
import { type PumpSettings, type TimePrefs } from 'medical-domain'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { formatParameterValue, sortHistoryParametersByDate } from './device-settings.utils'
import type { ChangeDateParameterGroup } from 'dumb'
import Button from '@mui/material/Button'
import textTable from 'text-table'
import moment from 'moment'

interface DeviceSettingsProps {
  goToDailySpecificDate: (date: number | Date) => void
  pumpSettings: PumpSettings
  timePrefs: TimePrefs
}

export const DeviceSettings: FC<DeviceSettingsProps> = ({ pumpSettings, timePrefs, goToDailySpecificDate }) => {
  const { t } = useTranslation()
  const { device, pump, cgm, parameters, history } = pumpSettings.payload

  // TODO Set this one directly in the futur new component (see YLP-2447 https://diabeloop.atlassian.net/browse/YLP-2354)
  parameters.forEach(parameter => {
    parameter.value = formatParameterValue(parameter.value, parameter.unit)
  })

  const lastUploadDate = moment.tz(pumpSettings.normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')

  const copySettingsToClipboard = async (): Promise<void> => {
    let rawText = `${lastUploadDate}\n\n`
    rawText += `-- ${t('Device')} --\n`
    rawText += textTable([
      [t('Manufacturer'), device.manufacturer],
      [t('Identifier'), device.deviceId],
      [t('IMEI'), device.imei],
      [t('Software version'), device.swVersion]]
    ) as string
    rawText += `\n\n-- ${t('Parameters')} --\n`

    const parametersTable = [[
      t('Name'),
      t('Value'),
      t('Unit')
    ]]
    parameters.forEach((parameter) => {
      parametersTable.push([t(`params|${parameter.name}`), parameter.value, parameter.unit])
    })
    rawText += textTable(parametersTable, { align: ['l', 'r', 'l'] }) as string

    try {
      await navigator.clipboard.writeText(rawText)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        rowSpacing={2}
        paddingX={3}
      >
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Typography>{`${t('last-upload:')} ${lastUploadDate}`}</Typography>
          <Button
            variant="outlined"
            onClick={copySettingsToClipboard}
          >
            {t('text-copy')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography color="text.secondary">{t('Device')}</Typography>
          <TerminalTable device={device} />
          <PumpTable pump={pump} timePrefs={timePrefs} />
          <CgmTable cgm={cgm} timePrefs={timePrefs} />
        </Grid>
        <Grid item xs={12} sm={6} data-testid="parameters-container">
          <Typography color="text.secondary">{t('Parameters')}</Typography>
          <Table
            title={t('Parameters')}
            rows={parameters}
          />
        </Grid>
      </Grid>
      <HistoryParameterTable
        rows={sortHistoryParametersByDate(history) as ChangeDateParameterGroup[]}
        onSwitchToDaily={goToDailySpecificDate}
        timePrefs={timePrefs}
      />
    </>
  )
}
