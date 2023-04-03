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

import { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment-timezone'

import { type Team, useTeam } from '../team'
import { useNotification } from '../notifications/notification.hook'
import PatientUtils from './patient.util'
import PatientApi from './patient.api'
import DirectShareApi from '../share/direct-share.api'
import { useAuth } from '../auth'
import metrics from '../metrics'
import { errorTextFromException } from '../utils'
import { type PatientContextResult } from './models/patient-context-result.model'
import { type Patient } from './models/patient.model'
import { PatientListFilters } from '../../components/patient-list/enums/patient-list.enum'
import { UserInvitationStatus } from '../team/models/enums/user-invitation-status.enum'
import { type MedicalData } from '../data/models/medical-data.model'
import { type PatientTeam } from './models/patient-team.model'
import { useSelectedTeamContext } from '../selected-team/selected-team.provider'
import { PRIVATE_TEAM_ID } from '../team/team.hook'
import { type PatientFilterStats } from './models/patient-filter-stats.model'
import { useAlert } from '../../components/utils/snackbar'

export default function usePatientProviderCustomHook(): PatientContextResult {
  const { cancel: cancelInvitation, getInvitation, refreshSentInvitations } = useNotification()
  const { refresh: refreshTeams } = useTeam()
  const { user, getFlagPatients, flagPatient } = useAuth()
  const { selectedTeam } = useSelectedTeamContext()
  const alert = useAlert()

  const [patients, setPatients] = useState<Patient[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)

  const fetchPatients = useCallback(() => {
    PatientUtils.computePatients(user).then(computedPatients => {
      setPatients(computedPatients)
    }).catch((reason: unknown) => {
      const message = errorTextFromException(reason)
      alert.error(message)
    }).finally(() => {
      setInitialized(true)
      setRefreshInProgress(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Need to rewrite the alert component, or it triggers infinite loop...
  }, [user])

  const refresh = (): void => {
    setRefreshInProgress(true)
    fetchPatients()
  }

  const updatePatient = useCallback((patient: Patient) => {
    const patientsUpdated = patients.filter(p => p.userid !== patient.userid)
    patientsUpdated.push(patient)
    setPatients(patientsUpdated)
  }, [patients])

  const patientsForSelectedTeam = user.isUserHcp() ? patients.filter((patient: Patient) => patient.teams.some((team: PatientTeam) => team.teamId === selectedTeam.id)) : []
  const patientList = user.isUserHcp() ? patientsForSelectedTeam : patients

  const isPatientTeamPrivate = (patientTeam: PatientTeam): boolean => {
    return patientTeam.teamId === PRIVATE_TEAM_ID
  }

  const buildPatientFiltersStats = useCallback((): PatientFilterStats => {
    return {
      directShare: patientList.filter((patient) => patient.teams.find(team => isPatientTeamPrivate(team))).length,
      unread: patientList.filter(patient => patient.metadata.hasSentUnreadMessages).length,
      outOfRange: patientList.filter(patient => patient.alarms.timeSpentAwayFromTargetActive).length,
      severeHypoglycemia: patientList.filter(patient => patient.alarms.frequencyOfSevereHypoglycemiaActive).length,
      dataNotTransferred: patientList.filter(patient => patient.alarms.nonDataTransmissionActive).length,
      remoteMonitored: patientList.filter(patient => patient.monitoring?.enabled).length,
      renew: patientList.filter(patient => patient.monitoring?.enabled && patient.monitoring.monitoringEnd && new Date(patient.monitoring.monitoringEnd).getTime() - moment.utc(new Date()).add(14, 'd').toDate().getTime() < 0).length
    }
  }, [patientList])

  const patientsFilterStats = useMemo<PatientFilterStats>(() => buildPatientFiltersStats(), [buildPatientFiltersStats])

  const getPatientByEmail = (email: string): Patient => patientList.find(patient => patient.profile.email === email)

  const getPatientById = (userId: string): Patient => patientList.find(patient => patient.userid === userId)

  const pendingPatientsCount = selectedTeam ? PatientUtils.extractPatients(patientList, PatientListFilters.Pending, [], selectedTeam.id).length : undefined

  const filterPatients = (filterType: PatientListFilters, search: string, flaggedPatients: string[]): Patient[] => {
    const filteredPatients = PatientUtils.extractPatients(patientList, filterType, flaggedPatients, user.isUserHcp() ? selectedTeam.id : undefined)

    if (search.length === 0) {
      return filteredPatients
    }

    const searchText = search.toLocaleLowerCase()
    const birthdateAsString = searchText.slice(0, 10)
    const searchTextStartsWithBirthdate = !!moment(birthdateAsString, 'DD/MM/YYYY').toDate().getTime()

    if (searchTextStartsWithBirthdate) {
      const firstNameOrLastName = searchText.slice(10).trimStart()
      return PatientUtils.extractPatientsWithBirthdate(filteredPatients, birthdateAsString, firstNameOrLastName)
    }

    return filteredPatients.filter(patient => {
      const firstName = patient.profile.firstName ?? ''
      const lastName = patient.profile.lastName ?? ''
      return firstName.toLocaleLowerCase().includes(searchText) || lastName.toLocaleLowerCase().includes(searchText)
    })
  }

  const invitePatient = async (team: Team, username: string): Promise<void> => {
    await PatientApi.invitePatient({ teamId: team.id, email: username })
    await refreshSentInvitations()
    refresh()
  }

  const editPatientRemoteMonitoring = (patient: Patient): void => {
    const patientUpdated = getPatientById(patient.userid)
    if (!patientUpdated) {
      throw Error(`Cannot update monitoring of patient with id ${patient.userid} as patient was not found`)
    }
    patientUpdated.monitoring = patient.monitoring
    updatePatient(patientUpdated)
  }

  const markPatientMessagesAsRead = useCallback((patient: Patient) => {
    patient.metadata.hasSentUnreadMessages = false
    updatePatient(patient)
  }, [updatePatient])

  const updatePatientMonitoring = async (patient: Patient): Promise<void> => {
    if (!patient.monitoring) {
      throw Error('Cannot update patient monitoring with "undefined"')
    }
    const monitoredTeam = PatientUtils.getRemoteMonitoringTeam(patient)
    try {
      await PatientApi.updatePatientAlerts(monitoredTeam.teamId, patient.userid, patient.monitoring)
      refresh()
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update patient with id ${patient.userid}`)
    }
  }

  const removePatient = async (patient: Patient, patientTeam: PatientTeam): Promise<void> => {
    if (patientTeam.status === UserInvitationStatus.pending) {
      const invitation = getInvitation(patientTeam.teamId)
      await cancelInvitation(invitation.id, undefined, invitation.email)
    }
    if (isPatientTeamPrivate(patientTeam)) {
      await DirectShareApi.removeDirectShare(patient.userid, user.id)
    } else {
      await PatientApi.removePatient(patientTeam.teamId, patient.userid)
    }

    patient.teams = patient.teams.filter(pt => pt.teamId !== patientTeam.teamId)

    if (patient.teams.length === 0 && getFlagPatients().includes(patient.userid)) {
      await flagPatient(patient.userid)
    }
    refresh()
  }

  const leaveTeam = async (teamId: string): Promise<void> => {
    const loggedInUserAsPatient = getPatientById(user.id)
    await PatientApi.removePatient(teamId, loggedInUserAsPatient.userid)
    metrics.send('team_management', 'leave_team')
    refresh()
    refreshTeams()
  }

  const setPatientMedicalData = (userId: string, medicalData: MedicalData | null): void => {
    const patient = getPatientById(userId)
    if (patient !== null) {
      patient.metadata.medicalData = medicalData
      updatePatient(patient)
    }
  }

  useEffect(() => {
    if (!initialized && user) {
      fetchPatients()
    }
  }, [fetchPatients, initialized, user])

  return {
    patients: patientList,
    patientsFilterStats,
    pendingPatientsCount,
    initialized,
    refreshInProgress,
    getPatientByEmail,
    getPatientById,
    filterPatients,
    invitePatient,
    editPatientRemoteMonitoring,
    markPatientMessagesAsRead,
    updatePatientMonitoring,
    removePatient,
    leaveTeam,
    setPatientMedicalData,
    refresh
  }
}
