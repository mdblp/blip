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

import { act, renderHook, waitFor } from '@testing-library/react'
import TeamApi from '../../../../lib/team/team.api'
import { type ITeam } from '../../../../lib/team/models/i-team.model'
import { useSignupInvitations } from '../../../../pages/signup/use-signup-invitations.hook'
import { SignupInvitationsStatus } from '../../../../pages/signup/models/enums/signup-invitations-status.enum'

describe('useSignupInvitations', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be loading, then ready without invitations when the list is empty', async () => {
    jest.spyOn(TeamApi, 'getTeamInvitations').mockResolvedValue([])
    const { result } = renderHook(() => useSignupInvitations())

    expect(result.current.status).toBe(SignupInvitationsStatus.Loading)
    await waitFor(() => { expect(result.current.status).toBe(SignupInvitationsStatus.Ready) })
    expect(result.current.hasInvitations).toBe(false)
  })

  it('should be ready with invitations when the list is not empty', async () => {
    jest.spyOn(TeamApi, 'getTeamInvitations').mockResolvedValue([{ id: 'team', name: 'Team' } as ITeam])
    const { result } = renderHook(() => useSignupInvitations())

    await waitFor(() => { expect(result.current.status).toBe(SignupInvitationsStatus.Ready) })
    expect(result.current.hasInvitations).toBe(true)
  })

  it('should be in error when the call fails, and recover on retry', async () => {
    const getInvitations = jest.spyOn(TeamApi, 'getTeamInvitations').mockRejectedValueOnce(new Error('mocked error'))
    const { result } = renderHook(() => useSignupInvitations())

    await waitFor(() => { expect(result.current.status).toBe(SignupInvitationsStatus.Error) })
    expect(result.current.hasInvitations).toBe(false)

    getInvitations.mockResolvedValueOnce([{ id: 'team', name: 'Team' } as ITeam])
    act(() => { result.current.retry() })

    expect(result.current.status).toBe(SignupInvitationsStatus.Loading)
    await waitFor(() => { expect(result.current.status).toBe(SignupInvitationsStatus.Ready) })
    expect(result.current.hasInvitations).toBe(true)
    expect(getInvitations).toHaveBeenCalledTimes(2)
  })
})
