/*
 * Copyright (c) 2016-2023, Diabeloop
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

import styles from './table.css'
import { useTranslation } from 'react-i18next'

interface Row {
  rawData: string
  name: string
  value: string
  unit: string
}

interface TableProps {
  rows: Row[]
  title: string
}

export const Table: FunctionComponent<TableProps> = (props) => {
  const { rows, title } = props

  const { t } = useTranslation()

  const parameterColumnClassName = 'table-diabeloop-parameters-name'
  const valueColumnClassName = 'table-diabeloop-parameters-value'
  const unitColumnClassName = 'table-diabeloop-parameters-unit'

  return (
    <table className={styles.settingsTable}>
      <caption className={styles.bdlgSettingsHeader}>
        {title}
      </caption>
      <thead>
      <tr>
        <th className={parameterColumnClassName}>
          {t('Parameter')}
        </th>
        <th className={valueColumnClassName}>
          {t('Value')}
        </th>
        <th className={unitColumnClassName}>
          {t('Unit')}
        </th>
      </tr>
      </thead>
      <tbody>
      {rows.map((row, index) =>
        <tr key={index} data-testid={`${row.rawData.toLowerCase()}-row`}>
          <td className={`${styles.secondaryLabelWithMain} ${parameterColumnClassName}`}>
            {row.name}
          </td>
          <td className={`${styles.secondaryLabelWithMain} ${valueColumnClassName}`}>
            {row.value}
          </td>
          <td className={`${styles.secondaryLabelWithMain} ${unitColumnClassName}`}>
            {row.unit}
          </td>
        </tr>
      )}
      </tbody>
    </table>
  )
}
