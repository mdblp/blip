/*
 * Copyright (c) 2023-2026, Diabeloop
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

import { DiabeticType } from 'medical-domain'
import moment from 'moment-timezone'
import { LeadClinician } from '../../../lib/lead-clinicians/models/lead-clinician.model'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { type PatientListColumn, type PendingPatientListColumns } from './enums/patient-list.enum'

export interface GridRowModel {
  id: string
  [PatientListColumn.Flag]?: Patient
  [PatientListColumn.Patient]: Patient
  [PatientListColumn.DateOfBirth]?: Patient
  [PatientListColumn.Age]?: number
  [PatientListColumn.Gender]?: string
  [PatientListColumn.System]?: string
  [PatientListColumn.MonitoringAlerts]?: Patient
  [PatientListColumn.Messages]?: boolean
  [PatientListColumn.TimeInRange]?: number
  [PatientListColumn.GlucoseManagementIndicator]?: number
  [PatientListColumn.BelowRange]?: number
  [PatientListColumn.Variance]?: number
  [PatientListColumn.LastDataUpdate]?: moment.Moment | null
  [PatientListColumn.Actions]: Patient
  [PatientListColumn.PatientProfile]: DiabeticType,
  [PatientListColumn.Clinicians]: LeadClinician[],
}

export interface PendingGridRowModel {
  id: string
  isInviteAvailable: boolean
  [PendingPatientListColumns.Actions]: Patient
  [PendingPatientListColumns.Date]: string
  [PendingPatientListColumns.Email]: string
  [PendingPatientListColumns.InviteSentBy]: string
}
