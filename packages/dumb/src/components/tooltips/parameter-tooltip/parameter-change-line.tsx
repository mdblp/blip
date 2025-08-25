/*
 * Copyright (c) 2025, Diabeloop
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
import styles from './parameter-tooltip.css'
import React, { FC } from 'react'
import commonStyles from '../../../styles/tooltip-common.css'
import { Parameter } from 'medical-domain'
import { useTranslation } from 'react-i18next'

interface ParameterChangeLineProps {
  parameter: Parameter
}

export const ParameterChangeLine: FC<ParameterChangeLineProps> = (props) => {
  const { parameter } = props
  const { t } = useTranslation('main')

  const parameterId = parameter.id
  const hasPreviousValue = !!parameter.previousValue
  const formattedPreviousValue = hasPreviousValue && formatParameterValue(parameter.previousValue, parameter.unit)
  const valueClasses = hasPreviousValue ? styles.value : `${styles.value} ${styles['value-no-prev']}`
  const value = formatParameterValue(parameter.value, parameter.unit)

  return (
    <React.Fragment key={parameterId}>
      <span id={`tooltip-daily-parameter-${parameterId}-name`}
            data-testid={'parameter-name'}
            className={styles.label}
      >
          {t(`params|${parameter.name}`)}
        </span>
      {
        hasPreviousValue &&
        <>
            <span id={`tooltip-daily-parameter-${parameterId}-prev`}
                  data-testid={'parameter-previous-value'}
                  className={styles.previous}
            >
              {formattedPreviousValue}
            </span>
          <span id={`tooltip-daily-parameter-${parameterId}-arrow`}>&rarr;</span>
        </>
      }
      <span id={`tooltip-daily-parameter-${parameterId}-value`}
            data-testid={'parameter-value'}
            className={valueClasses}
      >
          {value}
        </span>
      <span id={`tooltip-daily-parameter-${parameterId}-units`}
            data-testid={'parameter-units'}
            className={commonStyles.units}
      >
          {t(parameter.unit)}
        </span>
    </React.Fragment>
  )
}
