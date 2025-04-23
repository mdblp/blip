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

import { type Unit } from 'medical-domain'
import { type TableHeading } from './pdf-table.model'

export type AlignType = 'left' | 'center' | 'right'

export interface SettingsTableColumn {
  id: string
  headerFill?: boolean
  cache: boolean
  align: AlignType
  width: number
  header: string
}

export interface BasicSettingsTableRow { [key: string]: string | number }

export interface SettingsTableRow extends BasicSettingsTableRow {
  label: string
  value: string
}

export interface ParameterSettingsTableRow extends BasicSettingsTableRow {
  rawData: string
  name: string
  unit: Unit
  level: number
  value: string
}

export interface SafetyBasalProfileTableRow extends BasicSettingsTableRow {
  startTime: string
  endTime: string
  rate: string
}

interface SettingsTableData<T> {
  heading: TableHeading
  columns: SettingsTableColumn[]
  rows: T[]
}

export type BasicSettingsTable = SettingsTableData<BasicSettingsTableRow>
export type SettingsTable = SettingsTableData<SettingsTableRow>
export type ParameterSettingsTable = SettingsTableData<ParameterSettingsTableRow>
