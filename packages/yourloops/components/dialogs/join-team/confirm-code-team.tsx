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

import { useTranslation } from 'react-i18next'
import React, { createRef, useEffect } from 'react'
import { Team } from '../../../lib/team'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useConfirmCodeTeam from './confirm-code-team.hooks'

export interface ConfirmTeamProps {
  onClickCancel: () => void
  onCompleteStep: (team: Team, teamId?: string) => void
  teamName: string
}

export const ConfirmCodeTeam = (props: ConfirmTeamProps): JSX.Element => {
  const { onClickCancel, onCompleteStep, teamName } = props
  const { t } = useTranslation()
  const inputRef = createRef<HTMLInputElement>()
  const { handleChangeCode, handleClickJoinTeam, joinButtonDisabled, idCode } = useConfirmCodeTeam({ onCompleteStep })

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <React.Fragment>
      <Box textAlign="center">
        <DialogTitle>
          <strong id="team-add-dialog-title">
            {teamName
              ? t('modal-add-medical-specific-team', { careteam: teamName })
              : t('modal-add-medical-team')
            }
          </strong>
        </DialogTitle>

        <DialogContent id="team-add-dialog-content">
          <Box display="flex" flexDirection="column" alignItems="center">
            <DialogContentText>
              {teamName
                ? (t('modal-add-medical-team-code'))
                : (t('modal-add-medical-team-code-no-invite'))
              }
            </DialogContentText>
            <div id="team-add-dialog-field-code-parent" style={{ width: '42%' }}>
              <TextField
                id="team-add-dialog-field-code"
                variant="standard"
                value={idCode}
                onChange={handleChangeCode}
                fullWidth
                inputRef={inputRef}
              />
            </div>
          </Box>
        </DialogContent>
      </Box>

      <DialogActions>
        <Button
          id="team-add-dialog-button-cancel"
          onClick={onClickCancel}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="team-add-dialog-button-add-team"
          disabled={joinButtonDisabled}
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleClickJoinTeam}
        >
          {t('button-add-team')}
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}
