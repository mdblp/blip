/* global chai */
/* global describe */
/* global sinon */
/* global it */

import React from 'react';
import TestUtils from 'react-dom/test-utils';
import * as sinon from 'sinon';
import NotificationElem from '../../../app/components/notification';

const { expect } = chai;

describe('NotificationElem', function () {
  describe('render', function() {
    it('should render without problems', function () {
      console.error = sinon.stub();
      var props = {
        contents: {},
        onClose: sinon.stub()
      }
      var elem = TestUtils.renderIntoDocument(<NotificationElem {...props}/>);

      expect(elem).to.be.ok;
      expect(console.error.callCount).to.equal(0);
    });
  });
});
