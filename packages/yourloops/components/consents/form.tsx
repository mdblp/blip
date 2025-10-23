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

import React, { type FunctionComponent } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Link from '@mui/material/Link'

import { diabeloopExternalUrls } from '../../lib/diabeloop-urls.model'
import { type ConsentCheck } from './models/consent-check.model'
import { type ConsentFormProps } from './models/consent-form-props.model'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'
import { ConsentHcpConfirmAck } from './hcp-confirm-ack'

const formStyles = makeStyles({ name: 'ylp-form-consents' })((theme: Theme) => {
  return {
    formControlLabel: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    formGroup: {
      textAlign: 'left'
    },
    checkbox: {
      marginBottom: 'auto'
    }
  }
})

export const ConsentPrivacyPolicy: FunctionComponent<ConsentCheck> = ({ id, userRole, checked, onChange }) => {
  const { t } = useTranslation('yourloops')
  const { classes } = formStyles()

  const checkboxPolicy = (
    <Checkbox
      id={`${id}-checkbox-privacy-policy`}
      aria-label={t('privacy-policy-checkbox')}
      className={classes.checkbox}
      checked={checked}
      onChange={onChange}
      name="policy"
    />
  )
  const privacyPolicy = t('privacy-policy')
  const linkPrivacyPolicy = (
    <Link
      aria-label={privacyPolicy}
      href={diabeloopExternalUrls.privacyPolicy}
      target="_blank"
      rel="noreferrer"
    >
      {privacyPolicy}
    </Link>
  )
  const labelPrivacyPolicy = (
    <Trans
      i18nKey={`consent-${userRole}-privacy-policy`}
      t={t}
      components={{ linkPrivacyPolicy }}
      values={{ privacyPolicy }}
      parent={React.Fragment}
    >
      I have read and accepted YourLoops {privacyPolicy}.
    </Trans>
  )

  return (
    <FormControlLabel
      data-testid={`${id}-label-privacy-policy`}
      control={checkboxPolicy}
      label={labelPrivacyPolicy}
      className={classes.formControlLabel}
    />
  )
}

export const ConsentTerms: FunctionComponent<ConsentCheck> = ({ id, userRole, checked, onChange }) => {
  const { t } = useTranslation('yourloops')
  const { classes } = formStyles()

  const checkboxTerms = (
    <Checkbox
      id={`${id}-checkbox-terms`}
      aria-label={t('terms-checkbox')}
      className={classes.checkbox}
      checked={checked}
      onChange={onChange}
      name="terms"
    />
  )
  const terms = t('terms-of-use')
  const linkTerms = (
    <Link aria-label={terms} href={diabeloopExternalUrls.terms} target="_blank" rel="noreferrer">
      {terms}
    </Link>
  )
  const labelTerms = (
    <Trans
      i18nKey={`consent-${userRole}-terms-of-use`}
      t={t}
      components={{ linkTerms }}
      values={{ terms }}
      parent={React.Fragment}
    >
      I have read and accepted YourLoops {terms}.
    </Trans>
  )

  return (
    <FormControlLabel
      data-testid={`${id}-label-terms`}
      control={checkboxTerms}
      label={labelTerms}
      className={classes.formControlLabel}
    />
  )
}

export const ConsentFeedback: FunctionComponent<ConsentCheck> = ({ id, userRole, checked, onChange }) => {
  const { t } = useTranslation('yourloops')
  const { classes } = formStyles()

  const checkboxFeedback = (
    <Checkbox
      data-testid={`${id}-checkbox-feedback`}
      aria-label={t('feedback-checkbox')}
      className={classes.checkbox}
      checked={checked}
      onChange={onChange}
      name="feedback"
    />
  )

  const labelFeedback = (
    <Trans i18nKey={`consent-${userRole}-feedback`} t={t}>
      I agree to receive information and news from Diabeloop. <i>(optional)</i>
    </Trans>
  )

  return (
    <FormControlLabel
      data-testid={`${id}-label-feedback`}
      control={checkboxFeedback}
      label={labelFeedback}
      className={classes.formControlLabel}
    />
  )
}

const ConsentForm: FunctionComponent<ConsentFormProps> = (props) => {
  const {
    userRole,
    id,
    className,
    group,
    policyAccepted,
    setPolicyAccepted,
    hcpConfirmAcknowledged,
    setHcpConfirmAcknowledged,
    termsAccepted,
    setTermsAccepted,
    feedbackAccepted,
    setFeedbackAccepted
  } = props

  const { classes } = formStyles()
  const showFeedback = typeof setFeedbackAccepted === 'function' && userRole === UserRole.Hcp

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const what = event.target.name
    switch (what) {
      case 'policy':
        setPolicyAccepted(!policyAccepted)
        break
      case 'terms':
        setTermsAccepted(!termsAccepted)
        break
      case 'feedback':
        if (typeof setFeedbackAccepted === 'function') {
          setFeedbackAccepted(!feedbackAccepted)
        }
        break
      default:
        throw new Error('Invalid change type')
    }
  }

  return (
    <FormControl className={className}>
      <FormGroup className={`${classes.formGroup} ${group ?? ''}`}>
        {userRole === UserRole.Hcp && setHcpConfirmAcknowledged &&
          <ConsentHcpConfirmAck
            id={id}
            checked={!!hcpConfirmAcknowledged}
            onChange={() => { setHcpConfirmAcknowledged(!hcpConfirmAcknowledged) }}
          />
        }
        <ConsentPrivacyPolicy
          id={id}
          userRole={userRole}
          checked={policyAccepted}
          onChange={handleChange}
        />
        <ConsentTerms
          id={id}
          userRole={userRole}
          checked={termsAccepted}
          onChange={handleChange}
        />
        {showFeedback &&
          <ConsentFeedback
            id={id}
            userRole={userRole}
            checked={!!feedbackAccepted}
            onChange={handleChange}
          />
        }
      </FormGroup>
    </FormControl>
  )
}

export default ConsentForm
