/*
 * Copyright (c) 2023-2025, Diabeloop
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

import {
  formatCurrentDate,
  formatLocalizedFromUTC,
  getLongDayFormat,
  TIMEZONE_UTC
} from '../../../utils/datetime/datetime.util'
import {
  type CgmConfig,
  type DeviceConfig,
  DeviceSystem,
  MobileAppConfig,
  type ParameterConfig,
  type PumpConfig,
  SecurityBasalConfig,
  type TimePrefs
} from 'medical-domain'
import i18next from 'i18next'
import {
  type AlignType,
  type ParameterSettingsTable,
  type ParameterSettingsTableRow, SafetyBasalProfileTableRow,
  type SettingsTable,
  type SettingsTableColumn,
  type SettingsTableRow
} from '../../../models/print/pdf-settings-table.model'
import { type TableHeading } from '../../../models/print/pdf-table.model'
import { formatParameterValue } from '../../../utils/format/format.util'
import { PdfSettingsDataType } from '../../../models/enums/pdf-settings-data-type.enum'
import { type PdfSettingsData } from '../../../models/print/pdf-data.model'
import { type DeviceMetadata } from '../../../models/device-metadata.model'

const t = i18next.t.bind(i18next)

const TABLE_COLUMNS: SettingsTableColumn[] = [
  {
    id: 'label',
    headerFill: false,
    cache: false,
    align: 'left' as AlignType,
    width: 150,
    header: ''
  }, {
    id: 'value',
    headerFill: false,
    cache: false,
    align: 'right' as AlignType,
    width: 150,
    header: ''
  }
]

type TableData = CgmConfig | DeviceConfig | PumpConfig | MobileAppConfig | SecurityBasalConfig

const getTimePrefs = (timezone = TIMEZONE_UTC): TimePrefs => {
  const timezoneName = timezone === TIMEZONE_UTC ? new Intl.DateTimeFormat().resolvedOptions().timeZone : timezone

  return { timezoneAware: true, timezoneName }
}

const getTableHeading = (text: string, timePrefs: TimePrefs, subText?: string, date?: string): TableHeading => {
  const heading: TableHeading = {
    text
  }

  if (subText) {
    heading.subText = subText
  }
  if (date) {
    heading.note = formatLocalizedFromUTC(date, timePrefs, getLongDayFormat())
  }

  return heading
}

const getTextByDataTableType = (type: PdfSettingsDataType): string => {
  switch (type) {
    case PdfSettingsDataType.Cgm:
      return t('CGM')
    case PdfSettingsDataType.Device:
      return t('Device')
    case PdfSettingsDataType.Pump:
      return t('Pump')
    case PdfSettingsDataType.MobileApplication:
      return t('mobile-application')
  }
}

const getSubTextByDataTableType = (type: PdfSettingsDataType, data: TableData): string | undefined => {
  switch (type) {
    case PdfSettingsDataType.Cgm:
    case PdfSettingsDataType.MobileApplication:
      return
    case PdfSettingsDataType.Device: {
      const deviceData = data as DeviceConfig
      if (deviceData.name === DeviceSystem.Dblg2) {
        return
      }
      return `- ${deviceData.name}`
    }
    case PdfSettingsDataType.Pump: {
      const pumpData = data as PumpConfig
      return `- ${pumpData.name}`
    }
  }
}

const getTableRowsByDataTableType = (type: PdfSettingsDataType, data: TableData, timePrefs: TimePrefs): SettingsTableRow[] => {
  const longDayFormat = getLongDayFormat()

  switch (type) {
    case PdfSettingsDataType.Cgm:
      return [{
        label: t('Manufacturer'),
        value: (data as CgmConfig).manufacturer
      }, {
        label: t('Product'),
        value: (data as CgmConfig).name
      }, {
        label: t('Cgm sensor expiration date'),
        value: formatLocalizedFromUTC((data as CgmConfig).expirationDate, timePrefs, longDayFormat)
      }, {
        label: t('Cgm transmitter software version'),
        value: (data as CgmConfig).swVersionTransmitter
      }, {
        label: t('Cgm transmitter id'),
        value: (data as CgmConfig).transmitterId
      }, {
        label: t('Cgm transmitter end of life'),
        value: formatLocalizedFromUTC((data as CgmConfig).endOfLifeTransmitterDate, timePrefs, longDayFormat)
      }]
    case PdfSettingsDataType.Device:
      return [{
        label: t('Manufacturer'),
        value: (data as DeviceConfig).manufacturer
      }, {
        label: t('Identifier'),
        value: (data as DeviceConfig).deviceId
      }, {
        label: t('IMEI'),
        value: (data as DeviceConfig).imei
      }, {
        label: t('Software version'),
        value: (data as DeviceConfig).swVersion
      }]
    case PdfSettingsDataType.Pump:
      const pump = data as PumpConfig
      return [{
        label: t('Manufacturer'),
        value: pump.manufacturer
      }, {
          label: t('Product'),
          value: pump.product
        },{
        label: t('Serial Number'),
        value: pump.serialNumber
      }, {
        label: t('Pump version'),
        value: pump.swVersion
      }]
    case PdfSettingsDataType.MobileApplication: {
      const mobileApp = data as MobileAppConfig
      return [{
        label: t('Manufacturer'),
        value: mobileApp.manufacturer
      }, {
        label: t('Name'),
        value: DeviceSystem.Dblg2
      },{
        label: t('Software version'),
        value: mobileApp.swVersion
      },
      {
        label: t('Activation code'),
        value: mobileApp.activationCode
      },
      {
        label: t('Identifier'),
        value: mobileApp.identifier
      }]
    }
  }
}

const sortParametersByName = (parameters: ParameterSettingsTableRow[]): ParameterSettingsTableRow[] => {
  return parameters.sort((parameterA: ParameterSettingsTableRow, parameterB: ParameterSettingsTableRow) => parameterA.name.localeCompare(parameterB.name))
}

export const getDeviceMetadata = (settingsData: PdfSettingsData, timePrefs: TimePrefs): DeviceMetadata => {
  const normalTime = settingsData.normalTime
  const utcTime = normalTime ? Date.parse(normalTime) : null
  const uploadedTime = utcTime ? formatLocalizedFromUTC(utcTime, timePrefs, getLongDayFormat()) : ''

  return {
    schedule: t('unknown'),
    uploaded: uploadedTime.length > 0 ? uploadedTime : t('unknown'),
    serial: settingsData.deviceSerialNumber ?? t('unknown')
  }
}

export const getTableDataByDataType = (type: PdfSettingsDataType, data: TableData, timezone?: string, date?: string): SettingsTable => {
  const timePrefs = getTimePrefs(timezone)
  const text = getTextByDataTableType(type)
  const subText = getSubTextByDataTableType(type, data)

  const heading = getTableHeading(text, timePrefs, subText, date)
  const columns = TABLE_COLUMNS
  const rows = getTableRowsByDataTableType(type, data, timePrefs)

  return { heading, columns, rows }
}

export const getDeviceParametersTableData = (parameters: ParameterSettingsTableRow[], tableParameters: {
  level: number,
  width: number
}, timezone?: string, date?: string): ParameterSettingsTable => {
  const timePrefs = getTimePrefs(timezone)
  const text = t('Settings on day', { day: formatCurrentDate() })
  const subText = tableParameters.level !== 1 ? `- ${t('Advanced')}` : undefined

  const heading = getTableHeading(text, timePrefs, subText, date)

  const width = tableParameters.width
  const columns = [{
    id: 'name',
    header: t('Name'),
    cache: false,
    align: 'left' as AlignType,
    width: (width * 0.7)
  }, {
    id: 'value',
    header: t('Value'),
    cache: false,
    align: 'right' as AlignType,
    width: (width * 0.2)
  }, {
    id: 'unit',
    header: t('Unit'),
    cache: false,
    align: 'left' as AlignType,
    width: (width * 0.1)
  }]

  return { heading, columns, rows: parameters }
}

export const getSafetyBasalProfileTableData = (rates: SafetyBasalProfileTableRow[], width: number, timezone?: string, date?: string) => {
  const timePrefs = getTimePrefs(timezone)
  const text = t('safety-basal-profile')

  const heading = getTableHeading(text, timePrefs, formatCurrentDate(), date)

  const columns = [{
    id: 'startTime',
    header: t('start-time'),
    cache: false,
    align: 'left' as AlignType,
    width: (width * 0.3)
  }, {
    id: 'endTime',
    header: t('end-time'),
    cache: false,
    align: 'left' as AlignType,
    width: (width * 0.3)
  }, {
    id: 'rate',
    header: t('basal-rate'),
    cache: false,
    align: 'right' as AlignType,
    width: (width * 0.4)
  }]

  return { heading, columns, rows: rates }
}

export const getParametersByLevel = (parameters?: ParameterConfig[]): Map<number, ParameterSettingsTableRow[]> => {
  if (!parameters || parameters.length === 0) {
    return new Map()
  }

  const parametersMap = new Map<number, ParameterSettingsTableRow[]>()
  parameters.forEach((parameter: ParameterConfig) => {
    if (!parametersMap.has(parameter.level)) {
      parametersMap.set(parameter.level, [])
    }

    const value = formatParameterValue(parameter.value, parameter.unit)
    const parameterInfoDataRow = {
      rawData: parameter.name,
      name: t(`params|${parameter.name}`),
      value,
      unit: parameter.unit,
      level: parameter.level
    }
    parametersMap.get(parameter.level)?.push(parameterInfoDataRow)
  })

  parametersMap.forEach((parametersByLevel: ParameterSettingsTableRow[], key: number) => {
    const sortedValues = sortParametersByName(parametersByLevel)
    parametersMap.set(key, sortedValues)
  })

  return new Map([...parametersMap.entries()].sort(([key1], [key2]) => key1 - key2))
}
