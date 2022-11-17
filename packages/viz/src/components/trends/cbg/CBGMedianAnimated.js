/*
 * Copyright (c) 2017-2022, Diabeloop
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
import _ from 'lodash'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TransitionMotion, spring } from '@serprex/react-motion'

import { classifyBgValue } from '../../../utils/bloodglucose'
import { springConfig } from '../../../utils/constants'
import withDefaultYPosition from '../common/withDefaultYPosition'

import styles from './CBGMedianAnimated.css'

export class CBGMedianAnimated extends PureComponent {
  static defaultProps = {
    sliceWidth: 16
  }

  static propTypes = {
    bgBounds: PropTypes.shape({
      veryHighThreshold: PropTypes.number.isRequired,
      targetUpperBound: PropTypes.number.isRequired,
      targetLowerBound: PropTypes.number.isRequired,
      veryLowThreshold: PropTypes.number.isRequired
    }).isRequired,
    datum: PropTypes.shape({
      firstQuartile: PropTypes.number,
      id: PropTypes.string.isRequired,
      max: PropTypes.number,
      median: PropTypes.number,
      min: PropTypes.number,
      msFrom: PropTypes.number.isRequired,
      msTo: PropTypes.number.isRequired,
      msX: PropTypes.number.isRequired,
      ninetiethQuantile: PropTypes.number,
      tenthQuantile: PropTypes.number,
      thirdQuartile: PropTypes.number
    }).isRequired,
    defaultY: PropTypes.number.isRequired,
    displayingMedian: PropTypes.bool.isRequired,
    showingCbgDateTraces: PropTypes.bool.isRequired,
    sliceWidth: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.willEnter = this.willEnter.bind(this)
    this.willLeave = this.willLeave.bind(this)
  }

  willEnter() {
    const { defaultY } = this.props

    return {
      height: 0,
      median: defaultY,
      opacity: 0
    }
  }

  willLeave() {
    const { defaultY } = this.props
    const shrinkOut = spring(0, springConfig)
    return {
      height: shrinkOut,
      median: spring(defaultY, springConfig),
      opacity: shrinkOut
    }
  }

  render() {
    const {
      bgBounds,
      datum,
      defaultY,
      displayingMedian,
      showingCbgDateTraces,
      sliceWidth,
      xScale,
      yScale
    } = this.props

    const medianClasses = datum.median ?
      cx({
        [styles.median]: true,
        [styles[`${classifyBgValue(bgBounds, datum.median, 'fiveWay')}FadeIn`]]: !showingCbgDateTraces,
        [styles[`${classifyBgValue(bgBounds, datum.median, 'fiveWay')}FadeOut`]]: showingCbgDateTraces
      }) :
      cx({
        [styles.median]: true,
        [styles.transparent]: true
      })

    const strokeWidth = sliceWidth / 8
    const medianWidth = sliceWidth - strokeWidth
    const medianHeight = medianWidth * 0.75
    const binLeftX = xScale(datum.msX) - medianWidth / 2 + strokeWidth / 2
    const width = medianWidth - strokeWidth

    const shouldRender = displayingMedian && (_.get(datum, 'median') !== undefined)

    return (
      <TransitionMotion
        defaultStyles={shouldRender ? [{
          key: 'median',
          style: {
            height: 0,
            median: defaultY,
            opacity: 0
          }
        }] : []}
        styles={shouldRender ? [{
          key: 'median',
          style: {
            height: spring(medianHeight, springConfig),
            median: spring(yScale(datum.median) - medianHeight / 2, springConfig),
            opacity: spring(1.0, springConfig)
          }
        }] : []}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {(interpolateds) => {
          if (interpolateds.length === 0) {
            return null
          }
          const { key, style } = interpolateds[0]
          return (
            <rect
              className={medianClasses}
              id={`cbgMedian-${key}`}
              width={width}
              height={style.height}
              x={binLeftX}
              y={style.median}
              opacity={style.opacity}
            />
          )
        }}
      </TransitionMotion>
    )
  }
}

export default withDefaultYPosition(CBGMedianAnimated)
