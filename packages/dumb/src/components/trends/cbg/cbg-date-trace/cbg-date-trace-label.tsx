/*
 * Copyright (c) 2017-2023, Diabeloop
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

import styles from './cbg-date-trace-label.css'
import Tooltip from '../../../tooltips/common/tooltip/tooltip'
import { useTranslation } from 'react-i18next'
import { type FocusedDateTrace } from '../../../../models/focused-date-trace.model'
import { formatDateToUtc } from '../../../../utils/datetime/datetime.util'

interface CbgDateTraceLabelProps {
  focusedDateTrace: FocusedDateTrace
}

export const CbgDateTraceLabel: FunctionComponent<CbgDateTraceLabelProps> = (props) => {
  const { focusedDateTrace } = props

  const { t } = useTranslation()

  const formattedDate = formatDateToUtc(focusedDateTrace.data.localDate, t('dddd, MMMM D'))
  const tooltipPosition = {
    left: focusedDateTrace.position.left,
    top: 2.25 * focusedDateTrace.position.yPositions.topMargin
  }

  return (
    <div className={styles.container} data-testid="cbg-date-trace-tooltip">
      <Tooltip
        title={<span className={styles.dateLabel}>{formattedDate}</span>}
        borderWidth={0}
        position={tooltipPosition}
        side="bottom"
        tail={false}
      />
    </div>
  )
}
