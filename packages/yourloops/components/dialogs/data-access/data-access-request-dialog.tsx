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

import React, { FC, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import { DataAccessRequest } from './data-access-request'
import { DataAccessResultValue } from '../../../lib/external-consents/models/enum/data-access-result-value.enum'
import { DataAccessResult } from './data-access-result'
import { ExternalConsentsApi } from '../../../lib/external-consents/external-consents.api'
import { errorTextFromException } from '../../../lib/utils'
import { logError } from '../../../utils/error.util'
import { PartnerName } from '../../../lib/external-consents/models/enum/partner-name.enum'

interface DataAccessRequestDialogProps {
  patientId: string
  partnerId: string
  callbackUrl: string
  partnerState: string
  partnerName: PartnerName
}

export const DataAccessRequestDialog: FC<DataAccessRequestDialogProps> = (props) => {
  const { callbackUrl, patientId, partnerId, partnerState, partnerName } = props
  const [result, setResult] = useState<DataAccessResultValue | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)


  const onAcceptAccess = async () => {
    setIsLoading(true)
    try {
      await ExternalConsentsApi.addConsent(patientId, partnerId)

      setResult(DataAccessResultValue.Accepted)
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'add-consent')

      setResult(DataAccessResultValue.Error)
    }

    setIsLoading(false)
  }

  const onDenyAccess = () => {
    setResult(DataAccessResultValue.Denied)
  }

  return (
    <Dialog open data-testid="data-access-request-dialog">
      {result
        ? <DataAccessResult
          partnerName={partnerName}
          result={result}
          callbackUrl={callbackUrl}
          patientId={patientId}
          partnerState={partnerState}
        />
        : <DataAccessRequest
          partnerName={partnerName}
          onAcceptAccess={onAcceptAccess}
          onDenyAccess={onDenyAccess}
          isLoading={isLoading}
        />
      }
    </Dialog>
  )
}
