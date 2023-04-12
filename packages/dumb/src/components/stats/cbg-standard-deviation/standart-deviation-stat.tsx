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
import { type BgPrefs, CBGStandardDeviation } from '../../../index'
import Box from '@mui/material/Box'
import { t } from 'i18next'

export interface StandartDeviationProps {
  bgpref: BgPrefs
  averageGlucose: number
  standardDeviation: number
}

export const StandartDeviationStat: FunctionComponent<StandartDeviationProps> = (props) => {
  const { standardDeviation, averageGlucose, bgpref } = props

  const dataFormat = (data: number): number => {
    return Math.round(data)
  }

  const annotation = standardDeviation && averageGlucose ? [t('')] : [t(''), t('')]

  return (
    <Box data-test-id="standart-deviation-stat">
      <CBGStandardDeviation
        annotations={annotation}
        averageGlucose={dataFormat(averageGlucose)}
        bgClasses={bgpref.bgClasses}
        standardDeviation={dataFormat(standardDeviation)}
        title={t('standard-deviation')}
        units={bgpref.bgUnits}
      />
    </Box>
  )
}
