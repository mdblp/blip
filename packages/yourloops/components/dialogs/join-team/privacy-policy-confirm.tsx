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
import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import FormControl from '@mui/material/FormControl'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Trans, useTranslation } from 'react-i18next'
import { type Team } from '../../../lib/team'
import { Link } from '@mui/material'
import { diabeloopExternalUrls } from '../../../lib/diabeloop-urls.model'
import metrics from '../../../lib/metrics'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useTheme } from '@mui/material/styles'

export interface ConfirmTeamProps {
  onCompleteStep: () => Promise<void>
  team: Team
  onClickCancel: () => void
  inProgress?: boolean
}

export const PrivacyPolicyConfirm = (props: ConfirmTeamProps): JSX.Element => {
  const { t } = useTranslation('yourloops')
  const { onCompleteStep, team, onClickCancel, inProgress } = props
  const [policyChecked, setPolicyChecked] = useState<boolean>(false)
  const theme = useTheme()
  const privacyPolicy = t('privacy-policy')

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPolicyChecked(event.target.checked)
  }

  const linkPrivacyPolicy = (
    <Link
      aria-label={privacyPolicy}
      href={diabeloopExternalUrls.privacyPolicy}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        metrics.send('pdf_document', 'view_document', 'privacy_policy')
      }}
    >
      {privacyPolicy}
    </Link>
  )

  return (
    <React.Fragment>
      <DialogTitle>
        <strong>{t('modal-patient-share-team-title')}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText color="textPrimary">
          {t('modal-patient-add-team-info')}
        </DialogContentText>
        <DialogContentText color="textPrimary" data-testid="team-add-dialog-team-infos">
          <br />
          {team.name}
          <br />
          {team.address.line1}
          <br/>
          {team.address.line2}
          {team.address.line2 && <br/>}
          {team.address.zip}
          <br />
          {team.address.city}
          <br />
          {team.code}
          <br />
        </DialogContentText>
        <DialogContentText
          color="textPrimary"
          paddingTop={theme.spacing(1)}
          paddingBottom={theme.spacing(2)}
        >
          <strong>{t('modal-patient-team-warning')}</strong>
        </DialogContentText>

        <FormControl sx={{ marginBottom: theme.spacing(2) }}>
          <FormControlLabel
            control={<Checkbox checked={policyChecked} onChange={handleChangeChecked}
                               inputProps={{ 'aria-label': 'controlled' }} />}
            data-testid="checkbox-policy"
            label={t('modal-patient-share-team-privacy')}
            color="textPrimary"
          />
        </FormControl>
        <DialogContentText color="textPrimary" data-testid="text-privacy-policy">
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
          variant="outlined"
          onClick={onClickCancel}
        >
          {t('button-cancel')}
        </Button>
        <Button
          loading={inProgress}
          id="team-add-dialog-confirm-team-button-add-team"
          disabled={!policyChecked}
          variant="contained"
          color="primary"
          disableElevation
          onClick={onCompleteStep}
        >
          {t('join-team')}
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}
