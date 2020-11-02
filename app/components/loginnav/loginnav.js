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

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import i18n from '../../core/language';

function LoginNav(props) {
  const { page, hideLinks, trackMetric } = props;
  const t = i18n.t.bind(i18n);

  let link = null;
  if (!hideLinks) {
    let href = '/signup/clinician';
    let className = 'js-signup-link';
    let icon = 'icon-add';
    let text = t('Sign up');
    let handleClick = () => {
      trackMetric('Clicked Sign Up Link');
    };

    if (page === 'signup') {
      href = '/login';
      className = 'js-login-link';
      icon = 'icon-login';
      text = t('Log in');
      handleClick = () => {
        trackMetric('Clicked Log In Link');
      };
    }

    link = (
      <Link to={href} onClick={handleClick} className={className}>
        <i className={icon}></i>{' ' + text}
      </Link>
    );
  }

  return (
    <div className="container-nav-outer login-nav">
      <div className="container-nav-inner nav-wrapper">
        <ul className="nav nav-right">
          <li>
            {link}
          </li>
        </ul>
      </div>
    </div>
  );
}

LoginNav.propTypes = {
  page: PropTypes.string,
  hideLinks: PropTypes.bool,
  trackMetric: PropTypes.func.isRequired
};

LoginNav.defaultProps = {
  page: '',
  hideLinks: false,
};

export default LoginNav;
