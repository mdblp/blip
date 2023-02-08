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
import React, { FunctionComponent } from 'react'
import { ConfirmCodeTeam } from './confirm-code-team'
import Dialog from '@mui/material/Dialog'
import { ConfirmPrivacyPolicy } from './confirm-privacy-policy'
import useJoinTeamDialog from './join-team-dialog.hook'

export interface JoinTeamDialogProps {
  onClose: (teamId?: string) => Promise<void>
  error?: string
  teamName?: string
}

export const JoinTeamDialog: FunctionComponent<JoinTeamDialogProps> = (props) => {
  const { onClose, teamName } = props
  const { teamId, team, closeDialog, currentStep, goToNextStep } = useJoinTeamDialog({ onClose })
  return (
    <React.Fragment>
      <Dialog onClose={onClose} open>
        {currentStep === 1 &&
          <ConfirmCodeTeam
            onCompleteStep={goToNextStep}
            onClickCancel={closeDialog}
            teamName={teamName}
          />
        }
        {currentStep === 2 &&
          <ConfirmPrivacyPolicy
            onCompleteStep={() => closeDialog(teamId)}
            onClickCancel={closeDialog}
            team={team}
          />
        }
      </Dialog>
    </React.Fragment>
  )
}
