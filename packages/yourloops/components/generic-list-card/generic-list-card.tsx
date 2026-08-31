/*
 * Copyright (c) 2023-2026, Diabeloop
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

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import { useTheme } from '@mui/material/styles'
import React, { type FC } from 'react'
import { makeStyles } from 'tss-react/mui'
import { TableLine } from './table-line'
import useMediaQuery from '@mui/material/useMediaQuery'
import { PartnerName } from '../../lib/external-consents/models/enum/partner-name.enum'

interface GenericListCardProps {
  title: string,
  tableLines: { label: string, value: string }[]
  ['data-testid']?: string
  ['cardClassName']?: string
  ['cardHeaderClassName']?: string
  headerAction?: React.ReactNode
  hideFallbackValue?: boolean
  remoteMonitoring?:boolean
}

const useStyles = makeStyles()((theme) => ({
  cardHeader: {
    backgroundColor: 'var(--primary-color-background)',
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold,
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
  const { title, tableLines, headerAction, hideFallbackValue = false, remoteMonitoring = false } = props
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      variant="outlined"
      sx={{ marginBottom: isMobile ? undefined : theme.spacing(5) }}
      data-testid={props['data-testid']}
      className={props['cardClassName']}
    >
      <CardHeader
        title={title}
        className={`${classes.cardHeader} ${props['cardHeaderClassName']}`}
        disableTypography
        action={headerAction}
      />
      <CardContent className={classes.cardContent}>
        <List disablePadding>
          <Divider component="li" />
          {tableLines.map((item, index, array) => (
            <TableLine key={item.label} label={item.label} value={item.value} hideDivider={index === array.length - 1}
                       hideFallbackValue={hideFallbackValue} remoteMonitoring = {remoteMonitoring} partner={item.label as PartnerName } />
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
