/*
 * Copyright (c) 2021-2023, Diabeloop
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

import { useAuth0 } from '@auth0/auth0-react'
import { zendeskLogout } from '../zendesk'
import metrics from '../metrics'
import { IDLE_USER_QUERY_PARAM } from './models/authenticated-user.model'

type UseLogOutReturns = (isIdle?: boolean) => Promise<void>

export function useLogout(): UseLogOutReturns {
  const {
    logout: auth0logout
  } = useAuth0()


  const getLogoutRedirectUrl = (isIdle = false): string => {
    const defaultUrl = `${window.location.origin}/login`

    if (isIdle) {
      return `${defaultUrl}?${IDLE_USER_QUERY_PARAM}=true`
    }
    return defaultUrl
  }

  const logout = async (isIdle = false): Promise<void> => {
    try {
      zendeskLogout()
      const redirectUrl = getLogoutRedirectUrl(isIdle)
      metrics.resetUser()
      await auth0logout({ logoutParams: { returnTo: redirectUrl } })
    } catch (err) {
      console.error('An error happened when logging out', err)
    }
  }

  return logout
}
