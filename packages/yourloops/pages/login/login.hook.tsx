/*
 * Copyright (c) 2024-2026, Diabeloop
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

import { AppRoute } from '../../models/enums/routes.enum'
import { useNavigate } from 'react-router-dom'
import { AppState, useAuth0 } from '@auth0/auth0-react'

interface LoginHookReturn {
  loginWithState: (appState: AppState) => Promise<void>
  redirectToSignupInformation: () => void
}

export const useLogin = (): LoginHookReturn => {
  const navigate = useNavigate()
  const { loginWithRedirect } = useAuth0()

  const redirectToSignupInformation = () => {
    navigate(AppRoute.SignupInformation)
  }

  const loginWithState = async (appState: AppState) => {
    const appStateJson = encodeURIComponent(JSON.stringify(appState))
    await loginWithRedirect({ appState: { appStateJSON: appStateJson } })
  }

  return { loginWithState, redirectToSignupInformation }
}
