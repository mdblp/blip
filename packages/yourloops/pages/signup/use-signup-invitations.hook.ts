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

import { useCallback, useEffect, useState } from 'react'
import bows from 'bows'

import TeamApi from '../../lib/team/team.api'
import { SignupInvitationsStatus } from './models/enums/signup-invitations-status.enum'

const log = bows('SignupInvitations')

interface SignupInvitations {
  status: SignupInvitationsStatus
  hasInvitations: boolean
  retry: () => void
}

/**
 * Fetch the pending team invitations of the user who is completing the signup.
 */
export const useSignupInvitations = (): SignupInvitations => {
  const [status, setStatus] = useState<SignupInvitationsStatus>(SignupInvitationsStatus.Loading)
  const [hasInvitations, setHasInvitations] = useState<boolean>(false)
  const [attempt, setAttempt] = useState<number>(0)

  useEffect(() => {
    let cancelled = false
    setStatus(SignupInvitationsStatus.Loading)
    TeamApi.getTeamInvitations()
      .then((invitations) => {
        if (cancelled) {
          return
        }
        setHasInvitations(invitations.length > 0)
        setStatus(SignupInvitationsStatus.Ready)
      })
      .catch((error) => {
        log.error(error)
        if (!cancelled) {
          setStatus(SignupInvitationsStatus.Error)
        }
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback((): void => {
    setAttempt((previous) => previous + 1)
  }, [])

  return { status, hasInvitations, retry }
}
