/**
 * Copyright (c) 2021-2022, Diabeloop
 * Profile page tests
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
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate, SyntheticEventData } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'

import { Units } from '../../../../models/generic'
import ProfilePage from '../../../../pages/profile/profile-page'
import { AuthenticatedUserMetadata, UserRoles } from '../../../../models/user'
import * as authHookMock from '../../../../lib/auth'
import User from '../../../../lib/auth/user'
import { genderLabels } from '../../../../lib/auth/helpers'
import { HcpProfession } from '../../../../models/hcp-profession'

jest.mock('../../../../lib/auth')

describe('Profile', () => {
  let container: HTMLElement | null = null
  let patient: User
  let hcp: User
  const userId = 'fakeUserId'
  const birthday = '1964-12-01'

  async function mountProfilePage(): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <BrowserRouter>
            <ProfilePage />
          </BrowserRouter>, container, resolve)
      })
    })
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    patient = new User({
      email: 'josephine.dupuis@example.com',
      emailVerified: true,
      sub: 'auth0|a0a0a0b0',
      [AuthenticatedUserMetadata.Roles]: [UserRoles.patient]
    })
    patient.settings = { a1c: { date: '2020-01-01', value: '7.5' }, country: 'FR' }
    patient.profile = {
      firstName: 'Josephine',
      lastName: 'Dupuis',
      fullName: 'Josephine D.',
      patient: {
        birthday,
        birthPlace: 'Anywhere',
        diagnosisDate: '2020-12-02',
        diagnosisType: '1',
        referringDoctor: 'Dr Dre',
        sex: 'M',
        ins: '123456789012345',
        ssn: '012345678901234'
      }
    }
    patient.preferences = { displayLanguageCode: 'fr' }
    hcp = new User({
      email: 'john.doe@example.com',
      emailVerified: true,
      sub: 'auth0|a0000000',
      [AuthenticatedUserMetadata.Roles]: [UserRoles.hcp]
    })
    hcp.frProId = 'ANS20211229094028'
    hcp.profile = { firstName: 'John', lastName: 'Doe', fullName: 'John Doe', hcpProfession: HcpProfession.diabeto }
    hcp.preferences = { displayLanguageCode: 'en' }
    hcp.settings = { units: { bg: Units.gram }, country: 'FR' }
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
    patient = null
    hcp = null
  })

  beforeAll(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      user: patient
    }))
  })

  it('should be able to render', async () => {
    await mountProfilePage()
    expect(container.querySelector('#profile-textfield-firstname').id).toBe('profile-textfield-firstname')
    expect(container.querySelector('#profile-button-save').id).toBe('profile-button-save')
  })

  it('should display mg/dL Units by default if not specified', async () => {
    delete hcp.settings?.units?.bg
    await mountProfilePage()
    const selectValue = container.querySelector('#profile-units-selector').innerHTML
    expect(selectValue).toBe(Units.gram)
  })

  it('should display birthdate if user is a patient', async () => {
    await mountProfilePage()
    const birthDateInput: HTMLInputElement = container.querySelector('#profile-textfield-birthdate')
    expect(birthDateInput?.value).toBe(birthday)
  })

  it('should display birthplace if user is a patient', async () => {
    await mountProfilePage()
    const birthPlaceInput: HTMLInputElement = container.querySelector('#profile-textfield-birthplace')
    expect(birthPlaceInput?.value).toBe(patient.profile?.patient?.birthPlace)
  })

  it('should display gender if user is a patient', async () => {
    await mountProfilePage()
    const genderValue = container.querySelector('#profile-select-gender').innerHTML
    expect(genderValue).toBe(genderLabels()[patient.profile?.patient?.sex])
  })

  it('should display referring doctor if user is a patient', async () => {
    await mountProfilePage()
    const referringDoctorInput: HTMLInputElement = container.querySelector('#profile-textfield-referring-doctor')
    expect(referringDoctorInput?.value).toBe(patient.profile?.patient?.referringDoctor)
  })

  it('should not display INS if user is not a french patient', async () => {
    patient.settings.country = 'EN'
    await mountProfilePage()
    const insInput = container.querySelector('#profile-textfield-ins')
    expect(insInput).toBeNull()
  })

  it('should display INS if user is a french patient', async () => {
    await mountProfilePage()
    const insInput: HTMLInputElement = container.querySelector('#profile-textfield-ins')
    expect(insInput?.value).toBe(patient.profile?.patient?.ins)
  })

  it('should not display SSN if user is not a french patient', async () => {
    patient.settings.country = 'EN'
    await mountProfilePage()
    const ssnInput = container.querySelector('#profile-textfield-ssn')
    expect(ssnInput).toBeNull()
  })

  it('should display SSN if user is a french patient', async () => {
    await mountProfilePage()
    const ssnInput: HTMLInputElement = container.querySelector('#profile-textfield-ssn')
    expect(ssnInput?.value).toBe(patient.profile?.patient?.ssn)
  })

  it('should not display profession if user is a patient', async () => {
    await mountProfilePage()
    const hcpProfessionSelectInput = container.querySelector('#profile-hcp-profession-selector + input')
    expect(hcpProfessionSelectInput).toBeNull()
  })

  it('should not display pro sante connect button if user is not a french hcp', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: 'EN' }
        } as User
      }
    })
    await mountProfilePage()
    const proSanteConnectButton = container.querySelector('#pro-sante-connect-button')
    expect(proSanteConnectButton).toBeNull()
  })

  it('should display pro sante connect button if user is a french hcp and his account is not certified', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: 'FR' },
          frProId: undefined
        } as User
      }
    })
    await mountProfilePage()
    const proSanteConnectButton = container.querySelector('#pro-sante-connect-button')
    expect(proSanteConnectButton).not.toBeNull()
  })

  it('should display eCPS number if user is a french hcp and his account is certified', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: 'FR' },
          emailVerified: true,
          frProId: 'ANS20211229094028',
          getParsedFrProId: () => '',
          id: userId
        } as User
      }
    })
    await mountProfilePage()
    const textField = container.querySelector('#professional-account-number-text-field')
    const certifiedIcon = container.querySelector(`#certified-professional-icon-${userId}`)
    expect(certifiedIcon).not.toBeNull()
    expect(textField).not.toBeNull()
  })

  it('should not display certified icon if user is a french hcp and his account is not certified', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: 'FR' },
          emailVerified: false,
          frProId: undefined,
          getParsedFrProId: () => '',
          id: userId
        } as User
      }
    })
    await mountProfilePage()
    const certifiedIcon = container.querySelector(`#certified-professional-icon-${userId}`)
    expect(certifiedIcon).toBeNull()
  })

  it('should update settings when saving after changing units', async () => {
    const updateSettings = jest.fn();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: hcp,
        updateSettings
      }
    })
    await mountProfilePage()
    const saveButton: HTMLButtonElement = container.querySelector('#profile-button-save')
    const unitSelectInput = container?.querySelector('#profile-units-selector + input')

    expect(saveButton.disabled).toBeTruthy()
    Simulate.change(unitSelectInput, { target: { value: Units.mole } } as unknown as SyntheticEventData)
    expect(saveButton.disabled).toBeFalsy()
    Simulate.click(saveButton)
    expect(updateSettings).toHaveBeenCalledTimes(1)
  })

  it('should update preferences when saving after changing language', async () => {
    const updatePreferences = jest.fn();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: hcp,
        updatePreferences
      }
    })
    await mountProfilePage()

    const saveButton: HTMLButtonElement = container.querySelector('#profile-button-save')
    const languageSelectInput = container.querySelector('#profile-locale-selector + input')

    expect(saveButton.disabled).toBeTruthy()
    Simulate.change(languageSelectInput, { target: { value: 'es' } } as unknown as SyntheticEventData)
    expect(saveButton.disabled).toBeFalsy()
    Simulate.click(saveButton)
    expect(updatePreferences).toHaveBeenCalledTimes(1)
  })

  it('should update profile when saving after changing firstname', async () => {
    const updateProfile = jest.fn();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: hcp,
        updateProfile
      }
    })
    await mountProfilePage()

    const saveButton: HTMLButtonElement = container.querySelector('#profile-button-save')
    const firstnameInput: HTMLInputElement = container.querySelector('#profile-textfield-firstname')

    expect(saveButton.disabled).toBe(true)
    Simulate.change(firstnameInput, { target: { value: 'Chandler' } } as unknown as SyntheticEventData)
    expect(saveButton.disabled).toBe(false)
    Simulate.click(saveButton)
    expect(updateProfile).toHaveBeenCalledTimes(1)
  })
})
