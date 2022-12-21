/*
 * Copyright (c) 2022, Diabeloop
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

import { Patient } from '../patient/models/patient.model'
import { PatientTableSortFields } from '../../components/patient/models/enums/patient-table-sort-fields.enum'
import { compareValues, getMedicalValues } from '../../components/patient/utils'
import { useUserName } from './user-name.hook'

interface ComparePatientsHookReturn {
  comparePatients: (a: Patient, b: Patient, orderBy: PatientTableSortFields) => number
}

type ValueType = string | number | Date | boolean | undefined

export const useComparePatients = (): ComparePatientsHookReturn => {
  const { getUserName } = useUserName()

  const getCompareValues = (a: Patient, b: Patient, orderBy: PatientTableSortFields): { a: ValueType, b: ValueType } => {
    switch (orderBy) {
      case PatientTableSortFields.alertTimeTarget:
        return {
          a: a.alarms.timeSpentAwayFromTargetRate,
          b: b.alarms.timeSpentAwayFromTargetRate
        }
      case PatientTableSortFields.alertHypoglycemic:
        return {
          a: a.alarms.frequencyOfSevereHypoglycemiaRate,
          b: b.alarms.frequencyOfSevereHypoglycemiaRate
        }
      case PatientTableSortFields.dataNotTransferred:
        return {
          a: a.alarms.nonDataTransmissionRate,
          b: b.alarms.nonDataTransmissionRate
        }
      case PatientTableSortFields.flag:
        return {
          a: a.metadata.flagged,
          b: b.metadata.flagged
        }
      case PatientTableSortFields.ldu:
        return {
          a: getMedicalValues(a.metadata.medicalData).lastUploadEpoch,
          b: getMedicalValues(b.metadata.medicalData).lastUploadEpoch
        }
      case PatientTableSortFields.patientFullName:
        return {
          a: getUserName(a.profile.firstName, a.profile.lastName, a.profile.fullName),
          b: getUserName(b.profile.firstName, b.profile.lastName, b.profile.fullName)
        }
      case PatientTableSortFields.remoteMonitoring:
        return {
          a: a.monitoring?.monitoringEnd,
          b: b.monitoring?.monitoringEnd
        }
      case PatientTableSortFields.system:
        return {
          a: a.settings.system,
          b: b.settings.system
        }
    }
  }

  const comparePatients = (a: Patient, b: Patient, orderBy: PatientTableSortFields): number => {
    const values = getCompareValues(a, b, orderBy)
    return compareValues(values.a, values.b)
  }

  return { comparePatients }
}
