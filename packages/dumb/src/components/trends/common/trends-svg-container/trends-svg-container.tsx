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

import React, { type FunctionComponent, useMemo } from 'react'
import sizeMe from 'react-sizeme'
import { scaleLinear } from 'd3-scale'
import { TimeService } from 'medical-domain'

import { type RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'
import { NoDataLabel } from '../no-data-label/no-data-label'
import { CbgDateTracesAnimationContainer } from '../../cbg/cbg-date-trace/cbg-date-traces-animation-container'
import { type CbgDateTrace } from '../../../../models/cbg-date-trace.model'
import { THREE_HRS } from '../../../../utils/datetime/datetime.util'
import { getCbgsIntersectingWithCbgSliceSegment } from './trends-svg-container.util'
import { type BgPrefs } from '../../../../models/blood-glucose.model'
import { Background } from '../background/background'
import { XAxisLabels } from '../x-axis-labels/x-axis-labels'
import { XAxisTicks } from '../x-axis-ticks/x-axis-ticks'
import { YAxisLabelsAndTicks } from '../y-axis-labels-and-ticks/y-axis-labels-and-ticks'
import { CbgSlicesContainerMemoized as CbgSlicesContainer } from '../../cbg/cbg-slice/cbg-slices-container'
import { FocusedCbgSliceSegmentMemoized as FocusedCbgSliceSegment } from '../../cbg/cbg-slice/focused-cbg-slice-segment'
import { TargetRangeLines } from '../target-range-lines/target-range-lines'
import { type FocusedSlice } from '../../../../models/focused-slice.model'

const BUMPERS = {
  top: 50,
  bottom: 30
}

const MARGINS = {
  top: 30,
  right: 10,
  bottom: 10,
  left: 40
}

const SMBG_OPTS = {
  maxR: 7.5,
  r: 6
}

const CHART_WIDTH_M_SIZE = 70
const TOOLTIP_LEFT_THRESHOLD = 6 * THREE_HRS
const WIDTH = 640
const HEIGHT = 480

interface TrendsSvgContainerProps {
  activeDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  bgPrefs: BgPrefs
  cbgData: CbgDateTrace[]
  dates: string[]
  focusedSlice: FocusedSlice
  focusedSliceKeys: RangeSegmentSlice[]
  onSelectDate: (epoch: number) => void
  showingCbgDateTraces: boolean
  yScaleDomain: number[]
  size: { width: number, height: number }
}

const TrendsSvgContainer: FunctionComponent<TrendsSvgContainerProps> = ({
  size = { width: WIDTH, height: HEIGHT },
  ...props
}
) => {
  const {
    yScaleDomain,
    showingCbgDateTraces,
    cbgData,
    focusedSlice,
    focusedSliceKeys,
    activeDays,
    bgPrefs,
    onSelectDate
  } = props

  const { height, width } = size

  const sliceWidth = (width - CHART_WIDTH_M_SIZE) / 56

  const xScale = useMemo(() => scaleLinear().domain([0, TimeService.MS_IN_DAY]).range([
    MARGINS.left + Math.round(SMBG_OPTS.maxR),
    width - MARGINS.right - Math.round(SMBG_OPTS.maxR)
  ]), [width])

  const yScale = useMemo(() => scaleLinear().domain(yScaleDomain).clamp(true).range([
    height - MARGINS.bottom - BUMPERS.bottom,
    MARGINS.top + BUMPERS.top
  ]), [height, yScaleDomain])

  const focusedSegmentDataGroupedByDate = useMemo(() => {
    if (showingCbgDateTraces && focusedSlice && focusedSliceKeys) {
      return getCbgsIntersectingWithCbgSliceSegment(cbgData, focusedSlice.data, focusedSliceKeys)
    }
    return null
  }, [cbgData, focusedSlice, focusedSliceKeys, showingCbgDateTraces])

  const noData = useMemo(() => {
    if (cbgData.length > 0) {
      return null
    }
    const xPos = (width / 2) + MARGINS.right
    const yPos = (height / 2) + MARGINS.bottom
    const messagePosition = { x: xPos, y: yPos }
    const unselectedAll = Object.values(activeDays).every(flag => !flag)
    return { messagePosition, unselectedAll }
  }, [activeDays, cbgData.length, height, width])

  return (
    <div>
      <svg height={height} width="100%">
        <Background
          margins={MARGINS}
          svgDimensions={{ height, width }}
          xScale={xScale}
        />
        <XAxisLabels
          topMargin={MARGINS.top}
          xScale={xScale}
        />
        <XAxisTicks
          topMargin={MARGINS.top}
          xScale={xScale}
        />
        <YAxisLabelsAndTicks
          bgPrefs={bgPrefs}
          leftMargin={MARGINS.left}
          yScale={yScale}
        />
        <g>
          <CbgSlicesContainer
            bgBounds={bgPrefs.bgBounds}
            sliceWidth={sliceWidth}
            data={cbgData}
            showingCbgDateTraces={showingCbgDateTraces}
            tooltipLeftThreshold={TOOLTIP_LEFT_THRESHOLD}
            topMargin={MARGINS.top}
            xScale={xScale}
            yScale={yScale}
          />
          {focusedSegmentDataGroupedByDate &&
            <CbgDateTracesAnimationContainer
              bgBounds={bgPrefs.bgBounds}
              data={focusedSegmentDataGroupedByDate}
              onSelectDate={onSelectDate}
              topMargin={MARGINS.top}
              xScale={xScale}
              yScale={yScale}
            />
          }
          {focusedSlice &&
            <FocusedCbgSliceSegment
              leftPosition={focusedSlice.position.left}
              segmentSliceBottom={focusedSliceKeys[0]}
              segmentSliceTop={focusedSliceKeys[1]}
              segmentsPosition={focusedSlice.position.yPositions}
              sliceWidth={sliceWidth}
            />
          }
        </g>
        <TargetRangeLines
          upperBound={bgPrefs.bgBounds.targetUpperBound}
          lowerBound={bgPrefs.bgBounds.targetLowerBound}
          horizontalOffset={SMBG_OPTS.maxR}
          xScale={xScale}
          yScale={yScale}
        />
        {noData &&
          <NoDataLabel
            position={noData.messagePosition}
            isNoDataSelected={noData.unselectedAll}
          />
        }
      </svg>
    </div>
  )
}

export const TrendsSvgContainerSized = sizeMe({ monitorHeight: true })(TrendsSvgContainer)
