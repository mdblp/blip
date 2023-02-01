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

import { formatParameterValue } from '../../../utils/format/format.util'
import styles from '../diabeloop.css'
import React, { FunctionComponent } from 'react'
import { ChangeType, HistorizedParameter } from '../../../models/historized-parameter.model'

interface HistoryTableParameterValueChangeProps {
  parameter: HistorizedParameter
}

export const HistoryTableParameterValueChange: FunctionComponent<HistoryTableParameterValueChangeProps> = (props): JSX.Element => {
  const { parameter } = props
  const fCurrentValue = formatParameterValue(parameter.value, parameter.unit)
  const value = <span key="value">{`${fCurrentValue} ${parameter.unit}`}</span>
  let spanClass = `parameters-history-table-value ${styles.historyValue}`

  const elements = []
  switch (parameter.changeType) {
    case ChangeType.Added:
      spanClass = `${spanClass} ${styles.valueAdded}`
      break
    case ChangeType.Deleted:
      spanClass = `${spanClass} ${styles.valueDeleted}`
      break
    case ChangeType.Updated: {
      const changeValueArrowIcon = <i className="icon-next" key="icon-next" />
      const fPreviousValue = formatParameterValue(parameter.previousValue, parameter.previousUnit)
      spanClass = `${spanClass} ${styles.valueUpdated}`
      const previousValue = <span key="previousValue">{`${fPreviousValue} ${parameter.previousUnit}`}</span>
      elements.push(previousValue)
      elements.push(changeValueArrowIcon)
      break
    }
    default:
      break
  }

  elements.push(value)

  return (
    <span className={spanClass} data-changetype={parameter.changeType}>
        {elements}
      </span>
  )
}
