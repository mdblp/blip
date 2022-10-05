import React, { FunctionComponent, useRef, useState } from 'react'
import { TimeInRangeStat } from './time-in-range-stat'
import styles from './time-in-range.css'
import InfoIcon from './assets/info-outline-24-px.svg'
import { StatTooltip } from '../tooltips/stat-tooltip'
import { useTranslation } from 'react-i18next'

interface TimeInRangeData {
  id: string
  legendTitle: string
  title: string
  value: number
}

interface TimeInRangeStatsProps {
  annotations: []
  data: TimeInRangeData[]
  total: number
  titleKey: string
}

export const TimeInRangeStats: FunctionComponent<TimeInRangeStatsProps> = (props: TimeInRangeStatsProps) => {
  const { annotations, data, titleKey, total } = props
  const { t } = useTranslation('main')
  const timeInRangeLabel = t(titleKey)

  const [hoveredStatId, setHoveredStatId] = useState<string | null>(null)
  const [title, setTitle] = useState<string>(timeInRangeLabel)
  const [legendTitle, setLegendTitle] = useState<string>('')
  const [showTooltipIcon, setshowTooltipIcon] = useState<boolean>(true)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const elementRef = useRef<HTMLImageElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const getTimeInRange = (id: string): TimeInRangeData => {
    const tir = data.find(timeInRange => timeInRange.id === id)
    if (!tir) {
      throw Error(`Could not find stat with id ${id}`)
    }
    return tir
  }

  const veryHighTir = getTimeInRange('veryHigh')
  const highTir = getTimeInRange('high')
  const targetTir = getTimeInRange('target')
  const lowTir = getTimeInRange('low')
  const veryLowTir = getTimeInRange('veryLow')

  const onStatMouseover = (id: string, title: string, legendTitle: string): void => {
    setTitle(`${title}`)
    setLegendTitle(legendTitle)
    setHoveredStatId(id)
    setshowTooltipIcon(false)
  }

  const onStatMouseLeave = (): void => {
    setTitle(timeInRangeLabel)
    setLegendTitle('')
    setHoveredStatId(null)
    setshowTooltipIcon(true)
  }

  const onTooltipMouseover = (): void => {
    setShowTooltip(true)
  }

  const onTooltipMouseLeave = (): void => {
    setShowTooltip(false)
  }

  return (
    <>
      <div
        data-testid="time-in-range-stat-title"
        className={styles.title}
        ref={parentRef}
      >
        {title}
        {hoveredStatId &&
          <span className={styles.legendTitle}>
            {' ( '}
            <span className={styles[`${hoveredStatId}-label`]}>
            {legendTitle}
          </span>
            {' )'}
          </span>
        }
        {showTooltipIcon && <span
          className={styles.tooltipIcon}
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
          <div className={styles.StatTooltipWrapper}>
            <StatTooltip
              annotations={annotations}
              parentRef={parentRef.current}
              tooltipRef={elementRef.current}
            />
          </div>
        }
      </div>
      <div className={styles.stats}>
        <TimeInRangeStat
          total={total}
          hoveredStatId={hoveredStatId}
          onMouseLeave={onStatMouseLeave}
          onMouseOver={onStatMouseover}
          {...veryHighTir}
        />
        <TimeInRangeStat
          total={total}
          hoveredStatId={hoveredStatId}
          onMouseLeave={onStatMouseLeave}
          onMouseOver={onStatMouseover}
          {...highTir}
        />
        <TimeInRangeStat
          total={total}
          hoveredStatId={hoveredStatId}
          onMouseLeave={onStatMouseLeave}
          onMouseOver={onStatMouseover}
          {...targetTir}
        />
        <TimeInRangeStat
          total={total}
          hoveredStatId={hoveredStatId}
          onMouseLeave={onStatMouseLeave}
          onMouseOver={onStatMouseover}
          {...lowTir}
        />
        <TimeInRangeStat
          total={total}
          hoveredStatId={hoveredStatId}
          onMouseLeave={onStatMouseLeave}
          onMouseOver={onStatMouseover}
          {...veryLowTir}
        />
      </div>
    </>
  )
}
