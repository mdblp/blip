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

import { useEffect, useState } from 'react'
import { useTeam } from '../../../lib/team'
import { useAuth } from '../../../lib/auth'
import { useLocation } from 'react-router-dom'
import { useQueryParams } from '../../../lib/custom-hooks/useQueryParams'
import { MainDrawerProps } from './main-drawer'
import { PatientFilterStats } from '../../../lib/team/models'
import { PatientFilterTypes } from '../../../models/generic'
import { usePatientContext } from '../../../lib/patient/provider'

interface MainDrawerHookReturn {
  fullDrawer: boolean
  onHover: boolean
  setOnHover: Function
  patientFiltersStats: PatientFilterStats
  numberOfFlaggedPatients: number
  loggedUserIsHcpInMonitoring: boolean
  selectedFilter: string | null
}

const useMainDrawer = ({ miniVariant }: MainDrawerProps): MainDrawerHookReturn => {
  const [fullDrawer, setFullDrawer] = useState<boolean>(!miniVariant)
  const [onHover, setOnHover] = useState<boolean>(false)
  const teamHook = useTeam()
  const authHook = useAuth()
  const patientHook = usePatientContext()
  const queryParams = useQueryParams()
  const { pathname } = useLocation()

  const patientFiltersStats = patientHook.patientsFilterStats
  const numberOfFlaggedPatients = authHook.getFlagPatients().length
  const loggedUserIsHcpInMonitoring = !!(authHook.user?.isUserHcp() && teamHook.getRemoteMonitoringTeams().find(team => team.members.find(member => member.user.userid === authHook.user?.id)))
  const queryParam: string | null = queryParams.get('filter')
  const selectedFilter: string | null = queryParam ?? (pathname === '/home' ? PatientFilterTypes.all : null)

  useEffect(() => setFullDrawer(!miniVariant), [miniVariant])

  return {
    fullDrawer,
    onHover,
    setOnHover,
    patientFiltersStats,
    numberOfFlaggedPatients,
    loggedUserIsHcpInMonitoring,
    selectedFilter
  }
}

export default useMainDrawer
