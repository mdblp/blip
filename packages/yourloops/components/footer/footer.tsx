/*
 * Copyright (c) 2021-2025, Diabeloop
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

import diabeloopLabel from 'diabeloop-label.svg'
import diabeloopLogo from 'diabeloop-logo.svg'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LanguageIcon from '@mui/icons-material/Language'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'

import { diabeloopExternalUrls, ROUTES_REQUIRING_LANGUAGE_SELECTOR } from '../../lib/diabeloop-urls.model'
import { useAuth } from '../../lib/auth'
import config from '../../lib/config/config'
import metrics from '../../lib/metrics'
import LanguageSelector from '../language-select'
import AccompanyingDocumentLinks from './accompanying-document-links'
import { type AppRoute } from '../../models/enums/routes.enum'
import { getCurrentLang } from '../../lib/language'
import { LanguageCodes } from '../../lib/auth/models/enums/language-codes.enum'

export const footerStyle = makeStyles({ name: 'footer-component-styles' })((theme) => {
  return {
    appVersionLink: {
      marginLeft: theme.spacing(1)
    },
    bySpan: {
      paddingLeft: '12px',
      paddingRight: '12px',
      [theme.breakpoints.down('sm')]: {
        paddingRight: '0'
      }
    },
    centerBox: {
      alignItems: 'center',
      display: 'flex',
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
      },
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'space-around',
        marginLeft: '10px',
        marginRight: '10px'
      }
    },
    container: {
      alignItems: 'center',
      backgroundColor: 'var(--footer-background-color)',
      color: theme.palette.grey[700],
      display: 'flex',
      flexShrink: 0,
      fontSize: '12px',
      paddingBlock: '11px',
      zIndex: theme.zIndex.drawer + 1,
      [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap'
      },
      marginTop: theme.spacing(3)
    },
    cookiesManagement: {
      '&:hover': {
        cursor: 'pointer'
      }
    },
    diabeloopLogo: {
      paddingRight: '3px'
    },
    diabeloopLink: {
      [theme.breakpoints.down('sm')]: {
        marginTop: '12px'
      }
    },
    firstLine: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '6px',
      width: '100%',
      [theme.breakpoints.down('md')]: {
        marginBottom: '0'
      },
      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap'
      }
    },
    firstLineElement: {
      display: 'flex',
      height: '20px',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        marginTop: '10px',
        marginBottom: '17px'
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: '15px',
        marginTop: '0',
        width: '100%',
        justifyContent: 'center'
      }
    },
    icon: {
      alignSelf: 'center',
      color: theme.palette.grey[600],
      marginRight: '18px',
      width: '20px',
      marginBottom: '3px'
    },
    documentBox: {
      display: 'flex',
      height: '20px',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        marginBottom: '15px',
        marginTop: '0',
        width: '100%',
        justifyContent: 'center'
      }
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
    link: {
      color: theme.palette.grey[700],
      fontWeight: 400,
      [theme.breakpoints.down('sm')]: {
        marginBottom: '15px',
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        textAlign: 'center'
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
      },
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right'
      }
    },
    separator: {
      paddingLeft: '15px',
      paddingRight: '15px',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
        visibility: 'hidden'
      }
    },
    sideBox: {
      flex: '1'
    },
    supportButton: {
      height: '46px',
      width: '134px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '10px'
      }
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
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { classes } = footerStyle()

  const currentLanguage = getCurrentLang()
  const shouldDisplayMedicalDeviceWarning = currentLanguage === LanguageCodes.Ja

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
      <Box className={`${classes.sideBox} ${classes.leftBox}`}>
        <Box className={classes.supportButton} />
      </Box>

      {shouldDisplayMedicalDeviceWarning &&
        <Box className={classes.medicalDeviceWarning}>{t('not-a-medical-device')}</Box>
      }

      <Box className={classes.centerBox}>
        {ROUTES_REQUIRING_LANGUAGE_SELECTOR.includes(pathname as AppRoute)
          ? <Box className={classes.firstLine}>
            <Box className={classes.firstLineElement}>
              <LanguageIcon className={classes.icon} />
              <LanguageSelector />
              <Box className={`${classes.separator} ${classes.languageSeparator}`}>|</Box>
            </Box>
            <AccompanyingDocumentLinks user={user} />
          </Box>
          : <Box id="footer-accompanying-documents-box" className={classes.documentBox}>
            <AccompanyingDocumentLinks user={user} />
            <Box className={classes.separator}>|</Box>
          </Box>
        }

        <Link
          id="footer-link-url-privacy-policy"
          target="_blank"
          href={diabeloopExternalUrls.privacyPolicy}
          rel="nofollow"
          onClick={metricsPdfDocument('privacy_policy')}
          className={classes.link}
        >
          {t('privacy-policy')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-url-terms"
          target="_blank"
          href={diabeloopExternalUrls.terms}
          rel="nofollow"
          onClick={metricsPdfDocument('terms')}
          className={classes.link}
        >
          {t('terms-of-use')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-cookies-management"
          className={`${classes.link} ${classes.cookiesManagement}`}
          onClick={handleShowCookieBanner}
        >
          {t('cookies-management')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-url-cookies-policy"
          target="_blank"
          href={diabeloopExternalUrls.cookiesPolicy}
          rel="nofollow"
          onClick={metricsPdfDocument('yourloops-cookiepolicy')}
          className={classes.link}
        >
          {t('cookies-policy')}
        </Link>
        <Box className={classes.separator}>|</Box>
        <Link
          id="footer-link-contact-mailto"
          href={`mailto:${diabeloopExternalUrls.contactEmail}`}
          onClick={metricsPdfDocument('yourloops-mailto-contact')}
          className={classes.link}
        >
          {t('contact')}
        </Link>
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
            <Link
              data-testid="footer-link-url-release-notes"
              target="_blank"
              href={diabeloopExternalUrls.releaseNotes}
              rel="nofollow"
              onClick={metricsPdfDocument('release_notes')}
              className={`${classes.link} ${classes.appVersionLink}`}
            >
              <span className={classes.versionSpan}>{`v${config.VERSION}`.substring(0, 20)}</span>
            </Link>
          </Tooltip>
          <span className={classes.bySpan}>by </span>
        </Box>
        <Link
          id="footer-link-url-diabeloop"
          className={classes.diabeloopLink}
          target="_blank"
          href={diabeloopExternalUrls.support} rel="nofollow"
        >
          <img src={diabeloopLogo} alt={t('alt-img-logo')} className={`${classes.svg} ${classes.diabeloopLogo}`} />
          <img src={diabeloopLabel} alt={t('alt-img-logo')} className={classes.svg} />
        </Link>
      </Box>
    </Container>
  )
}
