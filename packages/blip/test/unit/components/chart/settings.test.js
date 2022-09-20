
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import * as sinon from 'sinon'
import chai from 'chai'

import { MGDL_UNITS } from 'medical-domain'
import SettingsDialog from '../../../../app/components/chart/settingsDialog'

describe('SettingsDialog', function () {
  const { expect } = chai

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
  }

  describe('render', () => {
    before(() => {
      sinon.spy(console, 'error')
    })

    after(() => {
      console.error.restore()
    })

    let settingsElem = null
    afterEach(() => {
      if (settingsElem) {
        settingsElem.unmount()
        settingsElem = null
      }
    })

    const fakeState = { viz: {}, blip: { currentPatientInViewId: null } }
    const fakeStore = createStore((state = fakeState) => { return state }, fakeState)

    it('should render without problems', function () {
      const props = {
        bgPrefs,
        timePrefs: {
          timezoneAware: false,
          timezoneName: 'UTC'
        },
        patientData: {
          opts: {
            defaultSource: 'Diabeloop',
            defaultPumpManufacturer: 'default'
          },
          grouped: { pumpSettings: [{
            source: 'diabeloop',
            type: 'pumpSettings',
            deviceId: '123456789-ID',
            deviceTime: '2021-01-31T10:26:04',
            payload: {
              device: {
                deviceId: '123456789-ID',
                imei: '123456789-IMEI',
                manufacturer: 'Diabeloop',
                name: 'DBLG1',
                swVersion: '1.1.0'
              },
              cgm: {
                apiVersion: '1.0.0',
                endOfLifeTransmitterDate: '2021-03-31T08:21:00.000Z',
                expirationDate: '2021-03-31T08:21:00.000Z',
                manufacturer: 'Dexcom',
                name: 'G6',
                swVersionTransmitter: '1.0.0',
                transmitterId: '123456789'
              },
              pump: {
                expirationDate: '2021-03-30T17:47:32.000Z',
                manufacturer: 'Roche',
                name: 'Pump0001',
                serialNumber: '123456789',
                swVersion: '1.0.0'
              },
              history: [],
              parameters: []
            }
          }] }
        },
        onSwitchToDaily: sinon.spy(),
        onSwitchToSettings: sinon.spy(),
        onSwitchToDashboard: sinon.spy(),
        onSwitchToTrends: sinon.spy(),
        onClickPrint: sinon.spy(),
        trackMetric: sinon.spy(),
        open: true,
        setOpen: sinon.spy()
      }

      settingsElem = mount(<Provider store={fakeStore}><SettingsDialog {...props} /></Provider>)
      expect(console.error.callCount).to.equal(0)
      expect(settingsElem.find('#device-usage-details-dialog').exists()).to.be.true
    })

    it('should render with missing data message when no pumpSettings data supplied', function () {
      const props = {
        bgPrefs,
        timePrefs: {},
        patientData: {
          grouped: { foo: 'bar' }
        },
        onSwitchToDaily: sinon.spy(),
        trackMetric: sinon.spy(),
        open: true,
        setOpen: sinon.spy()
      }
      settingsElem = mount(<SettingsDialog {...props} />)
      expect(settingsElem.find('.patient-data-message').exists()).to.be.true
    })
  })
})
