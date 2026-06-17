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

import HttpService, { ErrorMessageStatus } from '../http/http.service'
import { ExternalConsent } from './models/external-consent.model'
import { PartnerDetails } from './models/partner-details.model'
import type { PatientDataRange } from '../data/models/data-range.model'

const EXTERNAL_CONSENTS_URL = '/health-bridge/patient-consents'
const PARTNER_DETAILS_URL = '/health-bridge/partners'

export class ExternalConsentsApi {

  static async getPartnerDetails(partnerId: string): Promise<PartnerDetails> {
    try {
      const { data } = await HttpService.get<PartnerDetails>({ url: `${PARTNER_DETAILS_URL}/${partnerId}` })
      return data
    } catch (err) {
      return null
    }
  }

  static async getConsents(): Promise<ExternalConsent[]> {
    const { data } = await HttpService.get<ExternalConsent[]>({ url: EXTERNAL_CONSENTS_URL })
    return data
  }

  static async addConsent(patientId: string, partnerId: string): Promise<void> {
    await HttpService.post({
      url: EXTERNAL_CONSENTS_URL,
      payload: {
        userId: patientId,
        partnerId
      }
    })
  }

  static async revokeConsent(patientId: string, partnerId: string): Promise<void> {
    await HttpService.delete({
      url: EXTERNAL_CONSENTS_URL,
      config: {
        data: {
          userId: patientId,
          partnerId
        }
      }
    })
  }
}
