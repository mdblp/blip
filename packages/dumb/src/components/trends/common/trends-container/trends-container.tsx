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
import { TrendsSvgContainerSized as TrendsSvgContainer } from '../trends-svg-container/trends-svg-container'
import { type BgPrefs } from '../../../../models/blood-glucose.model'
import type MedicalDataService from 'medical-domain'
import { type Cbg, DatumType, Unit } from 'medical-domain'
import { type RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'
import { type BgPositionData } from '../../../../models/bg-position-data.model'
import { type FocusedSlice } from '../../../../models/focused-slice.model'
import { type OnSelectDateFunction } from '../../../../models/on-select-date-function.model'
import { extent } from 'd3-array'
import { connect } from 'react-redux'
import _ from 'lodash'
import { type ActiveDays } from '../../../../models/active-days.model'

interface SmbgPosition { top: number, left: number }

interface SmbgValue { value: number }

interface TrendsState {
  focusedCbgSlice: FocusedSlice
  focusedCbgSliceKeys: RangeSegmentSlice[]
  focusedSmbg: {
    allPositions: SmbgPosition
    allSmbgsOnDate: SmbgValue[]
    date: string
    datum: SmbgValue
    position: SmbgPosition
  }
  focusedSmbgRangeAvg: {
    data: {
      id: string
      max: number
      mean: number
      min: number
      msX: number
      msFrom: number
      msTo: number
    }
    position: BgPositionData
  }
  showingCbgDateTraces: boolean
}

interface TrendsContainerProps {
  currentCbgData: []
  days: string[]
  activeDays: ActiveDays
  bgPrefs: BgPrefs
  tidelineData: MedicalDataService
  onSelectDate: OnSelectDateFunction
  trendsState: TrendsState
  // Only for redux
  currentPatientInViewId: string
}

const MGDL_CLAMP_TOP = 400
const MMOLL_CLAMP_TOP = 22.5

const TrendsContainer: FunctionComponent<TrendsContainerProps> = (props) => {
  const {
    currentCbgData,
    days,
    activeDays,
    bgPrefs,
    tidelineData,
    onSelectDate,
    trendsState
  } = props

  const yScaleClampTop = {
    [Unit.MilligramPerDeciliter]: MGDL_CLAMP_TOP,
    [Unit.MmolPerLiter]: MMOLL_CLAMP_TOP
  }
  const upperBound = yScaleClampTop[bgPrefs.bgUnits]
  // FIXME The `MedicalDataService.grouped` getter should be improved to allow stricter typing
  // (e.g. passing a generic return type when wanting to access only one `DatumType` in particular)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const bgDomain = extent(tidelineData.grouped[DatumType.Cbg] as Cbg[], (datum: Cbg) => datum.value)
  const veryLowThreshold = bgPrefs.bgBounds?.veryLowThreshold ?? 0
  const lowerBound = bgDomain[0] && bgDomain[0] > veryLowThreshold ? veryLowThreshold : bgDomain[0] ?? 0
  const yScaleDomain = [lowerBound, upperBound]

  return (
    <TrendsSvgContainer
      activeDays={activeDays}
      bgPrefs={bgPrefs}
      cbgData={currentCbgData}
      dates={days}
      focusedSlice={trendsState.focusedCbgSlice}
      focusedSliceKeys={trendsState.focusedCbgSliceKeys}
      showingCbgDateTraces={trendsState.showingCbgDateTraces || false}
      onSelectDate={(date: number) => {
        onSelectDate(date)
      }}
      yScaleDomain={yScaleDomain}
    />
  )
}

const mapStateToProps = (state: { viz: { trends: Record<string, TrendsState> } }, componentProps: TrendsContainerProps): { trendsState: TrendsState } => {
  const userId = componentProps.currentPatientInViewId
  return { trendsState: state.viz.trends[userId] } ?? {}
}

export default connect(mapStateToProps, null, (stateProps, dispatchProps, ownProps: TrendsContainerProps) => (_.assign({}, ownProps, stateProps, dispatchProps)), { forwardRef: true })(TrendsContainer)
