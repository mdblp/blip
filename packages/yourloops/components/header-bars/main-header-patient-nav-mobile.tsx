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

import React, { Dispatch, type FunctionComponent, type MouseEventHandler, SetStateAction } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useStyles } from './main-header-style';

interface MainHeaderPatientNavMobileProps {
  onClickPrint: MouseEventHandler<HTMLButtonElement>
  setMainHeaderHeight: Dispatch<SetStateAction<number>>
}

export const MainHeaderPatientNavMobile: FunctionComponent<MainHeaderPatientNavMobileProps> = (props) => {
  const { onClickPrint, setMainHeaderHeight } = props
  const { classes: { appBar } } = useStyles()
  const theme = useTheme()

  const appBarRefCallback = (appMainHeaderElement: HTMLHeadElement): void => {
    if (appMainHeaderElement) {
      setMainHeaderHeight(appMainHeaderElement.offsetHeight ?? 0)
    }
  }

  return (
    <Box
      ref={appBarRefCallback}
      className={appBar}
      data-testid="bottom-part-main-header"
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: '100%',
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`
      }}>
      <IconButton
        color="inherit"
        data-testid="download-report-mobile"
        onClick={onClickPrint}
        sx={{ color: 'var(--primary-color-main)' }}>
        <CloudDownloadIcon />
      </IconButton>
    </Box>
  )
}

