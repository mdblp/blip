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

import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button, { type ButtonProps } from '@mui/material/Button'
import CloudDownloadOutlined from '@mui/icons-material/CloudDownloadOutlined'
import { useTheme } from '@mui/material/styles'
import MedicalFilesApi from '../../lib/medical-files/medical-files.api'
import AnalyticsApi, { ElementType } from '../../lib/analytics/analytics.api'
import { useAuth } from '../../lib/auth'

interface DownloadDocumentButtonProps {
  documentName: string
  metricName: string
  labelKey: string
  sx?: ButtonProps['sx']
}

export const DownloadDocumentButton: FC<DownloadDocumentButtonProps> = ({ documentName, metricName, labelKey, sx }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { user } = useAuth()

  if (!user.isUserPatient() && !user.isUserHcp()) {
    return null
  }

  const onClick = async (): Promise<void> => {
    const document = await MedicalFilesApi.getPresignedDocument(documentName)
    window.open(document.url, '_blank', 'noopener,noreferrer')
    AnalyticsApi.trackClick(metricName, ElementType.Button)
  }

  return (
    <Button size="large" sx={sx} data-testid="download-ifu" onClick={onClick} startIcon={<CloudDownloadOutlined/>}>
      {t(labelKey)}
    </Button>
  )
}
