/*
 * Copyright (c) 2025, Diabeloop
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
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { formatDate } from 'dumb'
import i18next from 'i18next'
import PatientUtils from '../../../../lib/patient/patient.util'

const t = i18next.t.bind(i18next)

export const getPatientAge = (birthdate?: string): string => {
  if (!birthdate) return t('N/A')

  const birthDate = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return `${age} ${t('years-old')}`
}

export const getPatientHbA1c = (patient: Patient): string => {
  const a1c = patient?.settings?.a1c?.value
  const a1cDate = patient?.settings?.a1c?.date

  if (!a1c || !a1cDate) return t('N/A')

  return `${a1c}% - (${formatDate(a1cDate)})`
}

export const getPatientInitials = (firstName: string = '', lastName: string = ''): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

enum InsulinType {
  Novorapid = 1,
  Humalog = 2,
  Fiasp = 3,
  Lyumjev = 4,
  Other = 5,
}

export const getPatientInsulinType = (insulinType?: string): string => {

  if (!insulinType) {
    return t('N/A')
  }

  // Insulin type is sent as a string by g1 and g2, but the UI is using the enum InsulinType
  const insulinTypeNumber = parseInt(insulinType)

  switch (insulinTypeNumber) {
    case InsulinType.Novorapid:
      return t('insulin-type-novorapid')
    case InsulinType.Humalog:
      return t('insulin-type-humalog')
    case InsulinType.Fiasp:
      return t('insulin-type-fiasp')
    case InsulinType.Lyumjev:
      return t('insulin-type-lyumjev')
    case InsulinType.Other:
      return t('insulin-type-other')
    default:
      return t('N/A')
  }
}

export const getPatientDisplayInfo = (patient: Patient) => ({
  initials: getPatientInitials(patient.profile.firstName, patient.profile.lastName),
  age: getPatientAge(patient.profile.birthdate),
  gender: PatientUtils.getGenderLabel(patient.profile.sex),
  hba1c: getPatientHbA1c(patient),
  dbUnits: patient.settings.units?.bg || t('N/A'),
  weight: `${patient.profile.weight?.value || t('N/A')} ${patient.profile.weight?.unit || ''}`,
  height: `${patient.profile.height?.value || t('N/A')} ${patient.profile.height?.unit || ''}`,
  equipmentDate: formatDate(patient.medicalData?.range?.startDate) || t('N/A'),
  insulinType: getPatientInsulinType(patient.settings.insulinType)
})
