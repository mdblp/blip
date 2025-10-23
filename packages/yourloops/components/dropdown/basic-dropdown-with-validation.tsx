/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React from 'react'
import { useTranslation } from 'react-i18next'

import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { makeStyles } from 'tss-react/mui'

type SetState<T> = React.Dispatch<React.SetStateAction<T>>
type HandleChange<E> = (event: E) => void

export interface Errors {
  notAllowedValue: boolean
}

export interface BasicDropdownWithValidationProps<T> {
  id: string
  defaultValue: string
  disabledValues: string[]
  values: string[]
  inputTranslationKey: string
  errorTranslationKey: string
  onSelect: (value: T) => void
}

const dropdownStyles = makeStyles({ name: 'component-basic-dropdown-with-validation' })(() => ({
  formControl: { display: 'flex' }
}))

function BasicDropdownWithValidation<T>(props: BasicDropdownWithValidationProps<T>): JSX.Element {
  const { onSelect, defaultValue, disabledValues, values, inputTranslationKey, errorTranslationKey, id } = props
  const { classes } = dropdownStyles()
  const { t } = useTranslation('yourloops')

  const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue)

  const createHandleSelectChange = <K extends string>(setState: SetState<K>): HandleChange<SelectChangeEvent<unknown>> => (event) => {
    setState(event.target.value as K)
    onSelect(event.target.value as T)
  }

  const labelId = `dropdown-${id}-input-label`

  return (
    <FormControl
      id={`dropdown-form-${id}`}
      variant="outlined"
      className={classes.formControl}
    >
      <FormGroup>
        <InputLabel id={labelId}>{t(inputTranslationKey)}</InputLabel>
        <Select
          id={`dropdown-${id}-selector`}
          data-testid={`dropdown-${id}-selector`}
          labelId={labelId}
          label={t(inputTranslationKey)}
          value={selectedValue}
          error={disabledValues.includes(selectedValue)}
          inputProps={{ id: `dropdown-${id}-selector-input-props`, 'data-testid': `dropdown-${id}-selector-input-props` }}
          onChange={createHandleSelectChange(setSelectedValue)}
        >
          {values.map(item => (
            <MenuItem id={`dropdown-${id}-menuitem-${item}`} key={item} value={item}>
              {t(item)}
            </MenuItem>
          ))}
        </Select>
        {disabledValues.includes(selectedValue) &&
          <FormHelperText id={`dropdown-error-${id}`} error>{t(errorTranslationKey)}</FormHelperText>
        }
      </FormGroup>
    </FormControl>
  )
}

export default BasicDropdownWithValidation
