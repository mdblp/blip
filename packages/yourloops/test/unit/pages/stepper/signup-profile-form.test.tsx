/**
 * Copyright (c) 2021, Diabeloop
 * password strength meter component tests
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

import React from 'react'

import SignUpProfileForm from '../../../../pages/signup/signup-profile-form'
import { SignupForm } from '../../../../lib/auth'
import * as authHookMock from '../../../../lib/auth'
import * as signupFormProviderMock from '../../../../pages/signup/signup-formstate-context'

import { UserRoles } from '../../../../models/user'
import { render, screen } from '@testing-library/react'

jest.mock('../../../../lib/auth')
jest.mock('../../../../pages/signup/signup-formstate-context')
describe('Signup profile form', () => {
  const mountComponent = () => {
    return render(
      <SignUpProfileForm handleBack={jest.fn} handleNext={jest.fn} />
    )
  }

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      completeSignup: jest.fn()
    }));
    (signupFormProviderMock.useSignUpFormState as jest.Mock).mockImplementation(() => ({
      state: { accountRole: UserRoles.caregiver }
    }))
  })

  it('should not render the drop down list when caregiver', () => {
    mountComponent()
    expect(screen.queryByTestId('hcp-profession-selector')).not.toBeInTheDocument()
  })

  it('should render the drop down list when HCP', () => {
    (signupFormProviderMock.useSignUpFormState as jest.Mock).mockImplementation(() => {
      return {
        state: {
          accountRole: UserRoles.hcp
        } as SignupForm
      }
    })
    mountComponent()
    expect(screen.getByTestId('hcp-profession-selector')).toBeInTheDocument()
  })
})
