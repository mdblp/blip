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

import React, { FunctionComponent, useRef } from 'react'
import { CBGStatType } from './models'
import styles from './cbg-mean-stat.css'
import { Box, Tooltip, withStyles } from '@material-ui/core'
import InfoIcon from './assets/info-outline-24-px.svg'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

export interface CBGMeanStatProps {
  annotations: []
  cbgStatType: CBGStatType
  id: string
  title: string
  units: string
  value: number
}

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'white',
    color: 'var(--stat--default)',
    // maxWidth: 220,
    border: '1px solid rgb(114, 115, 117)',
    fontSize: '12px',
    lineHeight: '20px',
    borderWidth: '2px'
  },
  arrow: {
    transform: 'scale(2.5) translate(-0.3px, 3.0px)'
  }
}))(Tooltip)

export const CBGMeanStat: FunctionComponent<CBGMeanStatProps> = (props: CBGMeanStatProps) => {
  const { annotations, cbgStatType, id, title, units, value } = props
  const { t } = useTranslation('main')

  const elementRef = useRef<HTMLImageElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const getValueStyle = (): string => {
    if (value < 12) {
      return styles.low
    } else if (value > 100) {
      return styles.high
    }
    return styles.target
  }

  const valueStyle = getValueStyle()
  console.log(annotations)

  const computeDotStyle = (): { left: string, color: string } => {
    if (value < 54) {
      return { left: '0', color: styles['low-background'] }
    } else if (value > 250) {
      return { left: '234px', color: styles['high-background'] }
    } else {
      return {
        left: `${((value - 54) * 234) / 196}px`,
        color: value < 180 ? styles['target-background'] : styles['high-background']
      }
    }
  }

  const dotLeft = computeDotStyle()

  return (
    <div>
      <Box
        data-testid={`cbg-stat-${id}-${cbgStatType}`}
        marginLeft="4px"
        marginRight="4px"
      >
        <Box display="flex" justifyContent="space-between">
          <div ref={parentRef}>
            {title}
            <HtmlTooltip arrow placement="top"
                         title={
                           <div className={styles.container}>
                             {annotations.map((message, index) =>
                               <div key={`message-${index}`}>
                                 <ReactMarkdown className={styles.message} linkTarget="_blank">
                                   {message}
                                 </ReactMarkdown>
                                 {index !== annotations.length - 1 &&
                                   <div
                                     key={`divider-${index}`}
                                     className={styles.divider}
                                   />
                                 }
                               </div>
                             )}
                           </div>}>
            <span
              className={styles['tooltip-icon']}
            >
              <img
                data-testid="info-icon"
                src={InfoIcon}
                alt={t('img-alt-hover-for-more-info')}
                ref={elementRef}
              />
          </span>
            </HtmlTooltip>
          </div>
          <Box fontSize="12px">
            {units}
          </Box>
        </Box>
        <Box display="flex" marginLeft="6px">
          <div className={styles.lines}>
            <div className={`${styles.line} ${styles['line-low']}`} />
            <div className={`${styles.line} ${styles['line-target']}`} />
            <div className={`${styles.line} ${styles['line-high']}`} />
            <div className={`${styles.dot} ${dotLeft.color}`} style={{ left: dotLeft.left }} />
          </div>
          <Box className={valueStyle} fontSize="24px" marginLeft="auto" marginRight="4px">
            {value}
          </Box>
        </Box>
      </Box>
    </div>
  )
}
