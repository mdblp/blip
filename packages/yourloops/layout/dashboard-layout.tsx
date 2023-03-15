/*
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

import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import MainHeader from '../components/header-bars/main-header'
import MainDrawer from '../components/menus/drawer/main-drawer'
import { useAuth } from '../lib/auth'

const dashboardLayoutStyle = makeStyles()(() => ({
  container: {
    padding: '0px'
  }
}))

function DashboardLayout({ children }: { children: JSX.Element }): JSX.Element {
  const { classes } = dashboardLayoutStyle()
  const theme = useTheme()
  const [drawerMiniVariant, setDrawerMiniVariant] = useState<boolean>(true)
  const authHook = useAuth()
  const isUserPatient = authHook.user?.isUserPatient()

  const onClickMainHeaderShrinkIcon = (): void => { setDrawerMiniVariant(!drawerMiniVariant) }

  return (
    <Box display="flex">
      <MainHeader withShrinkIcon={!isUserPatient} onClickShrinkIcon={onClickMainHeaderShrinkIcon} />
      {!isUserPatient &&
        <MainDrawer miniVariant={drawerMiniVariant} />
      }
      <Container maxWidth={false} className={classes.container}>
        <Box sx={{ ...theme.mixins.toolbar }} />
        {children}
      </Container>
    </Box>
  )
}

export default DashboardLayout