/**
 * Copyright (c) 2021, Diabeloop
 * Models for patients list
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

import { FilterType, PatientFilterTypes, PatientTableSortFields, SortDirection } from '../../models/generic'
import { Patient } from '../../lib/data/patient'

export interface PatientTableProps {
  filter?: FilterType | string
  order: SortDirection
  orderBy: PatientTableSortFields
  onSortList: (field: PatientTableSortFields, direction: SortDirection) => void
  patients: Patient[]
}

export interface PatientListProps {
  filter: string
  filterType: PatientFilterTypes
}

export interface PatientRowProps {
  patient: Patient
  filter?: FilterType | string
}

export interface MedicalTableValues {
  /** Value as a string for easy display */
  tir: string
  /** Value as a number for easy compare */
  tirNumber: number
  /** Value as a string for easy display */
  tbr: string
  /** Value as a number for easy compare */
  tbrNumber: number
  /** Value as a string for easy display */
  lastUpload: string
  /** Value as a number for easy compare */
  lastUploadEpoch: number
}
