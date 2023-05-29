/*
 * Copyright (c) 2022-2023, Diabeloop
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
import { mapITeamMemberToPatient } from '../../components/patient/utils'
import moment from 'moment-timezone'
import { type Patient } from './models/patient.model'
import { UserInvitationStatus } from '../team/models/enums/user-invitation-status.enum'
import { type User } from '../auth'
import { type PatientsFilters } from '../providers/models/patients-filters.model'
import i18next from 'i18next'
import { Gender } from '../auth/models/enums/gender.enum'

const t = i18next.t.bind(i18next)

const NO_GENDER_LABEL = '-'

export default class PatientUtils {
  static async retrievePatients(): Promise<Patient[]> {
    const patientsAsITeamMembers = await PatientApi.getPatients()
    return patientsAsITeamMembers.map(patientAsITeamMember => mapITeamMemberToPatient(patientAsITeamMember))
  }

  static async computePatients(user: User, teamId?: string): Promise<Patient[]> {
    const userIsHcp = user.isUserHcp()
    if (!userIsHcp && !user.isUserPatient() && !user.isUserCaregiver()) {
      throw Error(`Cannot retrieve patients with user having role ${user.role}`)
    }
    if (userIsHcp) {
      if (!teamId) {
        throw Error('Cannot retrieve scoped patients when no team id is given')
      }
      return await PatientApi.getPatientsForHcp(user.id, teamId)
    }
    return await PatientUtils.retrievePatients()
  }

  static computeFlaggedPatients = (patients: Patient[], flaggedPatients: string[]): Patient[] => {
    return patients.map(patient => {
      return { ...patient, metadata: { ...patient.metadata, flagged: flaggedPatients.includes(patient.userid) } }
    })
  }

  static isInvitationPending = (patient: Patient): boolean => {
    return patient.invitationStatus === UserInvitationStatus.pending
  }

  static getNonPendingPatients = (patients: Patient[]): Patient[] => {
    return patients.filter(patient => !PatientUtils.isInvitationPending(patient))
  }

  static getPendingPatients = (patients: Patient[]): Patient[] => {
    return patients.filter(patient => patient.invitationStatus === UserInvitationStatus.pending)
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
      .filter(patient => patientFilters.messagesEnabled ? patient.metadata.hasSentUnreadMessages : patient)
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
}
