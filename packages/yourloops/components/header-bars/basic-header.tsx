/*
 * Copyright (c) 2025, Diabeloop
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
import { useAuth } from '../../lib/auth'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Avatar from '@mui/material/Avatar'
import config from '../../lib/config/config'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { makeStyles } from 'tss-react/mui'

export const styles = makeStyles()((theme) => {
  return {
    appBar: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.common.white,
      color: 'var(--text-color-primary)'
    },
    desktopLogo: {
      width: 140
    }
  }
})

interface BasicHeaderProps {
  testId: string
}

export const BasicHeader: FunctionComponent<BasicHeaderProps> = (props) => {
  const { testId } = props
  const { classes: { appBar, desktopLogo } } = styles()
  const { t } = useTranslation()
  const { logout } = useAuth()

  const logoutUser = (): void => {
    logout()
  }

  return (
      <AppBar
        elevation={0}
        className={appBar}
        position="fixed"
        data-testid={testId}
      >
        <Toolbar>
          <Avatar
            id="header-main-logo"
            aria-label={t('alt-img-logo')}
            variant="square"
            src={`/branding_${config.BRANDING}_logo.svg`}
            alt={t('alt-img-logo')}
            className={desktopLogo}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            color="info"
            onClick={logoutUser}
          >
            {t('button-logout')}
          </Button>
        </Toolbar>
      </AppBar>
  )
}
