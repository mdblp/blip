/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FC } from 'react'
import { Outlet } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { GlobalStyles, TssCacheProvider } from 'tss-react'
import createCache from '@emotion/cache'
import CssBaseline from '@mui/material/CssBaseline'
import { getTheme } from '../components/theme'
import { DefaultSnackbarContext, SnackbarContextProvider } from '../components/utils/snackbar'
import { Footer } from '../components/footer/footer'
import { ALWAYS_ACCESSIBLE_ROUTES, PUBLIC_ROUTES } from '../lib/diabeloop-urls.model'
import { AppRoute } from '../models/enums/routes.enum'
import Box from '@mui/material/Box'

const muiCache = createCache({
  key: 'mui',
  prepend: true
})

const tssCache = createCache({
  key: 'tss'
})
tssCache.compat = true

const isRoutePublic = (route: string): boolean => PUBLIC_ROUTES.includes(route as AppRoute)
const isRouteAlwaysAccessible = (route: string): boolean => ALWAYS_ACCESSIBLE_ROUTES.includes(route as AppRoute)

export const MainLobby: FC = () => {
  const theme = getTheme()


  // const canDisplayApp = !isLoading && (isCurrentRoutePublic || isCurrentRouteAlwaysAccessible)
  // const canDisplayApp = !isLoading && (isCurrentRoutePublic || isCurrentRouteAlwaysAccessible || user)

  console.log('rendering lobby')
  return (
    <>
      {/*{canDisplayApp ? (*/}
      <CacheProvider value={muiCache}>
        <TssCacheProvider value={tssCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={{ body: { backgroundColor: 'var(--body-background-color)' } }} />
            <SnackbarContextProvider context={DefaultSnackbarContext}>
              <Box>
                <Outlet />
              </Box>
            </SnackbarContextProvider>
            <Footer />
          </ThemeProvider>
        </TssCacheProvider>
      </CacheProvider>
      {/*)*/}
      {/*: <Outlet />*/}
      {/*}*/}
    </>
  )
}
