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

import React, { type FunctionComponent } from 'react'
import * as d3 from 'd3'
import { TrendsSvgContainerSized as TrendsSvgContainer } from '../trends-svg-container/trends-svg-container'
import { type BgPrefs } from '../../../../models/blood-glucose.model'
import type MedicalDataService from 'medical-domain'
import { type Cbg, type WeekDaysFilter, Unit } from 'medical-domain'
import { type OnSelectDateFunction } from '../../../../models/on-select-date-function.model'

interface TrendsContainerProps {
  currentCbgData: []
  days: string[]
  activeDays: WeekDaysFilter
  bgPrefs: BgPrefs
  medicalData: MedicalDataService
  onSelectDate: OnSelectDateFunction
}

const MGDL_CLAMP_TOP = 400
const MMOLL_CLAMP_TOP = 22.5

export const TrendsContainer: FunctionComponent<TrendsContainerProps> = (props) => {
  const {
    currentCbgData,
    days,
    activeDays,
    bgPrefs,
    medicalData,
    onSelectDate
  } = props

  const yScaleClampTop = {
    [Unit.MilligramPerDeciliter]: MGDL_CLAMP_TOP,
    [Unit.MmolPerLiter]: MMOLL_CLAMP_TOP
  }
  const upperBound = yScaleClampTop[bgPrefs.bgUnits]
  // The `MedicalDataService.grouped` getter does not allow stricter typing
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  const bgDomain = d3.extent(medicalData.medicalData.cbg, (datum: Cbg) => datum.value)
  const veryLowThreshold = bgPrefs.bgBounds?.veryLowThreshold
  const lowerBound = bgDomain[0] && veryLowThreshold && bgDomain[0] > veryLowThreshold ? veryLowThreshold : bgDomain[0] ?? 0
  const yScaleDomain = [lowerBound, upperBound]

  return (
    <TrendsSvgContainer
      activeDays={activeDays}
      bgPrefs={bgPrefs}
      cbgData={currentCbgData}
      dates={days}
      onSelectDate={(date: number) => {
        onSelectDate(date)
      }}
      yScaleDomain={yScaleDomain}
    />
  )
}
