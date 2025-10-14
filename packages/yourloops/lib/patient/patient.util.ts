/*
 * Copyright (c) 2022-2025, Diabeloop
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

import PatientApi from './patient.api'
import moment from 'moment-timezone'
import { type Patient, type PatientMetrics } from './models/patient.model'
import { UserInviteStatus } from '../team/models/enums/user-invite-status.enum'
import { type User } from '../auth'
import { type PatientsFilters } from '../providers/models/patients-filters.model'
import i18next from 'i18next'
import { Gender } from '../auth/models/enums/gender.enum'
import { UserRole } from '../auth/models/enums/user-role.enum'
import { type MedicalData } from '../data/models/medical-data.model'

const t = i18next.t.bind(i18next)

const NO_GENDER_LABEL = '-'

export default class PatientUtils {

  static async computePatients(user: User, teamId?: string): Promise<Patient[]> {
    const userRole = user.role
    switch (userRole) {
      case UserRole.Hcp:
        if (!teamId) {
          throw Error('Cannot retrieve scoped patients when no team id is given')
        }
        return await PatientApi.getPatientsForHcp(user.id, teamId)
      case UserRole.Caregiver:
        return await PatientApi.getPatientsForCaregivers(user.id)
      default:
        throw Error(`Cannot retrieve patients with user having role ${user.role}`)
    }
  }

  static async fetchMetrics(patients: Patient[], teamId: string, userId: string): Promise<PatientMetrics[]> {
    const acceptedInvitePatients = patients.filter((patient: Patient) => patient.invitationStatus === UserInviteStatus.Accepted)
    if (!acceptedInvitePatients.length) {
      return
    }

    const patientIds = acceptedInvitePatients.map((patient: Patient) => patient.userid)

    return await PatientApi.getPatientsMetricsForHcp(userId, teamId, patientIds)
  }

  static getUpdatedPatientsWithMetrics(patients: Patient[], metrics: PatientMetrics[]): Patient[] {
    return patients.map((patient: Patient) => {
      const patientMetrics = metrics.find((metrics: PatientMetrics) => metrics.userid === patient.userid)
      if (!patientMetrics) {
        return patient
      }

      patient.glycemiaIndicators = patientMetrics.glycemiaIndicators
      patient.monitoringAlerts = patientMetrics.monitoringAlerts
      patient.medicalData = patientMetrics.medicalData
      return patient
    })
  }

  static mapUserToPatient(user: User): Patient {
    const userAccount = user.account
    return {
      userid: user.id,
      profile: {
        firstName: userAccount.firstName,
        fullName: userAccount.fullName,
        lastName: userAccount.lastName,
        email: userAccount.email,
        sex: userAccount?.patient?.sex ?? Gender.NotDefined,
        birthdate: userAccount?.patient?.birthday
      },
      settings: user.settings,
      hasSentUnreadMessages: false
    }
  }

  static computeFlaggedPatients = (patients: Patient[], flaggedPatients: string[]): Patient[] => {
    return patients.map((patient: Patient) => {
      patient.flagged = flaggedPatients.includes(patient.userid)
      return patient
    })
  }

  static isInvitationPending = (patient: Patient): boolean => {
    return patient.invitationStatus === UserInviteStatus.Pending
  }

  static getNonPendingPatients = (patients: Patient[]): Patient[] => {
    return patients.filter(patient => !PatientUtils.isInvitationPending(patient))
  }

  static getPendingPatients = (patients: Patient[]): Patient[] => {
    return patients.filter(patient => patient.invitationStatus === UserInviteStatus.Pending)
  }

  static filterPatientsOnMonitoringAlerts = (patients: Patient[], patientFilters: PatientsFilters): Patient[] => {
    if (!patientFilters.timeOutOfTargetEnabled && !patientFilters.hypoglycemiaEnabled && !patientFilters.dataNotTransferredEnabled) {
      return patients
    }
    if (patientFilters.timeOutOfTargetEnabled && patientFilters.hypoglycemiaEnabled && patientFilters.dataNotTransferredEnabled) {
      return patients.filter(patient => patient.monitoringAlerts?.timeSpentAwayFromTargetActive || patient.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive || patient.monitoringAlerts?.nonDataTransmissionActive)
    }
    if (patientFilters.timeOutOfTargetEnabled && patientFilters.hypoglycemiaEnabled) {
      return patients.filter(patient => patient.monitoringAlerts?.timeSpentAwayFromTargetActive || patient.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive)
    }
    if (patientFilters.hypoglycemiaEnabled && patientFilters.dataNotTransferredEnabled) {
      return patients.filter(patient => patient.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive || patient.monitoringAlerts?.nonDataTransmissionActive)
    }
    if (patientFilters.timeOutOfTargetEnabled && patientFilters.dataNotTransferredEnabled) {
      return patients.filter(patient => patient.monitoringAlerts?.timeSpentAwayFromTargetActive || patient.monitoringAlerts?.nonDataTransmissionActive)
    }
    if (patientFilters.timeOutOfTargetEnabled) {
      return patients.filter(patient => patient.monitoringAlerts?.timeSpentAwayFromTargetActive)
    }
    if (patientFilters.hypoglycemiaEnabled) {
      return patients.filter(patient => patient.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive)
    }
    return patients.filter(patient => patient.monitoringAlerts?.nonDataTransmissionActive)
  }

  static extractPatients = (patients: Patient[], patientFilters: PatientsFilters, flaggedPatientsId: string[] | undefined): Patient[] => {
    // When the filter is pending, we only get the pending patients and don't apply any filter on them
    if (patientFilters.pendingEnabled) {
      return patients.filter((patient) => PatientUtils.isInvitationPending(patient))
    }
    // We do not take the pending patients
    const nonPendingPatients = PatientUtils.getNonPendingPatients(patients)
    return PatientUtils.filterPatientsOnMonitoringAlerts(nonPendingPatients, patientFilters)
      .filter(patient => patientFilters.manualFlagEnabled ? flaggedPatientsId?.includes(patient.userid) : patient)
      .filter(patient => patientFilters.messagesEnabled ? patient.hasSentUnreadMessages : patient)
  }

  static extractPatientsWithBirthdate = (patients: Patient[], birthdate: string, firstNameOrLastName: string): Patient[] => {
    return patients.filter(patient => {
      const firstName = patient.profile.firstName ?? ''
      const lastName = patient.profile.lastName ?? ''
      const date = patient.profile.birthdate
      const dateString = moment(date).format('DD/MM/YYYY')
      return dateString === birthdate &&
        (firstNameOrLastName.length === 0 || firstName.toLocaleLowerCase().startsWith(firstNameOrLastName) || lastName.toLocaleLowerCase().startsWith(firstNameOrLastName))
    })
  }

  static computeAge = (birthdate: string): number => {
    return moment().diff(birthdate, 'years')
  }

  static getGenderLabel = (gender: Gender): string => {
    switch (gender) {
      case Gender.Indeterminate:
        return t('gender-i')
      case Gender.Female:
        return t('gender-f')
      case Gender.Male:
        return t('gender-m')
      case Gender.NotDefined:
      default:
        return NO_GENDER_LABEL
    }
  }

  static formatPercentageValue(value: number): string {
    return value || value === 0 ? `${Math.round(value * 10) / 10}%` : t('N/A')
  }

  static getLastUploadDate(medicalData: MedicalData, noDataLabel: string): string {
    if (!medicalData) {
      return null
    }

    const dataEndDate = medicalData.range?.endDate
    if (!dataEndDate) {
      return noDataLabel
    }

    const browserTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone
    const mLastUpload = moment.tz(dataEndDate, browserTimezone)
    if (!mLastUpload.isValid()) {
      return noDataLabel
    }

    return mLastUpload.format('lll')
  }
}
