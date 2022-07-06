/**
 * Copyright (c) 2022, Diabeloop
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

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput'

export interface BasicDropdownProps {
  id: string
  defaultKey?: string
  disabled?: boolean
  values: Map<string, string> // Map<key, value>
  onSelect: (value: string) => void
}

const styles = makeStyles((theme: Theme) => ({
  select: {
    backgroundColor: theme.palette.grey[100],
    height: '40px',
    maxWidth: '200px',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  }
}))

function Dropdown(props: BasicDropdownProps): JSX.Element {
  const { onSelect, defaultKey, values, id, disabled } = props
  const classes = styles()
  const [selectedValue, setSelectedValue] = React.useState(defaultKey || '')

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string
    setSelectedValue(value)
    onSelect(value)
  }

  return (
    <Select
      id={`basic-dropdown-${id}-selector`}
      value={selectedValue}
      className={classes.select}
      variant="outlined"
      disabled={disabled}
      input={<OutlinedInput margin="dense" />}
      onChange={handleSelectChange}
    >
      {Array.from(values.entries()).map(value => (
        <MenuItem id={`basic-dropdown-${id}-menuitem-${value[0]}`} key={value[0]} value={value[0]}>
          {value[1]}
        </MenuItem>
      ))}
    </Select>
  )
}

export default Dropdown
