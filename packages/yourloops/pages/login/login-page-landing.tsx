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

import React, { FunctionComponent, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/styles'
import { useAuth0 } from '@auth0/auth0-react'
import { useHistory } from 'react-router-dom'
import { useAlert } from '../../components/utils/snackbar'
import LoginPageMobile from './login-page-mobile'
import LoginPageDesktop from './login-page-desktop'
import { GlobalStyles } from 'tss-react'

const LoginPageLanding: FunctionComponent = () => {
  const { error } = useAuth0()
  const history = useHistory()
  const alert = useAlert()
  const theme = useTheme()
  const isMobileView: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  useEffect(() => {
    if (error) {
      if (error.message === 'Please verify your email before logging in.') {
        history.replace('/verify-email')
        return
      }
      alert.error(error.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <React.Fragment>
      <GlobalStyles styles={{ body: { backgroundColor: 'white' } }} />
      {isMobileView
        ? <LoginPageMobile />
        : <LoginPageDesktop />
      }
    </React.Fragment>
  )
}

export default LoginPageLanding
