/*
 * Copyright (c) 2023, Diabeloop
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

import React, { createContext, type FunctionComponent, type PropsWithChildren, useContext, useState } from 'react'
import { type PatientsFiltersContextResult } from './models/patients-filters-context-result.model'
import { type PatientsFilters } from './models/patients-filters.model'

const PatientsFiltersContext = createContext<PatientsFiltersContextResult>({} as PatientsFiltersContextResult)

export const PatientsFiltersProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [filters, setFilters] = useState<PatientsFilters>({
    pendingEnabled: false,
    manualFlagEnabled: false,
    telemonitoredEnabled: false,
    timeOutOfTargetEnabled: false,
    hypoglycemiaEnabled: false,
    dataNotTransferredEnabled: false,
    messagesEnabled: false
  })

  const updatePatientsFilters = (filters: PatientsFilters): void => {
    setFilters(filters)
  }

  const updatePendingFilter = (pendingEnabled: boolean): void => {
    setFilters({ ...filters, pendingEnabled })
  }

  const resetFilters = (): void => {
    setFilters({
      ...filters,
      manualFlagEnabled: false,
      telemonitoredEnabled: false,
      timeOutOfTargetEnabled: false,
      hypoglycemiaEnabled: false,
      dataNotTransferredEnabled: false,
      messagesEnabled: false
    })
  }

  const result = { filters, updatePatientsFilters, updatePendingFilter, resetFilters }

  return <PatientsFiltersContext.Provider value={result}>{children}</PatientsFiltersContext.Provider>
}

export function usePatientsFiltersContext(): PatientsFiltersContextResult {
  return useContext(PatientsFiltersContext)
}
