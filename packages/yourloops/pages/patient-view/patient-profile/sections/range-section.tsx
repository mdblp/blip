/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { FC, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import { Patient } from '../../../../lib/patient/models/patient.model'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import Divider from '@mui/material/Divider'

interface RangeSectionProps {
  patient: Patient
}

export const MONITORING_Range_SECTION_ID = 'monitoring-Range'

// TODO: ask in review: should we ahve a convention for having Suffix Section
export const RangeSection: FC<RangeSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const { pathname, hash, key } = useLocation()

  const monitoringRangeSection = useRef<HTMLElement>(null)


  useEffect(() => {
    if (hash === '') {
      return
    }

    const sectionId = hash.replace('#', '')
    if (monitoringRangeSection && sectionId === MONITORING_Range_SECTION_ID) {
      monitoringRangeSection.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [pathname, hash, key])


  return (
    <Container data-testid="range-container">
      <Card variant="outlined" sx={{ padding: theme.spacing(2) }}>
        <CardHeader title={t('range')} />
        <CardContent>
          <section
            data-testid="range-configuration-section"
            ref={monitoringRangeSection}
          >
            <Typography
              variant="body2"
              paddingBottom={theme.spacing(2)}
            >
              {t('range-description')}
            </Typography>

          </section>
        </CardContent>
      </Card>
    </Container>
  )
}
