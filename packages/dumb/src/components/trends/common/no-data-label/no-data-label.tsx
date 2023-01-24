/*
 * Copyright (c) 2023, Diabeloop
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
import styles from '../../../../styles/typography.css'
import { useTranslation } from 'react-i18next'

interface NoDataLabelProps {
  position: {
    x: number
    y: number
  }
  isNoDataSelected: boolean
}

const DEFAULT_CBG_DISPLAY_TYPE = 'CGM'

export const NoDataLabel: FunctionComponent<NoDataLabelProps> = (props) => {
  const { position, isNoDataSelected } = props
  const { t } = useTranslation('main')

  const noDataSelectedMessage = t('Hang on there, skippy! You unselected all of the data!')
  const noDataFoundMessage = t('There is no {{displayType}} data for this time period :(', { displayType: DEFAULT_CBG_DISPLAY_TYPE })
  const message = isNoDataSelected ? noDataSelectedMessage : noDataFoundMessage

  return (
    <text
      className={`${styles.mediumContrastText} ${styles.svgMiddleAnchored}`}
      x={position.x}
      y={position.y}
      data-testid="no-data-label"
    >
      {message}
    </text>
  )
}