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

import { type GridComparatorFn } from '@mui/x-data-grid'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { getUserName } from '../../../lib/auth/user.util'
import moment from 'moment-timezone'

interface PatientSortComparator extends GridComparatorFn<Patient> {
  (patient1: Patient, patient2: Patient): number
}

interface SortComparator extends GridComparatorFn<string> {
  (value1: string, value2: string): number
}

export const sortByUserName: PatientSortComparator = (patient1: Patient, patient2: Patient): number => {
  const patient1FullName = getUserName(patient1.profile.firstName, patient1.profile.lastName, patient1.profile.fullName)
  const patient2FullName = getUserName(patient2.profile.firstName, patient2.profile.lastName, patient2.profile.fullName)
  return patient1FullName.localeCompare(patient2FullName)
}

export const sortByFlag: PatientSortComparator = (patient1: Patient, patient2: Patient): number => {
  const isPatient1Flagged = patient1.flagged
  const isPatient2Flagged = patient2.flagged

  if (isPatient1Flagged && !isPatient2Flagged) {
    return -1
  }
  if (!isPatient1Flagged && isPatient2Flagged) {
    return 1
  }
  return 0
}

export const sortByDate: SortComparator = (dateA: string, dateB: string): number => {
  const dateAMoment = moment.utc(dateA)
  const dateBMoment = moment.utc(dateB)

  if (dateAMoment.isBefore(dateBMoment)) {
    return -1
  }
  if (dateAMoment.isAfter(dateBMoment)) {
    return 1
  }
  return 0
}

export const sortByDateOfBirth: PatientSortComparator = (patient1: Patient, patient2: Patient): number => {
  const patient1DateOfBirth = patient1.profile.birthdate
  const patient2DateOfBirth = patient2.profile.birthdate

  return sortByDate(patient1DateOfBirth, patient2DateOfBirth)
}

const getMonitoringAlertsCount = (patient: Patient): number => {
  const monitoringAlerts = patient.monitoringAlerts
  const timeOutOfRangeCount = monitoringAlerts.timeSpentAwayFromTargetActive ? 1 : 0
  const hypoglycemiaCount = monitoringAlerts.frequencyOfSevereHypoglycemiaActive ? 1 : 0
  const noDataCount = monitoringAlerts.nonDataTransmissionActive ? 1 : 0

  return timeOutOfRangeCount + hypoglycemiaCount + noDataCount
}

export const sortByMonitoringAlertsCount: PatientSortComparator = (patient1: Patient, patient2: Patient): number => {
  const patient1MonitoringAlertsCount = getMonitoringAlertsCount(patient1)
  const patient2MonitoringAlertsCount = getMonitoringAlertsCount(patient2)

  if (patient1MonitoringAlertsCount > patient2MonitoringAlertsCount) {
    return -1
  }
  if (patient1MonitoringAlertsCount < patient2MonitoringAlertsCount) {
    return 1
  }
  return 0
}

export const sortByLastDataUpdate = (date1: moment.Moment | null, date2: moment.Moment | null): number => {
  if (date2 === null) {
    return 1
  }

  if (date1 === null) {
    return -1
  }

  if (date1.isSame(date2, 'm')) {
    return 0
  } else if (date1.isAfter(date2, 'm')) {
    return 1
  } else {
    return -1
  }
}
