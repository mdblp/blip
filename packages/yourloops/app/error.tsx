/**
 * Copyright (c) 2021, Diabeloop
 * UI to display a message in case of a crash
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
import { useTranslation } from 'react-i18next'
import { browserName, browserVersion } from 'react-device-detect'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import metrics from '../lib/metrics'
import ErrorApi from '../lib/error/error-api'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment-timezone'
import { useLocation } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

interface OnErrorProps {
  event: Event | string
  source?: string
  lineno?: number
  colno?: number
  error?: Error
}

function OnError(props: OnErrorProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const theme = useTheme()
  const location = useLocation()
  const [showMore, setShowMore] = React.useState(false)
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const errorId = uuidv4()

  const errorMessage = props.error?.message ?? 'n/a'

  React.useEffect(() => {
    try {
      metrics.send('error', 'app-crash', errorMessage)
      ErrorApi.sendError({
        browserName,
        browserVersion,
        date: moment(new Date()).format('DD/MM/YYYY'),
        err: errorMessage,
        errorId,
        path: location.pathname
      }).catch(error => console.error(error))
    } catch (err) {
      console.error(err)
    }
    if (typeof window.clearSessionTimeout === 'function') {
      window.clearSessionTimeout()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOK = (): void => {
    window.location.replace('/')
  }

  const handleShowMore = (): void => {
    setShowMore(true)
  }

  let moreInfos: JSX.Element | null
  if (showMore) {
    const error = props.error ? `Error: ${errorMessage}\nStack: ${props.error.stack}` : 'N/A'
    const info = `${(props.event as string).toString()}\nSource: ${props.source}:${props.lineno}:${props.colno}\n${error}`
    moreInfos = (
      <React.Fragment>
        <DialogContentText className="no-margin-bottom">
          {t('app-crash-info')}
        </DialogContentText>
        <TextField
          id="dialog-app-crash-technical-info"
          inputProps={{ color: 'grey' }}
          fullWidth
          multiline
          rows={5}
          value={info}
        />
      </React.Fragment>
    )
  } else {
    moreInfos = (
      <Button
        id="dialog-app-button-more-info"
        variant="text"
        color="primary"
        onClick={handleShowMore}
      >
        {t('app-crash-button-more-info')}
      </Button>
    )
  }

  return (
    <Dialog
      id="dialog-app-crash"
      open
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="dialog-app-crash-title">{t('app-crash-title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-app-crash-explanation" color="textPrimary">
          {t('app-crash-text')}
          <Box fontWeight="bold">{errorId}</Box>
        </DialogContentText>
        {moreInfos}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleOK}>{t('button-ok')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OnError
