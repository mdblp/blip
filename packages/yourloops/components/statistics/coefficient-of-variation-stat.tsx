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
import { SimpleStat, StatFormats } from 'dumb'
import { t } from 'i18next'
import Box from '@mui/material/Box'
import { type BgType, DatumType } from 'medical-domain'

export interface CoefficientOfVariationProps {
  coefficientOfVariation: number
  bgType: BgType
}

export const CoefficientOfVariation: FunctionComponent<CoefficientOfVariationProps> = (props) => {
  const { coefficientOfVariation, bgType } = props
  const annotation = coefficientOfVariation ? [t('coefficient-of-variation-tooltip')] : [t('coefficient-of-variation-tooltip'), t('tooltip-empty-stat')]
  const selectedLabel = bgType === DatumType.Cbg ? t('CGM') : t('BGM')
  return (
    <Box data-testid="coefficient-of-variation-stat">
      <SimpleStat
        annotations={annotation}
        title={t('coefficient-of-variation-with-value', { cbgLabel: selectedLabel })}
        value={coefficientOfVariation}
        summaryFormat={StatFormats.Cv}
        total={0}
      />
    </Box>
  )
}
