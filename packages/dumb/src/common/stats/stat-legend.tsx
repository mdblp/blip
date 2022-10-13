import React, { FunctionComponent } from 'react'

import colors from '../../styles/colors.css'
import styles from './stat-legend.css'
import { Box } from '@material-ui/core'

interface StatLegendProps {
  items: Array<{ id: string, legendTitle: string }>
  units: string
}

export const StatLegend: FunctionComponent<StatLegendProps> = (props) => {
  const { items, units } = props

  return (
    <Box data-testid="cbg-percentage-stats-legends" display="flex" marginLeft="8px" marginBottom="8px">
      <ul className={styles['stat-legend']}>
        {items.map(item =>
          <li
            className={styles['stat-legend-item']}
            key={item.id}
            style={{ borderBottomColor: colors[item.id] }}
          >
            <span className={styles['stat-legend-title']}>
              {item.legendTitle}
            </span>
          </li>
        )}
      </ul>
      <Box marginLeft="auto" marginRight="4px" fontSize="12px">
        {units}
      </Box>
    </Box>
  )
}
