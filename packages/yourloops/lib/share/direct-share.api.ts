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
import { DirectShareAPI, ShareUser } from './models'
import HttpService from '../../services/http.service'
import { UserInvitationStatus } from '../../models/generic.model'
import { fixYLP878Settings } from '../utils'
import { UserRoles } from '../../models/user'
import { HttpHeaderKeys } from '../../models/api.model'
import { getCurrentLang } from '../language'

export default class DirectShareApi {
  static async addDirectShare(userId: string, email: string): Promise<void> {
    await HttpService.post<void, { email: string }>({
      url: `/confirm/send/invite/${userId}`,
      payload: { email },
      config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } }
    })
  }

  static async getDirectShares(): Promise<ShareUser[]> {
    const { data } = await HttpService.get<DirectShareAPI[]>({ url: '/v0/my-direct-shares' })
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
          status: UserInvitationStatus.accepted,
          user: {
            userid: directShareUser.userId,
            preferences: directShareUser.preferences ?? undefined,
            profile: directShareUser.profile ?? undefined,
            settings: fixYLP878Settings(directShareUser.settings),
            username: directShareUser.email,
            emails: [directShareUser.email],
            role: directShare.viewer ? UserRoles.caregiver : UserRoles.patient,
            idVerified: directShareUser.idVerified
          }
        })
      }
    })
    return shareUsers
  }
}
