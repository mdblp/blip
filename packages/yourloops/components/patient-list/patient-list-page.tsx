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

import React, { type FunctionComponent } from 'react'
import { PatientListHeader } from './patient-list-header'
import { usePatientListHook } from './patient-list.hook'
import { PatientListTabs } from './models/enums/patient-list.enum'
import { GlobalStyles } from 'tss-react'
import { useTheme } from '@mui/material/styles'
import { MedicalTeamPatientList } from './current-patient-list/medical-team-patient-list/medical-team-patient-list'
import { PendingPatientList } from './pending-patient-list/pending-patient-list'
import { setPageTitle } from '../../lib/utils'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/auth'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import TeamUtils from '../../lib/team/team.util'
import {
  PrivateTeamOrCaregiverPatientList
} from './current-patient-list/private-team-or-caregiver-patient-list/private-team-or-caregiver-patient-list'

export const PatientListPage: FunctionComponent = () => {
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { selectedTeam } = useSelectedTeamContext()
  const {
    selectedTab,
    inputSearch,
    patients,
    onChangingTab,
    setInputSearch
  } = usePatientListHook()

  const isCaregiverUserOrPrivateTeam = user.isUserCaregiver() || TeamUtils.isPrivate(selectedTeam)

  setPageTitle(t('header-tab-patients'))

  return (
    <React.Fragment>
      <GlobalStyles styles={{ body: { backgroundColor: theme.palette.common.white } }} />
      <PatientListHeader
        selectedTab={selectedTab}
        inputSearch={inputSearch}
        patientsDisplayedCount={patients.length}
        onChangingTab={onChangingTab}
        setInputSearch={setInputSearch}
      />

      {selectedTab === PatientListTabs.Current && isCaregiverUserOrPrivateTeam &&
        <PrivateTeamOrCaregiverPatientList patients={patients} />
      }
      {selectedTab === PatientListTabs.Current && !isCaregiverUserOrPrivateTeam &&
        <MedicalTeamPatientList patients={patients} />
      }
      {selectedTab === PatientListTabs.Pending &&
        <PendingPatientList patients={patients} />
      }
    </React.Fragment>
  )
}
