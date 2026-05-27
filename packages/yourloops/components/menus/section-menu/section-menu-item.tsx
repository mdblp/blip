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

import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import React, { FC } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useTheme } from '@mui/material/styles'

interface SectionMenuItemProps {
  label: string
  isSelected: boolean
  onClick: () => void
  children: React.ReactNode
  testId: string
}

const useStyles = makeStyles()((theme) => ({
  menuTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  },
  menuItemText: {
    whiteSpace: 'pre-line',
  }
}))

export const SectionMenuItem: FC<SectionMenuItemProps> = (props) => {
  const { isSelected, label, onClick, children, testId } = props
  const { classes } = useStyles()
  const theme = useTheme()

  return (
    <MenuItem
      selected={isSelected}
      onClick={() => onClick()}
      sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
      data-testid={testId}
    >
      <ListItemIcon>
        {children}
      </ListItemIcon>
      <ListItemText className={classes.menuItemText}>{label}</ListItemText>
    </MenuItem>
  )
}
