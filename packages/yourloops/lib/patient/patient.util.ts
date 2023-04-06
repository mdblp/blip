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
import { type PatientTeam } from './models/patient-team.model'
import { UserInvitationStatus } from '../team/models/enums/user-invitation-status.enum'
import { type User } from '../auth'
import { type PatientsFilters } from '../filter/models/patients-filters.model'

export default class PatientUtils {
  static removeDuplicates(patientsWithDuplicates: Patient[]): Patient[] {
    const patientsWithoutDuplicates = []
    patientsWithDuplicates.forEach(patient => {
      if (!patientsWithoutDuplicates.find(mergedPatient => mergedPatient.userid === patient.userid)) {
        const patientDuplicates = patientsWithDuplicates.filter(patientDuplicated => patientDuplicated.userid === patient.userid)
        const patientWithMonitoring = patientDuplicates.find(p => !!p.monitoring)
        patient.monitoring = patientWithMonitoring ? patientWithMonitoring.monitoring : undefined
        const monitoring = patientWithMonitoring ? patientWithMonitoring.monitoring : undefined
        const teams = []
        patientDuplicates.forEach(p => {
          if (p.teams.length > 0) {
            teams.push(p.teams[0])
          }
        })
        const patientToAdd: Patient = {
          alarms: patient.alarms,
          profile: patient.profile,
          settings: patient.settings,
          metadata: patient.metadata,
          monitoring,
          teams,
          userid: patient.userid
        }
        patientsWithoutDuplicates.push(patientToAdd)
      }
    })
    return patientsWithoutDuplicates
  }

  static async retrievePatients(): Promise<Patient[]> {
    const patientsAsITeamMembers = await PatientApi.getPatients()
    return patientsAsITeamMembers.map(patientAsITeamMember => mapITeamMemberToPatient(patientAsITeamMember))
  }

  static async computePatients(user: User): Promise<Patient[]> {
    const userIsHcp = user.isUserHcp()
    if (!userIsHcp && !user.isUserPatient() && !user.isUserCaregiver()) {
      throw Error(`Cannot retrieve patients with user having role ${user.role}`)
    }
    if (userIsHcp) {
      return await PatientApi.getPatientsForHcp(user.id)
    }
    return PatientUtils.removeDuplicates(await PatientUtils.retrievePatients())
  }

  static getRemoteMonitoringTeam(patient: Patient): PatientTeam {
    const remoteMonitoredTeam = patient.teams.find(team => team.monitoringStatus !== undefined)
    if (!remoteMonitoredTeam) {
      throw Error(`Could not find a monitored team for patient ${patient.userid}`)
    }
    return remoteMonitoredTeam
  }

  static computeFlaggedPatients = (patients: Patient[], flaggedPatients: string[]): Patient[] => {
    return patients.map(patient => {
      return { ...patient, metadata: { ...patient.metadata, flagged: flaggedPatients.includes(patient.userid) } }
    })
  }

  static isInvitationPending = (patient: Patient, selectedTeamId: string): boolean => {
    return patient.teams.some((team: PatientTeam) => team.teamId === selectedTeamId && team.status === UserInvitationStatus.pending)
  }

  static getNonPendingPatients = (patients: Patient[], selectedTeamId: string): Patient[] => {
    return patients.filter(patient => patient.teams.some(team => team.teamId === selectedTeamId && team.status !== UserInvitationStatus.pending))
  }

  static getPendingPatients = (patients: Patient[], selectedTeamId: string): Patient[] => {
    return patients.filter(patient => patient.teams.some(team => team.teamId === selectedTeamId && team.status === UserInvitationStatus.pending))
  }

  static filterPatientsOnMonitoringAlerts = (patients: Patient[], patientFilters: PatientsFilters): Patient[] => {
    if (!patientFilters.timeOutOfTargetEnabled && !patientFilters.hypoglycemiaEnabled && !patientFilters.dataNotTransferredEnabled) {
      return patients
    }
    if (patientFilters.timeOutOfTargetEnabled && patientFilters.hypoglycemiaEnabled && patientFilters.dataNotTransferredEnabled) {
      return patients.filter(patient => patient.alarms?.timeSpentAwayFromTargetActive || patient.alarms?.frequencyOfSevereHypoglycemiaActive || patient.alarms?.nonDataTransmissionActive)
    }
    if (patientFilters.timeOutOfTargetEnabled && patientFilters.hypoglycemiaEnabled) {
      return patients.filter(patient => patient.alarms?.timeSpentAwayFromTargetActive || patient.alarms?.frequencyOfSevereHypoglycemiaActive)
    }
    if (patientFilters.hypoglycemiaEnabled && patientFilters.dataNotTransferredEnabled) {
      return patients.filter(patient => patient.alarms?.frequencyOfSevereHypoglycemiaActive || patient.alarms?.nonDataTransmissionActive)
    }
    if (patientFilters.timeOutOfTargetEnabled && patientFilters.dataNotTransferredEnabled) {
      return patients.filter(patient => patient.alarms?.timeSpentAwayFromTargetActive || patient.alarms?.nonDataTransmissionActive)
    }
    if (patientFilters.timeOutOfTargetEnabled) {
      return patients.filter(patient => patient.alarms?.timeSpentAwayFromTargetActive)
    }
    if (patientFilters.hypoglycemiaEnabled) {
      return patients.filter(patient => patient.alarms?.frequencyOfSevereHypoglycemiaActive)
    }
    return patients.filter(patient => patient.alarms?.nonDataTransmissionActive)
  }

  static extractPatients = (patients: Patient[], patientFilters: PatientsFilters, flaggedPatientsId: string[] | undefined, selectedTeamId: string): Patient[] => {
    // When the filter is pending, we only get the pending patients and don't apply any filter on them
    if (patientFilters.pendingEnabled) {
      return patients.filter((patient) => PatientUtils.isInvitationPending(patient, selectedTeamId))
    }
    // We do not take the pending patients
    let patientsExtracted = PatientUtils.getNonPendingPatients(patients, selectedTeamId)
    patientsExtracted = PatientUtils.filterPatientsOnMonitoringAlerts(patientsExtracted, patientFilters)
    if (patientFilters.telemonitoredEnabled) {
      patientsExtracted = patientsExtracted.filter(patient => patient.monitoring?.enabled)
    }
    if (patientFilters.manualFlagEnabled) {
      patientsExtracted = patientsExtracted.filter(patient => flaggedPatientsId?.includes(patient.userid))
    }
    if (patientFilters.messagesEnabled) {
      return patientsExtracted.filter(patient => patient.metadata.hasSentUnreadMessages)
    }
    return patientsExtracted
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
}
