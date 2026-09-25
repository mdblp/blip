/*
 * Copyright (c) 2022-2026, Diabeloop
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

import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../../lib/auth'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { DataCard } from '../../../data-card/data-card'
import MedicalReportList from './medical-report-list'

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

  const teamId = user.isUserHcp() ? selectedTeamId : null

  return (
    <DataCard data-testid="medical-files-card" sx={{ padding: 0 }}>
      <Accordion sx={{ boxShadow: 'none', border: 'none' }} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ my: 0 }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 'bold' }}
          >
            {t('medical-files')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MedicalReportList teamId={teamId} patientId={patient.userid} />
        </AccordionDetails>
      </Accordion>
    </DataCard>
  )
}

export default MedicalFilesCard
