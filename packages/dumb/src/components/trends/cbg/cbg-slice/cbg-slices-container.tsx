/*
 * Copyright (c) 2016-2023, Diabeloop
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

import React, { FunctionComponent, memo, useMemo } from 'react'

import { BgBounds } from '../../../../models/blood-glucose.model'
import { XScale } from '../../../../models/x-scale.model'
import { CbgSlicesContainerData } from '../../../../models/cbg-slices-container-data.model'
import { TrendsDisplayFlags } from '../../../../models/trends-display-flags.model'
import { CbgSliceAnimated } from './cbg-slice-animated'
import { CbgMedianAnimated } from '../cbg-median-animated/cbg-median-animated'
import { formatCbgs } from './cbg-slices-container.util'

interface CbgSlicesContainerProps {
  bgBounds: BgBounds
  sliceWidth: number
  data: CbgSlicesContainerData[]
  displayFlags: TrendsDisplayFlags
  showingCbgDateTraces: boolean
  tooltipLeftThreshold: number
  topMargin: number
  xScale: XScale
  yScale: Function
}

const CbgSlicesContainer: FunctionComponent<CbgSlicesContainerProps> = (props) => {
  const {
    bgBounds,
    data,
    displayFlags,
    showingCbgDateTraces,
    sliceWidth,
    tooltipLeftThreshold,
    topMargin,
    xScale,
    yScale
  } = props

  const cbgs = useMemo(() => formatCbgs(data), [data])

  return (
    <>
      {cbgs.map(cbg => (
        <g key={cbg.id} data-testid="cbg-slice-segments">
          <CbgSliceAnimated
            datum={cbg}
            displayFlags={displayFlags}
            showingCbgDateTraces={showingCbgDateTraces}
            sliceWidth={sliceWidth}
            tooltipLeftThreshold={tooltipLeftThreshold}
            topMargin={topMargin}
            xScale={xScale}
            yScale={yScale}
          />
          {displayFlags.cbgMedianEnabled &&
            <CbgMedianAnimated
              bgBounds={bgBounds}
              median={cbg.median}
              msX={cbg.msX}
              showingCbgDateTraces={showingCbgDateTraces}
              xScale={xScale}
              yScale={yScale}
              sliceWidth={sliceWidth}
            />
          }
        </g>
      ))}
    </>
  )
}

export const CbgSlicesContainerMemoized = memo(CbgSlicesContainer)
