/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import metrics from '../lib/metrics'
import ErrorApi from '../lib/error/error-api'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment-timezone'
import { useLocation } from 'react-router-dom'

interface OnErrorProps {
  event: Event | string
  source?: string
  lineno?: number
  colno?: number
  error?: Error
}

const classes = makeStyles(() => ({
  errorId: {
    display: 'block',
    fontWeight: 'bold'
  }
}))

function OnError(props: OnErrorProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const theme = useTheme()
  const location = useLocation()
  const [showMore, setShowMore] = React.useState(false)
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const errorId = uuidv4()
  const style = classes()
  const errorMessage = props.error?.message ?? 'n/a'
  const error = props.error ? `Error: ${errorMessage}\nStack: ${props.error.stack}` : 'n/a'
  const info = `${(props.event as string).toString()}\nSource: ${props.source}:${props.lineno}:${props.colno}\n${error}`

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
      })
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

  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('app-crash-title')}</DialogTitle>
      <DialogContent>
        <DialogContentText color="textPrimary">
          {t('app-crash-text')}
          <span className={style.errorId}>{errorId}</span>
        </DialogContentText>
        {showMore ? (
          <>
            <DialogContentText className="no-margin-bottom">
              {t('app-crash-info')}
            </DialogContentText>
            <TextField
              data-testid="error-stacktrace"
              inputProps={{ color: 'grey' }}
              fullWidth
              multiline
              minRows={5}
              maxRows={8}
              value={info}
            />
          </>
        ) : (
          <Button
            variant="text"
            color="primary"
            onClick={handleShowMore}
          >
            {t('app-crash-button-more-info')}
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleOK}>{t('button-ok')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OnError
