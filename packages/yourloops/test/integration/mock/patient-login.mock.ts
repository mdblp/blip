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

import { mockAuth0Hook } from './auth0.hook.mock'
import { mockNotificationAPI } from './notification.api.mock'
import { mockDirectShareApi } from './direct-share.api.mock'
import { mockTeamAPI } from './team.api.mock'
import PatientAPI from '../../../lib/patient/patient.api'
import { mockChatAPI } from './chat.api.mock'
import { mockMedicalFilesAPI } from './medical-files.api.mock'
import { type ITeamMember } from '../../../lib/team/models/i-team-member.model'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { mockUserApi } from './user.api.mock'
import { PATIENTS } from '../data/patient.api.data'

export const mockPatientLogin = (patient: ITeamMember) => {
  mockAuth0Hook(UserRole.Patient, patient.userId)
  mockNotificationAPI()
  mockDirectShareApi()
  mockTeamAPI()
  mockUserApi().mockUserDataFetch({ firstName: patient.profile.firstName, lastName: patient.profile.lastName })
  jest.spyOn(PatientAPI, 'getPatient').mockImplementation((userId: string) => {
    const patient = PATIENTS.find(patient => patient.userid === userId)
    const patientsToReturn = [patient]
    if (!patientsToReturn) {
      console.warn('Your mocked getPatient return is undefined, make sure that this is a wanted behaviour.', userId)
    }
    return Promise.resolve(patientsToReturn)
  })
  mockChatAPI()
  mockMedicalFilesAPI()
}
