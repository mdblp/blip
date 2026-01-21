/*
 * Copyright (c) 2021-2025, Diabeloop
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
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { makeStyles } from 'tss-react/mui'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'

interface PatientsFiltersToggleProps {
  ariaLabel: string
  checked: boolean
  disabled?: boolean
  icon?: JSX.Element
  label: string
  onToggleChange?: () => void
  tooltip?: string
}

const useStyles = makeStyles()((theme) => ({
  label: {
    maxWidth: '200px',
    marginLeft: theme.spacing(1)
  },
  toggle: {
    marginLeft: 'auto'
  }
}))

export const PatientListOptionToggle: FunctionComponent<PatientsFiltersToggleProps> = (props) => {
  const { ariaLabel, checked, disabled, icon, label, onToggleChange, tooltip } = props
  const { classes } = useStyles()
  const theme = useTheme()

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        marginBottom: theme.spacing(1)
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center"
        }}>
        {icon}
        <Typography variant="subtitle1" className={classes.label}>{label}</Typography>
      </Box>
      <Tooltip title={tooltip}>
        <Box>
          <Switch
            aria-label={ariaLabel}
            className={classes.toggle}
            checked={checked}
            disabled={disabled}
            onChange={onToggleChange}
          />
        </Box>
      </Tooltip>
    </Stack>
  )
}
