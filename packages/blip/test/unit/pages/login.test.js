import React from'react';
import ReactDOM from 'react-dom';
import mutationTracker from 'object-invariant-test-helper';
import { assert, expect } from 'chai';
import sinon from 'sinon';

import { Login, mapStateToProps } from'../../../app/pages/login/login.js';
import config from '../../../app/config';

describe('Login', function () {

  it('should be exposed as a module and be of type function', function() {
    expect(Login).to.be.a('function');
  });

  describe('render', function() {
    let container = null;

    before(() => {
      sinon.spy(console, 'error');
    });

    after(() => {
      console.error.restore();
      config.BRANDING = 'tidepool';
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

    it('should render without problems when required props are present', (done) => {
      const props = {
        acknowledgeNotification: sinon.stub(),
        confirmSignup: sinon.stub(),
        fetchers: [],
        isInvite: false,
        onSubmit: sinon.stub(),
        trackMetric: sinon.stub(),
        working: false
      };
      ReactDOM.render(<Login {...props} />, container, () => {
        try {
          const div = document.querySelector('.login-simpleform');
          expect(div).to.be.not.null;
          expect(console.error.callCount).to.equal(0);
          done();
        } catch (err) {
          done(err);
        }
      });
    });


  });

  describe('mapStateToProps', () => {
    const state = {
      working: {
        confirmingSignup: {inProgress: false, notification: null},
        loggingIn: {inProgress: false, notification: {type: 'alert', message: 'Hi!'}}
      }
    };

    const tracked = mutationTracker.trackObj(state);
    const result = mapStateToProps({blip: state});

    it('should not mutate the state', () => {
      expect(mutationTracker.hasMutated(tracked)).to.be.false;
    });

    it('should be a function', () => {
      assert.isFunction(mapStateToProps);
    });

    it('should map working.loggingIn.inProgress to working', () => {
      expect(result.working).to.equal(state.working.loggingIn.inProgress);
    });

    it('should map working.loggingIn.notification to notification', () => {
      expect(result.notification).to.equal(state.working.loggingIn.notification);
    });

    it('should map working.confirmingSignup.notification to notification if working.loggingIn.notification is null', () => {
      const anotherState = {
        working: {
          loggingIn: {inProgress: false, notification: null},
          confirmingSignup: {inProgress: false, notification: {status: 500, body: 'Error :('}}
        }
      };
      const anotherRes = mapStateToProps({blip: anotherState});
      expect(anotherRes.notification).to.equal(anotherState.working.confirmingSignup.notification);
    });

    describe('when some state is `null`', () => {
      const state = {
        working: {
          confirmingSignup: {inProgress: false, notification: null},
          loggingIn: {inProgress: false, notification: null}
        }
      };

      const tracked = mutationTracker.trackObj(state);
      const result = mapStateToProps({blip: state});

      it('should not mutate the state', () => {
        expect(mutationTracker.hasMutated(tracked)).to.be.false;
      });

      it('should map working.loggingIn.notification to notification', () => {
        expect(result.notification).to.be.null;
      });
    });
  });
});
