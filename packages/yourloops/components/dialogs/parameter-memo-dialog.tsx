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

import React, { FC, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import { useTranslation } from 'react-i18next'
import { DblParameter } from 'medical-domain'
import { Alert } from '@mui/material'
import { ExternalFilesService } from '../../lib/external-files/external-files.service'

interface ParameterMemoDialogProps {
  parameterName: DblParameter
  onDialogClose: () => void
}

// Only works on Chrome browser
// Deactivates the navigation panes and fits the PDF to the vertical view
const PDF_VISUALIZATION_TOOLBAR_PARAMS = 'navpanes=0&view=FitV'

export const ParameterMemoDialog: FC<ParameterMemoDialogProps> = (props) => {
  const { parameterName, onDialogClose } = props
  const { t } = useTranslation()

  const [hasError, setHasError] = useState(false)

  const title = t('parameter-info-title', { parameterName: t(`params|${parameterName}`) })

  const filePath = ExternalFilesService.getParameterMemoUrl(parameterName)

  const handleClose = () => {
    onDialogClose()
  }

  useEffect(() => {
    const checkPdfAvailability = async () => {
      try {
        const response = await fetch(filePath, { method: 'HEAD' })
        if (!response.ok) {
          setHasError(true)
        }
      }
      catch (error) {
        setHasError(true)
      }
    }

    checkPdfAvailability()
  }, [filePath])

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="xl"
      data-testid="parameter-memo-dialog"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <IconButton onClick={handleClose} aria-label={t('button-close')}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: '100%' }}>
          {hasError ?
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('parameter-memo-load-error')}
            </Alert>
            : <iframe
              title={title}
              src={`${filePath}#${PDF_VISUALIZATION_TOOLBAR_PARAMS}`}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '70vh',
                border: 'none',
                borderRadius: '24px'
              }}
              data-testid="parameter-memo-iframe"
            />
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}
