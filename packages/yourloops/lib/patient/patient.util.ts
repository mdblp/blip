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

import PatientApi from './patient.api'
import { mapITeamMemberToPatient } from '../../components/patient/utils'
import moment from 'moment-timezone'
import { type Patient } from './models/patient.model'
import { type PatientTeam } from './models/patient-team.model'
import { UserInvitationStatus } from '../team/models/enums/user-invitation-status.enum'
import { PatientFilterTypes } from './models/enums/patient-filter-type.enum'
import { type User } from '../auth'

export default class PatientUtils {
  /* TODO remove this method once drop done to select team is implemented */
  static removeDuplicates(patientsWithDuplicates: Patient[]): Patient[] {
    const patientsWithoutDuplicates = []
    patientsWithDuplicates.forEach(patient => {
      if (!patientsWithoutDuplicates.find(mergedPatient => mergedPatient.userid === patient.userid)) {
        const patientDuplicates = patientsWithDuplicates.filter(patientDuplicated => patientDuplicated.userid === patient.userid)
        const patientWithMonitoring = patientDuplicates.find(p => p.monitoringAlertsParams !== undefined)
        patient.monitoringAlertsParams = patientWithMonitoring ? patientWithMonitoring.monitoringAlertsParams : undefined
        const monitoringAlertsParams = patientWithMonitoring ? patientWithMonitoring.monitoringAlertsParams : undefined
        const teams = []
        patientDuplicates.forEach(p => {
          if (p.teams.length > 0) {
            teams.push(p.teams[0])
          }
        })
        const patientToAdd: Patient = {
          monitoringAlerts: patient.monitoringAlerts,
          profile: patient.profile,
          settings: patient.settings,
          metadata: patient.metadata,
          monitoringAlertsParams,
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

  static computeFlaggedPatients = (patients: Patient[], flaggedPatients: string[]): Patient[] => {
    return patients.map(patient => {
      return { ...patient, metadata: { ...patient.metadata, flagged: flaggedPatients.includes(patient.userid) } }
    })
  }

  static isInAtLeastATeam = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status === UserInvitationStatus.accepted)
    return !!tm
  }

  static isInvitationPending = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status === UserInvitationStatus.pending)
    return !!tm
  }

  static isOnlyPendingInvitation = (patient: Patient): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.status !== UserInvitationStatus.pending)
    return !tm
  }

  static isInTeam = (patient: Patient, teamId: string): boolean => {
    const tm = patient.teams.find((team: PatientTeam) => team.teamId === teamId)
    return !!tm
  }

  static extractPatients = (patients: Patient[], filterType: PatientFilterTypes, flaggedPatients: string[]): Patient[] => {
    switch (filterType) {
      case PatientFilterTypes.all:
        return patients.filter((patient) => !PatientUtils.isOnlyPendingInvitation(patient))
      case PatientFilterTypes.pending:
        return patients.filter((patient) => PatientUtils.isInvitationPending(patient))
      case PatientFilterTypes.flagged:
        return patients.filter(patient => flaggedPatients.includes(patient.userid))
      case PatientFilterTypes.unread:
        return patients.filter(patient => patient.metadata.hasSentUnreadMessages)
      case PatientFilterTypes.outOfRange:
        return patients.filter(patient => patient.monitoringAlerts.timeSpentAwayFromTargetActive)
      case PatientFilterTypes.severeHypoglycemia:
        return patients.filter(patient => patient.monitoringAlerts.frequencyOfSevereHypoglycemiaActive)
      case PatientFilterTypes.dataNotTransferred:
        return patients.filter(patient => patient.monitoringAlerts.nonDataTransmissionActive)
      case PatientFilterTypes.private:
        return patients.filter(patient => PatientUtils.isInTeam(patient, filterType))
      default:
        return patients
    }
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
