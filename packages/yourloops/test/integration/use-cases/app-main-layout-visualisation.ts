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

import {
  checkBannerLanguageChange,
  checkCaregiverHeader,
  checkHcpHeader,
  checkPatientHeader,
  type HeaderInfo,
} from '../assert/header.assert'
import {
  checkBannerLanguageChangeMobile,
  checkHcpHeaderMobile,
  checkCaregiverHeaderMobile,
  checkPatientHeaderMobile,
  type HeaderInfoMobile
} from '../assert/header-mobile.assert'
import { checkFooterForCaregiver, checkFooterForHcp, checkFooterForPatient } from '../assert/footer.assert'
import {
  checkPatientNavBarAsHcp,
  checkPatientNavBarAsHcpMobile,
  checkPatientNavBarAsHcpInPrivateTeam,
  checkPatientNavBarAsHcpInPrivateTeamMobile
} from '../assert/patient-nav-bar.assert'

export interface AppMainLayoutHcpParams {
  footerHasLanguageSelector?: boolean
  headerInfo: HeaderInfo
}

export interface AppMainLayoutHcpMobileParams {
  footerHasLanguageSelector?: boolean
  headerInfoMobile: HeaderInfoMobile
}

export interface AppMainLayoutParams {
  footerHasLanguageSelector?: boolean
  loggedInUserFullName: string
}

export const testAppMainLayoutForHcp = async (appMainLayoutParams: AppMainLayoutHcpParams) => {
  await checkHcpHeader(appMainLayoutParams.headerInfo)
  checkFooterForHcp( false, appMainLayoutParams.footerHasLanguageSelector ?? false)
}

export const testAppMainLayoutForHcpMobile = async (appMainLayoutParams: AppMainLayoutHcpMobileParams) => {
  await checkHcpHeaderMobile(appMainLayoutParams.headerInfoMobile)
  checkFooterForHcp(true, appMainLayoutParams.footerHasLanguageSelector ?? false)
}

export const testAppMainLayoutForCaregiver = async (appMainLayoutParams: AppMainLayoutParams) => {
  await checkCaregiverHeader(appMainLayoutParams.loggedInUserFullName)
  checkFooterForCaregiver( false, appMainLayoutParams.footerHasLanguageSelector ?? false)
}

export const testAppMainLayoutForCaregiverMobile = async (appMainLayoutParams: AppMainLayoutParams) => {
  await checkCaregiverHeaderMobile(appMainLayoutParams.loggedInUserFullName)
  checkFooterForCaregiver( true, appMainLayoutParams.footerHasLanguageSelector ?? false)
}

export const testAppMainLayoutForPatient = async (appMainLayoutParams: AppMainLayoutParams) => {
  await checkPatientHeader(appMainLayoutParams.loggedInUserFullName)
  checkFooterForPatient( false, appMainLayoutParams.footerHasLanguageSelector ?? false)
}

export const testAppMainLayoutForPatientMobile = async (appMainLayoutParams: AppMainLayoutParams) => {
  await checkPatientHeaderMobile(appMainLayoutParams.loggedInUserFullName)
  checkFooterForPatient( true, appMainLayoutParams.footerHasLanguageSelector ?? false)
}

export const testBannerLanguageUpdate = async () => {
  await checkBannerLanguageChange()
  await checkBannerLanguageChangeMobile()
}

export const testPatientNavBarLayoutForHcp = () => {
  checkPatientNavBarAsHcp()
}

export const testPatientNavBarLayoutForHcpMobile = () => {
  checkPatientNavBarAsHcpMobile()
}

export const testPatientNavBarLayoutForHcpInPrivateTeam = () => {
  checkPatientNavBarAsHcpInPrivateTeam()
}

export const testPatientNavBarLayoutForHcpInPrivateTeamMobile = () => {
  checkPatientNavBarAsHcpInPrivateTeamMobile()
}
