/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import config from '../../config';
import { CONFIG } from '../../core/constants';

import './images/jdrf.png';
import './images/jdrf_hover.png';

const branding = config.BRANDING || 'tidepool';
const t = i18next.t.bind(i18next);

function renderVersion() {
  return (
    <div className='footer-section'>
      <div className="footer-version">{`v${config.VERSION}`}</div>
    </div>
  );
}

function tidepoolFooter(metricFnMkr) {
  const urlSupport = CONFIG[branding].support;
  const urlLegal = CONFIG[branding].legal;

  return (
    <div className='footer-section-tidepool footer-section-top'>
      <div className='footer-link social-media large-format-only'>
        <a
          className='footer-twitter'
          href="https://twitter.com/tidepool_org"
          id='twitter'
          onClick={metricFnMkr('Twitter')}
          target="_blank"
        >
          <svg viewBox="0 0 49 35">
            <path d="M43.94 9.783c0-.376 0-.75-.02-1.127 1.957-1.23 3.66-2.783 5.012-4.54-1.802.7-3.74 1.16-5.777 1.382 2.076-1.076 3.662-2.8 4.426-4.85-1.938 1.008-4.092 1.725-6.383 2.118C39.357 1.06 36.753 0 33.874 0 28.334 0 23.83 3.927 23.83 8.76c0 .68.097 1.347.254 1.996-8.34-.358-15.743-3.858-20.697-9.15-.86 1.296-1.35 2.8-1.35 4.404 0 3.04 1.78 5.72 4.464 7.29-1.644-.05-3.19-.444-4.542-1.093v.12c0 4.234 3.466 7.785 8.048 8.588-.842.205-1.723.307-2.644.307-.646 0-1.272-.05-1.88-.154 1.273 3.483 4.994 6.01 9.38 6.078-3.447 2.356-7.774 3.756-12.473 3.756-.804 0-1.607-.034-2.39-.12 4.425 2.46 9.712 3.91 15.37 3.91 18.465 0 28.57-13.35 28.57-24.91z"/>
          </svg>
        </a>
        <a
          className='footer-facebook'
          href="https://www.facebook.com/TidepoolOrg"
          id='facebook'
          onClick={metricFnMkr('Facebook')}
          target="_blank"
        >
          <svg viewBox="0 0 32 32">
            <path d="M18,32V18h6l1-6h-7V9c0-2,1.002-3,3-3h3V0c-1,0-3.24,0-5,0c-5,0-7,3-7,8v4H6v6h6v14H18z" />
          </svg>
        </a>
      </div>
      <div className='footer-link secondary large-format-only'>
        <a
          href="http://tidepool.org/products/tidepool-mobile/"
          id='mobile'
          onClick={metricFnMkr('Mobile App')}
          target="_blank">{t('Get Mobile App')}</a>
      </div>
      <div className='footer-link large-format-only'>
        <a
          href={urlSupport}
          id='support'
          onClick={metricFnMkr('Support')}
          target="_blank">{t('Get Support')}
        </a>
      </div>
      <div className='footer-link'>
        <a
          href={urlLegal}
          id='legal'
          onClick={metricFnMkr('PP and TOU')}
          target='_blank'>{t('Privacy and Terms of Use')}</a>
      </div>
      <div className='footer-link footer-jdrf'>
        <a
          href='http://jdrf.org/'
          id='jdrf'
          onClick={metricFnMkr('JDRF')}
          target='_blank'>
          {t('Made possible by')}
          <img />
        </a>
      </div>
    </div>
  );
}

function diabeloopFooter(metricFnMkr) {
  const urlSupport = CONFIG[branding].support;
  const urlLegal = CONFIG[branding].legal;
  const urlPrivacy = CONFIG[branding].privacy;
  const regulatoryWebAddress = config.REGULATORY_WEB_ADDRESS;

  return (
    <div className='footer-section-diabeloop'>
      <div className='footer-column footer-column-1'>
        <a
          href={urlPrivacy}
          className='footer-link'
          id='privacy-link'
          onClick={metricFnMkr('Privacy')}
          target='_blank'>{t('Privacy Policy')}
        </a>
        <a
          href={urlLegal}
          id='terms-link'
          className='footer-link'
          onClick={metricFnMkr('TermsOfUSe')}
          target='_blank'>{t('Tidepool Applications Terms of Use')}
        </a>
      </div>
      <div className='footer-column footer-column-2 justify-space-around'>
        {`${t('Yourloops')} v${config.VERSION}`}
      </div>
      <div className='footer-column footer-column-3 justify-space-around'>
        <a
          href={urlSupport}
          id='support-link'
          className='footer-link'
          onClick={metricFnMkr('CompanyInformation')}
          target="_blank">{t('Diabeloop')}
        </a>
        <a
          href={regulatoryWebAddress}
          id='regulatory-link'
          className='footer-link'
          onClick={metricFnMkr('RegulatoryInformation')}
          target='_blank'>{t('Regulatory Information')}
        </a>
      </div>
    </div>
  );
}

function FooterLinks(props) {
  const { shouldDisplayFooterLinks, trackMetric } = props;
  const metricFnMkr = (link) => {
    return () => trackMetric(`Clicked Footer ${link}`);
  }

  let footerContent = null;
  let versionContent = null;
  if (shouldDisplayFooterLinks) {
    if (branding === 'diabeloop') {
      footerContent = diabeloopFooter(metricFnMkr);
    } else {
      footerContent = tidepoolFooter(metricFnMkr);
      versionContent = renderVersion();
    }
  } else {
    versionContent = (
      <div className='footer-section'>
        {renderVersion()}
      </div>
    );
  }

  return (
    <div className='footer'>
      {footerContent}
      {versionContent}
    </div>
  );
};

FooterLinks.propTypes = {
  trackMetric: PropTypes.func.isRequired,
  shouldDisplayFooterLinks: PropTypes.bool.isRequired,
};

export default FooterLinks;
