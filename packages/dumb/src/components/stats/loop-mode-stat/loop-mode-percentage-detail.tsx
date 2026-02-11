/*
 * Copyright (c) 2020-2025, Diabeloop
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
import styles from './loop-mode-stat.css'
import { useTranslation } from 'react-i18next'
import { SimpleValue } from '../common/simple-value'
import { Unit } from 'medical-domain'
import Box from '@mui/material/Box'
import { formatNumberForLang } from 'yourloops/lib/language'

interface LoopModePercentageDetailProps {
  percentageValue: number
  duration: string
  valueClassName?: string
}

export const LoopModePercentageDetail: FunctionComponent<LoopModePercentageDetailProps> = (props) => {
  const { percentageValue, duration, valueClassName } = props
  const { t } = useTranslation('main')
  const isPercentageValid = !Number.isNaN(percentageValue)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      {isPercentageValid ?
        <>
          <SimpleValue value={formatNumberForLang(percentageValue)} suffix={Unit.Percent} valueClassName={valueClassName} />
          <Box className={styles.duration}>{duration}</Box>
        </>
        : <SimpleValue value={t('N/A')} suffix={''} valueClassName={valueClassName} />
      }
    </Box>
  )
}
