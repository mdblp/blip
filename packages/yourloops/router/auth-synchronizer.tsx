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

import React, { type FC, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import MetricsLocationListener from '../components/MetricsLocationListener'
import HttpService from '../lib/http/http.service'
import AuthService from '../lib/auth/auth.service'
import { AuthenticatedUser } from '../lib/auth/models/authenticated-user.model'
import { v4 as uuidv4 } from 'uuid'
import { MainLayout } from '../layout/main-layout'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AppRoute } from '../models/enums/routes.enum'
import { AUTH0_ERROR_EMAIL_NOT_VERIFIED } from '../lib/auth/models/auth0-error.model'

export const AuthSynchronizer: FC = () => {
  const { isAuthenticated, user: authUser, getAccessTokenSilently, isLoading } = useAuth0()
  console.log(isAuthenticated)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  console.log(pathname)

  AuthService.setIsAuthenticated(isAuthenticated)
  if (authUser && !AuthService.getAuthUser()) {
    AuthService.setAuthUser(authUser as AuthenticatedUser)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      getAccessTokenSilently()
        .then(() => {
          // Nothing to do
        })
        .catch((error) => {
          const errorDescription = error.error_description
          if (errorDescription === AUTH0_ERROR_EMAIL_NOT_VERIFIED) {
            navigate(AppRoute.VerifyEmail)
            return
          }
          navigate(AppRoute.Login)
          // This happens when we try to silently login but we don't have enough info
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async (): Promise<string> => await getAccessTokenSilently()
      HttpService.setGetAccessTokenMethod(getAccessToken)
      HttpService.setTraceToken(uuidv4())
    }
  }, [getAccessTokenSilently, isAuthenticated])

  useEffect(() => {
    console.log(isAuthenticated)
    if (!isAuthenticated) {
      return
    }
    const fromUrl = searchParams.get('from')
    console.log('fromUrl', fromUrl)
    if (fromUrl && fromUrl !== '/') {
      navigate(fromUrl)
      return
    }
    const user = AuthService.getUser()
    if (!user) {
      navigate('/')
      return
    }
    if (user.isFirstLogin()) {
      navigate(AppRoute.CompleteSignup)
      return
    }
    if (user.hasToAcceptNewConsent()) {
      navigate(AppRoute.NewConsent)
      return
    }
    if (user.hasToRenewConsent()) {
      navigate(AppRoute.RenewConsent)
      return
    }
    if (user.hasToDisplayTrainingInfoPage()) {
      navigate(AppRoute.Training)
      return
    }
    if (user.isUserHcp()) {
      navigate('/teams')
      return
    }
    if (user.isUserPatient()) {
      navigate('/dashboard')
      return
    }
    if (user.isUserCaregiver()) {
      navigate('/teams/private/patients')
      return
    }
    navigate(AppRoute.CompleteSignup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]) // This is necessary to avoid useless renders and extra APIs calls

  return (
    <>
      {!isLoading &&
        <>
          <MetricsLocationListener />
          <MainLayout />
        </>
      }
    </>
  )
}
