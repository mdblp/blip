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

import React, { FC } from 'react';
import Dialog from '@mui/material/Dialog'
import { Button, DialogTitle, FormControl, InputLabel, MenuItem } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import { Trans, useTranslation } from 'react-i18next'
import DialogActions from '@mui/material/DialogActions'
import { User } from '../../../../../../lib/auth'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'

interface AddReferrerDialogProps {
  patientName: string
  user: User
  onClose: () => void
}

const DEFAULT_HCP_ID_VALUE = ''

export const AddReferrerDialog: FC<AddReferrerDialogProps> = (props) => {
  const { patientName, user, onClose } = props
  const { t } = useTranslation()

  const [selectedHcpId, setSelectedHcpId] = React.useState(DEFAULT_HCP_ID_VALUE);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedHcpId(event.target.value);
  }

  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>{t('add-referrer-title')}</DialogTitle>
      <DialogContent>
        {user.isUserPatient() ?
          t('add-referrer-description-patient')
          : <Trans
            i18nKey="add-referrer-description"
            t={t}
            components={{ strong: <strong /> }}
            values={{ patientName }}
            parent={React.Fragment}
          />
        }

        <Box sx={{ marginY: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="referrer-name">{t('referrer-name')}</InputLabel>
            <Select
              labelId="referrer-name"
              value={selectedHcpId}
              label={t('referrer-name')}
              onChange={handleChange}
            >
              <MenuItem value={'hcpId1'}>HCP Name 1</MenuItem>
              <MenuItem value={'hcpId2'}>HCP Name 2</MenuItem>
              <MenuItem value={'hcpId3'}>HCP Name 3</MenuItem>
            </Select>
          </FormControl>
        </Box>


        {t('add-referrer-explanation')}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          disabled={selectedHcpId === DEFAULT_HCP_ID_VALUE}
        >
          {t('button-add-referrer')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
