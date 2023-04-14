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

import { useCallback, useEffect, useState } from 'react'
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
import { UserInvitationStatus } from '../team/models/enums/user-invitation-status.enum'
import { type MedicalData } from '../data/models/medical-data.model'
import { useSelectedTeamContext } from '../selected-team/selected-team.provider'
import { PRIVATE_TEAM_ID } from '../team/team.hook'
import { usePatientsFiltersContext } from '../filter/patients-filters.provider'
import { useAlert } from '../../components/utils/snackbar'

export default function usePatientProviderCustomHook(): PatientContextResult {
  const { cancel: cancelInvitation, getInvitation, refreshSentInvitations } = useNotification()
  const { refresh: refreshTeams } = useTeam()
  const { user } = useAuth()
  const { filters } = usePatientsFiltersContext()
  const { selectedTeam } = useSelectedTeamContext()
  const alert = useAlert()

  const [patients, setPatients] = useState<Patient[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)

  const fetchPatients = useCallback((teamId: string = selectedTeam?.id) => {
    PatientUtils.computePatients(user, teamId ?? null).then(computedPatients => {
      setPatients(computedPatients)
    }).catch((reason: unknown) => {
      const message = errorTextFromException(reason)
      alert.error(message)
    }).finally(() => {
      setInitialized(true)
      setRefreshInProgress(false)
    })
    // Need to rewrite the alert component, or it triggers infinite loop...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedTeam])

  const refresh = (teamId: string = selectedTeam?.id): void => {
    setRefreshInProgress(true)
    fetchPatients(teamId)
  }

  const updatePatient = useCallback((patient: Patient) => {
    const patientsUpdated = patients.filter(p => p.userid !== patient.userid)
    patientsUpdated.push(patient)
    setPatients(patientsUpdated)
  }, [patients])

  const getPatientList = (): Patient[] => {
    if (!user.isUserHcp()) {
      return patients
    }
    const patientsStarred = user.preferences?.patientsStarred ?? []
    return PatientUtils.extractPatients(patients, filters, patientsStarred)
  }

  const patientList = getPatientList()

  const pendingPatientsCount = user.isUserHcp() ? patients.filter((patient) => PatientUtils.isInvitationPending(patient)).length : undefined
  const allPatientsForSelectedTeamCount = user.isUserHcp() ? patients.filter((patient) => !PatientUtils.isInvitationPending(patient)).length : undefined

  const getPatientByEmail = (email: string): Patient => patients.find(patient => patient.profile.email === email)

  const getPatientById = (userId: string): Patient => patientList.find(patient => patient.userid === userId)

  const searchPatients = (search: string): Patient[] => {
    if (search.length === 0) {
      return patientList
    }

    const searchText = search.toLocaleLowerCase()
    const birthdateAsString = searchText.slice(0, 10)
    const searchTextStartsWithBirthdate = !!moment(birthdateAsString, 'DD/MM/YYYY').toDate().getTime()

    if (searchTextStartsWithBirthdate) {
      const firstNameOrLastName = searchText.slice(10).trimStart()
      return PatientUtils.extractPatientsWithBirthdate(patientList, birthdateAsString, firstNameOrLastName)
    }

    return patientList.filter(patient => {
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
    try {
      await PatientApi.updatePatientAlerts(selectedTeam.id, patient.userid, patient.monitoring)
      refresh()
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update patient with id ${patient.userid}`)
    }
  }

  const removePatient = async (patient: Patient): Promise<void> => {
    if (patient.invitationStatus === UserInvitationStatus.pending) {
      const invitation = getInvitation(selectedTeam.id)
      await cancelInvitation(invitation.id, undefined, invitation.email)
    }
    if (selectedTeam.id === PRIVATE_TEAM_ID) {
      await DirectShareApi.removeDirectShare(patient.userid, user.id)
    } else {
      await PatientApi.removePatient(selectedTeam.id, patient.userid)
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
    pendingPatientsCount,
    allPatientsForSelectedTeamCount,
    initialized,
    refreshInProgress,
    getPatientByEmail,
    getPatientById,
    searchPatients,
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
