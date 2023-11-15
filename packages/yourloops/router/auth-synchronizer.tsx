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

import React, { type FC, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'branding/global.css'
import 'classes.css'
import { User } from '../lib/auth'
import MetricsLocationListener from '../components/MetricsLocationListener'
import HttpService from '../lib/http/http.service'
import AuthService from '../lib/auth/auth.service'
import { AuthenticatedUser } from '../lib/auth/models/authenticated-user.model'
import { v4 as uuidv4 } from 'uuid'
import { MainLobby } from '../app/main-lobby'
import { useNavigate } from 'react-router-dom'


export const AuthSynchronizer: FC = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0()
  const navigate = useNavigate()
  const ref = useRef(true)
  const firstRender = ref.current;
  ref.current = false

  AuthService.setIsAuthenticated(isAuthenticated)
  if (user && !AuthService.getUser()) {
    const authUser = new User(user as AuthenticatedUser)
    AuthService.setUser(authUser)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      getAccessTokenSilently()
        .then(() => {
          AuthService.setIsAuthenticated(true)
        })
        .catch(() => {
          // This happens when we try to silently login but we don't have enough info
        })
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async (): Promise<string> => await getAccessTokenSilently()
      HttpService.setGetAccessTokenMethod(getAccessToken)
      HttpService.setTraceToken(uuidv4())
      const authUser = AuthService.getUser()
      if (authUser.isUserHcp()) {
        navigate(`/teams`)
      }
      if (authUser.isUserPatient()) {
        navigate(`/dashboard`)
      }
      if (authUser.isUserCaregiver()) {
        navigate(`/teams/private/patients`)
      }
    }
  }, [getAccessTokenSilently, isAuthenticated, navigate, user])

  return (
    <>
      {!firstRender && !isLoading &&
        <>
          <MetricsLocationListener />
          <MainLobby />
        </>
      }
    </>
  )
}
