
/**
 * @typedef {import("enzyme").ShallowWrapper} ShallowWrapper
 * @typedef {import("enzyme").ReactWrapper} ReactWrapper
 */
import _ from 'lodash';
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import i18next from 'i18next';
import moment from 'moment-timezone';

import DataUtilStub from '../../../helpers/DataUtil';
import Daily, { DailyChart } from '../../../../app/components/chart/daily';
import { MGDL_UNITS } from '../../../../app/core/constants';
import { components as vizComponents } from 'tidepool-viz';

const { Loader } = vizComponents;

require('tideline/css/tideline.less');
require('../../../../app/core/less/fonts.less');
require('../../../../app/style.less');

describe('Daily', () => {
  const timezone = 'America/Los_Angeles';
  const bgPrefs = {
    bgClasses: {
      'very-low': {
        boundary: 60
      },
      'low': {
        boundary: 80
      },
      'target': {
        boundary: 180
      },
      'high': {
        boundary: 200
      },
      'very-high': {
        boundary: 300
      }
    },
    bgUnits: MGDL_UNITS
  };

  const baseProps = {
    bgPrefs,
    chartPrefs: {
      daily: {},
    },
    permsOfLoggedInUser: {
      root: true,
    },
    dataUtil: new DataUtilStub(),
    profileDialog: sinon.stub().returns(<div id="profile-dialog" />),
    datetimeLocation: moment.utc('2014-03-13T12:00:00.000Z'),
    endpoints: ['2014-03-13T00:00:00.000Z', '2014-03-13T23:59:59.999Z'],
    loading: false,
    onClickRefresh: sinon.stub(),
    onClickPrint: sinon.stub(),
    onCreateMessage: sinon.stub(),
    onShowMessageThread: sinon.stub(),
    onSwitchToBasics: sinon.stub(),
    onSwitchToDaily: sinon.stub(),
    onSwitchToSettings: sinon.stub(),
    onSwitchToTrends: sinon.stub(),
    onUpdateChartDateRange: sinon.stub(),
    patient: {
      profile: {
        fullName: 'Jane Doe'
      },
      permissions: {
        note: {},
        view: {}
      }
    },
    tidelineData: {
      opts: {
        timePrefs: {
          timezoneAware: true,
          timezoneName: timezone,
          timezoneOffset: 0,
        },
      },
      grouped: { foo: 'bar' },
      getTimezoneAt: sinon.stub().returns(timezone),
    },
    canPrint: false,
    timePrefs: {
      timezoneAware: true,
      timezoneName: timezone,
    },
    t: i18next.t.bind(i18next),
    trackMetric: sinon.stub(),
    updateChartPrefs: sinon.stub(),
    updateDatetimeLocation: sinon.stub(),
  };

  /** @type {ShallowWrapper | ReactWrapper} */
  let wrapper;
  /** @type {Daily} */
  let instance;

  before(() => {
    sinon.stub(DailyChart.prototype, 'rerenderChart');
    sinon.stub(DailyChart.prototype, 'mountChart');
    sinon.stub(DailyChart.prototype, 'unmountChart');
    sinon.stub(DailyChart.prototype, 'initializeChart');
    sinon.stub(DailyChart.prototype, 'render').returns(<div className='fake-daily-chart' />);
  });

  beforeEach(() => {
    wrapper = mount(<Daily {...baseProps} />);
    wrapper.update();
    instance = wrapper.instance();
  });

  afterEach(() => {
    baseProps.onClickPrint.reset();
    baseProps.onUpdateChartDateRange.reset();
    baseProps.trackMetric.reset();
    baseProps.updateChartPrefs.reset();
    baseProps.updateDatetimeLocation.reset();
    baseProps.tidelineData.getTimezoneAt.resetHistory();
    wrapper.unmount();
  });

  after(() => {
    sinon.restore();
  });

  describe('render', () => {
    it('should have a refresh button which should call onClickRefresh when clicked', () => {
      var props = _.assign({}, baseProps, {
        onClickRefresh: sinon.spy(),
      });

      wrapper.setProps(props);

      var refreshButton = wrapper.find('.btn-refresh');

      sinon.assert.callCount(props.onClickRefresh, 0);
      refreshButton.simulate('click');
      sinon.assert.callCount(props.onClickRefresh, 1);
    });

    it('should not have a print button when a pdf is not ready to print', () => {
      var props = _.assign({}, baseProps, {
        canPrint: false,
      });

      wrapper.setProps(props);

      var printLink = wrapper.find('.printview-print-icon').hostNodes();
      expect(printLink.length).to.equal(0);
    });

    it('should have an enabled print button and icon when a pdf is ready and call onClickPrint when clicked', () => {
      var props = _.assign({}, baseProps, {
        canPrint: true,
      });

      wrapper.setProps(props);

      var printLink = wrapper.find('.printview-print-icon').hostNodes();
      expect(printLink.length).to.equal(1);

      sinon.assert.callCount(props.onClickPrint, 0);
      printLink.simulate('click');
      sinon.assert.callCount(props.onClickPrint, 1);
    });

    it('should show a loader when loading prop is true', () => {
      var props = _.assign({}, baseProps, {
        loading: false,
      });

      wrapper.setProps(props);

      const loader = () => wrapper.find(Loader).last();

      expect(loader().length).to.equal(1);
      expect(loader().prop('show')).to.be.false;

      wrapper.setProps({ loading: true });
      expect(loader().props().show).to.be.true;
    });

    it('should render the bg toggle', () => {
      const toggle = wrapper.find('BgSourceToggle');
      expect(toggle.length).to.equal(1);
    });

    it('should render the stats', () => {
      const stats = wrapper.find('Stats');
      expect(stats.length).to.equal(1);
    });
  });

  describe('handleDatetimeLocationChange', () => {
    const endpoints = {
      start: '2018-01-15T00:00:00.000Z',
      center: '2018-01-15T12:00:00.000Z',
      end: '2018-01-16T00:00:00.000Z',
    };

    it('should update the base props `datetimeLocation` & `dateRange` state', () => {
      instance.handleDatetimeLocationChange(endpoints);
      sinon.assert.calledOnce(baseProps.tidelineData.getTimezoneAt);
      sinon.assert.calledOnce(baseProps.updateDatetimeLocation);
      sinon.assert.calledWith(baseProps.updateDatetimeLocation, moment.utc('2018-01-15T12:00:00.000Z'));
      sinon.assert.calledOnce(baseProps.onUpdateChartDateRange);
      sinon.assert.calledWith(baseProps.onUpdateChartDateRange, ['2018-01-15T00:00:00.000Z', '2018-01-16T00:00:00.000Z']);
    });

    it('should set the `title` state', () => {
      expect(wrapper.state().title).to.equal('');
      instance.handleDatetimeLocationChange(endpoints);
      expect(wrapper.state().title).to.equal('Mon, Jan 15, 2018');
    });
  });

  describe('toggleBgDataSource', () => {
    it('should track metric when toggled', () => {
      const instance = wrapper.instance();
      instance.toggleBgDataSource(null, 'cbg');
      sinon.assert.callCount(baseProps.trackMetric, 1);
      sinon.assert.calledWith(baseProps.trackMetric, 'Daily Click to CGM');

      instance.toggleBgDataSource(null, 'smbg');
      sinon.assert.callCount(baseProps.trackMetric, 2);
      sinon.assert.calledWith(baseProps.trackMetric, 'Daily Click to BGM');
    });

    it('should call the `updateChartPrefs` handler to update the bgSource', () => {
      const instance = wrapper.instance();
      instance.toggleBgDataSource(null, 'cbg');

      sinon.assert.callCount(baseProps.updateChartPrefs, 1);
      sinon.assert.calledWith(baseProps.updateChartPrefs, {
        daily: { bgSource: 'cbg' },
      });

      instance.toggleBgDataSource(null, 'smbg');

      sinon.assert.callCount(baseProps.updateChartPrefs, 2);
      sinon.assert.calledWith(baseProps.updateChartPrefs, {
        daily: { bgSource: 'smbg' },
      });
    });
  });
});
