/*
 * Copyright (c) 2025, Diabeloop
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

import { browserName, browserVersion } from 'react-device-detect'
import moment from 'moment-timezone'
import { v4 as uuidv4 } from 'uuid'
import ErrorApi, { ErrorPayload } from '../lib/error/error.api'
import metrics from '../lib/metrics'

export const logError = (errorMessage: string, context: string): void => {
  try {
    metrics.send('error', context, errorMessage)
    const error = getErrorObject(errorMessage)

    ErrorApi.sendError(error)
  } catch (err) {
    console.error(err)
  }
}

const getErrorObject = (errorMessage: string): ErrorPayload => {
  return {
    browserName,
    browserVersion,
    date: moment(new Date()).format('DD/MM/YYYY'),
    err: errorMessage,
    errorId: uuidv4(),
    path: location.pathname
  }
}
