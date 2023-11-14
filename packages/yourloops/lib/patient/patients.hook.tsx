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

import { useCallback, useEffect, useRef, useState } from 'react'
import moment from 'moment-timezone'

import { type Team } from '../team'
import { useNotification } from '../notifications/notification.hook'
import PatientUtils from './patient.util'
import PatientApi from './patient.api'
import DirectShareApi from '../share/direct-share.api'
import { useAuth } from '../auth'
import { type PatientsContextResult } from './models/patients-context-result.model'
import { type Patient } from './models/patient.model'
import { usePatientListContext } from '../providers/patient-list.provider'
import { useLocation, useParams, useRevalidator, useRouteLoaderData } from 'react-router-dom'
import { PRIVATE_TEAM_ID } from '../team/team.hook'
import { LOCAL_STORAGE_SELECTED_TEAM_ID_KEY } from '../../layout/hcp-layout'

export default function usePatientsProviderCustomHook(): PatientsContextResult {
  const { cancel: cancelInvite } = useNotification()
  const { user } = useAuth()
  const { filters } = usePatientListContext()
  const { teamId: teamIdFromParam } = useParams()
  const isUserHcp = user.isUserHcp()
  const teamId = teamIdFromParam ?? localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
  const { pathname } = useLocation()
  const urlPrefix = pathname.split('/')[1]
  // const patientsBasicInfos = useRouteLoaderData('toto') as Patient[]
  const patientsBasicInfos = useRouteLoaderData(`patients-route-for-${urlPrefix}`) as Patient[]
  const { revalidate: refreshPatientsInfo } = useRevalidator()

  const [patients, setPatients] = useState<Patient[]>(patientsBasicInfos)
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)
  const teamIdForWhichPatientsAreFetched = useRef(null)

  const fetchPatientsMetrics = useCallback((selectedTeamId: string) => {
    if (!isUserHcp || !patientsBasicInfos) {
      return
    }

    if (!patientsBasicInfos.length) {
      setPatients([])
      return
    }

    PatientUtils.fetchMetrics(patientsBasicInfos, selectedTeamId, user.id).then(metrics => {
      if (!metrics) {
        return
      }
      const updatedPatients = PatientUtils.getUpdatedPatientsWithMetrics(patientsBasicInfos, metrics)
      setPatients(updatedPatients)
    })

  }, [isUserHcp, patientsBasicInfos, user.id])

  const refresh = (): void => {
    setRefreshInProgress(true)
    refreshPatientsInfo()
  }

  const updatePatient = useCallback((patient: Patient) => {
    const patientsUpdated = patients.filter(p => p.userid !== patient.userid)
    patientsUpdated.push(patient)
    setPatients(patientsUpdated)
  }, [patients])

  const getPatientList = (): Patient[] => {
    if (!isUserHcp) {
      return patients
    }
    const patientsStarred = user.preferences?.patientsStarred ?? []
    return PatientUtils.extractPatients(patients, filters, patientsStarred)
  }

  const patientList = getPatientList()

  const pendingPatientsCount = isUserHcp ? PatientUtils.getPendingPatients(patients).length : undefined
  const allNonPendingPatientsForSelectedTeamCount = isUserHcp ? PatientUtils.getNonPendingPatients(patients).length : undefined

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
      const fullName = patient.profile.fullName ?? ''

      return firstName.toLocaleLowerCase().includes(searchText) ||
        lastName.toLocaleLowerCase().includes(searchText) ||
        fullName.toLocaleLowerCase().includes(searchText)
    })
  }

  const invitePatient = async (team: Team, username: string): Promise<void> => {
    await PatientApi.invitePatient({ teamId: team.id, email: username })
    refresh()
  }

  const markPatientMessagesAsRead = useCallback((patient: Patient) => {
    patient.hasSentUnreadMessages = false
    updatePatient(patient)
  }, [updatePatient])

  const updatePatientMonitoringAlertsParameters = async (patient: Patient): Promise<void> => {
    try {
      await PatientApi.updatePatientAlerts(teamId, patient.userid, patient.monitoringAlertsParameters)
      refresh()
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update patient with id ${patient.userid}`)
    }
  }

  const removePatient = async (patient: Patient): Promise<void> => {
    if (PatientUtils.isInvitationPending(patient)) {
      await cancelInvite(patient.invite.id, undefined, patient.profile.email)
    }
    if (teamId === PRIVATE_TEAM_ID) {
      await DirectShareApi.removeDirectShare(patient.userid, user.id)
    } else {
      await PatientApi.removePatient(teamId, patient.userid)
    }
    refresh()
  }

  useEffect(() => {
    const selectedTeamId = teamId ?? localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
    if (user && teamIdForWhichPatientsAreFetched.current !== selectedTeamId) {
      teamIdForWhichPatientsAreFetched.current = selectedTeamId
      fetchPatientsMetrics(selectedTeamId)
    }
  }, [fetchPatientsMetrics, teamId, user])

  return {
    patients: patientList,
    pendingPatientsCount,
    allNonPendingPatientsForSelectedTeamCount,
    refreshInProgress,
    getPatientByEmail,
    getPatientById,
    searchPatients,
    invitePatient,
    markPatientMessagesAsRead,
    updatePatientMonitoringAlertsParameters,
    removePatient,
    refresh
  }
}
