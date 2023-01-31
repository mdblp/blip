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

import React, { FunctionComponent } from 'react'
import { formatBgValue } from '../../../../utils/format/format.util'
import { BgPrefs } from '../../../../models/blood-glucose.model'
import { ScaleFunction } from '../../../../models/scale-function.model'
import trendsStyles from '../../../../styles/trends-common.css'
import typographyStyles from '../../../../styles/typography.css'

interface YAxisLabelsAndTicksProps {
  bgPrefs: BgPrefs
  leftMargin: number
  yScale: ScaleFunction
}

const DEFAULT_TEXT_TO_TICK_GAP = 2
const DEFAULT_TICK_WIDTH = 8

export const YAxisLabelsAndTicks: FunctionComponent<YAxisLabelsAndTicksProps> = (props) => {
  const { bgPrefs, leftMargin, yScale } = props
  const bgBounds = bgPrefs.bgBounds

  return (
    <g>
      {
        Object
          .entries(bgBounds)
          .map(([boundKey, boundValue]: [boundKey: string, boundValue: number]) => (
              <g key={boundKey}>
                <text
                  className={`${typographyStyles.axisSize} ${typographyStyles.mediumContrastText} ${typographyStyles.svgRightAnchored} ${typographyStyles.svgVerticalCentered}`}
                  x={leftMargin - DEFAULT_TICK_WIDTH - DEFAULT_TEXT_TO_TICK_GAP}
                  y={yScale(boundValue)}
                >
                  {formatBgValue(boundValue, bgPrefs)}
                </text>
                <line
                  className={trendsStyles.tick}
                  x1={leftMargin - DEFAULT_TICK_WIDTH}
                  x2={leftMargin}
                  y1={yScale(boundValue)}
                  y2={yScale(boundValue)}
                />
              </g>
            )
          )
      }
    </g>
  )
}
