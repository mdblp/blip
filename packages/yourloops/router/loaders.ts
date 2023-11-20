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

import { UserRole } from '../lib/auth/models/enums/user-role.enum'
import AuthService from '../lib/auth/auth.service'
import { redirect } from 'react-router-dom'
import { User } from '../lib/auth'
import UserApi from '../lib/auth/user.api'
import { sanitizeBgUnit } from '../lib/auth/user.util'
import { AppRoute } from '../models/enums/routes.enum'
import i18next from 'i18next'
import { availableLanguageCodes, getCurrentLang } from '../lib/language'
import metrics from '../lib/metrics'

export const retrieveUser = async () => {
  const user = AuthService.getAuthUser()
  const userMetadata = await UserApi.getUserMetadata(user.id)
  if (userMetadata) {
    user.profile = userMetadata.profile
    user.preferences = userMetadata.preferences
    user.settings = userMetadata.settings
    if (!user.settings) {
      user.settings = {}
    }
    user.settings.units = {
      bg: sanitizeBgUnit(userMetadata.settings?.units?.bg)
    }
  }
  if (user.role !== UserRole.Unset) {
    const languageCode = user.preferences?.displayLanguageCode
    if (languageCode && availableLanguageCodes.includes(languageCode) && languageCode !== getCurrentLang()) {
      await i18next.changeLanguage()
      metrics.setUser(user)
    }
  }
  return user
}

export const checkFirstSignup = (user: User | null) => {
  if (user && user.isFirstLogin()) {
    return redirect(AppRoute.CompleteSignup)
  }
  return null
}

export const checkConsent = (user: User | null) => {
  if (user && user.hasToAcceptNewConsent()) {
    return redirect(AppRoute.NewConsent)
  }
  if (user && user.hasToRenewConsent()) {
    return redirect(AppRoute.RenewConsent)
  }
  return null
}

export const checkTraining = (user: User | null) => {
  if (user && user.hasToDisplayTrainingInfoPage()) {
    return redirect(AppRoute.Training)
  }
  return null
}

export const userLoader = async ({ request }) => {
  const isAuthenticated = AuthService.isAuthenticated()
  if (!isAuthenticated) {
    const params = new URLSearchParams()
    params.set("from", new URL(request.url).pathname)
    return redirect(`/loading?${params.toString()}`)
  }
  return await retrieveUser()
}
