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
import styles from './cbg-standard-deviation.css'
import stylesCbgCommon from '../cbg-common.css'
import { Box } from '@material-ui/core'
import InfoIcon from '../assets/info-outline-24-px.svg'
import { useTranslation } from 'react-i18next'
import { StatTooltip } from '../../tooltips/stat-tooltip'
import { computeCBGStyle } from '../cbg-utils'

export interface CBGStandardDeviationProps {
  annotations: string[]
  averageGlucose: number
  hideTooltip: boolean
  standardDeviation: number
  title: string
  units: string
}

const CbgStandardDeviation: FunctionComponent<CBGStandardDeviationProps> = (props) => {
  const { annotations, averageGlucose, hideTooltip, standardDeviation, title, units } = props
  const { t } = useTranslation('main')

  const standardDeviationMin = averageGlucose - standardDeviation
  const standardDeviationMax = averageGlucose + standardDeviation

  const valueBasedStyles = {
    min: computeCBGStyle(standardDeviationMin),
    max: computeCBGStyle(standardDeviationMax)
  }

  return (
    <Box
      data-testid="cbg-standard-deviation-stat"
      marginLeft="4px"
      marginRight="4px"
    >
      <Box display="flex" justifyContent="space-between" marginTop="4px">
        <Box display="flex">
          {title}
          {!Number.isNaN(standardDeviation) && !hideTooltip &&
            <>
              &nbsp;
              <span className={styles['title-value']}>
                (
                <span className={`${valueBasedStyles.min.color} ${styles.spacing}`}>{standardDeviationMin}</span>
                -
                <span className={`${valueBasedStyles.max.color} ${styles.spacing}`}>{standardDeviationMax}</span>
                )
              </span>
            </>
          }
          {!hideTooltip &&
            <StatTooltip annotations={annotations}>
              <span className={stylesCbgCommon['tooltip-icon']}>
                <img
                  data-testid="info-icon"
                  src={InfoIcon}
                  alt={t('img-alt-hover-for-more-info')}
                />
              </span>
            </StatTooltip>
          }
        </Box>
        <Box fontSize="12px">
          {units}
        </Box>
      </Box>
      <Box display="flex" marginLeft="6px" marginTop="4px">
        {Number.isNaN(standardDeviation) ? (
          <>
            <div className={stylesCbgCommon['disabled-line']} />
            <Box className={stylesCbgCommon['disabled-label']} fontSize="24px" marginLeft="auto" marginRight="4px">
              --
            </Box>
          </>
        ) : (
          <>
            <div className={stylesCbgCommon.lines}>
              <div className={`${stylesCbgCommon.line} ${stylesCbgCommon['line-low']}`} />
              <div className={`${stylesCbgCommon.line} ${stylesCbgCommon['line-target']}`} />
              <div className={`${stylesCbgCommon.line} ${stylesCbgCommon['line-high']}`} />
              <div
                className={`${styles['horizontal-line']} ${valueBasedStyles.min.backgroundColor}`}
                style={{ left: valueBasedStyles.min.left }}
              />
              <div
                className={`${styles['horizontal-line']} ${valueBasedStyles.max.backgroundColor}`}
                style={{ left: valueBasedStyles.max.left }}
              />
            </div>
            <Box className={styles.value} fontSize="24px" marginLeft="auto" marginRight="4px">
              {standardDeviation}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export const CbgStandardDeviationMemoized = React.memo(CbgStandardDeviation)
