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

import { SelectedTeamContextResult } from './selected-team-context.model'
import { useState } from 'react'
import { Team, useTeam } from '../team'
import TeamUtils from '../team/utils'

const LOCAL_STORAGE_SELECTED_TEAM_ID_KEY = 'selectedTeamId'

export function useSelectedTeamProviderCustomHook(): SelectedTeamContextResult {
  const { getMedicalAndPrivateTeams } = useTeam()

  const getSortedTeams = (): Team[] => {
    const teams = getMedicalAndPrivateTeams()
    return TeamUtils.sortTeams(teams)
  }

  const sortedTeams = getSortedTeams()

  const getDefaultTeamId = (): string => {
    const localStorageTeamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
    const isValidTeamId = sortedTeams.some((team: Team) => team.id === localStorageTeamId)

    if (!isValidTeamId) {
      const defaultId = sortedTeams[0].id
      localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, defaultId)
      return defaultId
    }
    return localStorageTeamId
  }

  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => getDefaultTeamId())

  const selectTeam = (teamId: string): void => {
    setSelectedTeamId(teamId)
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, teamId)
  }

  return {
    selectedTeamId,
    selectTeam
  }
}
