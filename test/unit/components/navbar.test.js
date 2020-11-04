import _ from 'lodash';
import React from 'react';
import sinon from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';

import '../../../app/core/language';
import Navbar from '../../../app/components/navbar';


describe('Navbar', () => {
  const { expect } = chai;
  let wrapper;
  const props = { trackMetric: sinon.spy() };

  before(() => {
    try {
      // FIXME should not protect this call
      sinon.spy(console, 'error');
    } catch (e) {
      console.error = sinon.stub();
    }

    wrapper = shallow(<Navbar {...props} />);
  });

  after(() => {
    if (_.isFunction(_.get(console, 'error.restore'))) {
      // @ts-ignore
      console.error.restore();
    }
  });

  it('should be exposed as a module and be of type function', function() {
    console.info('Navbar', typeof Navbar, Navbar);
    expect(Navbar).to.be.a('function');
  });

  describe('render', () => {
    it('should render without problems when required props present', () => {
      // @ts-ignore
      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('interactions', () => {
    it('should fire trackMetric when the logo is clicked', () => {
      const logo = wrapper.find('.Navbar-logo');
      expect(props.trackMetric.callCount).to.equal(0);
      logo.simulate('click');
      expect(props.trackMetric.callCount).to.equal(1);
      expect(props.trackMetric.firstCall.args[0]).to.equal('Clicked Navbar Logo');
    });
  });
});
