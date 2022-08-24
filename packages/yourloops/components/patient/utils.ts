/**
 * Copyright (c) 2021, Diabeloop
 * Patient list utilities for HCPs
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

import moment from 'moment-timezone' // TODO: Change moment-timezone lib with something else
import { TFunction } from 'i18next'

import { PatientTableSortFields, SortFields } from '../../models/generic'
import { MedicalData } from '../../models/device-data'
import { MedicalTableValues } from './models'
import { TeamMember, TeamUser } from '../../lib/team'
import { Patient, PatientTeam } from '../../lib/data/patient'
import { Alarm } from '../../models/alarm'
import { ITeamMember } from '../../models/team'

export const getMedicalValues = (medicalData: MedicalData | null | undefined, na = 'N/A'): MedicalTableValues => {
  let tir = '-'
  let tbr = '-'
  let lastUpload = '-'
  let tirNumber = Number.NaN
  let tbrNumber = Number.NaN
  let lastUploadEpoch = Number.NaN

  if (medicalData === null) {
    tir = na
    tbr = na
    lastUpload = na
  } else if (medicalData) {
    if (medicalData.range?.endDate) {
      const browserTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone
      const mLastUpload = moment.tz(medicalData.range.endDate, browserTimezone)
      if (mLastUpload.isValid()) {
        lastUploadEpoch = mLastUpload.valueOf()
        lastUpload = mLastUpload.format('llll')
      }
    }
    if (medicalData.computedTir?.count) {
      const { high, low, target, veryHigh, veryLow } = medicalData.computedTir.count
      const total = high + low + target + veryHigh + veryLow
      tirNumber = Math.round((100 * target) / total)
      tir = tirNumber.toString(10)
      tbrNumber = Math.round((100 * (low + veryLow)) / total)
      tbr = tbrNumber.toString(10)
    } else {
      tir = na
      tbr = na
    }
  }

  return {
    tir,
    tbr,
    lastUpload,
    tirNumber,
    tbrNumber,
    lastUploadEpoch
  }
}

export const translateSortField = (t: TFunction, field: SortFields): string => {
  let trOrderBy: string
  switch (field) {
    case SortFields.firstname:
      trOrderBy = t('firstname')
      break
    case SortFields.lastname:
      trOrderBy = t('lastname')
      break
    case SortFields.tir:
      trOrderBy = t('list-patient-tir')
      break
    case SortFields.tbr:
      trOrderBy = t('list-patient-tbr')
      break
    case SortFields.upload:
      trOrderBy = t('list-patient-upload')
      break
    case SortFields.email:
      trOrderBy = t('email')
      break
  }
  return trOrderBy
}

export const compareNumbers = (a: number, b: number): number => {
  return a - b
}

export const compareString = (a: string, b: string): number => {
  return a.localeCompare(b)
}

export const compareDate = (a: Date, b: Date): number => {
  return a.getTime() - b.getTime()
}

function compareValues(
  a: string | number | Date | boolean | null | undefined,
  b: string | number | boolean | Date | null | undefined
): number {
  if (typeof a === 'string' && typeof b === 'string') {
    return compareString(a, b)
  }
  if (a instanceof Date && b instanceof Date) {
    return compareDate(a, b)
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return compareNumbers(a, b)
  }
  if (!a && b) {
    return 1
  }
  if (!b && a) {
    return -1
  }
  return 0
}

/**
 * Compare two patient for sorting the patient table
 * @param a A patient
 * @param b A patient
 * @param orderBy Sort field
 */
export const comparePatients = (a: Patient, b: Patient, orderBy: PatientTableSortFields): number => {
  let aValue: string | number | Date | boolean | undefined
  let bValue: string | number | Date | boolean | undefined

  switch (orderBy) {
    case PatientTableSortFields.alertTimeTarget:
      aValue = a.metadata.alarm.timeSpentAwayFromTargetRate
      bValue = b.metadata.alarm.timeSpentAwayFromTargetRate
      break
    case PatientTableSortFields.alertHypoglycemic:
      aValue = a.metadata.alarm.frequencyOfSevereHypoglycemiaRate
      bValue = b.metadata.alarm.frequencyOfSevereHypoglycemiaRate
      break
    case PatientTableSortFields.dataNotTransferred:
      aValue = a.metadata.alarm.nonDataTransmissionRate
      bValue = b.metadata.alarm.nonDataTransmissionRate
      break
    case PatientTableSortFields.flag:
      aValue = a.metadata.flagged
      bValue = b.metadata.flagged
      break
    case PatientTableSortFields.ldu:
      aValue = getMedicalValues(a.metadata.medicalData).lastUploadEpoch
      bValue = getMedicalValues(b.metadata.medicalData).lastUploadEpoch
      break
    case PatientTableSortFields.patientFullName:
      aValue = a.profile.fullName
      bValue = b.profile.fullName
      break
    case PatientTableSortFields.remoteMonitoring:
      aValue = a.monitoring?.monitoringEnd
      bValue = b.monitoring?.monitoringEnd
      break
    case PatientTableSortFields.system:
      aValue = a.settings.system
      bValue = b.settings.system
      break
  }
  return compareValues(aValue, bValue)
}

export const mapTeamMemberToPatientTeam = (member: TeamMember): PatientTeam => {
  return {
    code: member.team.code,
    invitation: member.invitation,
    status: member.status,
    teamId: member.team.id,
    teamName: member.team.name
  }
}

export const mapTeamUserToPatient = (teamUser: TeamUser): Patient => {
  const birthdate = teamUser.profile?.patient?.birthday
  return {
    metadata: {
      alarm: teamUser.alarms ?? {} as Alarm,
      flagged: undefined,
      medicalData: null,
      unreadMessagesSent: teamUser.unreadMessages ?? 0
    },
    monitoring: teamUser.monitoring,
    profile: {
      birthdate: birthdate ? new Date(birthdate) : undefined,
      sex: teamUser.profile?.patient?.sex ? teamUser.profile?.patient?.sex : '',
      firstName: teamUser.profile?.firstName,
      fullName: teamUser.profile?.fullName ?? teamUser.username,
      lastName: teamUser.profile?.lastName,
      email: teamUser.username,
      referringDoctor: teamUser.profile?.patient?.referringDoctor
    },
    settings: {
      a1c: teamUser.settings?.a1c,
      system: 'DBLG1'
    },
    teams: teamUser.members.map(member => mapTeamMemberToPatientTeam(member)),
    userid: teamUser.userid
  }
}

export const mapITeamMemberToPatient = (iTeamMember: ITeamMember): Patient => {
  const birthdate = iTeamMember.profile?.patient?.birthday
  return {
    metadata: {
      alarm: iTeamMember.alarms ?? {} as Alarm,
      flagged: undefined,
      medicalData: null,
      unreadMessagesSent: iTeamMember.unreadMessages ?? 0
    },
    monitoring: iTeamMember.monitoring,
    profile: {
      birthdate: birthdate ? new Date(birthdate) : undefined,
      sex: iTeamMember.profile?.patient?.sex ? iTeamMember.profile?.patient?.sex : '',
      firstName: iTeamMember.profile?.firstName,
      fullName: iTeamMember.profile?.fullName ?? iTeamMember.email,
      lastName: iTeamMember.profile?.lastName,
      email: iTeamMember.email,
      referringDoctor: iTeamMember.profile?.patient?.referringDoctor
    },
    settings: {
      a1c: iTeamMember.settings?.a1c,
      system: 'DBLG1'
    },
    teams: [{ teamId: iTeamMember.teamId, status: iTeamMember.invitationStatus } as PatientTeam],
    userid: iTeamMember.userId
  }
}
