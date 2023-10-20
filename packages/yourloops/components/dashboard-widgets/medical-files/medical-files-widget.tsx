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

import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import CardContent from '@mui/material/CardContent'
import MedicalReportList from './medical-report-list'
import { type Patient } from '../../../lib/patient/models/patient.model'
import GenericDashboardCard from '../generic-dashboard-card'
import { useSelectedTeamContext } from '../../../lib/selected-team/selected-team.provider'
import { useAuth } from '../../../lib/auth'

export interface MedicalFilesWidgetProps {
  patient: Patient
}

export interface CategoryProps {
  teamId?: string
  patientId: string
}

const MedicalFilesWidget: FunctionComponent<MedicalFilesWidgetProps> = (props) => {
  const { t } = useTranslation()
  const { patient } = props
  const { selectedTeam } = useSelectedTeamContext()
  const { user } = useAuth()

  const teamId = user.isUserHcp() ? selectedTeam.id : null

  return (
    <GenericDashboardCard
      title={t('medical-files')}
      data-testid="medical-files-card"
    >
      <CardContent>
        <MedicalReportList teamId={teamId} patientId={patient.userid} />
      </CardContent>
    </GenericDashboardCard>
  )
}

export default MedicalFilesWidget
