/*
 * Copyright (c) 2022-2026, Diabeloop
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

import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { makeStyles } from 'tss-react/mui'
import OutlinedInput from '@mui/material/OutlinedInput'

export interface BasicDropdownProps {
  id: string
  value: string
  disabled?: boolean
  values: string[]
  error?: boolean
  onSelect: (value: string) => void
}

const styles = makeStyles()((theme) => ({
  select: {
    height: '40px',
    maxWidth: '200px',
  },
  error: {
    border: `1px solid ${theme.palette.error.main}`
  }
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

function BasicDropdown(props: BasicDropdownProps): JSX.Element {
  const { onSelect, value, disabled, values, id, error } = props
  const { t } = useTranslation('yourloops')
  const { classes } = styles()

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const getSanitizedLabel = (label: string): string => {
    return label
      // Replace non-alphanumeric characters with hyphens
      .replace(/[^a-zA-Z0-9-]/g, '-')
      // Collapse repeated hyphens
      .replace(/-+/g, '-')
      // Trim edge hyphens
      .replace(/^-|-$/g, '')
  }

  const getId = (label: string): string => {
    return `basic-dropdown-${id}-menuitem-${getSanitizedLabel(label)}`
  }

  const handleSelectChange = (event: SelectChangeEvent<unknown>): void => {
    const value = event.target.value as string
    onSelect(value)
  }

  return (
    <Select
      disabled={disabled}
      id={`basic-dropdown-${id}-selector`}
      data-testid={`basic-dropdown-${id}-selector`}
      value={value}
      className={classes.select}
      input={<OutlinedInput margin="dense" />}
      onChange={handleSelectChange}
      MenuProps={MenuProps}
      classes={error ? { select: classes.error } : undefined}
    >
      {values.map(item => (
        <MenuItem id={getId(item)} key={item} value={item} data-testid={getId(item)}>
          {t(item)}
        </MenuItem>
      ))}
    </Select>
  )
}

export default BasicDropdown
