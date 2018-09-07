
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

import { BRAND } from '../../core/constants';

var React = require('react');

var logoSrc = require('./images/tidepool-logo-880x96.png');
var altText = 'Tidepool';
if(__BRANDING__ !== 'tidepool'){
  logoSrc = require('./images/'+__BRANDING__+'/logo.png');
  altText = BRAND[__BRANDING__].alt;
}

var LoginLogo = React.createClass({
  render: function() {

    return (
      <div className="login-logo">
        <img src={logoSrc} alt={altText}/>
      </div>
    );

  }
});

module.exports = LoginLogo;
