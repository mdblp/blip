/*
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
import styles from './stat.css'
import colors from '../../../styles/colors.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'

interface ChartTitleProps {
  annotations: string[]
  emptyDataPlaceholder: string
  title: string
  titleData: { id?: string, value: number | string, suffix: string }
  hideToolTips: boolean
}

export const ChartTitle: FunctionComponent<ChartTitleProps> = (props) => {
  const {
    annotations,
    emptyDataPlaceholder,
    hideToolTips,
    title,
    titleData
  } = props

  console.log(titleData.value)
  return (
    <div className={styles.chartTitle}>
      {title}
      {titleData && titleData.value !== emptyDataPlaceholder && titleData.value !== '' && (
        <span className={styles.chartTitleData}>
            (&nbsp;
          <span
            style={{
              color: titleData.id ? (colors[titleData.id] ?? colors.statDefault) : colors.statDefault
            }}
          >
            {titleData.value}
          </span>
          <span className={styles.chartTitleSuffix}>
            {titleData.suffix}
          </span>
          &nbsp;)
        </span>
      )}
      {!hideToolTips && annotations && (
        <StatTooltip annotations={annotations} />
      )}
    </div>
  )
}
