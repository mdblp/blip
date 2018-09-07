
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


var React = require('react');

var logoSrc = require('./images/tidepool-logo-880x96.png');
var logoSrcDiabeloop = require('./images/diabeloop/logo_diabeloop_bleu.png');

var LoginLogo = React.createClass({
  render: function() {

    return (
      <div className="login-logo">
        {__BRANDING__ === 'diabeloop' ? (
          <img src={logoSrcDiabeloop} alt="Diabeloop"/>
        ):(
          <img src={logoSrc} alt="Tidepool"/>
        )}
      </div>
    );

  }
});

module.exports = LoginLogo;
