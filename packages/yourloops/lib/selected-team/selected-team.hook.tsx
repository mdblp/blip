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

import { type SelectedTeamContextResult } from './selected-team-context.model'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Team, useTeam } from '../team'
import TeamUtils from '../team/team.util'

const LOCAL_STORAGE_SELECTED_TEAM_ID_KEY = 'selectedTeamId'

export function useSelectedTeamProviderCustomHook(): SelectedTeamContextResult {
  const { getMedicalTeams, getPrivateTeam } = useTeam()
  const medicalTeams = getMedicalTeams()
  const privateTeam = getPrivateTeam()
  const availableTeams = useMemo(() => ([...medicalTeams, privateTeam]), [medicalTeams, privateTeam])
  const [teamIdToSelectWhenAvailable, setTeamIdToSelectWhenAvailable] = useState<string>(null)

  const getDefaultTeam = useCallback((): Team => {
    if (!medicalTeams.length) {
      return privateTeam
    }

    return TeamUtils.sortTeamsByName(medicalTeams)[0]
  }, [medicalTeams, privateTeam])

  const isValidTeamId = useCallback((teamId: string): boolean => {
    return availableTeams.some((team: Team) => team.id === teamId)
  }, [availableTeams])

  const getTeamToSelect = useCallback((): Team => {
    if (teamIdToSelectWhenAvailable && isValidTeamId(teamIdToSelectWhenAvailable)) {
      const teamToSelect = availableTeams.find((team: Team) => team.id === teamIdToSelectWhenAvailable)
      setTeamIdToSelectWhenAvailable(null)
      return teamToSelect
    }

    const localStorageTeamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)

    if (!isValidTeamId(localStorageTeamId)) {
      const defaultTeam = getDefaultTeam()
      localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, defaultTeam.id)

      return defaultTeam
    }

    return availableTeams.find((team: Team) => team.id === localStorageTeamId)
  }, [availableTeams, getDefaultTeam, isValidTeamId, teamIdToSelectWhenAvailable])

  const [selectedTeam, setSelectedTeam] = useState<Team>(() => getTeamToSelect())

  const selectTeam = (teamId: string, isNewTeam?: boolean): void => {
    const team = availableTeams.find((team: Team) => team.id === teamId)
    if (!team) {
      if (isNewTeam) {
        setTeamIdToSelectWhenAvailable(teamId)
      }
      return
    }
    setSelectedTeam(team)
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, teamId)
  }

  useEffect(() => {
    const team = getTeamToSelect()
    setSelectedTeam(team)
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, team.id)
  }, [getDefaultTeam, getTeamToSelect])

  return {
    selectedTeam,
    selectTeam
  }
}
