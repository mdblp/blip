/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2015, Tidepool Project
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
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { hot, setConfig } from 'react-hot-loader';
import Perf from 'react-addons-perf';

import config from '../../config';

function Root(props) {
  const { store, routing } = props;
  return (
    <Provider store={store}>
      <div>
        <Router history={browserHistory}>
          {routing}
        </Router>
      </div>
    </Provider>
  );
}

function exportRoot() {
  if (config.DEV) {
    window.Perf = Perf;
    setConfig({ logLevel: 'warning' });
    return hot(module)(Root);
  } else {
    return Root;
  }

}

export default exportRoot();
