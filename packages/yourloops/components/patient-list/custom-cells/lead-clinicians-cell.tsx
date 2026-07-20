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

import { AvatarGroup } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { getInitials, sortClinicians } from '../../../lib/auth/user.util'
import { LeadClinician } from '../../../lib/lead-clinicians/models/lead-clinician.model'

interface LeadCliniciansCellProps {
  clinicians: LeadClinician[]
}

export const LeadCliniciansCell: FC<LeadCliniciansCellProps> = (props) => {
  const { clinicians } = props
  const { t } = useTranslation()

  const hasClinicians = clinicians && clinicians.length > 0
  const sortedClinicians = sortClinicians(clinicians)

  return (
    <Box
      data-testid="lead-clinicians-cell"
      sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyItems: 'center' }}
    >
      {hasClinicians
        ? <AvatarGroup>
          {sortedClinicians.map((clinician: LeadClinician) => {
            const clinicianName = clinician.name

            return (
              <Tooltip title={clinicianName} key={clinician.email}>
                <Avatar
                  alt={clinicianName}
                  sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'var(--text-color-secondary)' }}
                  data-testid={`lead-clinician-avatar-${clinician.email}`}
                >
                  {getInitials(clinicianName)}
                </Avatar>
              </Tooltip>
            )
          })
          }
        </AvatarGroup>
        : t('N/A')
      }
    </Box>
  )
}
