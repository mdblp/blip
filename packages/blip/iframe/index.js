import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropType from 'prop-types';
import _ from 'lodash';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import bows from 'bows';

import { reducers as vizReducers } from 'tidepool-viz';

import '../../viz/src/styles/colors.css';
import '../../tideline/css/tideline.less';
import '../app/style.less';

import { FETCH_PATIENT_DATA_SUCCESS } from '../app/redux/constants/actionTypes';
import { updateConfig } from '../app/config';
import PatientData from './patient-data';

/** @type {import('redux').Store} */
let store = null;

function blipReducer(state, action) {
  console.log('blipReducer', state, action);
  if (_.isEmpty(state)) {
    return {
      currentPatientInViewId: null,
    };
  }

  switch (action.type) {
  case FETCH_PATIENT_DATA_SUCCESS:
    state.currentPatientInViewId = action.payload.patientId;
    break;
  }

  return state;
}

function ReduxProvider(props) {
  if (store === null) {
    // I love redux
    store = applyMiddleware(thunkMiddleware)(createStore)(combineReducers({viz: vizReducers, blip: blipReducer}), { viz: {}, blip: { currentPatientInViewId: null } });
  }
  return (
    // @ts-ignore
    <Provider store={store}>
      <PatientData api={props.api} store={store} />
    </Provider>
  );
}

ReduxProvider.propTypes = {
  api: PropType.object.isRequired,
};

function renderIframe(config, api) {
  const logger = bows('iframe');
  try {
    const blipConfig = updateConfig(config);
    logger.info('iframe config:', blipConfig);

    let mainDiv = document.getElementById('main');
    if (mainDiv) {
      console.info('Removing previous div');
      mainDiv.parentElement.removeChild(mainDiv);
    }

    mainDiv = document.createElement('div');
    mainDiv.id = 'main';
    document.body.appendChild(mainDiv);

    ReactDOM.render((
      <ReduxProvider api={api} />
    ), mainDiv);
  } catch (err) {
    console.error('renderIframe:',err);
  }
}

window.onerror = (event, source, lineno, colno, error) => {
  console.error(event, source, lineno, colno, error);
  const p = document.createElement('p');
  p.style.color = 'red';
  p.appendChild(document.createTextNode(`Error ${source}:${lineno}:${colno}: ${error}`));
  document.body.appendChild(p);
};

// @ts-ignore
window.renderIframe = renderIframe;
