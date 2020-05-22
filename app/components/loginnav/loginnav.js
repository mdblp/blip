
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
import { translate } from 'react-i18next';
import { Link } from 'react-router';

function renderLink(props) {
  const { trackMetric, hideLinks } = props;
  if (hideLinks) {
    return null;
  }

  const { page, t } = props;
  let href;
  let className;
  let icon;
  let text;
  let handleClick;

  if (page === 'signup') {
    href = '/login';
    className = 'js-login-link';
    icon = 'icon-login';
    text = t('Log in');
    handleClick = () => {
      trackMetric('Clicked Log In Link');
    };
  } else {
    href = '/signup/clinician';
    className = 'js-signup-link';
    icon = 'icon-add';
    text = t('Sign up');
    handleClick = () => {
      trackMetric('Clicked Sign Up Link');
    };
  }

  return (
    <Link id="login-nav-link" to={href} className={className} onClick={handleClick}>
      <i className={icon}></i>{' ' + text}
    </Link>
  );
}

function LoginNav(props) {
  const link = renderLink(props);

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

export default translate()(LoginNav);
