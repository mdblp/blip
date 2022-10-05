import React, { FunctionComponent } from 'react'
import styles from './time-in-range.css'
import { formatDuration } from '../../utils/datetime'

interface TimeInRangeStatsProps {
  id: string
  legendTitle: string
  hoveredStatId: string | null
  onMouseLeave: Function
  onMouseOver: Function
  title: string
  total: number
  value: number
}

export const TimeInRangeStat: FunctionComponent<TimeInRangeStatsProps> = (props: TimeInRangeStatsProps) => {
  const { id, value, total, onMouseLeave, onMouseOver, hoveredStatId, legendTitle, title } = props
  const tooltip = formatDuration(value, { condensed: true })
  const hasValues = total !== 0
  const percentage = hasValues ? Math.round(value / total * 100) : 0
  const isDisabled = !hasValues || (hoveredStatId && hoveredStatId !== id)
  const background = isDisabled ? styles['disabled-rectangle'] : styles[`${id}-background`]
  const label = isDisabled ? styles['disabled-label'] : styles[`${id}-label`]

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const rectangleClasses = `${styles.rectangle} ${background}`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const tooltipClasses = `${styles.tooltip} ${label}`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const percentageClasses = `${styles['percentage-value']} ${label}`

  const handleMouseOver = (): void => {
    if (!isDisabled) {
      onMouseOver(id, title, legendTitle)
    }
  }

  const handleMouseLeave = (): void => {
    if (!isDisabled) {
      onMouseLeave()
    }
  }

  return (
    <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}
         className={styles.stat}>
      <div className={styles.bar} style={{ width: '234px', position: 'relative' }}>
        {hasValues &&
          <div className={rectangleClasses} style={{ width: `${percentage}%` }} />
        }
        <div className={styles.line} style={{ flexGrow: 1 }} />
        <div className={tooltipClasses}>
          {tooltip}
        </div>
      </div>
      {hasValues
        ? (
          <>
            <div className={percentageClasses}>
              {percentage}
            </div>
            <div className={styles['percentage-symbol']}>
              %
            </div>
          </>
          ) : (
          <div className={percentageClasses}>
            --
          </div>
          )
      }
    </div>
  )
}
