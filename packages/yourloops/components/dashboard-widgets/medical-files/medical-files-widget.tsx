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

import AssignmentIcon from '@mui/icons-material/Assignment'
import CardContent from '@mui/material/CardContent'
import MedicalRecordList from './medical-record-list'
import PrescriptionList from './prescription-list'
import PatientUtils from '../../../lib/patient/patient.util'
import { type Patient } from '../../../lib/patient/models/patient.model'
import GenericDashboardCard from '../generic-dashboard-card'

export interface MedicalFilesWidgetProps {
  patient: Patient
}

export interface CategoryProps {
  teamId: string
  patientId: string
}

const MedicalFilesWidget: FunctionComponent<MedicalFilesWidgetProps> = (props) => {
  const { t } = useTranslation()
  const { patient } = props

  const team = PatientUtils.getRemoteMonitoringTeam(patient)

  return (
    <GenericDashboardCard
      avatar={<AssignmentIcon />}
      title={t('medical-files')}
      data-testid="medical-files-card"
    >
      <CardContent>
        <PrescriptionList teamId={team.teamId} patientId={patient.userid} />
        <MedicalRecordList teamId={team.teamId} patientId={patient.userid} />
      </CardContent>
    </GenericDashboardCard>
  )
}

export default MedicalFilesWidget
