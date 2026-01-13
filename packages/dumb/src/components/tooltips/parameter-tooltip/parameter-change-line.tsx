/*
 * Copyright (c) 2025-2026, Diabeloop
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
import Grid from '@mui/material/Grid'

interface ParameterChangeLineProps {
  parameter: Parameter
}

export const ParameterChangeLine: FC<ParameterChangeLineProps> = (props) => {
  const { parameter } = props
  const { t } = useTranslation('main')

  const parameterId = parameter.id
  const hasPreviousValue = !!parameter.previousValue
  const formattedPreviousValue = hasPreviousValue && formatParameterValue(parameter.previousValue, parameter.unit)
  const value = formatParameterValue(parameter.value, parameter.unit)

  return (
    <Grid container spacing={1} key={parameterId}>
      <Grid size={7}>
        <span
          id={`tooltip-daily-parameter-${parameterId}-name`}
          data-testid={'parameter-name'}
          className={styles.bold}
        >
          {t(`params|${parameter.name}`)}
        </span>
      </Grid>

      <Grid size={1} display="flex" justifyContent="end">
        {
          hasPreviousValue &&
          <span
            id={`tooltip-daily-parameter-${parameterId}-prev`}
            data-testid={'parameter-previous-value'}
          >
          {formattedPreviousValue}
        </span>
        }
      </Grid>

      <Grid size={1} display="flex" justifyContent="center">
        {
          hasPreviousValue &&
          <span id={`tooltip-daily-parameter-${parameterId}-arrow`}>
            &rarr;
          </span>
        }
      </Grid>

      <Grid size={1} display="flex" justifyContent="end">
        <span
          id={`tooltip-daily-parameter-${parameterId}-value`}
          data-testid={'parameter-value'}
          className={styles.bold}
        >
          {value}
        </span>
      </Grid>

      <Grid size={2}>
        <span
          id={`tooltip-daily-parameter-${parameterId}-units`}
          data-testid={'parameter-units'}
          className={commonStyles.units}
        >
          {t(parameter.unit)}
        </span>
      </Grid>
    </Grid>
  )
}
