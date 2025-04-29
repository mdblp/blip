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

import { type PdfDocumentOverridden } from '../../../models/print/pdf-override.model'
import { type PdfSettingsData } from '../../../models/print/pdf-data.model'
import { type PrintViewParams } from '../../../models/print/print-view-params.model'
import { PrintView } from '../print-view/print-view'
import {
  type CgmConfig,
  type DeviceConfig,
  DeviceSystem,
  MobileAppConfig,
  type PumpConfig,
  type TimePrefs
} from 'medical-domain'
import { type DeviceMetadata } from '../../../models/device-metadata.model'
import i18next from 'i18next'
import {
  getDeviceMetadata,
  getDeviceParametersTableData,
  getParametersByLevel,
  getSafetyBasalProfileTableData,
  getTableDataByDataType
} from './settings-print-view.util'
import {
  type BasicSettingsTable,
  type ParameterSettingsTableRow,
  SafetyBasalProfileTableRow,
  type SettingsTableColumn
} from '../../../models/print/pdf-settings-table.model'
import { PdfSettingsDataType } from '../../../models/enums/pdf-settings-data-type.enum'
import {
  getSafetyBasalItems,
  isSafetyBasalAvailable
} from '../../../utils/safety-basal-profile/safety-basal-profile.util'

const t = i18next.t.bind(i18next)

export class SettingsPrintView extends PrintView<PdfSettingsData> {
  source: string
  timePrefs: TimePrefs
  deviceMetadata: DeviceMetadata

  constructor(doc: PdfDocumentOverridden, data: PdfSettingsData, params: PrintViewParams) {
    super(doc, data, params)

    this.source = data.source?.toLowerCase() ?? ''

    const dataTimezone = data.timezone
    this.timePrefs = dataTimezone ? { timezoneAware: true, timezoneName: dataTimezone } : params.timePrefs
    this.deviceMetadata = getDeviceMetadata(data, this.timePrefs)

    this.doc.addPage()
  }

  newPage(): void {
    super.newPage(`${t('Uploaded on')} ${this.deviceMetadata.uploaded}`)
  }

  render(): void {
    if (this.data.payload?.device?.name === DeviceSystem.Dblg1) {
      this.renderTableSection(PdfSettingsDataType.Device)
    }
    if (this.data.payload?.mobileApplication?.identifier.toUpperCase() === DeviceSystem.Dblg2) {
      this.renderTableSection(PdfSettingsDataType.MobileApplication)
    }
    this.renderTableSection(PdfSettingsDataType.Pump)
    this.renderTableSection(PdfSettingsDataType.Cgm)
    this.renderDeviceParametersTableSection()
    this.renderSafetyBasalProfileTableSection()
    this.resetText()
  }

  private renderSettingsSection(tableData: BasicSettingsTable, width: number, optionalParams?: {
    zebra: boolean,
    showHeaders: boolean
  }): void {
    this.renderTableHeading(tableData.heading, {
      columnsDefaults: {
        width,
        header: ''
      }
    })

    this.renderTable({
      columnsDefaults: {
        zebra: optionalParams?.zebra ?? false,
        headerFill: false,
        header: ''
      },
      flexColumn: 'start',
      showHeaders: optionalParams?.showHeaders ?? false
    }, tableData.columns, tableData.rows)
  }

  private readonly getDataByDataType = (type: PdfSettingsDataType): CgmConfig | DeviceConfig | PumpConfig | MobileAppConfig | undefined => {
    switch (type) {
      case PdfSettingsDataType.Cgm:
        return this.data.payload?.cgm
      case PdfSettingsDataType.Device:
        return this.data.payload?.device
      case PdfSettingsDataType.Pump:
        return this.data.payload?.pump
      case PdfSettingsDataType.MobileApplication:
        return this.data.payload?.mobileApplication
    }
  }

  private renderTableSection(type: PdfSettingsDataType): void {
    const data = this.getDataByDataType(type) ?? null
    if (!data) {
      if (type === PdfSettingsDataType.Device) {
        this.renderSectionHeading(t('No diabeloop device informations available'))
      }
      return
    }

    const timezone = this.data.timezone
    const originalDate = this.data.originalDate

    const tableData = getTableDataByDataType(type, data, timezone, originalDate)
    const tableDataWidth = this.chartArea.width * 0.6
    const columnWidth = tableDataWidth / 2

    tableData.columns.forEach((column: SettingsTableColumn) => {
      column.width = columnWidth
    })

    this.renderSettingsSection(tableData, tableDataWidth)
  }

  private renderDeviceParametersTableSection(): void {
    const parameters = this.data.payload?.parameters ?? null
    if (!parameters) {
      this.renderSectionHeading(t('No diabeloop device parameters available'))
      return
    }

    const parametersByLevel = getParametersByLevel(parameters)
    const originalDate = this.data.originalDate ? this.data.normalTime : undefined

    parametersByLevel.forEach((parameters: ParameterSettingsTableRow[], level: number) => {
      const tableData = getDeviceParametersTableData(parameters, {
        level,
        width: this.chartArea.width
      }, this.data.timezone, originalDate)

      this.renderSettingsSection(tableData, this.chartArea.width, { zebra: true, showHeaders: true })
    })
  }

  private renderSafetyBasalProfileTableSection(): void {
    const safetyBasalProfile = this.data.payload?.securityBasals ?? null

    if (!safetyBasalProfile || !isSafetyBasalAvailable(safetyBasalProfile)) {
      return
    }

    const originalDate = this.data.originalDate ? this.data.normalTime : undefined

    const safetyBasalItems = getSafetyBasalItems(safetyBasalProfile)
    const tableData = getSafetyBasalProfileTableData(safetyBasalItems as SafetyBasalProfileTableRow[], this.chartArea.width, this.data.timezone, originalDate)

    this.renderSettingsSection(tableData, this.chartArea.width, { zebra: true, showHeaders: true })
  }
}
