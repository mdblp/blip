/**
 * Copyright (c) 2021, Diabeloop
 * Teams management & helpers - hook version
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
import { PatientFilterStats } from '../team/models'
import { PatientFilterTypes, UserInvitationStatus } from '../../models/generic'
import { notificationConversion } from '../notifications/utils'
import PatientApi from './patient-api'
import DirectShareApi from '../share/direct-share-api'
import { useAuth } from '../auth'
import metrics from '../metrics'
import { MedicalData } from '../../models/device-data'
import { Alarm } from '../../models/alarm'
import { errorTextFromException } from '../utils'
import { CircularProgress } from '@material-ui/core'

export interface PatientContextResult {
  patients: Patient[]
  patientsFilterStats: PatientFilterStats
  errorMessage: string | null
  getPatient: (userId: string) => Patient
  filterPatients: (filterType: PatientFilterTypes, search: string, flaggedPatients: string[]) => Patient[]
  invitePatient: (team: Team, username: string) => Promise<void>
  editPatientRemoteMonitoring: (patient: Patient) => void
  markPatientMessagesAsRead: (patient: Patient) => void
  updatePatientMonitoring: (patient: Patient) => Promise<void>
  removePatient: (patient: Patient, patientTeam: PatientTeam) => Promise<void>
  leaveTeam: (team: string) => Promise<void>
  setPatientMedicalData: (userId: string, medicalData: MedicalData | null) => void
  refresh: () => void
}

const PatientContext = React.createContext<PatientContextResult>({
  patients: [],
  patientsFilterStats: {} as PatientFilterStats,
  errorMessage: null,
  getPatient: () => ({} as Patient),
  filterPatients: () => [],
  invitePatient: async () => await Promise.resolve(),
  editPatientRemoteMonitoring: () => {
  },
  markPatientMessagesAsRead: () => {
  },
  updatePatientMonitoring: async () => await Promise.resolve(),
  removePatient: async () => await Promise.resolve(),
  leaveTeam: async () => await Promise.resolve(),
  setPatientMedicalData: () => {
  },
  refresh: () => {
  }
})

export const PatientProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { cancel: cancelInvitation, getInvitation } = useNotification()
  const { removeTeamFromList } = useTeam()
  const { user, getFlagPatients, flagPatient } = useAuth()

  const [patients, setPatients] = useState<Patient[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const refresh = useCallback(() => {
    setInitialized(false)
  }, [])

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
    const apiInvitation = await PatientApi.invitePatient({ teamId: team.id, email: username })
    const invitation = notificationConversion(apiInvitation)
    const patientTeam = {
      status: UserInvitationStatus.pending,
      teamId: team.id,
      remoteMonitoringEnabled: team.monitoring?.enabled
    }

    let patient: Patient = patients.find(patient => patient.profile.email === invitation.email)
    if (!patient) {
      patient = {
        metadata: {
          alarm: {} as Alarm,
          flagged: undefined,
          medicalData: null,
          unreadMessagesSent: 0
        },
        settings: { system: 'DBLG1' },
        userid: invitation.id,
        profile: {
          sex: '',
          fullName: username,
          email: username
        },
        teams: [patientTeam]
      }
      patients.push(patient)
      setPatients(patients)
    } else {
      const patientsUpdated = patients.filter(patient => patient.profile.email !== invitation.email)
      if (patient.teams) {
        patient.teams.push(patientTeam)
      } else {
        patient.teams = [patientTeam]
      }
      patientsUpdated.push(patient)
      setPatients(patientsUpdated)
    }
  }, [patients])

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
      throw Error('Cannot update patient monitoring with undefined')
    }
    const monitoredTeam = patient.teams.find(team => team.monitoringStatus !== undefined)
    if (!monitoredTeam) {
      throw Error(`Cannot find monitoring team in which patient ${patient.profile.email} is in`)
    }
    try {
      await PatientApi.updatePatientAlerts(monitoredTeam.teamId, patient.userid, patient.monitoring)
      monitoredTeam.monitoringStatus = patient.monitoring?.status
      patient.teams = patient.teams.filter(team => team.teamId !== monitoredTeam.teamId)
      patient.teams.push(monitoredTeam)
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update patient with id ${patient.userid}`)
    }
    updatePatient(patient)
  }, [updatePatient])

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

    if (patient.teams.length === 0) {
      const patientsUpdated = patients.filter(p => p.userid !== patient.userid)
      setPatients(patientsUpdated)
      const isFlagged = getFlagPatients().includes(patient.userid)
      if (isFlagged) {
        await flagPatient(patient.userid)
      }
    } else {
      updatePatient(patient)
    }
  }, [cancelInvitation, flagPatient, getFlagPatients, getInvitation, patients, updatePatient, user.id])

  const leaveTeam = useCallback(async (teamId: string) => {
    const loggedInUserAsPatient = patients.find(patient => patient.userid === user.id)
    await PatientApi.removePatient(teamId, loggedInUserAsPatient.userid)
    metrics.send('team_management', 'leave_team')
    loggedInUserAsPatient.teams = loggedInUserAsPatient.teams.filter(t => t.teamId !== teamId)
    updatePatient(loggedInUserAsPatient)
    removeTeamFromList(teamId)
  }, [patients, removeTeamFromList, updatePatient, user.id])

  const setPatientMedicalData = useCallback((userId: string, medicalData: MedicalData | null) => {
    const patient = getPatient(userId)
    if (patient !== null) {
      patient.metadata.medicalData = medicalData
      updatePatient(patient)
    }
  }, [getPatient, updatePatient])

  React.useEffect(() => {
    if (!initialized && user) {
      PatientUtils.computePatients().then(computedPatients => {
        setPatients(computedPatients)
        setInitialized(true)
        setErrorMessage(null)
      }).catch((reason: unknown) => {
        const message = errorTextFromException(reason)
        if (message !== errorMessage) {
          setErrorMessage(message)
        }
      })
    }
  }, [errorMessage, initialized, user])

  const shared = useMemo(() => ({
    patients,
    patientsFilterStats,
    errorMessage,
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
    patients,
    patientsFilterStats,
    errorMessage,
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
  ])
  return initialized ? (
    <PatientContext.Provider value={shared}>
      {children}
    </PatientContext.Provider>
  ) : <CircularProgress
    disableShrink
    style={{ position: 'absolute', top: 'calc(50vh - 20px)', left: 'calc(50vw - 20px)' }}
  />
}

export function usePatient(): PatientContextResult {
  return React.useContext(PatientContext)
}
