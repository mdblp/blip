/* global chai */
/* global describe */
/* global sinon */
/* global it */
/* global after */

import React from 'react';
import TestUtils from 'react-dom/test-utils';
import * as sinon from 'sinon';
import Messages from '../../../../app/components/messages/messages';
const { expect } = chai;

describe('Messages', function () {
  it('should be exposed as a module and be of type function', function() {
    expect(Messages).to.be.a('function');
  });

  describe('render', function() {
    after(() => {
      sinon.restore();
    });

    it('should render without problems when required props are present', function () {
      console.error = sinon.stub();
      var props = {
        timePrefs: {}
      };
      var elem = React.createElement(Messages, props);
      var render = TestUtils.renderIntoDocument(elem);
      expect(render).to.be.ok;
      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('getInitialState', function() {
    it('should equal expected initial state', function() {
      var props = {
        messages : []
      };
      var elem = React.createElement(Messages, props);
      var render = TestUtils.renderIntoDocument(elem);
      var state = render.getWrappedInstance().getInitialState();

      expect(state.messages).to.deep.equal(props.messages);
    });
  });
});
