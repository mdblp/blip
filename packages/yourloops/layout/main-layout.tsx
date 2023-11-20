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

import React, { type FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { GlobalStyles, TssCacheProvider } from 'tss-react'
import createCache from '@emotion/cache'
import CssBaseline from '@mui/material/CssBaseline'
import { getTheme } from '../components/theme'
import { DefaultSnackbarContext, SnackbarContextProvider, useAlert } from '../components/utils/snackbar'
import { Footer } from '../components/footer/footer'
import Box from '@mui/material/Box'
import { useAuth0 } from '@auth0/auth0-react'

const muiCache = createCache({
  key: 'mui',
  prepend: true
})

const tssCache = createCache({
  key: 'tss'
})
tssCache.compat = true

const AuthError: FC = () => {
  const { error } = useAuth0()
  const { error: displayError } = useAlert()

  useEffect(() => {
    if (error) {
      displayError(error.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]) // Including displayError creates an infinite loop

  return null
}

export const MainLayout: FC = () => {
  const theme = getTheme()
  return (
    <CacheProvider value={muiCache}>
      <TssCacheProvider value={tssCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={{ body: { backgroundColor: 'var(--body-background-color)' } }} />
          <SnackbarContextProvider context={DefaultSnackbarContext}>
            <AuthError />
            <Box>
              <Outlet />
            </Box>
          </SnackbarContextProvider>
          <Footer />
        </ThemeProvider>
      </TssCacheProvider>
    </CacheProvider>
  )
}
