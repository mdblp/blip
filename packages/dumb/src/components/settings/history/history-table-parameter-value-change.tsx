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
import React, { type FunctionComponent } from 'react'
import { ChangeType, type HistorizedParameter } from '../../../models/historized-parameter.model'
import styles from '../diabeloop.css'

interface HistoryTableParameterValueChangeProps {
  parameter: HistorizedParameter
}

const buildSpanClass = (change: ChangeType): string => {
  const spanClass = `parameters-history-table-value ${styles.historyValue}`
  switch (change) {
    case ChangeType.Added:
      return `${spanClass} ${styles.valueAdded}`
    case ChangeType.Deleted:
      return `${spanClass} ${styles.valueDeleted}`
    case ChangeType.Updated: {
      return `${spanClass} ${styles.valueUpdated}`
    }
    default:
      break
  }
  return spanClass
}

export const HistoryTableParameterValueChange: FunctionComponent<HistoryTableParameterValueChangeProps> = (props): JSX.Element => {
  const { parameter } = props
  const spanClass = buildSpanClass(parameter.changeType)
  const currentValue = formatParameterValue(parameter.value, parameter.unit)

  return (
    <span className={spanClass} data-changetype={parameter.changeType}>
      {parameter.changeType === ChangeType.Updated &&
        <>
          <span>{`${formatParameterValue(parameter.previousValue, parameter.previousUnit)} ${parameter.previousUnit}`}</span>
          <i className="icon-next" key="icon-next" />
        </>
      }
        <span>{`${currentValue} ${parameter.unit}`}</span>
    </span>
  )
}
