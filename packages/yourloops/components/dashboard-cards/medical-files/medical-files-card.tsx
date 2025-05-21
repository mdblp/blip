/*
 * Copyright (c) 2022-2025, Diabeloop
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
import MedicalReportList from './medical-report-list'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { useAuth } from '../../../lib/auth'
import { useParams } from 'react-router-dom'
import { DataCard } from '../../data-card/data-card'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

export interface MedicalFilesCardProps {
  patient: Patient
}

export interface CategoryProps {
  teamId?: string
  patientId: string
}

const MedicalFilesCard: FunctionComponent<MedicalFilesCardProps> = (props) => {
  const { t } = useTranslation()
  const { patient } = props
  const { teamId: selectedTeamId } = useParams()
  const { user } = useAuth()
  const theme = useTheme()

  const teamId = user.isUserHcp() ? selectedTeamId : null

  return (
    <DataCard data-testid="medical-files-card">
      <Typography sx={{ fontWeight: 'bold', paddingBottom: theme.spacing(1) }}>
        {t('medical-files')}
      </Typography>
      <MedicalReportList teamId={teamId} patientId={patient.userid} />
    </DataCard>
  )
}

export default MedicalFilesCard
