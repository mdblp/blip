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

import { type PatientListColumns, type PendingPatientListColumns } from './enums/patient-list.enum'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { DiabeticType } from 'medical-domain'
import moment from 'moment-timezone'

export interface GridRowModel {
  id: string
  [PatientListColumns.Flag]?: Patient
  [PatientListColumns.Patient]: Patient
  [PatientListColumns.DateOfBirth]?: Patient
  [PatientListColumns.Age]?: number
  [PatientListColumns.Gender]?: string
  [PatientListColumns.System]?: string
  [PatientListColumns.MonitoringAlerts]?: Patient
  [PatientListColumns.Messages]?: boolean
  [PatientListColumns.TimeInRange]?: number
  [PatientListColumns.GlucoseManagementIndicator]?: number
  [PatientListColumns.BelowRange]?: number
  [PatientListColumns.Variance]?: number
  [PatientListColumns.LastDataUpdate]?: moment.Moment | null
  [PatientListColumns.Actions]: Patient
  [PatientListColumns.PatientProfile]: DiabeticType
}

export interface PendingGridRowModel {
  id: string
  isInviteAvailable: boolean
  [PendingPatientListColumns.Actions]: Patient
  [PendingPatientListColumns.Date]: string
  [PendingPatientListColumns.Email]: string
  [PendingPatientListColumns.InviteSentBy]: string
}
