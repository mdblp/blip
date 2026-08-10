/*
 * Copyright (c) 2026, Diabeloop
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

import { useRef, useState } from 'react'
import { type Team } from '../../../lib/team'
import { usePatientListContext } from '../../../lib/providers/patient-list.provider'
import AnalyticsApi, { ElementType } from '../../../lib/analytics/analytics.api'
import { useAuth } from '../../../lib/auth'
import { useTranslation } from 'react-i18next'


export const usePatientListHeaderHook = () => {

  const { t } = useTranslation()
  const { user } = useAuth()
  const { filters } = usePatientListContext()
  const [isFiltersDialogOpen, setFiltersDialogOpen] = useState<boolean>(false)
  const [showAddPatientDialog, setShowAddPatientDialog] = useState<boolean>(false)
  const [teamCodeDialogSelectedTeam, setTeamCodeDialogSelectedTeam] = useState<Team | null>(null)

  const filtersRef = useRef<HTMLButtonElement>(null)
  const columnsRef = useRef<HTMLButtonElement>(null)

  const isUserHcp = user.isUserHcp()

  const filterButtonTooltipTitle = isUserHcp && filters.pendingEnabled ? t('filter-cannot-apply-pending-tab') : ''
  const columnSettingsButtonTooltipTitle = isUserHcp && filters.pendingEnabled ? t('columns-settings-cannot-changed-pending-tab') : ''

  const onAddPatientSuccessful = (team: Team): void => {
    setShowAddPatientDialog(false)
    setTeamCodeDialogSelectedTeam(team)
  }

  const openFiltersDialog = (): void => {
    setFiltersDialogOpen(true)
    AnalyticsApi.trackClick('patient-list-filters', ElementType.Button)
  }

  const closeFiltersDialog = (): void => {
    setFiltersDialogOpen(false)
  }

  return {
    filters,
    isFiltersDialogOpen,
    setFiltersDialogOpen,
    showAddPatientDialog,
    setShowAddPatientDialog,
    teamCodeDialogSelectedTeam,
    setTeamCodeDialogSelectedTeam,
    filterButtonTooltipTitle,
    columnSettingsButtonTooltipTitle,
    filtersRef,
    columnsRef,
    isUserHcp,
    onAddPatientSuccessful,
    openFiltersDialog,
    closeFiltersDialog
  }
}
