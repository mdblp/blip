/**
 * Copyright (c) 2022, Diabeloop
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
import ReactMarkdown from 'react-markdown'

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
  annotations.forEach((message, index) => {
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
