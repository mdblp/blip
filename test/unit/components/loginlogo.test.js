/* global chai */
/* global describe */
/* global sinon */
/* global it */

import React from 'react';
import ReactDOM from 'react-dom';
import LoginLogo from '../../../app/components/loginlogo';

const { expect } = chai;

describe('LoginLogo', function () {
  it('should be exposed as a module and be of type function', function() {
    expect(LoginLogo).to.be.a('function');
  });

  describe('render', function() {
    it('should render without problems', () => {
      const container = document.createElement('div');
      ReactDOM.render(<LoginLogo />, container);
      expect(container.getElementsByClassName('login-logo').length).to.be.equal(1);
    });
  });
});
