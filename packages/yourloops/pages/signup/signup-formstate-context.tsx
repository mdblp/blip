/*
 * Copyright (c) 2021-2022, Diabeloop
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

import React, { createContext, type FunctionComponent, type PropsWithChildren, useContext, useState } from 'react'

import { getCurrentLang } from '../../lib/language'
import { type SignupForm } from '../../lib/auth'
import { type SignupFormKey } from './models/enums/signup-form-key.enum'
import { UserRoles } from '../../lib/auth/models/enums/user-roles.enum'
import { CountryCodes } from '../../lib/auth/models/country.model'

interface ISignUpFormStateContext {
  signupForm: SignupForm
  updateForm: (key: SignupFormKey, value: boolean | string) => void
}

const initialState: SignupForm = {
  accountRole: UserRoles.unset,
  profileFirstname: '',
  profileLastname: '',
  profileCountry: CountryCodes.Unknown,
  preferencesLanguage: getCurrentLang(),
  terms: false,
  privacyPolicy: false
}

/*
 * Create the context for the Signup Form state
 */
const SignUpFormStateContext = createContext<ISignUpFormStateContext>({} as ISignUpFormStateContext)

/*
 * Provide a signup form state context
 */
export const SignUpFormStateProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [signupForm, setSignupForm] = useState<SignupForm>(initialState)

  const updateForm = (key: SignupFormKey, value: unknown): void => {
    setSignupForm(prevState => ({ ...prevState, [key]: value }))
    if (value === UserRoles.caregiver) {
      setSignupForm(prevState => {
        delete prevState.hcpProfession
        delete prevState.feedback
        return { ...prevState }
      })
    }
  }

  return (
    <SignUpFormStateContext.Provider value={{ signupForm, updateForm }}>
      {children}
    </SignUpFormStateContext.Provider>
  )
}

/**
 Returns the current SignupForm State and a setter to update it
 */
export const useSignUpFormState = (): ISignUpFormStateContext => useContext(SignUpFormStateContext)
