/**
 * Copyright (c) 2021, Diabeloop
 * Remove a patient for an HCP - Dialog
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
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import MedicalServiceIcon from '../icons/MedicalServiceIcon'
import ProgressIconButtonWrapper from '../buttons/progress-icon-button-wrapper'
import { makeButtonsStyles } from '../theme'
import { Patient } from '../../lib/data/patient'
import useRemovePatientDialog from './remove-patient-dialog.hook'

interface RemovePatientDialogProps {
  patient: Patient | null
  onClose: () => void
}

const makeButtonClasses = makeStyles(makeButtonsStyles, { name: 'ylp-dialog-remove-patient-dialog-buttons' })

const RemovePatientDialog: FunctionComponent<RemovePatientDialogProps> = ({ onClose, patient }) => {
  const { t } = useTranslation('yourloops')
  const buttonClasses = makeButtonClasses()
  const {
    selectedTeamId,
    sortedTeams,
    processing,
    handleOnClickRemove,
    setSelectedTeamId,
    patientName
  } = useRemovePatientDialog({ patient, onClose })

  return (
    <Dialog
      id="remove-hcp-patient-dialog"
      data-testid="remove-hcp-patient-dialog"
      open
      onClose={onClose}
    >
      <DialogTitle>
        <strong>{t('remove-patient')}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t('team-modal-remove-patient-choice', { patientName })}
        </DialogContentText>
      </DialogContent>

      <DialogContent>
        <FormControl
          fullWidth
          required
          variant="outlined"
        >
          <InputLabel>{t('select-team')}</InputLabel>
          <Select
            data-testid="patient-team-selector"
            label={t('select-team')}
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value as string)}
          >
            {sortedTeams.map((team, index) => (
              <MenuItem
                value={team.id}
                key={index}
                data-testid={`select-option-${team.name}`}
              >
                {team.code === 'private'
                  ? <Box display="flex" alignItems="center">
                    <React.Fragment>
                      <Box display="flex" ml={0} mr={1}>
                        <MedicalServiceIcon color="primary" />
                      </Box>
                      {t('private-practice')}
                    </React.Fragment>
                  </Box>
                  : team.name
                }
              </MenuItem>
            ))
            }
          </Select>
        </FormControl>
      </DialogContent>

      {sortedTeams.length === 1 &&
        <DialogContent>
          <DialogContentText>
            {t('modal-remove-patient-info-2')}
          </DialogContentText>
        </DialogContent>
      }

      <DialogActions>
        <Button onClick={onClose}>
          {t('button-cancel')}
        </Button>
        <ProgressIconButtonWrapper inProgress={processing}>
          <Button
            data-testid="remove-patient-dialog-validate-button"
            className={buttonClasses.alertActionButton}
            disabled={!selectedTeamId || processing}
            variant="contained"
            disableElevation
            onClick={handleOnClickRemove}
          >
            {t('remove-patient')}
          </Button>
        </ProgressIconButtonWrapper>
      </DialogActions>
    </Dialog>
  )
}

export default RemovePatientDialog
