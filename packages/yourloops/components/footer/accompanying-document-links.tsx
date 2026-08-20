/*
 * Copyright (c) 2022-2026, Diabeloop
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
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { type User } from '../../lib/auth'
import { footerWebStyle } from './footer'
import { footerMobileStyle } from './footer-mobile'
import { ExternalFilesService } from '../../lib/external-files/external-files.service'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { commonStyleFooter } from './shared/footer-style'
import { FooterLink } from './footer-link-mobile'

const AccompanyingDocumentLinks: FunctionComponent<{ user: User }> = ({ user }) => {
  const { t } = useTranslation('yourloops')
  const themeMobile = useTheme()
  const { classes: { separator } } = footerWebStyle()
  const { classes: { separatorMobile } } = footerMobileStyle({})
  const { classes: { commonLink } } = commonStyleFooter()
  const isMobile = useMediaQuery(themeMobile.breakpoints.down('sm'))

  const trainingUrl = ExternalFilesService.getTrainingUrl(user?.role)

  return (
    <React.Fragment>
      <Link
        data-testid="product-labelling-link"
        component={RouterLink}
        to="/product-labelling"
        className={commonLink}
      >
        {t('product-labelling')}
      </Link>
      <Box className={isMobile ? separatorMobile : separator}>|</Box>

      <FooterLink
        dataTestId="training-Link"
        href={trainingUrl}
        style = {commonLink}
        isExternal
      >
        {t('training')}
      </FooterLink>
    </React.Fragment>
  )
}

export default AccompanyingDocumentLinks
