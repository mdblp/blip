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
import { BgUnit } from 'medical-domain'
import React, { FC } from 'react'
import { DropdownWithLabel } from './dropdown-with-label'
import { MonitoringAlertSubtitle } from './monitoring-alert-subtitle'
import { MonitoringAlertTitle } from './monitoring-alert-title'
import { TextNumberValueWithLabel } from './text-number-value-with-label'

interface SingleAlertConfigurationProps {
  title: string
  icon: React.ReactNode
  dataTestId: string
  isReadonly: boolean
  textFieldsSubtitle?: string
  dropdownSubTitle: string
  textFieldParams?: TextFieldParams
  textFieldParams2?: TextFieldParams
  dropdownParams: DropdownParams
  unit: BgUnit
}

export interface TextFieldParams {
  label: string
  dataTestId: string
  errorMessage: string
  value: number
  minValue: number
  maxValue: number
  ariaLabel: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface DropdownParams {
  label: string
  id: string
  dataTestId: string
  defaultValue: string
  values: string[]
  error: boolean
  onSelect: (value: string) => void
}

export const SingleAlertConfiguration: FC<SingleAlertConfigurationProps> = (props) => {
  const {
    title,
    icon,
    dataTestId,
    textFieldsSubtitle,
    dropdownSubTitle,
    unit,
    textFieldParams,
    textFieldParams2,
    isReadonly,
    dropdownParams
  } = props

  const hasTextFields = !!textFieldParams

  return (
    <>
      <MonitoringAlertTitle
        label={title}
        icon={icon}
      />
      <Box data-testid={dataTestId} sx={{ display: 'flex', mt: 2 }}>
        {
          hasTextFields && (
            <Box sx={{ width: '100%' }}>
              <MonitoringAlertSubtitle label={textFieldsSubtitle} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginRight: 3 }}>
                <TextNumberValueWithLabel
                  dataTestId={textFieldParams.dataTestId}
                  label={textFieldParams.label}
                  unit={unit}
                  errorMessage={textFieldParams.errorMessage}
                  isReadonly={isReadonly}
                  value={textFieldParams.value}
                  minValue={textFieldParams.minValue}
                  maxValue={textFieldParams.maxValue}
                  ariaLabel={textFieldParams.ariaLabel}
                  onChange={textFieldParams.onChange}
                />

                {textFieldParams2 &&
                  <TextNumberValueWithLabel
                    dataTestId={textFieldParams2.dataTestId}
                    label={textFieldParams2.label}
                    unit={unit}
                    errorMessage={textFieldParams2.errorMessage}
                    isReadonly={isReadonly}
                    value={textFieldParams2.value}
                    minValue={textFieldParams2.minValue}
                    maxValue={textFieldParams2.maxValue}
                    ariaLabel={textFieldParams2.ariaLabel}
                    onChange={textFieldParams2.onChange}
                  />
                }
              </Box>
            </Box>)
        }

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: hasTextFields ? 'end' : 'start'
          }}
        >
          <DropdownWithLabel
            title={dropdownSubTitle}
            label={dropdownParams.label}
            isReadonly={isReadonly}
            id={dropdownParams.id}
            dataTestId={dropdownParams.dataTestId}
            value={dropdownParams.defaultValue}
            values={dropdownParams.values}
            error={dropdownParams.error}
            onSelect={dropdownParams.onSelect}
          />
        </Box>
      </Box>
    </>

  )
}
