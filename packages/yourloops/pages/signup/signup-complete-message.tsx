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

import React, { type FC } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSignUpFormState } from './signup-formstate-context'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'

export const SignupCompleteMessage: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signupForm } = useSignUpFormState()
  const isHcpSelected = signupForm.accountRole === UserRole.Hcp

  const redirectToHome = (): void => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        paddingX: 2,
        paddingTop: 1,
        textAlign: "left"
      }}>
      <Typography id="signup-steppers-ending-text-1" variant="h6" gutterBottom>
        {t('account-creation-finalized')}
      </Typography>
      <Typography gutterBottom>
        {t('account-created-info-1')}.
      </Typography>
      <Typography data-testid="message-complete-account">
        {t(isHcpSelected ? 'account-created-info-2-hcp' : 'account-created-info-2-caregiver')}
      </Typography>
      <Box
        id="signup-consent-button-group"
        sx={{
          display: "flex",
          justifyContent: "center",
          mx: 0,
          mt: 4
        }}>
        <Button
          data-testid="validate-account-completion"
          variant="contained"
          color="primary"
          disableElevation
          onClick={redirectToHome}
        >
          {t('button-continue')}
        </Button>
      </Box>
    </Box>
  )
}
