/*
 * Copyright (c) 2021-2025, Diabeloop
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

import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'

import { REGEX_EMAIL } from '../../lib/utils'

import { type AddMemberDialogContentProps } from './types'
import { TeamMemberRole, type TypeTeamMemberRole } from '../../lib/team/models/enums/team-member-role.enum'

export interface AddMemberDialogProps {
  addMember: null | AddMemberDialogContentProps
}

function AddMemberDialog(props: AddMemberDialogProps): JSX.Element | null {
  const { addMember } = props

  const { t } = useTranslation('yourloops')
  const [email, setEMail] = React.useState('')
  const [role, setRole] = React.useState<Exclude<TypeTeamMemberRole, 'patient'>>(TeamMemberRole.member)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  const teamName = addMember?.team.name ?? ''

  const handleChangeEMail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const eMail = e.target.value
    setEMail(eMail)
    setButtonDisabled(!REGEX_EMAIL.test(eMail))
  }
  const handleChangeRole = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setRole(checked ? TeamMemberRole.admin : TeamMemberRole.member)
  }

  const handleClickClose = (): void => {
    addMember?.onMemberInvited(null)
    setEMail('')
    setButtonDisabled(true)
    setRole(TeamMemberRole.member)
  }

  const handleClickAdd = (): void => {
    addMember?.onMemberInvited({ email, role, team: addMember?.team })
    setEMail('')
    setButtonDisabled(true)
    setRole(TeamMemberRole.member)
  }

  return (
    <Dialog
      id="team-add-member-dialog"
      open={addMember !== null}
      aria-labelledby={t('aria-team-add-member-dialog-title', { teamName })}
      onClose={handleClickClose}
      fullWidth
    >
      <DialogTitle>
        <strong id="team-add-member-dialog-title">{t('team-add-member-dialog-title')}</strong>
        <br />
        <span id="team-add-member-dialog-title-team-name">{teamName}</span>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}>
          <TextField
            id="team-add-member-dialog-field-email"
            onChange={handleChangeEMail}
            name="email"
            value={email}
            label={t('email')}
            required
            aria-required="true"
            type="email"
          />
          <FormControlLabel
            control={
              <Checkbox
                id="team-add-member-dialog-checkbox-admin"
                checked={role === TeamMemberRole.admin}
                onChange={handleChangeRole}
                name="role"
              />
            }
            label={t('team-add-member-dialog-checkbox-admin')}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          id="team-add-member-dialog-button-cancel"
          variant="outlined"
          onClick={handleClickClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="team-add-member-dialog-button-add"
          color="primary"
          variant="contained"
          disableElevation
          disabled={buttonDisabled}
          onClick={handleClickAdd}
        >
          {t('button-invite')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMemberDialog
