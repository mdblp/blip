/**
 * Copyright (c) 2021, Diabeloop
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

import React, { createContext, Dispatch, FunctionComponent, useContext, useReducer } from 'react'

import { HcpProfession } from '../../models/hcp-profession'
import { getCurrentLang } from '../../lib/language'
import { SignupForm } from '../../lib/auth'
import { UserRoles } from '../../models/user'
import signupFormReducer, { SignupReducerAction } from './signup-form-reducer'

interface ISignUpFormStateContext {
  state: SignupForm
  dispatch: Dispatch<SignupReducerAction>
}

export const initialState: SignupForm = {
  accountRole: UserRoles.caregiver,
  profileFirstname: '',
  profileLastname: '',
  profileCountry: '',
  hcpProfession: HcpProfession.empty,
  preferencesLanguage: getCurrentLang(),
  terms: false,
  privacyPolicy: false,
  feedback: false
}

/*
 * Create the context for the Signup Form state
 */
const SignUpFormStateContext = createContext<ISignUpFormStateContext>({
  state: initialState,
  dispatch: () => undefined
})

/*
 * Provide a signup form state context
 */
export const SignUpFormStateProvider: FunctionComponent = ({ children }) => {
  // Attach the Signup reducer and assign initial state
  const [state, dispatch] = useReducer(signupFormReducer, initialState)

  return (
    <SignUpFormStateContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpFormStateContext.Provider>
  )
}

/**
 Returns the current SignupForm State and a dispatcher to update it
 */
export const useSignUpFormState = (): ISignUpFormStateContext => useContext(SignUpFormStateContext)
