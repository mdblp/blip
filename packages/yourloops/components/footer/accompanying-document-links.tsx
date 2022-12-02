/*
 * Copyright (c) 2022, Diabeloop
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
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import { useTranslation } from 'react-i18next'
import { diabeloopExternalUrls } from '../../lib/diabeloop-url'
import { User } from '../../lib/auth'
import { footerStyle } from './footer'

const AccompanyingDocumentLinks: FunctionComponent<{ user: User }> = ({ user }) => {
  const { t } = useTranslation('yourloops')
  const { link, separator } = footerStyle()

  return (
    <React.Fragment>
      <Link
        id="footer-link-product-labelling"
        component={RouterLink}
        to="/product-labelling"
        className={link}
      >
        {t('product-labelling')}
      </Link>
      <Box className={separator}>|</Box>

      <Link
        id="footer-link-url-training"
        target="_blank"
        href={diabeloopExternalUrls.training(user?.role)}
        rel="nofollow"
        className={link}
      >
        {t('training')}
      </Link>
    </React.Fragment>
  )
}

export default AccompanyingDocumentLinks
