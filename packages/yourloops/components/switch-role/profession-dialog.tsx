/*
 * Copyright (c) 2022, Diabeloop
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

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle'

import { HcpProfession, HcpProfessionList } from '../../models/hcp-profession.model'
import { SwitchRoleProfessionDialogProps } from './models'
import BasicDropdownWithValidation from '../dropdown/basic-dropdown-with-validation'

function SwitchRoleProfessionDialog(props: SwitchRoleProfessionDialogProps): JSX.Element {
  const { open, onAccept, onCancel } = props
  const { t } = useTranslation('yourloops')

  const [hcpProfession, setHcpProfession] = React.useState<HcpProfession>(HcpProfession.empty)

  const handleAccept = (): void => {
    onAccept(hcpProfession)
  }

  const onClose = (): void => {
    onCancel()
    setHcpProfession(HcpProfession.empty)
  }

  return (
    <Dialog
      id="switch-role-profession-dialog"
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <DialogTitle id="patient-add-caregiver-dialog-title">
        <strong>{t('profession-dialog-title')}</strong>
      </DialogTitle>
      <DialogContent id="switch-role-consequences-dialog-content">
        <Box>
          <BasicDropdownWithValidation
            onSelect={setHcpProfession}
            defaultValue={HcpProfession.empty}
            disabledValues={[]}
            values={HcpProfessionList.filter(item => item !== HcpProfession.empty)}
            id="profession"
            inputTranslationKey="hcp-profession"
            errorTranslationKey="profession-dialog-title"
          />
        </Box>
      </DialogContent>

      <DialogActions id="switch-role-profession-dialog-actions">
        <Button
          id="switch-role-profession-dialog-button-decline"
          onClick={onClose}
        >
          {t('button-decline')}
        </Button>
        <Button
          id="switch-role-profession-dialog-button-validate"
          variant="contained"
          color="primary"
          disableElevation
          disabled={hcpProfession === HcpProfession.empty}
          onClick={handleAccept}
        >
          {t('button-validate')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SwitchRoleProfessionDialog
