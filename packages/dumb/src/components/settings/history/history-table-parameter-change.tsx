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

import styles from '../diabeloop.css'
import React, { FunctionComponent } from 'react'
import { ChangeType, HistorizedParameter } from '../../../models/historized-parameter.model'
import { useTranslation } from 'react-i18next'

interface HistoryTableParameterChangeProps {
  parameter: HistorizedParameter
}

const buildIconCssClass = (change: ChangeType): string => {
  switch (change) {
    case ChangeType.Added:
      return 'icon-add'
    case ChangeType.Deleted:
      return 'icon-remove'
    case ChangeType.Updated:
      return 'icon-refresh'
    default:
      break
  }
  return 'icon-unsure-data'
}

export const HistoryTableParameterChange: FunctionComponent<HistoryTableParameterChangeProps> = (props): JSX.Element => {
  const { t } = useTranslation('main')
  const { parameter } = props

  const iconClass = buildIconCssClass(parameter.changeType)
  return (
    <span>
      <i className={iconClass} />
      <span
        className={styles.parameterHistory}>
          {t(`params|${parameter.name}`)}
      </span>
    </span>
  )
}
