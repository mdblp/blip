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

import React, { FunctionComponent, useRef, useState } from 'react'
import styles from './time-in-range-stats-title.css'
import cbgTimeStatStyles from './cbg-time-stat.css'
import InfoIcon from './assets/info-outline-24-px.svg'
import { StatTooltip } from '../tooltips/stat-tooltip'
import { useTranslation } from 'react-i18next'
import { StatLevel } from './time-in-range-stats'

interface TimeInRangeStatsTitleProps {
  annotations: []
  hoveredStatId: StatLevel | null
  legendTitle: string
  showTooltipIcon: boolean
  title: string
}

const TimeInRangeStatsTitle: FunctionComponent<TimeInRangeStatsTitleProps> = (props: TimeInRangeStatsTitleProps) => {
  const { annotations, hoveredStatId, legendTitle, showTooltipIcon, title } = props
  const { t } = useTranslation('main')

  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const elementRef = useRef<HTMLImageElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const onTooltipMouseover = (): void => {
    setShowTooltip(true)
  }

  const onTooltipMouseLeave = (): void => {
    setShowTooltip(false)
  }
  return (
    <>
      <div
        data-testid="time-in-range-stats-title"
        className={styles.title}
        ref={parentRef}
      >
        {title}
        {hoveredStatId &&
          <span className={styles['legend-title']}>
            {' ( '}
            <span className={cbgTimeStatStyles[`${hoveredStatId}-label`]}>
            {legendTitle}
          </span>
            {' )'}
          </span>
        }
        {showTooltipIcon && <span
          className={styles['tooltip-icon']}
        >
            <img
              data-testid="info-icon"
              src={InfoIcon}
              alt={t('img-alt-hover-for-more-info')}
              ref={elementRef}
              onMouseOver={onTooltipMouseover}
              onMouseOut={onTooltipMouseLeave}
            />
          </span>}
        {showTooltip && elementRef.current && parentRef.current &&
          <div className={styles['stat-tooltip']}>
            <StatTooltip
              annotations={annotations}
              parentRef={parentRef.current}
              tooltipRef={elementRef.current}
            />
          </div>
        }
      </div>
    </>
  )
}

export const TimeInRangeStatsTitleMemoized = React.memo(TimeInRangeStatsTitle)
