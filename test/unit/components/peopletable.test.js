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
/* global chai */
/* global sinon */

import React from 'react';
import { mount } from 'enzyme';

import PeopleTable from '../../../app/components/peopletable';

const expect = chai.expect;

describe('PeopleTable', () => {
  const props = {
    people: [{
        profile: {
          fullName: 'Zoe Smith',
          firstName: 'Zoe',
          lastName: 'Smith',
          patient: { birthday: '1969-08-19T01:51:55.000Z' },
          link: 'http://localhost:3000/patients/0cc2aad188/data',
        },
        permissions: { root: {} },
        userid: 10,
        metric: {
          lastCbgTime: '2020-03-06T23:50:21.000Z',
          rate: {
            high: 10.3,
            low: 0,
            target: 6.9,
            veryHigh: 82.8,
            veryLow: 0,
          },
        },
      },
      {
        profile: {
          fullName: 'Tucker Doe',
          patient: { birthday: '1977-08-19T01:51:55.000Z' },
          link: 'http://localhost:3000/patients/0cc2bbd188/data',
        },
        userid: 20,
      },
      {
        profile: {
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          patient: { birthday: '2000-08-19T01:51:55.000Z' },
          link: 'http://localhost:3000/patients/0cc2ccd188/data',
        },
        userid: 30,
        metric: {
          lastCbgTime: '2020-03-06T23:50:21+01:00',
          rate: {
            high: 10.3,
            low: 0,
            target: 6.9,
            veryHigh: 82.8,
            veryLow: 0,
          },
        }
      },
      {
        profile: {
          fullName: 'amanda jones',
          firstName: 'amanda',
          lastName: 'jones',
          patient: { birthday: '1989-08-19T01:51:55.000Z' },
          link: 'http://localhost:3000/patients/0cc2ddd188/data',
        },
        userid: 40,
      },
      {
        profile: {
          fullName: 'Anna Zork',
          firstName: 'Anna',
          lastName: 'Zork',
          patient: { birthday: '2010-08-19T01:51:55.000Z' },
          link: 'http://localhost:3000/patients/0cc2eed188/data',
        },
        userid: 50,
      }
    ],
    trackMetric: sinon.stub(),
    onRemovePatient: sinon.stub(),
    timezone: 'Europe/Paris',
  };

  let wrapper;

  beforeEach(() => {
    props.trackMetric.reset();
    props.onRemovePatient.reset();

    wrapper = mount(
      <PeopleTable
        {...props}
      />
    );
    wrapper.instance().setState({ fullDisplayMode: true });
    wrapper.update();
  });

  it('should be a function', function () {
    expect(PeopleTable).to.be.a('function');
  });

  describe('render', function () {
    it('should render without problems', function () {
      expect(wrapper.find(PeopleTable)).to.have.length(1);
    });

    it('should have provided search box', function () {
      expect(wrapper.find('.peopletable-search-box')).to.have.length(1);
      expect(wrapper.find('.peopletable-search-box input')).to.have.length(2);
    });

    // by default, patients list is displayed
    // and instructions are not
    // following PT-1111 there is actually no scenario where these instructions would be displayed
    it('should not have instructions displayed by default', function () {
      expect(wrapper.find('.peopletable-instructions').hostNodes()).to.have.length(0);
    });

    it('should default searching and showNames to be respectively false and true', function () {
      expect(wrapper.instance().state.searching).to.equal(false);
      expect(wrapper.instance().state.showNames).to.equal(true);
    });
  });

  describe('showNames', function () {
    it('should show a row of data for each person', function () {
      wrapper.setState({ showNames: true });
      // 5 people plus one row for the header
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(6);
    });
    it('should display first name and last name for each person (if available)', function () {
      wrapper.setState({ showNames: true });
      const names = props.people.map(p=>{
        return {
          firstName:p.profile.firstName?p.profile.firstName:p.profile.fullName,
          lastName:p.profile.lastName?p.profile.lastName:''
        }
      }).sort((p1,p2)=>{
        const lastNameP1 = p1.lastName.toLocaleLowerCase();
        const lastNameP2 = p2.lastName.toLocaleLowerCase();
        if( lastNameP1 < lastNameP2){
          return -1;
        }
        if( lastNameP1 > lastNameP2){
          return 1;
        }
        return 0;
      })
      const firstNameCells = wrapper.find('.public_fixedDataTable_bodyRow .firstName .peopletable-cell-content').map(r=>r.text());
      const lastNameCells = wrapper.find('.public_fixedDataTable_bodyRow .lastName .peopletable-cell-content').map(r=>r.text());
      expect(names.length).to.equal(firstNameCells.length);
      expect(names.length).to.equal(lastNameCells.length);
      names.forEach((name,i)=>{
        expect(name.firstName).to.equal(firstNameCells[i]);
        expect(name.lastName).to.equal(lastNameCells[i]);
      })
    });
  });

  describe('sorting', function () {
    it('should find 8 sort link', function () {
      const links = wrapper.find('.peopletable-search-icon');
      expect(links).to.have.length(8);
    });

    it('should trigger a call to trackMetric with correct parameters', function () {
      const link = wrapper.find('.peopletable-search-icon').first();
      link.simulate('click');
      expect(props.trackMetric.callCount).to.equal(1);
      expect(props.trackMetric.calledWith('Sort by firstName desc')).to.be.true;
    });

    it('should find 4 sort link on small display', function () {
      wrapper.instance().setState({ fullDisplayMode: false });
      wrapper.update();
      const links = wrapper.find('.peopletable-search-icon');
      expect(links).to.have.length(4);
    });
  });

  describe('searching', function () {
    it('should show a row of data for each person', function () {
      wrapper.instance().setState({ searching: true });
      wrapper.update();
      // 5 people plus one row for the header
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(6);
    });

    it('should show a row of data for each person that matches the firstName search value', function () {
      // showing `amanda` or `Anna`
      wrapper.find('input[name="firstName"]').simulate('change', {target: {name:'firstName', value: 'a'}});
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(3);
      expect(wrapper.instance().state.searching).to.equal(true);
      // now just showing `amanda`
      wrapper.find('input[name="firstName"]').simulate('change', {target: {name:'firstName', value: 'am'}});
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(2);
      expect(wrapper.instance().state.searching).to.equal(true);
    });

    it('should show a row of data for each person that matches the lastName search value', function () {
      // showing `Doe`, `Zork` & `jones` matches
      wrapper.find('input[name="lastName"]').simulate('change', {target: {name:'lastName', value: 'o'}});
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(4);
      expect(wrapper.instance().state.searching).to.equal(true);
      // now just showing `jones`
      wrapper.find('input[name="lastName"]').simulate('change', {target: {name:'lastName', value: 'Jones'}});
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(2);
      expect(wrapper.instance().state.searching).to.equal(true);
    });

    it('should show a row of data for each person that matches the lastName and the firstName search value', function () {
      // showing `Doe`, `Zork` & `jones` matches
      wrapper.find('input[name="lastName"]').simulate('change', {target: {name:'lastName', value: 'o'}});
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(4);
      expect(wrapper.instance().state.searching).to.equal(true);
      // now just showing `amanda jones`
      wrapper.find('input[name="firstName"]').simulate('change', {target: {name:'firstName', value: 'am'}});
      expect(wrapper.find('.public_fixedDataTableRow_main')).to.have.length(2);
      expect(wrapper.instance().state.searching).to.equal(true);
    });

    it('should NOT trigger a call to trackMetric', function () {
      wrapper.find('input[name="firstName"]').simulate('change', {target: {name:'firstName', value: 'am'}});
      expect(props.trackMetric.callCount).to.equal(0);
    });

    it('should not have instructions displayed', function () {
      wrapper.find('input[name="firstName"]').simulate('change', {target: {name:'firstName', value: 'a'}});
      expect(wrapper.find('.peopletable-instructions')).to.have.length(0);
    });

    it('should have tir displayed when available', function () {
      const expectedCells = props.people.length * 6;
      expect(wrapper.find('.peopletable-cell-metric')).to.have.length(expectedCells);
    });

    it('should have tir displayed when available on small display', function () {
      wrapper.instance().setState({ fullDisplayMode: false });
      wrapper.update();
      const expectedCells = props.people.length * 2;
      expect(wrapper.find('.peopletable-cell-metric')).to.have.length(expectedCells);
    });

    it('should have message displayed for 1st patient in the list', function () {
      expect(wrapper.find('.peopletable-cell-metric').at(0).text()).to.equal('No data in the last 24 hours');
    });

    it('should have message displayed when tir not available', function () {
      const cells = wrapper.find('.peopletable-cell-metric');
      let nbrOfDataNotAvailable = 0;
      cells.forEach(cell => {
        nbrOfDataNotAvailable = (cell.text() === 'No data in the last 24 hours') ? nbrOfDataNotAvailable + 1 : nbrOfDataNotAvailable;
      });
      expect(nbrOfDataNotAvailable).to.equal(3);
    });

  });

  describe('patient removal link', function () {

    it('should have a remove icon for each patient', function () {
      expect(wrapper.find('.peopletable-icon-remove')).to.have.length(5);
    });

    it('should show open a modal for removing a patient when their remove icon is clicked', function () {
      const wrappedInstance = wrapper.instance();
      const renderRemoveDialog = sinon.spy(wrappedInstance, 'renderRemoveDialog');

      // Modal should be hidden
      const overlay = () => wrapper.find('.ModalOverlay').hostNodes();
      expect(overlay()).to.have.length(1);
      expect(overlay().is('.ModalOverlay--show')).to.be.false;

      // Click the remove link for the last patient
      const removeLink = wrapper.find('RemoveLinkCell').last().find('i.peopletable-icon-remove');
      const handleRemoveSpy = sinon.spy(wrappedInstance, 'handleRemove');
      sinon.assert.notCalled(handleRemoveSpy);
      removeLink.simulate('click');
      sinon.assert.called(handleRemoveSpy);

      // Ensure the currentRowIndex is set to highlight the proper patient
      const state = (key) => wrappedInstance.state[key];
      const currentRow = state('currentRowIndex');
      expect(currentRow).to.equal(4);
      const activeRow = wrapper.find('.peopletable-active-row').hostNodes();
      expect(activeRow).to.have.length(1);
      expect(activeRow.html()).to.contain('Anna');
      expect(activeRow.html()).to.contain('Zork');
      // Ensure the renderRemoveDialog method is called with the correct patient
      // Since we've clicked the last one, and the default sort is lastName alphabetically,
      // it should be 'Anna Zork'
      sinon.assert.callCount(renderRemoveDialog, 1);
      sinon.assert.calledWith(renderRemoveDialog, state('dataList')[currentRow]);
      expect(state('dataList')[currentRow].firstName).to.equal('Anna');
      expect(state('dataList')[currentRow].lastName).to.equal('Zork');

      // Ensure the modal is showing
      expect(overlay().is('.ModalOverlay--show')).to.be.true;
      expect(state('showModalOverlay')).to.equal(true);
    });
  });

  describe('patient removal modal', function () {
    let removeLink;
    let overlay;

    beforeEach(() => {
      overlay = () => wrapper.find('.ModalOverlay');

      removeLink = wrapper.find('RemoveLinkCell').last().find('i.peopletable-icon-remove');
      removeLink.simulate('click');
    });

    it('should close the modal when the background overlay is clicked', function () {
      const overlayBackdrop = wrapper.find('.ModalOverlay-target');

      expect(overlay().is('.ModalOverlay--show')).to.be.true;
      overlayBackdrop.simulate('click');

      expect(overlay().is('.ModalOverlay--show')).to.be.false;
    });

    it('should close the modal when the cancel link is clicked', function () {
      const cancelButton = overlay().find('.btn-secondary');

      expect(overlay().is('.ModalOverlay--show')).to.be.true;
      cancelButton.simulate('click')

      expect(overlay().is('.ModalOverlay--show')).to.be.false;
    });

    it('should remove the patient when the remove button is clicked', function () {
      const removeButton = overlay().first().find('.btn-danger');

      expect(overlay().is('.ModalOverlay--show')).to.be.true;

      // Ensure that onRemovePatient is called with the proper userid
      removeButton.simulate('click')
      sinon.assert.callCount(props.onRemovePatient, 1);
      sinon.assert.calledWith(props.onRemovePatient, 50);
    })
  });

  describe('handleRemove', function (){
    let patient;
    let rowIndex;
    let proxy;

    beforeEach(function () {
      patient = wrapper.instance().state.dataList[0];
      rowIndex = 4;
      proxy = wrapper.instance().handleRemove(patient, rowIndex);
    });

    it('should return a proxy function', function () {
      expect(proxy).to.be.a('function');
    });

    it('should set the modal and currentRowIndex state appropriately when called', function () {
      const state = key => wrapper.instance().state[key];
      expect(state('currentRowIndex')).to.equal(-1);
      expect(state('showModalOverlay')).to.be.false;
      expect(state('dialog')).to.equal('');

      proxy();

      expect(state('currentRowIndex')).to.equal(rowIndex);
      expect(state('showModalOverlay')).to.be.true;
      expect(state('dialog')).to.be.an('object');
    });
  })

  describe('handleRemovePatient', function () {
    let patient;
    let proxy;

    beforeEach(function () {
      patient = { userid: 40 };
      proxy = wrapper.instance().handleRemovePatient(patient);
    });

    it('should return a proxy function', function () {
      expect(proxy).to.be.a('function');
    });

    it('should call the appropriate handlers when called', function () {
      sinon.assert.callCount(props.onRemovePatient, 0);
      sinon.assert.callCount(props.trackMetric, 0);

      proxy();

      sinon.assert.callCount(props.onRemovePatient, 1);
      sinon.assert.calledWith(props.onRemovePatient, 40);

      sinon.assert.callCount(props.trackMetric, 1);
      sinon.assert.calledWith(props.trackMetric, 'Web - clinician removed patient account');
    });
  })
});
