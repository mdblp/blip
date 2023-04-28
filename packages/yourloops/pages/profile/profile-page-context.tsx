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

import React, { createContext, type FunctionComponent, type PropsWithChildren, useContext } from 'react'
import useProfilePageContextHook from './profile-page-context.hook'
import { type ProfileErrors, type ProfileForm } from './models/profile-form.model'
import { type ProfileFormKey } from './models/enums/profile-form-key.enum'
import { type LanguageCodes } from '../../lib/auth/models/enums/language-codes.enum'
import { type HcpProfession } from '../../lib/auth/models/enums/hcp-profession.enum'
import { type BgUnit } from 'medical-domain'

interface ProfilePageContext {
  canSave: boolean
  errors: ProfileErrors
  profileForm: ProfileForm
  saveProfile: () => Promise<void>
  saving: boolean
  updateProfileForm: (key: ProfileFormKey, value: boolean | string | LanguageCodes | BgUnit | HcpProfession) => void
}

const ProfilePageStateContext = createContext<ProfilePageContext>({} as ProfilePageContext)

export const ProfilePageContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const {
    canSave,
    errors,
    profileForm,
    saveProfile,
    saving,
    updateProfileForm
  } = useProfilePageContextHook()

  return (
    <ProfilePageStateContext.Provider value={{ profileForm, updateProfileForm, errors, canSave, saving, saveProfile }}>
      {children}
    </ProfilePageStateContext.Provider>
  )
}

export const useProfilePageState = (): ProfilePageContext => useContext(ProfilePageStateContext)
