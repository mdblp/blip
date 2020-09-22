/**
 * Copyright (c) 2014, Tidepool Project
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
 */

import _ from 'lodash';
import React from 'react';
import { render as reactDOMRender } from 'react-dom';
import bows from 'bows';

import i18n from './core/language';
import blipCreateStore from './redux/store';
import AppRoot from './redux/containers/Root';

import { getRoutes } from './routes';

import config, { DUMMY_URL } from './config';
import api from './core/api';
import { CONFIG as BrandConfig } from './core/constants';
import personUtils from './core/personutils';
import detectTouchScreen from './core/notouch';

/**
 * @typedef {object} TermsURLObject Terms object inside the legal JSON
 * @property {string} terms - Terms document URL
 * @property {string} dataPrivacy - data privacy document URL
 * @property {string} intendedUse - Intended use document URL
 *
 * @typedef {{ [x: string]: TermsURLObject }} TermsLangObject Terms by languages
 * @typedef {{ [x: string]: TermsLangObject }} TermsCountriesObject Terms by country / language
 * @typedef {{ language: string, countries?: { [x: string]: string } }} DefaultsLangCountries Default values
 * @typedef {{ defaults: DefaultsLangCountries, languages?: TermsLangObject, countries?: TermsCountriesObject }} TermsObject Terms object definition
 */

class Bootstrap {
  constructor() {
    this.log = bows('App');
    this.api = api;
    this.personUtils = personUtils;
    this.DEBUG = _.get(window, 'localStorage.debug', false) === 'true';
    this.config = config;
    this.store = null;
    this.routing = null;
    /** @type {TermsObject|null} Terms URLs by countries/languages */
    this.terms = null;
    /** Default country info, which should be returned by the localization service */
    this.countryInfos = {
      lang: null,
      code: null,
      name: null,
      timeZone: 'UTC',
    };
    this.trackMetric = this.trackMetric.bind(this);
  }

  get props() {
    return {
      DEBUG: this.DEBUG,
      api,
      config,
      log: this.log,
      trackMetric: this.trackMetric,
    };
  }

  trackMetric(eventName, properties, cb) {
    api.metrics.track(eventName, properties, cb);
  }

  /**
   * i18next callback
   * @param {string} language
   */
  onLanguageChanged(language) {
    /** @type {string | null} */
    let country = this.countryInfos.code;
    let lang = language;
    if (_.isString(lang) && lang.indexOf('-') > 0) {
      const s = language.split('-');
      lang = s[0];
      country = country === null ? s[1] : country;
    }

    /** @type {TermsURLObject} */
    let termsURLs = null;

    // Update only if we can, and if there is a change
    if (this.terms !== null && lang !== this.countryInfos.lang) {
      this.countryInfos.lang = lang;

      this.log.debug(`Language change to ${lang}-${country}`);

      // Do we have the terms for the country?
      if (country !== null && !_.isEmpty(this.terms.countries) && _.has(this.terms.countries, country)) {
        // Do we have the terms for the language too?
        let langForCountry = lang;
        if (!_.has(this.terms.countries, `${country}.${langForCountry}`)) {
          // no, use the default language for the country
          langForCountry = _.get(this.terms.defaults.countries, country, null);
          this.log.warn(`No terms found for ${lang}-${country}, using default country lang ${langForCountry}`);
        }
        if (langForCountry !== null) {
          termsURLs = _.get(this.terms.countries, `${country}.${langForCountry}`, null);
        }
      }

      // No terms for country/lang found, try by lang only
      if (termsURLs === null && !_.isEmpty(this.terms.languages)) {
        if (!_.has(this.terms.languages, lang)) {
          this.log.warn(`Missing term for lang ${lang}, using default: ${this.terms.defaults.language}`);
          lang = this.terms.defaults.language;
        }
        termsURLs = _.get(this.terms.languages, lang, null);
      }

      if (termsURLs === null) {
        this.log.warn(`No terms & conditions for ${lang}-${country} found`);
      } else {
        _.assign(BrandConfig.diabeloop, termsURLs);
        this.log.info('branding', BrandConfig.diabeloop);
      }
    }
  }

  async init() {
    detectTouchScreen();

    document.title = BrandConfig[config.BRANDING].name;

    if (config.BRANDING === 'diabeloop') {
      try {
        let response;

        if (this.config.ASSETS_URL !== DUMMY_URL) {
          const url = new URL('legal/legal.json', this.config.ASSETS_URL);
          response = await fetch(url.toString());
          this.terms = await response.json();
        } else {
          response = await fetch('legal/legal.json');
          this.terms = await response.json();
        }

        if (navigator.language) {
          this.onLanguageChanged(navigator.language);
        } else if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
          this.onLanguageChanged(navigator.languages[0]);
        }

        i18n.on('languageChanged', this.onLanguageChanged.bind(this));

      } catch (e) {
        this.log.error('Error fetching legal information', e);
      }

      try {
        if (!_.isEmpty(this.terms.countries)) {
          // We have countries definitions, so the country.json service should be available
          const response = await fetch('country.json');
          this.countryInfos = await response.json();
        }
      } catch (e) {
        this.log.error('Error getting current country', e);
      }
    }

    await new Promise((resolve) => {
      this.api.init(resolve);
    });
  }

  render() {
    reactDOMRender(<AppRoot store={this.store} routing={this.routing} />, document.getElementById('app'));
  }

  async start() {
    this.log('Starting app...');
    await this.init();
    this.store = blipCreateStore(this.api);
    this.routing = getRoutes(this, this.store);
    this.render();
    this.log('App started');
  }
}

export default Bootstrap;
