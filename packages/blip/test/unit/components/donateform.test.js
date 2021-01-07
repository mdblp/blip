/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
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
import { mount } from 'enzyme';
import _ from 'lodash';
import sinon from 'sinon';
import { expect } from 'chai';

import { DonateForm } from '../../../app/components/donateform/donateform';
import {
  TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL,
} from '../../../app/core/constants';

describe('DonateForm', () => {
  const props = {
    dataDonationAccounts: [],
    onUpdateDataDonationAccounts: sinon.stub(),
    working: false,
    dataDonationAccountsFetched: true,
    trackMetric: sinon.stub(),
    t: (v) => v,
  };

  const expectedInitialFormValues = {
    dataDonate: false,
    dataDonateDestination: '',
  };

  /** @type {import('enzyme').ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>} */
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <DonateForm
        {...props}
      />
    );
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    props.onUpdateDataDonationAccounts.reset();
    props.trackMetric.reset();
    sinon.restore();
    wrapper.unmount();
  });

  it('should be a function', () => {
    expect(DonateForm).to.be.a('function');
  });

  it('should render without errors when provided all required props', () => {
    expect(wrapper.find('.DonateForm')).to.have.length(1);
    expect(console.error.callCount).to.equal(0);
  });

  it('should set the initial state', () => {
    const expectedInitialState = {
      formValues: expectedInitialFormValues,
      initialFormValues: expectedInitialFormValues,
      formSubmitted: false,
    };

    expect(wrapper.state()).to.eql(expectedInitialState);
  });

  describe('getNonProfitAccounts', () => {
    it('should return a slice of the data donation accounts array with the primary account filtered out', () => {
      expect(wrapper.instance().getNonProfitAccounts([
        { email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL },
        { email: 'bigdata+CARBDM@tidepool.org' },
        { email: 'bigdata+CWD@tidepool.org' },
      ])).to.eql([
        { email: 'bigdata+CARBDM@tidepool.org' },
        { email: 'bigdata+CWD@tidepool.org' },
      ]);
    });
  });

  describe('componentWillReceiveProps', () => {
    it('should set the form values state as soon as the data donation accounts are fetched', () => {
      const setStateSpy = sinon.spy(DonateForm.prototype, 'setState');

      wrapper.setProps({ dataDonationAccountsFetched: false });
      sinon.assert.callCount(setStateSpy, 0);

      wrapper.setProps({ dataDonationAccountsFetched: true });
      sinon.assert.callCount(setStateSpy, 1);
      sinon.assert.calledWith(setStateSpy, sinon.match({
        formValues: sinon.match.object,
        initialFormValues: sinon.match.object,
      }));
      DonateForm.prototype.setState.restore();
    });
  });

  describe('render', () => {
    it('should render a donation checkbox', () => {
      const label = wrapper.find('.input-group-checkbox-label');
      const checkbox = wrapper.find('input#dataDonate[type="checkbox"]');

      expect(label).to.have.length(1);
      expect(label.text()).contains('Donate my anonymized data');

      expect(checkbox).to.have.length(1);
    });

    it('should render a select list of nonprofits to support', () => {
      const placeholder = wrapper.find('.Select__placeholder');
      const select = wrapper.find('.Select__input > input');

      expect(placeholder).to.have.length(1);
      expect(placeholder.text()).contains('Choose which diabetes organization(s) to support');

      expect(select).to.have.length(1);
    });

    it('should render a submit button', () => {
      const button = wrapper.find('button.simple-form-submit');
      expect(button).to.have.length(1);
    });
  });

  describe('getInitialFormValues', () => {
    it('should set appropriate form values for a non-donor', () => {
      expect(wrapper.state().formValues).to.eql(expectedInitialFormValues);
    });

    it('should set appropriate initial form values for a donor who has not yet shared proceeds', () => {
      const newProps = _.assign({}, props, {
        dataDonationAccounts: [{ email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL }],
      });

      const expectedFormValues = _.assign({}, expectedInitialFormValues, {
        dataDonate: true,
      });

      const element = mount(<DonateForm {...newProps} />);
      expect(element.state().formValues).to.eql(expectedFormValues);
    });

    it('should set appropriate initial form values for a donor who has shared proceeds', () => {
      const newProps = _.assign({}, props, {
        dataDonationAccounts: [
          { email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL },
          { email: 'bigdata+CARBDM@tidepool.org' },
          { email: 'bigdata+CWD@tidepool.org' },
        ],
      });

      const expectedFormValues = _.assign({}, expectedInitialFormValues, {
        dataDonate: true,
        dataDonateDestination: 'CARBDM,CWD',
      });

      const element = mount(<DonateForm {...newProps} />);
      expect(element.state().formValues).to.eql(expectedFormValues);
    });

    it('should set sort the nonprofits alphabetically in the value string', () => {
      const newProps = _.assign({}, props, {
        dataDonationAccounts: [
          { email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL },
          { email: 'bigdata+CWD@tidepool.org' },
          { email: 'bigdata+NSF@tidepool.org' },
          { email: 'bigdata+CARBDM@tidepool.org' },
        ],
      });

      const expectedFormValues = _.assign({}, expectedInitialFormValues, {
        dataDonate: true,
        dataDonateDestination: 'CARBDM,CWD,NSF',
      });

      const element = mount(<DonateForm {...newProps} />);
      expect(element.state().formValues).to.eql(expectedFormValues);
    });

    it('should set initial form values with a provided props argument', () => {
      expect(wrapper.instance().getInitialFormValues({
        dataDonationAccounts: [
          { email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL },
          { email: 'bigdata+NSF@tidepool.org' },
        ]
      })).to.eql({
        dataDonate: true,
        dataDonateDestination: 'NSF',
      });
    });
  });

  describe('getSubmitButtonText', () => {
    it('should display the appropriate text depending on whether or not the form is submitting', () => {
      const button = wrapper.find('button.simple-form-submit');
      expect(button.text()).to.equal('Save');

      wrapper.setProps({ working: true });
      expect(button.text()).to.equal('Saving...');
    });

    it('should display the appropriate text depending on whether or not the form has been submitted', () => {
      const button = wrapper.find('button.simple-form-submit');
      expect(button.text()).to.equal('Save');

      wrapper.instance().setState({ formSubmitted: true });
      expect(button.text()).to.equal('Saved');
    });

    it('should display the appropriate initial text depending on whether or not the user has donated', () => {
      const button = wrapper.find('button.simple-form-submit');
      expect(button.text()).to.equal('Save');

      wrapper.setProps({ dataDonationAccounts: [TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL] });
      expect(button.text()).to.equal('Saved');
    });
  });

  describe('formIsUpdated', () => {
    it('should return true if the form has been updated', () => {
      wrapper.instance().setState({
        formValues: {
          dataDonate: true,
          dataDonateDestination: 'CARBDM,CWD',
        }
      });
      expect(wrapper.instance().formIsUpdated()).to.be.true;
    });

    it('should return false if the form has not been updated', () => {
      expect(wrapper.instance().formIsUpdated()).to.be.false;
    });
  });

  describe('submitIsDisabled', () => {
    let checkbox, button;

    beforeEach(() => {
      checkbox = () => wrapper.find('.simple-form').find('.input-group').first().find('input').first();
      button = () => wrapper.find('.simple-form').find('button.simple-form-submit[disabled]');
    });

    it('should disable the submit button if the form values haven\'t changed', () => {
      expect(checkbox()).to.have.length(1);
      expect(button()).to.have.length(1);

      expect(button().prop('disabled')).to.be.true;

      // Change the form to enable the submit button
      checkbox().simulate('change', { target: { name: 'dataDonate', checked: true } });
      expect(button().prop('disabled')).to.be.false;
    });

    it('should disable the submit button if the form is processing', () => {
      // Change the form to enable the submit button
      checkbox().simulate('change', { target: { name: 'dataDonate', checked: true } });
      expect(button().prop('disabled')).to.be.false;

      // Set the form working state to true
      wrapper.setProps({ working: true });
      expect(button().prop('disabled')).to.be.true;
    });

    it('should disable the submit button if the data donation accounts have not been fetched', () => {
      // Change the form to enable the submit button
      checkbox().simulate('change', { target: { name: 'dataDonate', checked: true } });
      expect(button().prop('disabled')).to.be.false;

      // Set the dataDonationAccountsFetched prop to false
      wrapper.setProps({ dataDonationAccountsFetched: false });
      expect(button().prop('disabled')).to.be.true;
    });
  });

  describe('handleChange', () => {
    let spy, checkbox, select;

    beforeEach(() => {
      spy = sinon.spy(wrapper.instance(), 'handleChange');
      wrapper.instance().forceUpdate();

      checkbox = wrapper.find('.simple-form').first().find('.input-group').first().find('input');
      select = wrapper.find('.simple-form').first().find('.input-group').at(2).find('.Select').first().find('input').first();
    });

    it('should update the form values in state when a form value changes', () => {
      expect(wrapper.instance().state.formValues.dataDonate).to.be.false;

      checkbox.simulate('change', { target: { name: 'dataDonate', checked: true } });
      sinon.assert.calledOnce(spy);

      expect(wrapper.instance().state.formValues.dataDonate).to.be.true;
    });

    it('should ensure that the dataDonate form value string is sorted alphabetically', () => {
      expect(wrapper.instance().state.formValues.dataDonateDestination).to.be.empty;

      wrapper.instance().handleChange({
        name: 'dataDonateDestination',
        value: ['CWD', 'NSF', 'CARBDM'].map(value => ({ value }))
      });

      expect(wrapper.instance().state.formValues.dataDonateDestination).to.equal('CARBDM,CWD,NSF');
    });
  });

  describe('handleSubmit', () => {
    let spy, checkbox, button;

    beforeEach(() => {
      spy = sinon.spy(wrapper.instance(), 'handleSubmit');
      wrapper.update();

      checkbox = () => wrapper.find('.simple-form').first().find('.input-group').first().find('input');
      button = () => wrapper.find('.simple-form').first().find('button.simple-form-submit[disabled]');
    });

    it('should be called when the user clicks the submit button', () => {
      // Change the form to enable the submit button
      checkbox().simulate('change', { target: { name: 'dataDonate', checked: true } });
      expect(button().prop('disabled')).to.be.false;

      button().simulate('click');

      sinon.assert.calledOnce(spy);
    });

    it('should call the onUpdateDataDonationAccounts handler', () => {
      // Change the form to enable the submit button
      checkbox().simulate('change', { target: { name: 'dataDonate', checked: true } });
      expect(button().prop('disabled')).to.be.false;

      button().simulate('click');

      sinon.assert.calledOnce(props.onUpdateDataDonationAccounts);
    });

    it('should add donation accounts and track metrics', () => {
      const formValues = {
        dataDonate: true,
        dataDonateDestination: 'CARBDM,CWD',
      };

      const expectedAddAccounts = [
        TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL,
        'bigdata+CARBDM@tidepool.org',
        'bigdata+CWD@tidepool.org',
      ];

      const location = 'settings';

      wrapper.instance().setState({ formValues });

      wrapper.instance().handleSubmit(formValues);
      sinon.assert.calledOnce(props.onUpdateDataDonationAccounts);
      sinon.assert.calledWith(props.onUpdateDataDonationAccounts, expectedAddAccounts);

      sinon.assert.calledThrice(props.trackMetric);
      expect(props.trackMetric.getCall(0).args).to.eql(['web - big data sign up', { source: 'none', location }]);
      expect(props.trackMetric.getCall(1).args).to.eql(['web - big data sign up', { source: 'CARBDM', location }]);
      expect(props.trackMetric.getCall(2).args).to.eql(['web - big data sign up', { source: 'CWD', location }]);
    });

    it('should not re-add accounts that are already added', () => {
      wrapper.setProps({
        dataDonationAccounts: [
          { email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL },
          { email: 'bigdata+CWD@tidepool.org' },
        ],
      });

      const formValues = {
        dataDonate: true,
        dataDonateDestination: 'CARBDM,CWD',
      };

      const expectedAddAccounts = [
        'bigdata+CARBDM@tidepool.org',
      ];

      wrapper.instance().setState({ formValues });

      wrapper.instance().handleSubmit(formValues);

      sinon.assert.calledOnce(props.onUpdateDataDonationAccounts);
      sinon.assert.calledWith(props.onUpdateDataDonationAccounts, expectedAddAccounts);
    });

    it('should remove donation accounts and track metrics', () => {
      wrapper.setProps({
        dataDonationAccounts: [
          { email: TIDEPOOL_DATA_DONATION_ACCOUNT_EMAIL },
          { email: 'bigdata+CWD@tidepool.org' },
          { email: 'bigdata+CARBDM@tidepool.org' },
        ],
      });

      const formValues = {
        dataDonate: true,
        dataDonateDestination: '',
      };

      const expectedRemoveAccounts = [
        { email: 'bigdata+CWD@tidepool.org' },
        { email: 'bigdata+CARBDM@tidepool.org' },
      ];

      wrapper.instance().setState({ formValues });

      wrapper.instance().handleSubmit(formValues);

      sinon.assert.calledOnce(props.onUpdateDataDonationAccounts);
      sinon.assert.calledWithExactly(props.onUpdateDataDonationAccounts, [], expectedRemoveAccounts);

      sinon.assert.calledTwice(props.trackMetric);
      expect(props.trackMetric.getCall(0).args).to.eql(['web - big data cancellation', { source: 'CWD' }]);
      expect(props.trackMetric.getCall(1).args).to.eql(['web - big data cancellation', { source: 'CARBDM' }]);
    });
  });
});
