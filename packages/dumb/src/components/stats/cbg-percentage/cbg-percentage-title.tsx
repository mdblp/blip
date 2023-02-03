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

import React, { FunctionComponent } from 'react'
import styles from './cbg-percentage-title.css'
import cbgColorsStyles from '../common/cbg-colors.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { StatLevel } from '../../../models/stats.model'

interface CBGPercentageTitleProps {
  annotations: string[]
  hoveredStatId: StatLevel | null
  legendTitle: string
  title: string
}

const CBGPercentageTitle: FunctionComponent<CBGPercentageTitleProps> = (props) => {
  const { annotations, hoveredStatId, legendTitle, title } = props

  return (
    <>
      <div
        data-testid="cbg-percentage-title"
        className={styles.title}
      >
        {title}
        {hoveredStatId &&
          <span className={styles['legend-title']}>
            {' ( '}
            <span className={cbgColorsStyles[`${hoveredStatId}-color`]}>
            {legendTitle}
          </span>
            {' )'}
          </span>
        }
        <StatTooltip annotations={annotations} />
      </div>
    </>
  )
}

export const CbgPercentageTitleMemoized = React.memo(CBGPercentageTitle)
