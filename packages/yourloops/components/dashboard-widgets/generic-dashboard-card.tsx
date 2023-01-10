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

import React, { FunctionComponent, PropsWithChildren } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { makeStyles } from 'tss-react/mui'

interface GenericDashboardCardProps {
  avatar: JSX.Element
  title: string
  width?: string
  ['data-testid']?: string
}

const useStyles = makeStyles()(() => ({
  header: {
    textTransform: 'uppercase',
    backgroundColor: 'var(--card-header-background-color)'
  },
  headerTitle: {
    fontWeight: 600
  }
}))

const GenericDashboardCard: FunctionComponent<PropsWithChildren<GenericDashboardCardProps>> = (props) => {
  const { classes } = useStyles()
  return (
    <Card
      sx={{ width: props.width || '25%' }}
      data-testid={props['data-testid']}
    >
      <CardHeader
        className={classes.header}
        classes={{ title: classes.headerTitle }}
        avatar={props.avatar}
        title={props.title}
      />
      {props.children}
    </Card>
  )
}

export default GenericDashboardCard
