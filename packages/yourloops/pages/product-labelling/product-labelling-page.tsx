/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FC, useState } from 'react'
import parse from 'html-react-parser'
import { getCurrentLang } from '../../lib/language'
import i18n from 'i18next'
import Box from '@mui/material/Box'
import { LanguageCodes } from '../../lib/auth/models/enums/language-codes.enum'
import { setPageTitle } from '../../lib/utils'
import { useTranslation } from 'react-i18next'
import config from '../../lib/config/config'

const DEFAULT_LANG = LanguageCodes.En

export const ProductLabellingPage: FC = () => {
  const { t } = useTranslation()
  const getHtml = (): string => {
    const hasCurrentLang = Object.values(LanguageCodes).includes(getCurrentLang())
    const locale = hasCurrentLang ? getCurrentLang() : DEFAULT_LANG

    return `
        <object type="application/pdf"
            data="${config.ASSETS_URL}intended-use.${locale}.pdf"
            width="100%" height="100%"
        />`
  }

  const [html, setHtml] = useState<string>(getHtml())

  i18n.on('languageChanged', () => {
    setHtml(getHtml)
  })

  setPageTitle(t('product-labelling'))

  return (
    <Box marginBottom={2} sx={{ width: '100%', height: '100%' }}>
      {parse(html)}
    </Box>
  )
}
