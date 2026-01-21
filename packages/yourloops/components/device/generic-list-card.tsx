/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { type FC, type PropsWithChildren } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'

interface GenericListCardProps extends PropsWithChildren {
  title: string
  ['data-testid']?: string
}

const useStyles = makeStyles()((theme) => ({
  cardHeader: {
    backgroundColor: 'var(--primary-color-background)',
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold
  },
  cardContent: {
    fontSize: theme.typography.fontSize,
    padding: 0,
    '&:last-child': {
      padding: 0
    }
  }
}))

export const GenericListCard: FC<GenericListCardProps> = (props) => {
  const theme = useTheme()
  const { classes } = useStyles()
  const { title, children } = props

  return (
    <Card
      variant="outlined"
      sx={{ marginBottom: theme.spacing(5) }}
      data-testid={props['data-testid']}
    >
      <CardHeader
        title={title}
        className={classes.cardHeader}
        disableTypography
      />
      <CardContent className={classes.cardContent}>
        <List disablePadding>
          <Divider component="li" />
          {children}
        </List>
      </CardContent>
    </Card>
  )
}
