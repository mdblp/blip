/*
 * Copyright (c) 2022, Diabeloop
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

import { renderPage } from '../../utils/render'
import { loggedInUserId, mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockUserDataFetch } from '../../mock/auth'
import { mockTeamAPI } from '../../mock/mockTeamAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { act, fireEvent, screen, within } from '@testing-library/react'
import { checkCaregiverLayout } from '../../assert/layout'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { mockPatientAPI } from '../../mock/mockPatientAPI'
import { checkCaregiverProfilePage } from '../../assert/profile'
import userEvent from '@testing-library/user-event'
import { Profile } from '../../../../lib/auth/models/profile.model'
import { Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { LanguageCodes } from '../../../../lib/auth/models/language-codes.model'
import UserApi from '../../../../lib/auth/user.api'
import { Preferences } from '../../../../lib/auth/models/preferences.model'
import { UnitsType } from '../../../../lib/units/models/enums/units-type.enum'
import { UserRoles } from '../../../../lib/auth/models/enums/user-roles.enum'

describe('Caregiver page for hcp', () => {
  const profile: Profile = {
    email: 'phil@defer.com',
    firstName: 'Phil',
    lastName: 'Defer',
    fullName: 'Phil Defer',
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    a1c: {
      date: '2020-01-01',
      value: '7.5'
    },
    country: CountryCodes.France,
    units: { bg: UnitsType.MMOLL }
  }
  const preferences: Preferences = { displayLanguageCode: 'fr' }
  const changeUserRoleToHcpMock = jest.spyOn(UserApi, 'changeUserRoleToHcp').mockResolvedValue(undefined)

  beforeAll(() => {
    mockAuth0Hook(UserRoles.caregiver)
    mockUserDataFetch({ profile, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientAPI()
  })

  it('should render profile page for a caregiver and be able to change his role to HCP', async () => {
    const expectedProfile = { ...profile, firstName: 'Jean', lastName: 'Talue', fullName: 'Jean Talue' }
    const expectedPreferences = { displayLanguageCode: 'en' as LanguageCodes }
    const expectedSettings = { ...settings, units: { bg: UnitsType.MGDL } }
    const updateProfileMock = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(expectedProfile)
    const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(expectedPreferences)
    const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(expectedSettings)
    await act(async () => {
      renderPage('/preferences')
    })
    checkCaregiverLayout(`${profile.firstName} ${profile.lastName}`)
    const fields = checkCaregiverProfilePage()
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(fields.firstNameInput).toHaveValue(profile.firstName)
    expect(fields.lastNameInput).toHaveValue(profile.lastName)
    expect(fields.unitsSelect).toHaveTextContent(settings.units.bg)
    expect(fields.languageSelect).toHaveTextContent('Français')
    expect(saveButton).toBeDisabled()

    fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: 'English' }))

    fireEvent.mouseDown(within(screen.getByTestId('profile-units-selector')).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: UnitsType.MGDL }))

    await userEvent.clear(fields.firstNameInput)
    await userEvent.clear(fields.lastNameInput)
    await userEvent.type(fields.firstNameInput, 'Jean')
    await userEvent.type(fields.lastNameInput, 'Talue')

    expect(saveButton).not.toBeDisabled()
    await act(async () => {
      await userEvent.click(saveButton)
    })

    expect(saveButton).toBeDisabled()
    expect(screen.getByRole('alert')).toBeVisible()
    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, expectedPreferences)
    expect(updateProfileMock).toHaveBeenCalledWith(loggedInUserId, expectedProfile)
    expect(updateSettingsMock).toHaveBeenCalledWith(loggedInUserId, expectedSettings)

    /*******************/
    /** Changing role **/
    /*******************/
    const changeRoleButton = screen.getByTestId('switch-role-link')
    await userEvent.click(changeRoleButton)

    // First dialog (consequences)
    const consequencesDialog = screen.getByTestId('switch-role-consequences-dialog')
    expect(consequencesDialog).toBeVisible()
    expect(within(consequencesDialog).getByText('Switch to professional account')).toBeVisible()
    expect(within(consequencesDialog).getByText('You are about to convert your caregiver account to a professional account.')).toBeVisible()
    expect(within(consequencesDialog).getByText('This action can’t be undone.')).toBeVisible()
    expect(within(consequencesDialog).getByText('As a healthcare professional on YourLoops you can:')).toBeVisible()
    expect(within(consequencesDialog).getByText('Patients you followed as a caregiver will be added to your Professional Private Care.')).toBeVisible()
    expect(within(consequencesDialog).getByText('Do you want to convert your caregiver account to a professional account?')).toBeVisible()
    expect(within(consequencesDialog).getByText('Create, manage and join care teams')).toBeVisible()
    expect(within(consequencesDialog).getByText('Invite your patients to share their data')).toBeVisible()
    expect(within(consequencesDialog).getByText('Invite other healthcare professionals')).toBeVisible()
    expect(within(consequencesDialog).getByRole('button', { name: 'Cancel' })).toBeVisible()
    const switchButton = within(consequencesDialog).getByRole('button', { name: 'Switch to Professional' })
    expect(switchButton).toBeVisible()
    await userEvent.click(switchButton)

    // Second dialog (privacy and terms)
    const consentDialog = screen.getByTestId('switch-role-consent-dialog')
    expect(consentDialog).toBeVisible()
    const privacyCheckbox = within(consentDialog).getByLabelText('Privacy policy checkbox')
    const termsCheckbox = within(consentDialog).getByLabelText('Terms checkbox')
    const feedbackCheckbox = within(consentDialog).getByLabelText('Feedback checkbox')
    const acceptButton = within(consentDialog).getByRole('button', { name: 'Accept' })
    expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-privacy-policy')).toBeVisible()
    expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-terms')).toBeVisible()
    expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-feedback')).toBeVisible()
    expect(privacyCheckbox).toBeVisible()
    expect(termsCheckbox).toBeVisible()
    expect(feedbackCheckbox).toBeVisible()
    expect(acceptButton).toBeDisabled()
    await userEvent.click(privacyCheckbox)
    await userEvent.click(termsCheckbox)
    await userEvent.click(feedbackCheckbox)
    await userEvent.click(acceptButton)

    // Third dialog (HCP profession)
    const professionDialog = screen.getByTestId('switch-role-profession-dialog')
    const hcpProfessionSelect = within(professionDialog).getByTestId('dropdown-profession-selector')
    const validateButton = within(professionDialog).getByRole('button', { name: 'Validate' })
    expect(professionDialog).toBeVisible()
    expect(hcpProfessionSelect).toBeVisible()
    expect(validateButton).toBeDisabled()
    expect(hcpProfessionSelect.textContent).toEqual('​')

    fireEvent.mouseDown(within(screen.getByTestId('dropdown-profession-selector')).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: 'Dietitian' }))
    expect(hcpProfessionSelect).toHaveTextContent('Dietitian')
    await userEvent.click(validateButton)
    expect(changeUserRoleToHcpMock).toHaveBeenCalled()
  })
})
