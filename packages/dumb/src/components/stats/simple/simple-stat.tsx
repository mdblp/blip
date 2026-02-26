/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FunctionComponent, memo, useMemo } from 'react'
import styles from './simple-stat.css'
import commonStyles from '../../../styles/stat-common.css'
import { SimpleValue } from '../common/simple-value'
import { type StatFormats } from '../../../models/stats.model'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { buildSimpleValueProps } from './simple-stat.util'

interface SimpleStatProps {
  annotations: string[]
  summaryFormat: StatFormats
  title: string
  total: number
  value: number | string
}

const SimpleStat: FunctionComponent<SimpleStatProps> = (props) => {
  const {
    annotations,
    summaryFormat,
    title,
    total,
    value
  } = props

  const simpleValueProps = useMemo(() => {
    return buildSimpleValueProps(summaryFormat, total, Number(value))
  }, [summaryFormat, total, value])

  return (
    <div className={styles.statWrapper}>
      <div className={commonStyles.stat}>
        <div className={commonStyles.statHeader}>
          <div className={commonStyles.chartTitle}>
            {title}
            {annotations &&
              <StatTooltip annotations={annotations} />
            }
          </div>
          <SimpleValue {...simpleValueProps} />
        </div>
      </div>
    </div>
  )
}

export const SimpleStatMemoized = memo(SimpleStat)
