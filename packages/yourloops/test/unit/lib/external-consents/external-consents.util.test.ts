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

import { ConfigService } from '../../../../lib/config/config.service'
import { validatePartner } from '../../../../lib/external-consents/external-consents.util'
import { PartnerName } from '../../../../lib/external-consents/models/enum/partner-name.enum'
import { ExternalConsentsApi } from '../../../../lib/external-consents/external-consents.api'

describe('External consents util', () => {

  describe('validatePartner', () => {
    const partnerId = 'some-partner-id'
    const callbackUrl = 'https://valid-callback.com'

    it('should return null when getPartnerDetails returns null', async () => {
      jest.spyOn(ExternalConsentsApi, 'getPartnerDetails').mockResolvedValue(null)

      const result = await validatePartner(partnerId, callbackUrl)

      expect(result).toBeNull()
    })

    it('should return null when authorizedCallbackUrls is empty', async () => {
      jest.spyOn(ExternalConsentsApi, 'getPartnerDetails').mockResolvedValue({
        id: partnerId,
        name: PartnerName.GlookoXT,
        authorizedCallbackUrls: []
      })

      const result = await validatePartner(partnerId, callbackUrl)

      expect(result).toBeNull()
    })

    it('should return the partner name when callbackUrl matches an authorized URL', async () => {
      jest.spyOn(ExternalConsentsApi, 'getPartnerDetails').mockResolvedValue({
        id: partnerId,
        name: PartnerName.GlookoXT,
        authorizedCallbackUrls: ['https://other-url.com', callbackUrl]
      })

      const result = await validatePartner(partnerId, callbackUrl)

      expect(result).toBe(PartnerName.GlookoXT)
    })

    it('should return null when callbackUrl does not match any authorized URL', async () => {
      jest.spyOn(ExternalConsentsApi, 'getPartnerDetails').mockResolvedValue({
        id: partnerId,
        name: PartnerName.MyDiabby,
        authorizedCallbackUrls: ['https://other-url.com', 'https://another-url.com']
      })

      const result = await validatePartner(partnerId, callbackUrl)

      expect(result).toBeNull()
    })
  })
})


