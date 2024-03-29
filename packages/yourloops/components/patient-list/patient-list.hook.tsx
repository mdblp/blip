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

import { useEffect, useMemo, useState } from 'react'
import { PatientListTabs } from './models/enums/patient-list.enum'
import { usePatientsContext } from '../../lib/patient/patients.provider'
import { type Patient } from '../../lib/patient/models/patient.model'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'

interface PatientListHookReturns {
  selectedTab: PatientListTabs
  inputSearch: string
  patients: Patient[]
  setInputSearch: (value: string) => void
  onChangingTab: (newTab: PatientListTabs) => void
}

export const usePatientListHook = (): PatientListHookReturns => {
  const { searchPatients } = usePatientsContext()
  const { updatePendingFilter, filters } = usePatientListContext()

  const [selectedTab, setSelectedTab] = useState<PatientListTabs>(PatientListTabs.Current)
  const [inputSearch, setInputSearch] = useState<string>('')

  const patients = useMemo(() => searchPatients(inputSearch), [searchPatients, inputSearch])

  const onChangingTab = (newTab: PatientListTabs): void => {
    setSelectedTab(newTab)
    switch (newTab) {
      case PatientListTabs.Current:
        updatePendingFilter(false)
        return
      case PatientListTabs.Pending:
        updatePendingFilter(true)
    }
  }

  useEffect(() => {
    if (selectedTab === PatientListTabs.Current && filters.pendingEnabled) {
      updatePendingFilter(false)
    }
  }, [filters.pendingEnabled, selectedTab, updatePendingFilter])

  return {
    selectedTab,
    inputSearch,
    patients,
    onChangingTab,
    setInputSearch
  }
}
