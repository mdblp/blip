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
import ReactMarkdown from 'react-markdown'
import styles from './stat-tooltip.css'
import { withStyles } from '@mui/styles'
import Tooltip from '@mui/material/Tooltip'

interface StatTooltipProps {
  annotations: string[]
  children: JSX.Element
}

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'white',
    color: 'var(--stat--default)',
    border: '1px solid rgb(114, 115, 117)',
    fontSize: '12px',
    lineHeight: '20px',
    borderWidth: '2px'
  }
}))(Tooltip)

export const StatTooltip: FunctionComponent<StatTooltipProps> = (props) => {
  const { annotations, children } = props

  return (
    <StyledTooltip
      disableFocusListener
      placement="top"
      title={
        <div data-testid="stat-tooltip-content" className={styles.container}>
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
        </div>
      }>
      {children}
    </StyledTooltip>
  )
}
