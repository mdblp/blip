/*
 * Copyright (c) 2026, Diabeloop
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

import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Unit } from 'medical-domain'
import React, { FC } from 'react'

interface TextNumberValueWithLabelProps {
  dataTestId: string
  label: string
  unit: string
  errorMessage?: string
  isReadonly: boolean
  value: number
  minValue: number
  maxValue: number
  ariaLabel: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const INPUT_STEP_MGDL = 1
const INPUT_STEP_MMOLL = 0.1

export const TextNumberValueWithLabel: FC<TextNumberValueWithLabelProps> = (props) => {
  const {
    dataTestId,
    label,
    unit,
    errorMessage,
    isReadonly,
    value,
    minValue,
    maxValue,
    ariaLabel,
    onChange
  } = props

  const hasError = !!errorMessage
  const inputStep = unit === Unit.MilligramPerDeciliter ? INPUT_STEP_MGDL : INPUT_STEP_MMOLL

  return (
    <Box
      data-testid={dataTestId}
      sx={{
        display: "flex",
        alignItems: "center",
        paddingBottom: 1,
        position: "relative"
      }}>
      <Typography>{label}</Typography>
      <TextField
        disabled={isReadonly}
        value={value}
        error={hasError}
        helperText={hasError ? errorMessage : ''}
        type="number"
        size="small"
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
          },
          htmlInput: {
            min: minValue,
            max: maxValue,
            step: inputStep,
            'aria-label': ariaLabel,
          }
        }}
        sx={{ mx: 1, maxWidth: '150px' }}
        onChange={onChange}
      />
    </Box>
  )
}
