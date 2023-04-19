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
import { type BgPrefs, CBGStandardDeviation } from 'dumb'
import { t } from 'i18next'
import { type BgType, DatumType } from 'medical-domain'

export interface StandardDeviationProps {
  bgPrefs: BgPrefs
  bgType: BgType
  averageGlucose: number
  standardDeviation: number
  total: number
}

export const StandardDeviationStat: FunctionComponent<StandardDeviationProps> = (props) => {
  const { standardDeviation, averageGlucose, total, bgPrefs, bgType } = props

  const getAnnotations = (bgType: string): string[] => {
    const annotations = [t('standard-deviation-tooltip')]
    if (!standardDeviation || !averageGlucose) {
      annotations.push(t('tooltip-empty-stat'))
      return annotations
    }
    if (bgType === DatumType.Smbg) {
      annotations.push(t('tooltip-smbg-data', { total, smbgLabel: t('BGM') }))
    }
    return annotations
  }

  return (
      <CBGStandardDeviation
        annotations={getAnnotations(bgType)}
        averageGlucose={Math.round(averageGlucose)}
        bgClasses={bgPrefs.bgClasses}
        standardDeviation={Math.round(standardDeviation)}
        title={t('standard-deviation')}
        units={bgPrefs.bgUnits}
      />
  )
}
