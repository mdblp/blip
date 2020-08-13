import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

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

Root.propTypes = {
  store: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
};

export default Root;
