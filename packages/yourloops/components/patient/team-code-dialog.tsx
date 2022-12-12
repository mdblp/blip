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

import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export interface TeamCodeDialogProps {
  /** Team code */
  code: string
  /** Team name */
  name: string
  /** Close the modal event callback */
  onClose: () => void
}

const reCode = /^([0-9]{3})([0-9]{3})([0-9]{3})$/
const dialogClasses = makeStyles({ name: 'ylp-dialog-team-code' })((theme: Theme) => {
  return {
    contentCode: {
      display: 'flex',
      fontSize: 'x-large'
    },
    divTeamCode: {
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: theme.palette.grey[200], // eslint-disable-line no-magic-numbers
      paddingLeft: '1rem',
      paddingRight: '1rem',
      paddingTop: '0.3rem',
      paddingBottom: '0.3rem',
      borderColor: theme.palette.grey[200], // eslint-disable-line no-magic-numbers
      borderWidth: '1px',
      borderRadius: theme.shape.borderRadius
    }
  }
})

function TeamCodeDialog(props: TeamCodeDialogProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { classes } = dialogClasses()
  const { code, name, onClose } = props
  const dialogIsOpen = !!code.match(reCode)

  return (
    <Dialog
      id="patient-list-dialog-team-code"
      aria-labelledby={t('identification-code')}
      open={dialogIsOpen}
      onClose={onClose}
    >
      <DialogTitle>
        <strong id="patient-list-dialog-team-code-title">{name}</strong>
      </DialogTitle>

      <DialogContent id="patient-list-dialog-team-code-content-placeholder">
        <DialogContentText id="patient-list-dialog-team-code-content-placeholder-1">
          {t('modal-team-code-descr-placeholder')}
        </DialogContentText>
        <DialogContentText id="patient-list-dialog-team-code-content-placeholder-2">
          {t('modal-team-code-descr-placeholder-2')}
        </DialogContentText>
      </DialogContent>

      <DialogContent id="patient-list-dialog-team-code-content-code" className={classes.contentCode}>
        {dialogIsOpen &&
          <div className={classes.divTeamCode}>
            {code.replace(reCode, '$1 - $2 - $3')}
          </div>
        }
      </DialogContent>

      <DialogActions>
        <Button
          id="patient-list-dialog-team-code-button-ok"
          onClick={onClose}
        >
          {t('button-ok')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TeamCodeDialog
