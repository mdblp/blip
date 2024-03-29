/*
 * Copyright (c) 2023, Diabeloop
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
import React, { type FunctionComponent, useState } from 'react'
import { TeamCodeConfirm } from './team-code-confirm'
import Dialog from '@mui/material/Dialog'
import { PrivacyPolicyConfirm } from './privacy-policy-confirm'
import { type Team } from '../../../lib/team'

export interface JoinTeamDialogProps {
  onClose: () => void
  onAccept: (teamId: string) => Promise<void>
  teamName?: string
}

export const JoinTeamDialog: FunctionComponent<JoinTeamDialogProps> = (props) => {
  const { onClose, onAccept, teamName } = props
  const [team, setTeam] = useState<Team | undefined>(undefined)
  const [isInProgress, setIsInProgress] = useState<boolean>(false)

  const onCompleteTeamCodeConfirmStep = (team: Team): void => {
    setTeam(team)
  }

  const onCompletePolicyConfirmStep = async (): Promise<void> => {
    setIsInProgress(true)
    await onAccept(team.id)
  }

  return (
    <Dialog onClose={onClose} open data-testid="join-team-dialog">
      {!team ? (
        <TeamCodeConfirm
          onCompleteStep={onCompleteTeamCodeConfirmStep}
          onClickCancel={onClose}
          teamName={teamName}
        />
      ) : (
        <PrivacyPolicyConfirm
          onCompleteStep={onCompletePolicyConfirmStep}
          inProgress={isInProgress}
          onClickCancel={onClose}
          team={team}
        />
      )
      }
    </Dialog>
  )
}
