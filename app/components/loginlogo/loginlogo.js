
/**
 * Copyright (c) 2020, Diabeloop
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
import { CONFIG as CONSTANTS } from '../../core/constants';
import config from '../../config';
import logoSrc from './images/tidepool/logo.png';

function LoginLogo() {
  const altText = CONSTANTS[config.BRANDING].name;
  return (
    <div className="login-logo">
      <img src={logoSrc} alt={altText}/>
    </div>
  );
}

export default LoginLogo;
