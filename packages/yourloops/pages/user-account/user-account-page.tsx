/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { setPageTitle } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import { UserAccountPageContextProvider } from './user-account-page-context'
import { UserAccountForm } from './forms/user-account-form'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import { SecurityForm } from './forms/security-form'
import { ProfessionalAccountForm } from './forms/professional-account-form'

export const UserAccountPage: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const theme = useTheme()
  const { user } = useAuth()

  setPageTitle(t('user-account'))

  return (
    <Box marginX={12} marginY={6}>
      <Card variant="outlined" sx={{ padding: theme.spacing(2) }}>
        <CardHeader title={t('user-account')} />

        <CardContent>
          <UserAccountPageContextProvider>
            <UserAccountForm />
          </UserAccountPageContextProvider>

          {!user.isUserPatient() &&
            <SecurityForm />
          }

          {user.isUserCaregiver() &&
            <ProfessionalAccountForm />
          }
        </CardContent>
      </Card>
    </Box>
  )
}
