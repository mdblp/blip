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
import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import FormControl from '@mui/material/FormControl'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Trans, useTranslation } from 'react-i18next'
import { Team } from '../../../lib/team'
import useConfirmPrivacyPolicy from './confirm-privacy-policy.hook'
import { Link } from '@mui/material'
import { diabeloopExternalUrls } from '../../../lib/diabeloop-urls.model'
import metrics from '../../../lib/metrics'
import FormControlLabel from '@mui/material/FormControlLabel'

export interface ConfirmTeamProps {
  onCompleteStep: () => Promise<void>
  team: Team
  onClickCancel: () => void

}

const addTeamDialogClasses = makeStyles({ name: 'ylp-patient-join-team-dialog' })((theme: Theme) => {
  return {
    formControl: {
      marginBottom: theme.spacing(2)
    },
    divTeamCodeField: {
      marginTop: theme.spacing(2),
      width: '8em'
    },
    checkboxPrivacy: {
      marginBottom: 'auto'
    }
  }
})

export const ConfirmPrivacyPolicy = (props: ConfirmTeamProps): JSX.Element => {
  const { t } = useTranslation('yourloops')
  const { classes } = addTeamDialogClasses()
  const { onCompleteStep, team, onClickCancel } = props
  const {
    handleChangeChecked,
    checked,
    buttonAddTeamDisabled
  } = useConfirmPrivacyPolicy()
  const privacyPolicy = t('privacy-policy')
  const linkPrivacyPolicy = (
    <Link
      aria-label={privacyPolicy}
      href={diabeloopExternalUrls.privacyPolicy}
      target="_blank"
      rel="noreferrer"
      onClick={() => metrics.send('pdf_document', 'view_document', 'privacy_policy')}
    >
      {privacyPolicy}
    </Link>
  )

  return (
    <React.Fragment>
      <DialogTitle id="team-add-dialog-confirm-title">
        <strong>{t('modal-patient-share-team-title')}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="team-add-dialog-confirm-info" color="textPrimary">
          {t('modal-patient-add-team-info')}
        </DialogContentText>
        <DialogContentText color="textPrimary" data-testid='team-add-dialog-team-infos'>
          <br />
          {team.name}
          <br />
          {team.address.line1}
          {team.address.line2 ?? ''}
          {team.address.line2 ? null : <br />}
          {team.address.zip}
          <br />
          {team.address.city}
          <br />
          {team.code}
          <br />
        </DialogContentText>
        <DialogContentText color="textPrimary">
          <strong>{t('modal-patient-team-warning')}</strong>
        </DialogContentText>

        <FormControl className={classes.formControl}>
          <FormControlLabel id="team-add-dialog-confirm-team-privacy-checkbox-policy" control={<Checkbox checked={checked} onChange={handleChangeChecked} inputProps={{ 'aria-label': 'controlled' }} />}
            data-testid="check-policy"
            label={t('modal-patient-share-team-privacy')}
            color="textPrimary" />
        </FormControl>
        <DialogContentText id="team-add-dialog-config-team-privacy-read-link" color="textPrimary"
                           data-testid="text-privacy-policy">
          <Trans
            i18nKey="modal-patient-team-privacy-2"
            t={t}
            components={{ linkPrivacyPolicy }}
            values={{ privacyPolicy }}
            parent={React.Fragment}>
            Read our {linkPrivacyPolicy} for more information.
          </Trans>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          id="team-add-dialog-confirm-team-button-cancel"
          onClick={onClickCancel}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="team-add-dialog-confirm-team-button-add-team"
          disabled={!buttonAddTeamDisabled}
          variant="contained"
          color="primary"
          disableElevation
          onClick={onCompleteStep}
        >
          {t('button-add-medical-team')}
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}
