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

import React, { FC } from 'react'
import Dialog from '@mui/material/Dialog'
import { Button, DialogTitle, FormControl, InputLabel, MenuItem } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import { Trans, useTranslation } from 'react-i18next'
import DialogActions from '@mui/material/DialogActions'
import { User } from '../../../../../../../lib/auth'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useAddClinicianDialog } from './add-clinician-dialog.hook'

interface AddClinicianDialogProps {
  patientInfo: { id: string, name: string }
  user: User
  clinicianIds: string[]
  onClose: () => void
  onSuccess: () => void
}

const DEFAULT_HCP_ID_VALUE = ''

export const AddClinicianDialog: FC<AddClinicianDialogProps> = (props) => {
  const { patientInfo, user, clinicianIds, onClose, onSuccess } = props
  const { t } = useTranslation()

  const [selectedHcpId, setSelectedHcpId] = React.useState(DEFAULT_HCP_ID_VALUE)
  const patientId = patientInfo.id
  const { getAvailableHcps, onClickAddClinician } = useAddClinicianDialog({
    patientId,
    clinicianIds,
    selectedHcpId,
    onSuccess,
    onClose
  })

  const patientName = patientInfo.name

  const availableHcps = getAvailableHcps()

  const sortedAvailableHcpList = availableHcps.toSorted((a, b) => a.profile.fullName.localeCompare(b.profile.fullName))

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedHcpId(event.target.value)
  }

  return (
    <Dialog onClose={onClose} open={true} data-testid="add-clinician-dialog">
      <DialogTitle>{t('add-clinician-title')}</DialogTitle>
      <DialogContent>
        {user.isUserPatient() ?
          t('add-clinician-description-patient')
          : <Trans
            i18nKey="add-clinician-description"
            t={t}
            components={{ strong: <strong /> }}
            values={{ patientName }}
            parent={React.Fragment}
          />
        }

        <Box sx={{ marginY: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="clinician-name">{t('clinician-name')}</InputLabel>
            <Select
              labelId="clinician-name"
              value={selectedHcpId}
              label={t('clinician-name')}
              onChange={handleChange}
              MenuProps={{ sx: { maxHeight: 300 } }}
              data-testid="add-clinician-select"
            >
              {sortedAvailableHcpList.map((hcp) => (
                <MenuItem
                  key={hcp.userId}
                  value={hcp.userId}
                  data-testid={`select-option-${hcp.profile?.fullName}`}
                >
                  {hcp.profile?.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {t('add-clinician-explanation')}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          data-testid="add-clinician-cancel-button"
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onClickAddClinician}
          disabled={selectedHcpId === DEFAULT_HCP_ID_VALUE}
          data-testid="add-clinician-confirm-button"
        >
          {t('button-add-clinician')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
