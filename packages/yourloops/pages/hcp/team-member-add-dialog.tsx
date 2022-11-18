/*
 * Copyright (c) 2021-2022, Diabeloop
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

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'

import { TeamMemberRole, TypeTeamMemberRole } from '../../models/team'
import { REGEX_EMAIL } from '../../lib/utils'

import { AddMemberDialogContentProps } from './types'

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
      <DialogTitle id="team-add-member-dialog-title">
        <strong>{t('team-add-member-dialog-title')}</strong>
        <br />
        <span id="team-add-member-dialog-title-team-name">{teamName}</span>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column">
          <TextField
            id="team-add-member-dialog-field-email"
            variant="outlined"
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
                color="primary"
              />
            }
            label={t('team-add-member-dialog-checkbox-admin')}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          id="team-add-member-dialog-button-cancel"
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
