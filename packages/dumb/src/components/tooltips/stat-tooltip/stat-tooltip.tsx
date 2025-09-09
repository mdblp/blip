/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './stat-tooltip.css'
import Tooltip, { tooltipClasses, type TooltipProps } from '@mui/material/Tooltip'
import InfoIcon from '../../stats/assets/info-outline-24-px.svg'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material'

interface StatTooltipProps {
  annotations: string[]
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: 'var(--stat--default)',
    fontSize: '12px',
    lineHeight: '20px',
    borderRadius: '24px',
    boxShadow: '4px 4px 20px -5px rgba(2, 57, 79, 0.12)',
    margin: '8px'
  }
}))

export const StatTooltip: FunctionComponent<StatTooltipProps> = (props) => {
  const { annotations } = props
  const { t } = useTranslation('main')

  const imageAlt = t('img-alt-hover-for-more-info')

  return (
    <StyledTooltip
      disableFocusListener
      placement="top"
      title={
        <div data-testid="stat-tooltip-content" className={styles.container}>
          {annotations.map((message, index) =>
            <div key={`message-${index}`}>
              <ReactMarkdown className={styles.message}>
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
        </div>
      }
    >
      <span className={styles.tooltipIcon}>
        <img
          data-testid="info-icon"
          src={InfoIcon}
          alt={imageAlt}
        />
      </span>
    </StyledTooltip>
  )
}
