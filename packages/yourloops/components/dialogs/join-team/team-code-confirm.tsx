/*
 * Copyright (c) 2023-2025, Diabeloop
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
import React, { createRef, useEffect, useState } from 'react'
import { REGEX_TEAM_CODE_DISPLAY, type Team, useTeam } from '../../../lib/team'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useAlert } from '../../utils/snackbar'
import { getNumericCode } from '../../../lib/team/team-code.utils'
import { LoadingButton } from '@mui/lab'
import { logError } from '../../../utils/error.util'
import { errorTextFromException } from '../../../lib/utils'
import { formatCode } from '../../../utils/format.utils'

export interface ConfirmTeamProps {
  onClickCancel: () => void
  onCompleteStep: (team: Team) => void
  teamName?: string
}

export const TeamCodeConfirm = (props: ConfirmTeamProps): JSX.Element => {
  const { onClickCancel, onCompleteStep, teamName } = props
  const { t } = useTranslation()
  const inputRef = createRef<HTMLInputElement>()
  const teamHook = useTeam()
  const alert = useAlert()
  const [numericCode, setNumericCode] = useState<string>('')
  const [idCode, setIdCode] = useState<string>('')
  const [isInProgress, setIsInProgress] = useState<boolean>(false)
  const joinButtonDisabled = !idCode.match(REGEX_TEAM_CODE_DISPLAY)

  const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const numericCode = getNumericCode(event.target.value)
    const displayCode = formatCode(numericCode)
    setIdCode(displayCode)
    setNumericCode(numericCode)
  }

  const handleClickJoinTeam = async (): Promise<void> => {
    if (numericCode !== '') {
      const team = teamHook.teams.find((team) => team.code === numericCode)
      if (team) {
        alert.error(t('modal-patient-add-team-failure-exists'))
        return
      }
      try {
        setIsInProgress(true)
        const team = await teamHook.getTeamFromCode(numericCode)
        if (!team) {
          alert.error(t('invalid-code'))
          return
        }
        onCompleteStep(team)
      } catch (err) {
        const errorMessage = errorTextFromException(err)
        logError(errorMessage, 'join-team')

        alert.error(t('modal-patient-add-team-failure'))
      } finally {
        setIsInProgress(false)
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <React.Fragment>
      <Box textAlign="center">
        <DialogTitle>
          <strong data-testid="team-add-dialog-title">
            {t('join-team-title', { teamName })}
          </strong>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <DialogContentText data-testid="label-dialog">
              {t('team-code')}
            </DialogContentText>
            <Box>
              <TextField
                id="field-code"
                variant="standard"
                value={idCode}
                onChange={handleChangeCode}
                fullWidth
                inputRef={inputRef}
                InputProps={{ sx: { width: 120, '& > input': { textAlign: 'center' } } }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Box>

      <DialogActions>
        <Button
          id="team-add-dialog-button-cancel"
          variant="outlined"
          onClick={onClickCancel}
        >
          {t('button-cancel')}
        </Button>
        <LoadingButton
          loading={isInProgress}
          id="team-add-dialog-button-add-team"
          disabled={joinButtonDisabled}
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleClickJoinTeam}
        >
          {t('button-continue')}
        </LoadingButton>
      </DialogActions>
    </React.Fragment>
  )
}
