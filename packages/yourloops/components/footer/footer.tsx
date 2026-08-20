/*
 * Copyright (c) 2021-2026, Diabeloop
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

import diabeloopLabel from 'diabeloop-label.svg'
import diabeloopLogo from 'diabeloop-logo.svg'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LanguageIcon from '@mui/icons-material/Language'
import Tooltip from '@mui/material/Tooltip'
import config from '../../lib/config/config'

import { diabeloopExternalUrls, ROUTES_REQUIRING_LANGUAGE_SELECTOR } from '../../lib/diabeloop-urls.model'
import LanguageSelector from '../language-select'
import AccompanyingDocumentLinks from './accompanying-document-links'
import { type AppRoute } from '../../models/enums/routes.enum'
import { useFooterHook } from "./shared/footer.hook"
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/auth'
import { useLocation } from 'react-router-dom'
import { commonStyleFooter } from './shared/footer-style'
import { FooterLink } from './footer-link-mobile'

export const footerWebStyle = makeStyles({ name: 'footer-component-styles' })((theme) => {
  return {
    appVersionLink: {
      marginLeft: theme.spacing(1)
    },
    bySpan: {
      paddingLeft: '12px',
      paddingRight: '12px'
    },
    centerBox: {
      justifyContent: 'center',
      paddingLeft: '15px',
      paddingRight: '15px',
      [theme.breakpoints.up('sm')]: {
        flexWrap: 'wrap'
      },
      [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap',
        order: 1,
        textAlign: 'center',
        width: '100%'
      }
    },
    containerWeb: {
      paddingBlock: '11px',
      [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap'
      }
    },
    cookiesManagement: {
      '&:hover': {
        cursor: 'pointer'
      }
    },
    diabeloopLogo: {
      paddingRight: '3px'
    },
    firstLine: {
      justifyContent: 'center',
      marginBottom: '6px',
      width: '100%',
      [theme.breakpoints.down('md')]: {
        marginBottom: '0'
      }
    },
    firstLineElement: {
      height: '20px',
      [theme.breakpoints.down('md')]: {
        marginTop: '10px',
        marginBottom: '17px'
      }
    },
    documentBox: {
      height: '20px'
    },
    languageSeparator: {
      alignSelf: 'center'
    },
    leftBox: {
      width: '134px',
      [theme.breakpoints.down('md')]: {
        order: 2
      }
    },
    medicalDeviceWarning: {
      paddingRight: theme.spacing(4)
    },
    rightBox: {
      display: 'flex',
      justifyContent: 'right',
      [theme.breakpoints.down('md')]: {
        order: 3
      }
    },
    separator: {
      paddingLeft: '15px',
      paddingRight: '15px'
    },
    sideBox: {
      flex: '1'
    },
    supportButton: {
      height: '46px',
      width: '134px'
    },
    svg: {
      height: '12px',
      verticalAlign: 'middle',
      display: 'inline-block'
    },
    versionSpan: {
      textDecoration: 'underline'
    }
  }
})

export const Footer: FunctionComponent = () => {
  const { classes: webClasses } = footerWebStyle();
  const { classes: commonClasses } = commonStyleFooter();

  const classes = {
    ...webClasses,
    ...commonClasses
  }
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { pathname } = useLocation()

  const {
    shouldDisplayMedicalDeviceWarning,
    cookiesPolicyUrl,
    privacyPolicyUrl,
    termsOfUseUrl,
    releaseNotesUrl,
    handleShowCookieBanner,
    metricsPdfDocument
  } = useFooterHook()

  return (
    <Container id="footer-links-container" data-testid="footer"
               className={`${classes.containerWeb} ${classes.containerCommon}
    ${classes.commonBoxAndContainer}`} maxWidth={false}>
      <Box className={`${classes.sideBox} ${classes.leftBox}`}>
        <Box className={classes.supportButton} />
      </Box>

      {shouldDisplayMedicalDeviceWarning &&
        <Box className={classes.medicalDeviceWarning}>{t('not-a-medical-device')}</Box>
      }

      <Box className={`${classes.centerBox} ${classes.commonBoxAndContainer}`}>
        {ROUTES_REQUIRING_LANGUAGE_SELECTOR.includes(pathname as AppRoute)
          ? <Box className={`${classes.firstLine} ${classes.commonBoxAndContainer}`}>
            <Box className={`${classes.firstLineElement} ${classes.commonBoxAndContainer}`}>
              <LanguageIcon className={classes.icon} />
              <LanguageSelector />
              <Box className={`${classes.separator} ${classes.languageSeparator}`}>|</Box>
            </Box>
            <AccompanyingDocumentLinks user={user} />
          </Box>
          : <Box id="footer-accompanying-documents-box"
                 className={`${classes.documentBox} ${classes.commonBoxAndContainer}`}>
            <AccompanyingDocumentLinks user={user} />
            <Box className={classes.separator}>|</Box>
          </Box>
        }

        <FooterLink
          id="footer-link-url-privacy-policy"
          href={privacyPolicyUrl}
          onClick={metricsPdfDocument('privacy_policy')}
          style = {classes.commonLink}
          isExternal
        >
          {t('privacy-policy')}
        </FooterLink>
        <Box className={classes.separator}>|</Box>
        <FooterLink
          id="footer-link-url-terms"
          href={termsOfUseUrl}
          onClick={metricsPdfDocument('terms')}
          style = {classes.commonLink}
          isExternal
        >
          {t('terms-of-use')}
        </FooterLink>
        <Box className={classes.separator}>|</Box>
        <FooterLink
          id="footer-link-cookies-management"
          onClick={handleShowCookieBanner}
          style = {classes.commonLink}
        >
          {t('cookies-management')}
        </FooterLink>
        <Box className={classes.separator}>|</Box>
        <FooterLink
          id="footer-link-url-cookies-policy"
          href={cookiesPolicyUrl}
          onClick={metricsPdfDocument('yourloops-cookiepolicy')}
          style = {classes.commonLink}
          isExternal
        >
          {t('cookies-policy')}
        </FooterLink>
        <Box className={classes.separator}>|</Box>
        <FooterLink
          id="footer-link-contact-mailto"
          href={`mailto:${diabeloopExternalUrls.contactEmail}`}
          onClick={metricsPdfDocument('mailto-contact')}
          style = {classes.commonLink}
        >
          {t('contact')}
        </FooterLink>
      </Box>
      <Box className={`${classes.sideBox} ${classes.rightBox}`}>
        <Box>
          {t('brand-name')}
          <Tooltip
            id="footer-link-tooltip-app-release-notes"
            title={t('tooltip-release-notes')}
            aria-label={t('tooltip-release-notes')}
            placement="right-start"
          >
            <FooterLink
              dataTestId="footer-link-url-release-notes"
              href={releaseNotesUrl}
              onClick={metricsPdfDocument('release_notes')}
              style = {`${classes.commonLink} ${classes.appVersionLink}`}
              isExternal
            >
              <span className={classes.versionSpan}>{`v${config.VERSION}`.substring(0, 20)}</span>
            </FooterLink>
          </Tooltip>
          <span className={classes.bySpan}>by </span>
        </Box>
        <FooterLink
          id="footer-link-url-diabeloop"
          href={diabeloopExternalUrls.support}
          style = {classes.commonLink}
          isExternal
        >
          <img src={diabeloopLogo} alt={t('alt-img-logo')} className={`${classes.svg} ${classes.diabeloopLogo}`} />
          <img src={diabeloopLabel} alt={t('alt-img-logo')} className={classes.svg} />
        </FooterLink>
      </Box>
    </Container>
  )
}
