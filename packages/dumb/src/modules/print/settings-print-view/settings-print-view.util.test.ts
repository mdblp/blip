/*
 * Copyright (c) 2023-2024, Diabeloop
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
  getDeviceMetadata,
  getDeviceParametersTableData,
  getParametersByLevel,
  getTableDataByDataType
} from './settings-print-view.util'
import { PdfSettingsDataType } from '../../../models/enums/pdf-settings-data-type.enum'
import { DeviceSystem, type ParameterConfig, PumpManufacturer, Unit } from 'medical-domain'
import { type ParameterSettingsTableRow } from '../../../models/print/pdf-settings-table.model'
import { type PdfSettingsData } from '../../../models/print/pdf-data.model'
import { formatCurrentDate } from '../../../utils/datetime/datetime.util'

const labelColumn = {
  id: 'label',
  headerFill: false,
  cache: false,
  align: 'left',
  width: 150,
  header: ''
}

const valueColumn = {
  id: 'value',
  headerFill: false,
  cache: false,
  align: 'right',
  width: 150,
  header: ''
}

describe('Settings print view util', () => {
  const timezone = 'Europe/Paris'

  const level1Parameters = [{
    level: 1,
    name: 'Lunch - average',
    unit: Unit.Gram,
    value: '96.0'
  }, {
    level: 1,
    name: 'Weight',
    unit: Unit.Kilogram,
    value: '78.0'
  }, {
    level: 1,
    name: 'Aggressiveness in normoglycemia',
    unit: Unit.Percent,
    value: '97'
  }]
  const level2Parameters = [{
    level: 2,
    name: 'Height',
    unit: Unit.Minute,
    value: '80'
  }]
  const allParameters = [...level1Parameters, ...level2Parameters]

  describe('getDeviceMetadata', () => {
    const timePrefs = { timezoneAware: true, timezoneName: 'Europe/Paris' }

    it('should fallback on the default values when there is no data', () => {
      const emptyData = { deviceSerialNumber: undefined }

      expect(getDeviceMetadata(emptyData as PdfSettingsData, timePrefs)).toEqual({
        schedule: 'unknown',
        uploaded: 'unknown',
        serial: 'unknown'
      })
    })

    it('should compute the metadata', () => {
      const deviceSerialNumber = 'ABCDEFG'

      const fullData = {
        deviceSerialNumber,
        normalTime: '2016-09-23T23:00:00.000Z',
        deviceTime: '2016-09-23T19:00:00Z'
      }

      expect(getDeviceMetadata(fullData as PdfSettingsData, timePrefs)).toEqual({
        schedule: 'unknown',
        uploaded: 'Sep 24, 2016',
        serial: deviceSerialNumber
      })
    })
  })

  describe('getTableDataByDataType', () => {
    it('should return the table data for a CGM data', () => {
      const cgm = {
        apiVersion: 'v1',
        endOfLifeTransmitterDate: '2035-04-12T15:53:54Z',
        expirationDate: '2035-04-12T15:53:54Z',
        manufacturer: 'Dexcom',
        name: 'G6',
        swVersionTransmitter: 'v1',
        transmitterId: 'a1234'
      }

      const result = getTableDataByDataType(PdfSettingsDataType.Cgm, cgm, timezone)

      expect(result.heading).toEqual({
        text: 'CGM',
        subText: undefined,
        note: undefined
      })
      expect(result.columns).toEqual([labelColumn, valueColumn])
      expect(result.rows).toEqual([{
        label: 'Manufacturer',
        value: 'Dexcom'
      }, {
        label: 'Product',
        value: 'G6'
      }, {
        label: 'Sensor expiration',
        value: 'Apr 12, 2035'
      }, {
        label: 'Transmitter software version',
        value: 'v1'
      }, {
        label: 'Transmitter ID',
        value: 'a1234'
      }, {
        label: 'Transmitter expiration',
        value: 'Apr 12, 2035'
      }])
    })

    it('should return the table data for a device data', () => {
      const device = {
        deviceId: '1234',
        imei: '1234567890',
        manufacturer: 'Diabeloop',
        name: DeviceSystem.Dblg1,
        swVersion: 'beta',
        operatingSystem: '',
        osVersion: '',
        smartphoneModel: ''
      }

      const result = getTableDataByDataType(PdfSettingsDataType.Device, device, timezone)

      expect(result.heading).toEqual({
        text: 'DBL',
        subText: '- DBLG1',
        note: undefined
      })
      expect(result.columns).toEqual([labelColumn, valueColumn])
      expect(result.rows).toEqual([{
        label: 'Manufacturer',
        value: 'Diabeloop'
      }, {
        label: 'Identifier',
        value: '1234'
      }, {
        label: 'IMEI',
        value: '1234567890'
      }, {
        label: 'Software version',
        value: 'beta'
      }])
    })

    it('should return the table data for a pump data', () => {
      const pump = {
        expirationDate: '2035-04-12T15:53:54Z',
        manufacturer: PumpManufacturer.Vicentra,
        product: 'Kaleido',
        name: 'Kaleido',
        serialNumber: '123456',
        swVersion: 'beta'
      }

      const result = getTableDataByDataType(PdfSettingsDataType.Pump, pump, timezone)

      expect(result.heading).toEqual({
        text: 'Pump',
        subText: '- Kaleido',
        note: undefined
      })
      expect(result.columns).toEqual([labelColumn, valueColumn])
      expect(result.rows).toEqual([{
        label: 'Manufacturer',
        value: 'VICENTRA'
      }, {
        label: "Product",
        value: "Kaleido",
    },{
        label: 'Serial number',
        value: '123456'
      }, {
        label: 'Pump version',
        value: 'beta'
      }])
    })
  })

  describe('getDeviceParametersTableData', () => {
    it('should return the table data with no subText when the level is 1', () => {
      const tableParameters = { level: 1, width: 523.28 }

      const result = getDeviceParametersTableData(level1Parameters as ParameterSettingsTableRow[], tableParameters, timezone)

      expect(result.heading).toEqual({
        text: `Settings on ${formatCurrentDate()}`
      })
      expect(result.columns).toEqual([{
        id: 'name',
        header: 'Name',
        cache: false,
        align: 'left',
        width: 366.29599999999994
      }, {
        id: 'value',
        header: 'Value',
        cache: false,
        align: 'right',
        width: 104.656
      }, {
        id: 'unit',
        header: 'Unit',
        cache: false,
        align: 'left',
        width: 52.328
      }])
      expect(result.rows).toEqual(level1Parameters)
    })

    it('should return the table data with a subText when the level is 2', () => {
      const tableParameters = { level: 2, width: 523.28 }

      const result = getDeviceParametersTableData(level2Parameters as ParameterSettingsTableRow[], tableParameters, timezone)

      expect(result.heading).toEqual({
        text: `Settings on ${formatCurrentDate()}`,
        subText: '- Advanced'
      })
    })
  })

  describe('getParametersByLevel', () => {
    it('should return an empty map if there are no parameters', () => {
      const emptyMap = new Map()

      expect(getParametersByLevel([])).toEqual(emptyMap)
      expect(getParametersByLevel(undefined)).toEqual(emptyMap)
    })

    it('should build a map sorting the parameters by level and by name inside each level', () => {
      const result = getParametersByLevel(allParameters as ParameterConfig[])

      expect(result.get(1)).toEqual([
        {
          ...level1Parameters[2],
          rawData: 'Aggressiveness in normoglycemia'
        },
        {
          ...level1Parameters[0],
          rawData: 'Lunch - average'
        },
        {
          ...level1Parameters[1],
          rawData: 'Weight'
        }
      ])
      expect(result.get(2)).toEqual([{
        ...level2Parameters[0],
        rawData: 'Height'
      }])
      expect(result.get(3)).toBeUndefined()
      expect(result.get(0)).toBeUndefined()
    })
  })
})
