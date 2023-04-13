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
import { t } from 'i18next'
import { SimpleStat } from 'dumb'
import Box from '@mui/material/Box'
import { StatFormats } from 'dumb/src/models/stats.model'

interface GlucoseManagementIndicatorProps {
  glucoseManagementIndicator: number
}

export const GlucoseManagementIndicator: FunctionComponent<GlucoseManagementIndicatorProps> = (props) => {
  const { glucoseManagementIndicator } = props
  const annotations = glucoseManagementIndicator ? [t('glucose-management-indicator-tooltip')] : [t('glucose-management-indicator-tooltip'), t('tooltip-empty-stat')]

  return (
    <Box data-testid="glucose-management-indicator-stat">
      <SimpleStat
        annotations={annotations}
        title={t('glucose-management-indicator-title')}
        value={glucoseManagementIndicator}
        summaryFormat={StatFormats.Gmi}
        total={0}
      />
    </Box>)
}