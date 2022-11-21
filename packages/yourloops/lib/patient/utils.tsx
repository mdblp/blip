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

import { Patient, PatientTeam } from '../data/patient'
import PatientApi from './patient-api'
import { mapITeamMemberToPatient } from '../../components/patient/utils'
import { PatientFilterTypes, UserInvitationStatus } from '../../models/generic'
import moment from 'moment-timezone'
import { User } from '../auth'

export default class PatientUtils {
  static removeDuplicates(patientsWithDuplicates: Patient[]): Patient[] {
    const patientsWithoutDuplicates = []
    patientsWithDuplicates.forEach(patient => {
      if (!patientsWithoutDuplicates.find(mergedPatient => mergedPatient.userid === patient.userid)) {
        const patientDuplicates = patientsWithDuplicates.filter(patientDuplicated => patientDuplicated.userid === patient.userid)
        const patientWithMonitoring = patientDuplicates.find(p => p.monitoring !== undefined)
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
    const twoWeeksFromNow = new Date()
    switch (filterType) {
      case PatientFilterTypes.all:
        return patients.filter((patient) => !PatientUtils.isOnlyPendingInvitation(patient))
      case PatientFilterTypes.pending:
        return patients.filter((patient) => PatientUtils.isInvitationPending(patient))
      case PatientFilterTypes.flagged:
        return patients.filter(patient => flaggedPatients.includes(patient.userid))
      case PatientFilterTypes.unread:
        return patients.filter(patient => patient.metadata.unreadMessagesSent > 0)
      case PatientFilterTypes.outOfRange:
        return patients.filter(patient => patient.alarms.timeSpentAwayFromTargetActive)
      case PatientFilterTypes.severeHypoglycemia:
        return patients.filter(patient => patient.alarms.frequencyOfSevereHypoglycemiaActive)
      case PatientFilterTypes.dataNotTransferred:
        return patients.filter(patient => patient.alarms.nonDataTransmissionActive)
      case PatientFilterTypes.remoteMonitored:
        return patients.filter(patient => patient.monitoring?.enabled)
      case PatientFilterTypes.private:
        return patients.filter(patient => PatientUtils.isInTeam(patient, filterType))
      case PatientFilterTypes.renew:
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)
        return patients.filter(patient => patient.monitoring?.enabled && patient.monitoring.monitoringEnd && new Date(patient.monitoring.monitoringEnd).getTime() - twoWeeksFromNow.getTime() < 0)
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
