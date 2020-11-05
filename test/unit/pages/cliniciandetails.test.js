// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';

import config from '../../../app/config';
import { ClinicianDetails } from '../../../app/pages/cliniciandetails/cliniciandetails';

describe('ClinicianDetails', function () {
  const { expect } = chai;
  let container = null;
  const props = {
    fetchingUser: false,
    onSubmit: _.noop,
    trackMetric: sinon.spy(),
    user: {},
    working: false,
  };

  before(() => {
    try {
      sinon.spy(console, 'error');
    } catch (e) {
      console.error = sinon.spy();
    }
  });

  after(() => {
    // @ts-ignore
    if (_.isFunction(_.get(console, 'error.restore'))) {
      // @ts-ignore
      console.error.restore();
    }
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    console.error.resetHistory();
  });

  it('should render with no error with the rights props', (done) => {
    ReactDOM.render(<ClinicianDetails {...props} />, container, () => {
      try {
        expect(console.error.called, console.error.getCalls()).to.be.false;
        expect(props.trackMetric.calledOnce).to.be.true;
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should not propose to set the country if the preference is not set', (done) => {
    config.ALLOW_SELECT_COUNTRY = false;
    ReactDOM.render(<ClinicianDetails {...props} />, container, () => {
      try {
        expect(document.getElementById('country')).to.be.null;
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should propose to set the country if the preference is set', (done) => {
    config.ALLOW_SELECT_COUNTRY = true;
    ReactDOM.render(<ClinicianDetails {...props} />, container, () => {
      try {
        expect(document.getElementById('country')).to.be.not.null;
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
