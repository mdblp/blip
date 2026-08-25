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
import { makeStyles } from 'tss-react/mui'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LanguageIcon from '@mui/icons-material/Language'

import { diabeloopExternalUrls, ROUTES_REQUIRING_LANGUAGE_SELECTOR } from '../../lib/diabeloop-urls.model'
import LanguageSelector from '../language-select'
import AccompanyingDocumentLinks from './accompanying-document-links'
import { type AppRoute } from '../../models/enums/routes.enum'
import { getCurrentLang } from '../../lib/language'
import { LanguageCode } from '../../lib/auth/models/enums/language-code.enum'
import { PatientView } from '../../enum/patient-view.enum'
import { FooterLink } from './footer-link'
import { useFooterHook } from "./shared/footer.hook"
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/auth'
import { useTheme } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import { commonStyleFooter } from './shared/footer-style'

export const footerMobileStyle = makeStyles<{ isLongLanguage?: boolean }>({ name: 'footer-component-styles' })((theme, { isLongLanguage }) => {
  return {
    allLines: {
      justifyContent: 'center',
      marginBottom: theme.spacing(2),
      wordBreak: isLongLanguage ? 'break-word' : 'normal'
    },
    containerMobile: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(1),
      minHeight: theme.spacing(14),
      flexDirection: 'column'
    },
    separatorMobile: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
})

export const FooterMobile: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const theme = useTheme()
  const { pathname } = useLocation()

  const currentLanguage = getCurrentLang()

  const isLongLanguage = (currentLanguage === LanguageCode.De) || (currentLanguage === LanguageCode.Nl)

  const { classes: mobileClasses } = footerMobileStyle({ isLongLanguage })
  const { classes: commonClasses } = commonStyleFooter()

  const classes = {
    ...commonClasses,
    ...mobileClasses,
  }

  const PATIENT_VIEW_URL_MAPPING: Record<PatientView, string> = {
    [PatientView.Daily]: 'daily',
    [PatientView.Dashboard]: 'dashboard',
    [PatientView.Devices]: 'devices',
    [PatientView.PatientProfile]: 'patient-profile',
    [PatientView.Trends]: 'trends',
  }

  const isMatchingPatientView = Object.values(PATIENT_VIEW_URL_MAPPING).some(viewValue =>
    pathname.includes(viewValue)
  )

  const {
    shouldDisplayMedicalDeviceWarning,
    cookiesPolicyUrl,
    privacyPolicyUrl,
    termsOfUseUrl,
    handleShowCookieBanner,
    metricsPdfDocument
  } = useFooterHook()

  return (
    <Container id="footer-links-container" data-testid="footer" className={`${classes.containerMobile} ${classes.containerCommon}
    ${classes.commonBoxAndContainer}`} maxWidth={false}>
      {shouldDisplayMedicalDeviceWarning &&
        <Box className={`${classes.allLines} ${classes.commonBoxAndContainer}`}>{t('not-a-medical-device')}</Box>
      }
        {ROUTES_REQUIRING_LANGUAGE_SELECTOR.includes(pathname as AppRoute)
          ? <>
            <Box className={`${classes.allLines} ${classes.commonBoxAndContainer}`} >
              <LanguageIcon className={classes.icon} />
              <LanguageSelector />
            </Box>
            <Box id="footer-accompanying-documents-box" className={`${classes.allLines} ${classes.commonBoxAndContainer}`}>
              <AccompanyingDocumentLinks user={user} />
            </Box>
          </>
          : <Box id="footer-accompanying-documents-box" className={`${classes.allLines} ${classes.commonBoxAndContainer}`}>
            <AccompanyingDocumentLinks user={user} />
          </Box>
        }
      <Box className={`${classes.allLines} ${classes.commonBoxAndContainer}`}>
        <FooterLink
          id="footer-link-url-privacy-policy"
          href={privacyPolicyUrl}
          style = {`${classes.linkMobile} ${classes.commonLink}`}
          onClick={metricsPdfDocument('privacy_policy')}
          isExternal
        >
          {t('privacy-policy')}
        </FooterLink>
        <Box className={classes.separatorMobile}>|</Box>
        <FooterLink
          id="footer-link-url-terms"
          href={termsOfUseUrl}
          style = {`${classes.linkMobile} ${classes.commonLink}`}
          onClick={metricsPdfDocument('terms')}
          isExternal
        >
          {t('terms-of-use')}
        </FooterLink>
      </Box>
      <Box className={`${classes.allLines} ${classes.commonBoxAndContainer}`}>
        <FooterLink
          id="footer-link-cookies-management"
          onClick={handleShowCookieBanner}
          style = {`${classes.linkMobile} ${classes.commonLink}`}
        >
          {t('cookies-management')}
        </FooterLink>
        <Box className={classes.separatorMobile}>|</Box>
        <FooterLink
          id="footer-link-url-cookies-policy"
          href={cookiesPolicyUrl}
          style = {`${classes.linkMobile} ${classes.commonLink}`}
          onClick={metricsPdfDocument('yourloops-cookiepolicy')}
          isExternal
        >
          {t('cookies-policy')}
        </FooterLink>
        <Box className={classes.separatorMobile}>|</Box>
        <FooterLink
          id="footer-link-contact-mailto"
          style = {`${classes.linkMobile} ${classes.commonLink}`}
          href={`mailto:${diabeloopExternalUrls.contactEmail}`}
          onClick={metricsPdfDocument('mailto-contact')}
        >
          {t('contact')}
        </FooterLink>
      </Box>
      {isMatchingPatientView &&
        <Box sx={{ height: theme.spacing(9) }} />
      }
    </Container>
  )
}
