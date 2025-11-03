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

import React, { type FunctionComponent, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import config from '../../lib/config/config'
import { GlobalStyles } from 'tss-react'
import { useAuth } from '../../lib/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { setPageTitle } from '../../lib/utils'
import { useTheme } from '@mui/material/styles'
import { registerDblCommunicationAck } from '../../lib/dbl-communication/storage'
import { BasicHeader } from '../../components/header-bars/basic-header'


export const DblCommunicationPage: FunctionComponent = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = location.state?.from?.pathname
  let communicationTitle = ''
  let communicationContent = ''

  if (user?.newDblCommunication) {
    communicationTitle = user.newDblCommunication.title
    communicationContent = user.newDblCommunication.content
  }


  const ackInformation = (): void => {
    registerDblCommunicationAck(user.newDblCommunication.id)
    navigate(fromPath ?? '/')
  }

  setPageTitle(t('important-information'))

  return (
    <>
      <BasicHeader testId="dbl-comm-header"/>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
        textAlign="center"
        data-testid="dbl-comm-content"
      >
        <GlobalStyles styles={{ body: { backgroundColor: theme.palette.common.white } }} />

        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <img
              data-testid="header-main-logo"
              aria-label={t('alt-img-logo')}
              src={`/branding_${config.BRANDING}_logo.svg`}
              alt={t('alt-img-logo')}
              width="140" />
          </Box>

          <Box mt={4} mb={3}>
            <Typography variant="h5" dangerouslySetInnerHTML={{ __html: communicationTitle }}/>
          </Box>

          <Box textAlign="left">
            <Box mt={3} mb={3} data-testid="dbl-comm-details" dangerouslySetInnerHTML={{ __html: communicationContent }}/>
          </Box>

          <Box marginTop={4}>
            <Button
              variant="contained"
              onClick={ackInformation}
              disableElevation
            >
              {t('button-continue')}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}
