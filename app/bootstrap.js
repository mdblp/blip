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
 * @typedef {object} TermsObject Terms object inside the legal JSON
 * @property {string} terms - Terms document URL
 * @property {string} dataPrivacy - data privacy document URL
 * @property {string} intendedUse - Intended use document URL
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
      code: 'US',
      name: 'USA',
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
   * @param {string} lang
   */
  onLanguageChanged(lang) {
    if (this.terms !== null && lang !== this.countryInfos.lang) {
      let legals = _.get(this.terms, `${this.countryInfos.code}.${lang}`, null);
      if (legals === null) {
        this.log.warn(`not terms for ${this.countryInfos.code}.${lang}`);
        const countryCode = _.get(this.terms, `defaultCountries.${lang}`, null);
        legals = _.get(this.terms, `${countryCode}.${lang}`, null);
      }
      if (legals === null) {
        this.log.warn(`not terms for defaultCountries.${lang}`);
        legals = _.get(this.terms, 'defaults', null);
      }
      if (legals !== null) {
        _.assign(BrandConfig.diabeloop, legals);
        this.log.info('branding', BrandConfig.diabeloop);
      }
      this.countryInfos.lang = lang;
    }
  }

  async init() {
    detectTouchScreen();

    document.title = BrandConfig[config.BRANDING].name;

    if (config.BRANDING === 'diabeloop') {
      try {
        let response = await fetch('country.json');
        this.countryInfos = await response.json();

        if (this.config.ASSETS_URL !== DUMMY_URL) {
          response = await fetch(`${this.config.ASSETS_URL}/legal/legal.json`);
          this.terms = await response.json();
        } else {
          response = await fetch('legal/legal.json');
          this.terms = await response.json();
        }

        if (navigator.language) {
          this.onLanguageChanged(navigator.language);
        }
        i18n.on('languageChanged', this.onLanguageChanged.bind(this));

      } catch (e) {
        this.log.error('Error fetching legal information', e);
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
