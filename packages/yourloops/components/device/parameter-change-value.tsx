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

import React, { type FC } from 'react'
import { type ParametersChange, type PumpSettingsParameter } from 'medical-domain'
import Box from '@mui/material/Box'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTheme } from '@mui/material/styles'
import { formatParameterValue } from './utils/device.utils'

interface ParameterChangeValueProps {
  historyCurrentIndex: number
  history: ParametersChange[]
  parameter: PumpSettingsParameter
}

export const ParameterChangeValue: FC<ParameterChangeValueProps> = (props) => {
  let previousParameter: PumpSettingsParameter
  const theme = useTheme()
  const { parameter, history, historyCurrentIndex } = props
  const filteredHistory = history.slice(historyCurrentIndex + 1)

  filteredHistory.every(parametersChange => {
    previousParameter = parametersChange.parameters.find(paramChange => paramChange.name === parameter.name)
    return !previousParameter
  })

  return (
    <Box
      display="flex"
      alignItems="center"
      className={`${parameter.name.toLowerCase()} ${previousParameter ? 'updated-value' : 'added-value'}`}
    >
      {previousParameter &&
        <>
          <span>{`${formatParameterValue(previousParameter.value, previousParameter.unit)} ${previousParameter.unit}`}</span>
          <ChevronRightIcon sx={{ marginInline: theme.spacing(1) }} />
        </>
      }
      <span>{`${formatParameterValue(parameter.value, parameter.unit)} ${parameter.unit}`}</span>
    </Box>
  )
}
