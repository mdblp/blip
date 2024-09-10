/*
 * Copyright (c) 2022-2024, Diabeloop
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
import {
  getAccessTokenWithPopupMock,
  loggedInUserEmail,
  loggedInUserId,
  mockAuth0Hook
} from '../../mock/auth0.hook.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { checkCaregiverLayout } from '../../assert/layout.assert'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockPatientApiForCaregivers, mockPatientApiForHcp } from '../../mock/patient.api.mock'
import { checkCaregiverProfilePage, checkPasswordChangeRequest } from '../../assert/profile.assert'
import userEvent from '@testing-library/user-event'
import { type Profile } from '../../../../lib/auth/models/profile.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCodes } from '../../../../lib/auth/models/country.model'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'
import UserApi from '../../../../lib/auth/user.api'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { mockUserApi } from '../../mock/user.api.mock'
import { mockAuthApi } from '../../mock/auth.api.mock'
import { Unit } from 'medical-domain'

describe('Profile page for caregiver', () => {
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
    country: CountryCodes.France,
    units: { bg: Unit.MmolPerLiter }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCodes.Fr }
  const changeUserRoleToHcpMock = jest.spyOn(UserApi, 'changeUserRoleToHcp').mockResolvedValue(undefined)

  beforeAll(() => {
    mockAuth0Hook(UserRole.Caregiver)
    mockAuthApi()
    mockUserApi().mockUserDataFetch({ profile, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientApiForCaregivers()
    mockPatientApiForHcp() // Do not remove this, this is needed for when the user switches role
  })

  it('should render profile page for a caregiver and be able to change his password and change his role to HCP', async () => {
    const expectedProfile = { ...profile, firstName: 'Jean', lastName: 'Talue', fullName: 'Jean Talue' }
    const expectedPreferences = { displayLanguageCode: 'en' as LanguageCodes }
    const expectedSettings = { ...settings, units: { bg: Unit.MilligramPerDeciliter } }
    const updateProfileMock = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(expectedProfile)
    const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(expectedPreferences)
    const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(expectedSettings)
    const router = renderPage('/preferences')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/preferences')
    })
    await checkCaregiverLayout(`${profile.lastName} ${profile.firstName}`)
    const fields = checkCaregiverProfilePage()
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(fields.firstNameInput).toHaveValue(profile.firstName)
    expect(fields.lastNameInput).toHaveValue(profile.lastName)
    expect(fields.unitsSelect).toHaveTextContent(settings.units.bg)
    expect(fields.languageSelect).toHaveTextContent('Français')
    expect(screen.queryByTestId('country-selector')).not.toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'English' }))

    fireEvent.mouseDown(within(screen.getByTestId('profile-units-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: Unit.MilligramPerDeciliter }))

    await userEvent.clear(fields.firstNameInput)
    expect(saveButton).toBeDisabled()
    await userEvent.clear(fields.lastNameInput)
    expect(saveButton).toBeDisabled()
    await userEvent.type(fields.firstNameInput, 'Jean')
    expect(saveButton).toBeDisabled()
    await userEvent.type(fields.lastNameInput, 'Talue')
    expect(saveButton).toBeEnabled()

    await userEvent.click(saveButton)

    expect(saveButton).toBeDisabled()
    expect(screen.getByRole('alert')).toBeVisible()
    expect(updatePreferencesMock).toHaveBeenCalledWith(loggedInUserId, expectedPreferences)
    expect(updateProfileMock).toHaveBeenCalledWith(loggedInUserId, expectedProfile)
    expect(updateSettingsMock).toHaveBeenCalledWith(loggedInUserId, expectedSettings)

    const profileUpdateSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
    expect(profileUpdateSuccessfulSnackbar).toHaveTextContent('Profile updated')

    const profileUpdateSuccessfulSnackbarCloseButton = within(profileUpdateSuccessfulSnackbar).getByTitle('Close')

    await userEvent.click(profileUpdateSuccessfulSnackbarCloseButton)

    await checkPasswordChangeRequest(loggedInUserEmail)

    /*******************/
    /** Changing role **/
    /*******************/
    const changeRoleButton = screen.getByTestId('switch-role-link')
    await userEvent.click(changeRoleButton)

    // First dialog (consequences)
    const consequencesDialog = screen.getByRole('dialog')
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
    const switchButton = within(consequencesDialog).getByRole('button', { name: 'Switch to Professional account' })
    await userEvent.click(switchButton)

    // Second dialog (privacy and terms)
    const consentDialog = screen.getByRole('dialog')
    expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-privacy-policy')).toHaveTextContent('I have read and accepted YourLoops Privacy Policy. Hereby, I consent to the processing of my personal data by Diabeloop so I can benefit from YourLoops services.')
    expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-terms')).toHaveTextContent('I have read and accepted YourLoops Terms of use. I confirm that I am an authorized healthcare practitioner according to local laws and regulation. I undertake to use YourLoops solely in accordance with these Terms of Use and what is allowed by the law.')
    expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-feedback')).toHaveTextContent('I agree to receive information and news from Diabeloop. (optional)')
    const privacyCheckbox = within(consentDialog).getByLabelText('Privacy policy checkbox')
    const termsCheckbox = within(consentDialog).getByLabelText('Terms checkbox')
    const feedbackCheckbox = within(consentDialog).getByLabelText('Feedback checkbox')
    const acceptButton = within(consentDialog).getByRole('button', { name: 'Accept' })
    expect(privacyCheckbox).toBeVisible()
    expect(termsCheckbox).toBeVisible()
    expect(feedbackCheckbox).toBeVisible()
    expect(acceptButton).toBeDisabled()
    await userEvent.click(privacyCheckbox)
    await userEvent.click(termsCheckbox)
    expect(acceptButton).toBeEnabled()
    await userEvent.click(feedbackCheckbox)
    await userEvent.click(acceptButton)

    // Third dialog (HCP profession)
    const professionDialog = screen.getByRole('dialog')
    const hcpProfessionSelect = within(professionDialog).getByTestId('dropdown-profession-selector')
    const validateButton = within(professionDialog).getByRole('button', { name: 'Validate' })
    expect(hcpProfessionSelect).toBeVisible()
    expect(validateButton).toBeDisabled()
    expect(hcpProfessionSelect.textContent).toEqual('​')

    fireEvent.mouseDown(within(screen.getByTestId('dropdown-profession-selector')).getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Dietitian' }))
    expect(hcpProfessionSelect).toHaveTextContent('Dietitian')
    await userEvent.click(validateButton)
    expect(changeUserRoleToHcpMock).toHaveBeenCalled()
    expect(getAccessTokenWithPopupMock).toHaveBeenCalledWith({ authorizationParams: { ignoreCache: true } })
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Your account has been successfully switched to HCP')
  })

  it('should close the modals when clicking on cancel or decline buttons', async () => {
    await act(async () => {
      renderPage('/preferences')
    })

    const changeRoleButton = screen.getByTestId('switch-role-link')
    await userEvent.click(changeRoleButton)

    // First dialog
    const consequencesDialog = screen.getByRole('dialog')
    await userEvent.click(within(consequencesDialog).getByRole('button', { name: 'Cancel' }))
    expect(consequencesDialog).not.toBeVisible()

    // Second dialog
    await userEvent.click(changeRoleButton)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to Professional account' }))
    const consentDialog = screen.getByRole('dialog')
    await userEvent.click(within(consentDialog).getByRole('button', { name: 'Decline' }))
    expect(consentDialog).not.toBeVisible()

    // Third dialog
    await userEvent.click(changeRoleButton)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to Professional account' }))
    await userEvent.click(screen.getByLabelText('Privacy policy checkbox'))
    await userEvent.click(screen.getByLabelText('Terms checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }))
    const professionDialog = screen.getByRole('dialog')
    await userEvent.click(within(professionDialog).getByRole('button', { name: 'Decline' }))
    expect(professionDialog).not.toBeVisible()
  })
})
