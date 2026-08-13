/*
 * Copyright (c) 2026, Diabeloop
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
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { act } from '@testing-library/react'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { mockPatientApiForPatients } from '../../mock/patient.api.mock'
import { type UserAccount } from '../../../../lib/auth/models/user-account.model'
import { type Settings } from '../../../../lib/auth/models/settings.model'
import { CountryCode } from '../../../../lib/auth/models/country.model'
import { type Preferences } from '../../../../lib/auth/models/preferences.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { LanguageCode } from '../../../../lib/auth/models/enums/language-code.enum'
import UserApi from '../../../../lib/auth/user.api'
import { mockUserApi } from '../../mock/user.api.mock'
import { Unit } from 'medical-domain'
import { Gender } from '../../../../lib/auth/models/enums/gender.enum'
import { AppUserRoute } from '../../../../models/enums/routes.enum'
import { testPatientUserInfoUpdate } from '../../use-cases/user-account-management'
import { mockDblCommunicationApi } from '../../mock/dbl-communication.api'
import { buildPatient } from '../../data/patient-builder.data'
import {
  testDataSharingContentNoData,
  testDataSharingContentWithData,
  testRevokeConsentError,
  testUserAccountMenuNotVisible,
} from '../../use-cases/data-sharing'
import {
  testUserAccountMenuVisibleMobile,
  testUserAccountMenuNotVisibleMobile,
  testClickViewMoreUserAccount,
  testClickViewMoreDataSharing
} from '../../use-cases/user-account-menu-visualisation'
import { mockErrorApi } from '../../mock/error.api.mock'
import { mockExternalConsentsApi } from '../../mock/external-consents.api.mock'
import { ExternalConsentsApi } from '../../../../lib/external-consents/external-consents.api'
import { PartnerName } from '../../../../lib/external-consents/models/enum/partner-name.enum'
import { mockMobileScreen } from '../../mock/mobile-screen.mock'

describe('User account page for patient', () => {
  const userAccountRoute = AppUserRoute.UserAccount
  const userMenuMobileRoute = AppUserRoute.UserMenu

  const account: UserAccount = {
    email: 'yann.blanc@example.com',
    firstName: 'Elie',
    lastName: 'Coptere',
    fullName: 'Elie Coptere',
    patient: {
      birthday: '1964-12-01',
      birthPlace: 'Anywhere',
      diagnosisDate: '2020-12-02',
      diagnosisType: '1',
      sex: Gender.Male
    },
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  }
  const settings: Settings = {
    a1c: {
      rawdate: '2020-01-01',
      date: 'date should not be used in this scenario',
      value: '7.5'
    },
    country: CountryCode.France,
    units: { bg: Unit.MilligramPerDeciliter }
  }
  const preferences: Preferences = { displayLanguageCode: LanguageCode.Fr }
  // not used only for the mockPatientApiForPatients
  const patient = buildPatient({ userid: "fakeone" })

  beforeAll(() => {
    mockAuth0Hook(UserRole.Patient)
    mockDblCommunicationApi()
    mockUserApi().mockUserDataFetch({ account, preferences, settings })
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockPatientApiForPatients(patient)
    mockExternalConsentsApi()
    mockErrorApi()
    mockMobileScreen()
  })

  it('should render the menu page if the patient is french', async () => {

    await act(async () => {
      renderPage(userMenuMobileRoute)
    })

    await testUserAccountMenuVisibleMobile()
  })

  it('should not render the menu page if the patient is french', async () => {
    const settingsWithDeCountry: Settings = {
      a1c: {
        rawdate: '2020-01-01',
        date: 'date should not be used in this scenario',
        value: '7.5'
      },
      country: CountryCode.Germany,
      units: { bg: Unit.MilligramPerDeciliter }
    }

    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce({
      profile: {
        firstName: 'Elie',
        lastName: 'Coptere',
        fullName: 'Elie Coptere',
        email: 'fake@email.com',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true },
        ...account
      } as UserAccount,
      settings: settingsWithDeCountry,
      preferences
    })

    await act(async () => {
      renderPage(userAccountRoute)
    })

    testUserAccountMenuNotVisibleMobile()
  })

  it('should be able to access to the user account page', async () => {

    await act(async () => {
      renderPage(userMenuMobileRoute)
    })

    await testClickViewMoreUserAccount()
  })

  it('should be able to access to the data sharing page', async () => {

    await act(async () => {
      renderPage(userMenuMobileRoute)
    })

    await testClickViewMoreDataSharing()
  })

/*
  it('should have access to the Data Sharing section with no data', async () => {
    await act(async () => {
      renderPage(userAccountRoute)
    })

    await testDataSharingContentNoData()
  })

  it('should have access to the Data Sharing section with consents', async () => {
    const preferencesWithEnLanguage: Preferences = { displayLanguageCode: LanguageCode.En }
    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce({
      profile: account,
      settings,
      preferences: preferencesWithEnLanguage
    })

    const consents = [
      {
        partnerId: 'partnerId1',
        partnerName: PartnerName.GlookoXT,
        consentDate: '2026-05-13T04:15:59.159Z'
      },
      {
        partnerId: 'partnerId2',
        partnerName: PartnerName.MyDiabby,
        consentDate: '2026-05-19T14:15:59.159Z'
      }
    ]
    jest.spyOn(ExternalConsentsApi, 'getConsents').mockResolvedValue(consents)

    await act(async () => {
      renderPage(userAccountRoute)
    })

    await testDataSharingContentWithData()

    jest.spyOn(ExternalConsentsApi, 'revokeConsent').mockRejectedValueOnce(new Error('Revoke consent error'))
    await testRevokeConsentError()
  })

  it('should not have access to the Data Sharing section if the patient does not have the FR country', async () => {
    const settingsWithDeCountry: Settings = {
      a1c: {
        rawdate: '2020-01-01',
        date: 'date should not be used in this scenario',
        value: '7.5'
      },
      country: CountryCode.Germany,
      units: { bg: Unit.MilligramPerDeciliter }
    }

    jest.spyOn(UserApi, 'getUserMetadata').mockResolvedValueOnce({
      profile: {
        firstName: 'Elie',
        lastName: 'Coptere',
        fullName: 'Elie Coptere',
        email: 'fake@email.com',
        termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
        trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true },
        ...account
      } as UserAccount,
      settings: settingsWithDeCountry,
      preferences
    })

    await act(async () => {
      renderPage(userAccountRoute)
    })

    testUserAccountMenuNotVisible()
  })
  */
})
