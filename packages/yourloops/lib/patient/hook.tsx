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
import TeamUtils from '../team/utils'
import { PatientFilterStats } from '../team/models'
import { PatientFilterTypes, UserInvitationStatus } from '../../models/generic'
import { notificationConversion } from '../notifications/utils'
import PatientApi from './patient-api'
import TeamApi from '../team/team-api'
import _ from 'lodash'
import DirectShareApi from '../share/direct-share-api'
import { useAuth } from '../auth'
import metrics from '../metrics'
import { MedicalData } from '../../models/device-data'
import { Alarm } from '../../models/alarm'

interface PatientContextResult {
  patients: Patient[]
  patientsFilterStats: PatientFilterStats
  initialized: boolean
  setPatients: Function
  getPatient: Function
  filterPatients: Function
  invitePatient: Function
  editPatientRemoteMonitoring: Function
  markPatientMessagesAsRead: Function
  updatePatientMonitoring: Function
  removePatient: Function
  leaveTeam: Function
  setPatientMedicalData: Function
  refresh: Function
}

const PatientContext = React.createContext<PatientContextResult>({
  patients: [],
  patientsFilterStats: {} as PatientFilterStats,
  initialized: false,
  setPatients: () => {
  },
  getPatient: () => {
  },
  filterPatients: () => {
  },
  invitePatient: () => {
  },
  editPatientRemoteMonitoring: () => {
  },
  markPatientMessagesAsRead: () => {
  },
  updatePatientMonitoring: () => {
  },
  removePatient: () => {
  },
  leaveTeam: () => {
  },
  setPatientMedicalData: () => {
  },
  refresh: () => {
  }
})

export const PatientProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { teams, initialized: teamHookInitialized, removeTeamFromList } = useTeam()
  const { sentInvitations, cancel: cancelInvitation } = useNotification()
  const [patients, setPatients] = useState<Patient[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const { user, getFlagPatients, flagPatient } = useAuth()
  // console.log(user?.preferences?.patientsStarred)
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
      all: patients.filter((patient) => !TeamUtils.isOnlyPendingInvitation(patient)).length,
      pending: patients.filter((patient) => TeamUtils.isInvitationPending(patient)).length,
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
    let res = TeamUtils.extractPatients(patients, filterType, flaggedPatients)
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
    const patientTeam = { status: UserInvitationStatus.pending, teamId: team.id, code: team.code, teamName: team.name }

    let patient = patients.find(patient => patient.profile.email === invitation.email)
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
    const team = teams.find(t => t.monitoring?.enabled && patient.teams.find(team => team.teamId === t.id))
    if (!team) {
      throw Error(`Cannot find monitoring team in which patient ${patient.profile.email} is in`)
    }
    try {
      await TeamApi.updatePatientAlerts(team.id, patient.userid, patient.monitoring)
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update patient with id ${patient.userid}`)
    }
    updatePatient(patient)
  }, [teams, updatePatient])

  const removePatient = useCallback(async (patient: Patient, member: PatientTeam, teamId: string) => {
    if (member.status === UserInvitationStatus.pending) {
      if (_.isNil(member.invitation)) {
        throw new Error('Missing invitation!')
      }
      await cancelInvitation(member.invitation)
    }
    if (teamId === 'private') {
      await DirectShareApi.removeDirectShare(patient.userid, user.id)
    } else {
      await TeamApi.removePatient(teamId, patient.userid)
    }

    patient.teams = patient.teams.filter(patientTeam => patientTeam.teamId !== teamId)
    updatePatient(patient)

    if (patient.teams.length === 0) {
      const isFlagged = getFlagPatients().includes(patient.userid)
      if (isFlagged) {
        await flagPatient(patient.userid)
      }
    }
  }, [cancelInvitation, flagPatient, getFlagPatients, updatePatient, user.id])

  const leaveTeam = useCallback(async (team: Team) => {
    const loggedInUserAsPatient = patients.find(patient => patient.userid === user.id)
    await TeamApi.removePatient(team.id, loggedInUserAsPatient.userid)
    metrics.send('team_management', 'leave_team')
    loggedInUserAsPatient.teams = loggedInUserAsPatient.teams.filter(t => t.teamId !== team.id)
    updatePatient(loggedInUserAsPatient)
    removeTeamFromList(team.id)
  }, [patients, removeTeamFromList, updatePatient, user.id])

  const setPatientMedicalData = useCallback((userId: string, medicalData: MedicalData | null) => {
    const patient = getPatient(userId)
    if (patient !== null) {
      patient.metadata.medicalData = medicalData
      updatePatient(patient)
    }
  }, [getPatient, updatePatient])

  React.useEffect(() => {
    if (!initialized && teamHookInitialized) {
      console.log('FETCHING PATIENTS')
      PatientUtils.computePatients(teams, sentInvitations).then(computedPatients => {
        setPatients(computedPatients)
        setInitialized(true)
      })
    }
  }, [initialized, sentInvitations, teamHookInitialized, teams])

  const shared = useMemo(() => ({
    patients,
    patientsFilterStats,
    initialized,
    setPatients,
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
    initialized,
    setPatients,
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

  return (
    <PatientContext.Provider value={shared}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient(): PatientContextResult {
  return React.useContext(PatientContext)
}
