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
import { type ScaleFunction } from '../../../../models/scale-function.model'
import { type BgBounds, ClassificationType } from '../../../../models/blood-glucose.model'
import { getBgClass } from '../../../../utils/blood-glucose/blood-glucose.util'
import styles from './cbg-date-traces-animated.css'
import { type CbgPositionData } from '../../../../models/cbg-position-data.model'
import { bindActionCreators, type Dispatch } from 'redux'
import { connect } from 'react-redux'
import { focusTrendsCbgDateTrace, unfocusTrendsCbgDateTrace } from 'tidepool-viz'
import { type CbgDateTrace } from '../../../../models/cbg-date-trace.model'
import { CBG_CIRCLE_PREFIX_ID } from '../../../../models/constants/cbg.constants'

interface CbgDateTracesAnimatedProps {
  bgBounds: BgBounds
  data: CbgDateTrace[]
  onSelectDate: (epoch: number) => void
  topMargin: number
  xScale: ScaleFunction
  yScale: ScaleFunction
  // Added via redux
  userId: string
  focusDateTrace: (userId: string, dateTrace: CbgDateTrace, position: CbgPositionData) => void
  unfocusDateTrace: (userId: string) => void
}

const CBG_RADIUS = 2.5

const CbgDateTracesAnimated: FunctionComponent<CbgDateTracesAnimatedProps> = (props) => {
  const { userId, bgBounds, data, focusDateTrace, onSelectDate, topMargin, unfocusDateTrace, xScale, yScale } = props

  const handleClick = (dateTrace: CbgDateTrace): void => {
    if (dateTrace.epoch) {
      onSelectDate(dateTrace.epoch)
    }
  }

  const handleMouseOut = (): void => {
    unfocusDateTrace(userId)
  }

  return (
    <g>
      {data.map((dateTrace: CbgDateTrace) => (
        <circle
          className={styles[getBgClass(bgBounds, dateTrace.value, ClassificationType.FiveWay)]}
          cx={xScale(dateTrace.msPer24)}
          cy={yScale(dateTrace.value)}
          id={`${CBG_CIRCLE_PREFIX_ID}-${dateTrace.id}`}
          data-testid="trends-cbg-circle"
          key={dateTrace.id}
          onClick={() => { handleClick(dateTrace) }}
          onMouseOver={() => {
            focusDateTrace(userId, dateTrace, {
              left: xScale(dateTrace.msPer24),
              yPositions: {
                top: yScale(dateTrace.value),
                topMargin
              }
            })
          }}
          onMouseOut={handleMouseOut}
          opacity={1}
          r={CBG_RADIUS}
        />
      ))}
    </g>
  )
}

const mapStateToProps = (state: { blip: { currentPatientInViewId: string } }): { userId: string } => {
  const { blip: { currentPatientInViewId } } = state
  return {
    userId: currentPatientInViewId
  }
}

const mapDispatchToProps = (dispatch: Dispatch): { unfocusDateTrace: typeof unfocusTrendsCbgDateTrace, focusDateTrace: typeof focusTrendsCbgDateTrace } => {
  return bindActionCreators({
    focusDateTrace: focusTrendsCbgDateTrace,
    unfocusDateTrace: unfocusTrendsCbgDateTrace
  }, dispatch)
}

// This workaround to avoid type error on `null` will be removed when redux is removed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(CbgDateTracesAnimated)
