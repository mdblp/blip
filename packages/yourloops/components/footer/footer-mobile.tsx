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

import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LanguageIcon from '@mui/icons-material/Language'
import Link from '@mui/material/Link'

import { diabeloopExternalUrls, ROUTES_REQUIRING_LANGUAGE_SELECTOR } from '../../lib/diabeloop-urls.model'
import { useAuth } from '../../lib/auth'
import metrics from '../../lib/metrics'
import LanguageSelector from '../language-select'
import AccompanyingDocumentLinks from './accompanying-document-links'
import { type AppRoute } from '../../models/enums/routes.enum'
import { getCurrentLang } from '../../lib/language'
import { LanguageCodes } from '../../lib/auth/models/enums/language-codes.enum'
import { ExternalFilesService } from '../../lib/external-files/external-files.service'

export const footerStyle = makeStyles({ name: 'footer-component-styles' })((theme) => {
  return {
    allLines: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: theme.spacing(2)
    },
    container: {
      alignItems: 'center',
      backgroundColor: 'var(--footer-background-color)',
      color: theme.palette.grey[700],
      display: 'flex',
      flexShrink: 0,
      fontSize: '12px',
      zIndex: theme.zIndex.drawer + 1,
      marginTop: theme.spacing(3),
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(1),
      minHeight: theme.spacing(14),
      flexDirection: 'column'
    },
    icon: {
      alignSelf: 'center',
      color: theme.palette.grey[600],
      marginRight: '18px',
      width: '20px',
      marginBottom: '3px'
    },
    languageSeparator: {
      alignSelf: 'center'
    },
    link: {
      color: theme.palette.grey[700],
      fontWeight: 400,
      textAlign: 'center',
      display: 'inline-block',
      lineHeight: 1.2
    },
    separator: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
})

export const FooterMobile: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { classes } = footerStyle()

  const currentLanguage = getCurrentLang()

  const isLongLanguage = (currentLanguage === LanguageCodes.De) || (currentLanguage === LanguageCodes.Nl)

  const shouldDisplayMedicalDeviceWarning = currentLanguage === LanguageCodes.Ja

  const cookiesPolicyUrl = ExternalFilesService.getCookiesPolicyUrl()
  const privacyPolicyUrl = ExternalFilesService.getPrivacyPolicyUrl()
  const termsOfUseUrl = ExternalFilesService.getTermsOfUseUrl()

  const handleShowCookieBanner = (): void => {
    if (typeof window.openAxeptioCookies === 'function') {
      window.openAxeptioCookies()
    }
  }

  const metricsPdfDocument = (title: string) => {
    return () => {
      metrics.send('pdf_document', 'view_document', title)
    }
  }

  return (
    <Container id="footer-links-container" data-testid="footer" className={classes.container} maxWidth={false}>
      {shouldDisplayMedicalDeviceWarning &&
        <Box className={classes.allLines}>{t('not-a-medical-device')}</Box>
      }
        {ROUTES_REQUIRING_LANGUAGE_SELECTOR.includes(pathname as AppRoute)
          ? <>
            <Box className={classes.allLines} >
              <LanguageIcon className={classes.icon} />
              <LanguageSelector />
            </Box>
            <Box id="footer-accompanying-documents-box" className={classes.allLines}>
              <AccompanyingDocumentLinks user={user} />
            </Box>
          </>
          : <Box id="footer-accompanying-documents-box" className={classes.allLines}>
            <AccompanyingDocumentLinks user={user} />
          </Box>
        }
      <Box className={classes.allLines}>
        <Link
          id="footer-link-url-privacy-policy"
          target="_blank"
          href={privacyPolicyUrl}
          rel="nofollow"
          onClick={metricsPdfDocument('privacy_policy')}
          className={classes.link}
          sx={{ wordBreak: isLongLanguage ? 'break-word' : 'normal' }}
        >
          {t('privacy-policy')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-url-terms"
          target="_blank"
          href={termsOfUseUrl}
          rel="nofollow"
          onClick={metricsPdfDocument('terms')}
          className={classes.link}
          sx={{ wordBreak: isLongLanguage ? 'break-word' : 'normal' }}
        >
          {t('terms-of-use')}
        </Link>
      </Box>
      <Box className={classes.allLines}>
        <Link
          id="footer-link-cookies-management"
          className={classes.link}
          onClick={handleShowCookieBanner}
          sx={{ wordBreak: isLongLanguage ? 'break-word' : 'normal' }}
        >
          {t('cookies-management')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-url-cookies-policy"
          target="_blank"
          href={cookiesPolicyUrl}
          rel="nofollow"
          onClick={metricsPdfDocument('yourloops-cookiepolicy')}
          className={classes.link}
          sx={{ wordBreak: isLongLanguage ? 'break-word' : 'normal' }}
        >
          {t('cookies-policy')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-contact-mailto"
          href={`mailto:${diabeloopExternalUrls.contactEmail}`}
          onClick={metricsPdfDocument('yourloops-mailto-contact')}
          className={classes.link}
          sx={{ wordBreak: isLongLanguage ? 'break-word' : 'normal' }}
        >
          {t('contact')}
        </Link>
      </Box>
    </Container>
  )
}
