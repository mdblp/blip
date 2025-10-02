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
import HttpService from '../http/http.service'
import { fixYLP878Settings } from '../utils'
import { getCurrentLang } from '../language'
import { HttpHeaderKeys } from '../http/models/enums/http-header-keys.enum'
import { type ShareUser } from './models/share-user.model'
import { type DirectShareAPI } from './models/direct-share-api.model'
import { UserInviteStatus } from '../team/models/enums/user-invite-status.enum'
import { UserRole } from '../auth/models/enums/user-role.enum'
import HttpStatus from '../http/models/enums/http-status.enum'

export const PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE = 'patient-cannot-be-invited-as-caregiver'
const PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_CODE = HttpStatus.StatusMethodNotAllowed

export default class DirectShareApi {
  static async addDirectShare(userId: string, email: string): Promise<void> {
    try {
      const { data } = await HttpService.post<void, { email: string }>({
        url: `/confirm/send/invite/${userId}`,
        payload: { email },
        config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } }
      }, [PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_CODE])
      return data
    } catch (error) {
      if (error.response.status === PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_CODE) {
        throw new Error(PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE)
      }
      throw error
    }
  }

  static async getDirectShares(userId: string): Promise<ShareUser[]> {
    const { data } = await HttpService.get<DirectShareAPI[]>({ url: `/bff/v1/patients/${userId}/caregivers-info` })
    return DirectShareApi.mapShareUser(data)
  }

  static async removeDirectShare(patientId: string, viewerId: string): Promise<void> {
    await HttpService.delete({ url: `/crew/v0/direct-share/${patientId}/${viewerId}` })
  }

  private static mapShareUser(directShareApiArray: DirectShareAPI[]): ShareUser[] {
    const shareUsers: ShareUser[] = []
    directShareApiArray.forEach((directShare) => {
      const directShareUser = directShare.patient ?? directShare.viewer
      if (directShareUser) {
        shareUsers.push({
          status: UserInviteStatus.Accepted,
          user: {
            userid: directShareUser.userId,
            preferences: directShareUser.preferences ?? undefined,
            profile: directShareUser.profile ?? undefined,
            settings: fixYLP878Settings(directShareUser.settings),
            username: directShareUser.email,
            emails: [directShareUser.email],
            role: directShare.viewer ? UserRole.Caregiver : UserRole.Patient,
            idVerified: directShareUser.idVerified
          }
        })
      }
    })
    return shareUsers
  }
}
