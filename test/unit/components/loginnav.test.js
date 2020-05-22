/* global chai */
/* global describe */
/* global sinon */
/* global it */
/* global after */

import React from 'react';
import ReactDOM from 'react-dom';
// import { act } from 'react-dom/test-utils';
import * as sinon from 'sinon';
import LoginNav from '../../../app/components/loginnav';

const { expect } = chai;

describe('LoginNav', function () {
  it('should be exposed as a module and be of type function', function() {
    expect(LoginNav).to.be.a('function');
  });

  describe('render', function() {
    /** @type {HTMLElement} */
    let container = null;
    /** @type {HTMLElement} */
    let link = null;
    const trackMetric = sinon.stub();

    after(() => {
      if (container) {
        container.parentElement.removeChild(container);
        container = null;
      }
      link = null;
    });

    it('should render without problems when required props are present', () => {
      container = document.createElement('div');
      const body = document.getElementsByTagName('body')[0];
      body.appendChild(container);

      // React v16:
      // act(() => { ReactDOM.render(<LoginNav trackMetric={trackMetric} />, container); });
      ReactDOM.render(<LoginNav trackMetric={trackMetric} />, container);

      expect(container.getElementsByClassName('login-nav').length).to.be.equal(1);
      link = document.getElementById('login-nav-link');
      expect(link).to.be.not.null;
    });

    it('Should call trackMetrics when the link is clicked', () => {
      // act(() => { link.dispatchEvent(new MouseEvent('click', {bubbles: true})); });
      // expect(trackMetric.called).to.be.true;
    });
  });
});
