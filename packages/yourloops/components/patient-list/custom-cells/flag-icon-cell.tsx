/*
 * Copyright (c) 2023-2026, Diabeloop
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

import { type FunctionComponent } from 'react'
import { useAuth } from '../../../lib/auth'
import { useTranslation } from 'react-i18next'
import IconActionButton from '../../buttons/icon-action'
import FlagIcon from '@mui/icons-material/Flag'
import FlagOutlineIcon from '@mui/icons-material/FlagOutlined'
import { type Patient } from '../../../lib/patient/models/patient.model'
import React from 'react'

interface FlagCellProps {
  isFlagged: boolean
  patient: Patient
}

export const FlagIconCell: FunctionComponent<FlagCellProps> = ({ isFlagged, patient }) => {
  const { flagPatient } = useAuth()
  const { t } = useTranslation()
  const flagPatientLabel = t('flag-patient', { patientEmail: patient.profile.email })
  const unflagPatientLabel = t('unflag-patient', { patientEmail: patient.profile.email })

  const onClickFlag = async (): Promise<void> => {
    await flagPatient(patient.userid)
  }

  return (
    <IconActionButton
      icon={isFlagged
        ? <FlagIcon
          titleAccess={unflagPatientLabel}
          aria-label={unflagPatientLabel}
        />
        : <FlagOutlineIcon
          titleAccess={flagPatientLabel}
          aria-label={flagPatientLabel}
        />}
      color="inherit"
      onClick={onClickFlag}
    />
  )
}

