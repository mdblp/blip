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

export const retrieveUser = async (user: User | null) => {
  if (!user || AuthService.hasUserBeenRetrieved()) {
    return AuthService.getUser()
  }
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
  AuthService.setUser(user)
  AuthService.setHasUserBeenRetrieved(true)
  return user
}


export const checkFirstSignup = (user: User | null) => {
  if (user && user.isFirstLogin()) {
    redirect(AppRoute.CompleteSignup)
  }
}

export const checkConsent = (user: User | null) => {
  if (user && user.hasToAcceptNewConsent()) {
    redirect(AppRoute.NewConsent)
  }
  if (user && user.hasToRenewConsent()) {
    redirect(AppRoute.RenewConsent)
  }
}

export const checkTraining = (user: User | null) => {
  if (user && user.hasToDisplayTrainingInfoPage()) {
    redirect(AppRoute.NewConsent)
  }
}

export const userLoader = async (currentRoleRoute: UserRole) => {
  const isAuthenticated = AuthService.isAuthenticated()
  if (!isAuthenticated) {
    return redirect('/login')
  }
  const user = AuthService.getUser()
  if (user.role !== currentRoleRoute) {
    redirect('/login')
  }
  checkFirstSignup(user)
  checkConsent(user)
  return await retrieveUser(user)
}
