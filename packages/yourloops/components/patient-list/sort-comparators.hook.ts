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

import { useUserName } from '../../lib/custom-hooks/user-name.hook'
import { type GridComparatorFn } from '@mui/x-data-grid'
import { type Patient } from '../../lib/patient/models/patient.model'

interface SortComparatorsHookReturn {
  sortByUserName: SortComparator
  sortByFlag: SortComparator
}

interface SortComparator extends GridComparatorFn<Patient> {
  (patient1: Patient, patient2: Patient): number
}

export const useSortComparatorsHook = (): SortComparatorsHookReturn => {
  const { getUserName } = useUserName()

  const sortByUserName: SortComparator = (patient1, patient2): number => {
    const patient1FullName = getUserName(patient1.profile.firstName, patient1.profile.lastName, patient1.profile.fullName)
    const patient2FullName = getUserName(patient2.profile.firstName, patient2.profile.lastName, patient2.profile.fullName)
    return patient1FullName.localeCompare(patient2FullName)
  }

  const sortByFlag: SortComparator = (patient1: Patient, patient2: Patient): number => {
    const isPatient1Flagged = patient1.metadata.flagged
    const isPatient2Flagged = patient2.metadata.flagged

    if (isPatient1Flagged && !isPatient2Flagged) {
      return -1
    }
    if (!isPatient1Flagged && isPatient2Flagged) {
      return 1
    }
    return 0
  }

  return { sortByUserName, sortByFlag }
}
