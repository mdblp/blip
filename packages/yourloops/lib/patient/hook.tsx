/**
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

import React, { useCallback, useMemo, useState } from 'react'
import moment from 'moment-timezone'

import { Patient, PatientTeam } from '../data/patient'
import { Team, useTeam } from '../team'
import { useNotification } from '../notifications/hook'
import PatientUtils from './utils'
import { PatientFilterTypes, UserInvitationStatus } from '../../models/generic'
import PatientApi from './patient-api'
import DirectShareApi from '../share/direct-share-api'
import { useAuth } from '../auth'
import metrics from '../metrics'
import { MedicalData } from '../../models/device-data'
import { errorTextFromException } from '../utils'
import { PatientContextResult } from './provider'

export default function usePatientProviderCustomHook(): PatientContextResult {
  const { cancel: cancelInvitation, getInvitation, receivedInvitations } = useNotification()
  const { refresh: refreshTeams } = useTeam()
  const { user, getFlagPatients, flagPatient } = useAuth()

  const [patients, setPatients] = useState<Patient[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const fetchPatients = useCallback(() => {
    PatientUtils.computePatients().then(computedPatients => {
      setPatients(computedPatients)
      setErrorMessage(null)
    }).catch((reason: unknown) => {
      const message = errorTextFromException(reason)
      if (message !== errorMessage) {
        setErrorMessage(message)
      }
    }).finally(() => {
      setInitialized(true)
      setRefreshInProgress(false)
    })
  }, [errorMessage])

  const refresh = useCallback(() => {
    setRefreshInProgress(true)
    fetchPatients()
  }, [fetchPatients])

  const updatePatient = useCallback((patient: Patient) => {
    const patientsUpdated = patients.filter(p => p.userid !== patient.userid)
    patientsUpdated.push(patient)
    setPatients(patientsUpdated)
  }, [patients])

  const buildPatientFiltersStats = useCallback(() => {
    return {
      all: patients.filter((patient) => !PatientUtils.isOnlyPendingInvitation(patient)).length,
      pending: patients.filter((patient) => PatientUtils.isInvitationPending(patient)).length,
      directShare: patients.filter((patient) => patient.teams.find(team => team.teamId === 'private')).length,
      unread: patients.filter(patient => patient.metadata.unreadMessagesSent > 0).length,
      outOfRange: patients.filter(patient => patient.metadata.alarm.timeSpentAwayFromTargetActive).length,
      severeHypoglycemia: patients.filter(patient => patient.metadata.alarm.frequencyOfSevereHypoglycemiaActive).length,
      dataNotTransferred: patients.filter(patient => patient.metadata.alarm.nonDataTransmissionActive).length,
      remoteMonitored: patients.filter(patient => patient.monitoring?.enabled).length,
      renew: patients.filter(patient => patient.monitoring?.enabled && patient.monitoring.monitoringEnd && new Date(patient.monitoring.monitoringEnd).getTime() - moment.utc(new Date()).add(14, 'd').toDate().getTime() < 0).length
    }
  }, [patients])

  const patientsFilterStats = useMemo(() => buildPatientFiltersStats(), [buildPatientFiltersStats])

  const getPatient = useCallback(userId => {
    return patients.find(patient => patient.userid === userId)
  }, [patients])

  const filterPatients = useCallback((filterType: PatientFilterTypes, search: string, flaggedPatients: string[]) => {
    let res = PatientUtils.extractPatients(patients, filterType, flaggedPatients)
    const searchByName = search.length > 0
    if (searchByName) {
      const searchText = search.toLocaleLowerCase()
      res = res.filter((patient: Patient): boolean => {
        const firstName = patient.profile.firstName ?? ''
        if (firstName.toLocaleLowerCase().includes(searchText)) {
          return true
        }
        const lastName = patient.profile.lastName ?? ''
        return lastName.toLocaleLowerCase().includes(searchText)
      })
    }
    return res
  }, [patients])

  const invitePatient = useCallback(async (team: Team, username: string) => {
    await PatientApi.invitePatient({ teamId: team.id, email: username })
    refresh()
  }, [refresh])

  const editPatientRemoteMonitoring = useCallback((patient: Patient) => {
    const patientUpdated = getPatient(patient.userid)
    if (!patientUpdated) {
      throw Error(`Cannot update monitoring of patient with id ${patient.userid} as patient was not found`)
    }
    patientUpdated.monitoring = patient.monitoring
    updatePatient(patientUpdated)
  }, [getPatient, updatePatient])

  const markPatientMessagesAsRead = useCallback((patient: Patient) => {
    patient.metadata.unreadMessagesSent = 0
    updatePatient(patient)
  }, [updatePatient])

  const updatePatientMonitoring = useCallback(async (patient: Patient) => {
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
  }, [refresh])

  const removePatient = useCallback(async (patient: Patient, patientTeam: PatientTeam) => {
    if (patientTeam.status === UserInvitationStatus.pending) {
      const invitation = getInvitation(patientTeam.teamId)
      await cancelInvitation(invitation)
    }
    if (patientTeam.teamId === 'private') {
      await DirectShareApi.removeDirectShare(patient.userid, user.id)
    } else {
      await PatientApi.removePatient(patientTeam.teamId, patient.userid)
    }

    patient.teams = patient.teams.filter(pt => pt.teamId !== patientTeam.teamId)

    if (patient.teams.length === 0 && getFlagPatients().includes(patient.userid)) {
      await flagPatient(patient.userid)
    }
    refresh()
  }, [cancelInvitation, flagPatient, getFlagPatients, getInvitation, user.id, refresh])

  const leaveTeam = useCallback(async (teamId: string) => {
    const loggedInUserAsPatient = getPatient(user.id)
    await PatientApi.removePatient(teamId, loggedInUserAsPatient.userid)
    metrics.send('team_management', 'leave_team')
    refresh()
    refreshTeams()
  }, [getPatient, refresh, refreshTeams, user.id])

  const setPatientMedicalData = useCallback((userId: string, medicalData: MedicalData | null) => {
    const patient = getPatient(userId)
    if (patient !== null) {
      patient.metadata.medicalData = medicalData
      updatePatient(patient)
    }
  }, [getPatient, updatePatient])

  React.useEffect(() => {
    if (!initialized && user) {
      fetchPatients()
    }
  }, [fetchPatients, initialized, user])

  React.useEffect(() => {
    if (initialized) {
      refresh()
    }
  }, [receivedInvitations, initialized, refresh]) // We want the patient list to refresh when the notifications are updated

  return useMemo(() => ({
    patients,
    patientsFilterStats,
    errorMessage,
    initialized,
    refreshInProgress,
    getPatient,
    filterPatients,
    invitePatient,
    editPatientRemoteMonitoring,
    markPatientMessagesAsRead,
    updatePatientMonitoring,
    removePatient,
    leaveTeam,
    setPatientMedicalData,
    refresh
  }), [
    refreshInProgress,
    editPatientRemoteMonitoring,
    errorMessage,
    filterPatients,
    getPatient,
    initialized,
    invitePatient,
    leaveTeam,
    markPatientMessagesAsRead,
    patients,
    patientsFilterStats,
    refresh,
    removePatient,
    setPatientMedicalData,
    updatePatientMonitoring
  ])
}
