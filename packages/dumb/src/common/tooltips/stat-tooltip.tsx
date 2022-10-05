/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import React, { FunctionComponent } from 'react'
import ReactMarkdown from 'react-markdown'
import _ from 'lodash'

import colors from '../../styles/colors.css'
import styles from './stat-tooltip.css'
import Tooltip from './tooltip'

interface StatTooltipProps {
  annotations: []
  title?: string
  tail?: boolean
  tailWidth?: number
  tailHeight?: number
  parentRef: HTMLDivElement
  tooltipRef: HTMLImageElement
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

export const StatTooltip: FunctionComponent<StatTooltipProps> = (
  {
    annotations = [],
    tail = true,
    tailWidth = 9,
    tailHeight = 17,
    borderColor = colors.statDefault,
    borderWidth = 2,
    ...props
  }) => {
  const {
    title,
    backgroundColor,
    parentRef,
    tooltipRef
  } = props

  const { top, left, width, height } = tooltipRef.getBoundingClientRect()
  const {
    top: parentTop,
    left: parentLeft,
    height: parentHeight
  } = parentRef.getBoundingClientRect()

  const position = {
    top: (top - parentTop) + height / 2,
    left: (left - parentLeft) + width / 2
  }

  const offset = {
    horizontal: width / 2,
    top: -parentHeight
  }

  const side = ((document.body.clientWidth ?? 0) - left < 225) ? 'left' : 'right'

  const rows: JSX.Element[] = []
  _.forEach(annotations, (message, index) => {
    rows.push(
      <ReactMarkdown key={`message-${index}`} className={styles.message} linkTarget="_blank">
        {message}
      </ReactMarkdown>
    )
    if (index !== annotations.length - 1) {
      rows.push(
        <div
          key={`divider-${index}`}
          className={styles.divider}
        />
      )
    }
  })

  return (
    <Tooltip
      tail={tail}
      side={side}
      tailWidth={tailWidth}
      tailHeight={tailHeight}
      borderColor={borderColor}
      borderWidth={borderWidth}
      position={position}
      offset={offset}
      title={title}
      backgroundColor={backgroundColor}
      content={<div className={styles.container}>{rows}</div>}
    />
  )
}
