/**
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

import UserApi from '../../../../lib/auth/user-api'
import { Preferences, Profile, Settings, UserRoles } from '../../../../models/user'
import { loggedInUserId, mockAuth0Hook } from './mockAuth0Hook'
import { patientMonitoredId } from './mockPatientAPI'
import { mockNotificationAPI } from './mockNotificationAPI'
import { mockDirectShareApi } from './mockDirectShareAPI'
import { mockTeamAPI } from './mockTeamAPI'
import PatientAPI from '../../../../lib/patient/patient-api'
import { ITeamMember } from '../../../../models/team'
import { mockChatAPI } from './mockChatAPI'
import { mockMedicalFilesAPI } from './mockMedicalFilesAPI'

export const mockUserDataFetch = (firstName: string, lastName: string, userId = loggedInUserId) => {
  jest.spyOn(UserApi, 'getShorelineAccessToken').mockResolvedValue({ id: userId, token: null })
  jest.spyOn(UserApi, 'getProfile').mockResolvedValue({
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    termsOfUse: { acceptanceTimestamp: '2021-01-02', isAccepted: true },
    privacyPolicy: { acceptanceTimestamp: '2021-01-02', isAccepted: true }
  } as Profile)
  jest.spyOn(UserApi, 'getPreferences').mockResolvedValue({} as Preferences)
  jest.spyOn(UserApi, 'getSettings').mockResolvedValue({} as Settings)
}

export const mockPatientLogin = (patient: ITeamMember) => {
  mockAuth0Hook(UserRoles.patient, patientMonitoredId)
  mockNotificationAPI()
  mockDirectShareApi()
  mockTeamAPI()
  mockUserDataFetch(patient.profile.firstName, patient.profile.lastName, patient.userId)
  jest.spyOn(PatientAPI, 'getPatients').mockResolvedValue([patient])
  mockChatAPI()
  mockMedicalFilesAPI()
}
