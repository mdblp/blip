/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2015 Tidepool Project
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

import _ from 'lodash'
import i18next from 'i18next'
import PropTypes from 'prop-types'
import React from 'react'
import './less/basics.less'
import dataMungerMkr from './logic/datamunger'
import Section from './components/DashboardSection'
import {
  SECTION_TYPE_UNDECLARED,
  SITE_CHANGE_BY_MANUFACTURER,
  SITE_CHANGE_RESERVOIR
} from './logic/constants'
import { PumpManufacturer } from 'medical-domain'
import SiteChange from './components/chart/SiteChange'
import InfusionHoverDisplay from './components/day/hover/InfusionHoverDisplay'


class BasicsChartNoSize extends React.Component {
  static propTypes = {
    patient: PropTypes.object.isRequired,
    tidelineData: PropTypes.object.isRequired,
    size: PropTypes.object,
    trackMetric: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      basicsData: null,
      data: null,
      siteChanges: null
    }
  }

  componentDidMount() {
    const { tidelineData, patient } = this.props
    if (!tidelineData.basicsData) {
      return
    }

    const basicsData = _.cloneDeep(tidelineData.basicsData)

    // We only want the last 15 days for the dashboard
    const now = new Date()
    const dashboardStartDate = new Date()
    dashboardStartDate.setDate(now.getDate() - 14)
    basicsData.days = tidelineData.basicsData.days.filter(day => new Date(day.date) >= dashboardStartDate)
    basicsData.dateRange = [dashboardStartDate.toJSON(), now.toJSON()]

    const dataMunger = dataMungerMkr()
    const medicalData = tidelineData.medicalData
    const latestPump = medicalData.pumpSettings.length > 0 ? medicalData.pumpSettings[0].source : null
    const manufacturer = tidelineData.latestPumpManufacturer
    const siteChangesTitle = _.get(
      _.get(SITE_CHANGE_BY_MANUFACTURER, manufacturer, SITE_CHANGE_BY_MANUFACTURER[PumpManufacturer.Default]),
      'label'
    )
    basicsData.siteChanges =  {
      active: true,
      chart: React.createFactory(SiteChange),
      hasHover: true,
      hoverDisplay: React.createFactory(InfusionHoverDisplay),
      id: 'siteChanges',
      index: 1,
      noDataMessage: '',
      title: i18next.t(siteChangesTitle),
      type: SITE_CHANGE_RESERVOIR
    }

    dataMunger.reduceByDay(basicsData)

    if (basicsData.days.length > 0) {
      dataMunger.processInfusionSiteHistory(basicsData, latestPump, patient)
    }

    this.adjustSectionsBasedOnAvailableData(basicsData)
    this.setState({ basicsData, siteChanges: basicsData.siteChanges, data: basicsData.data })
  }

  adjustSectionsBasedOnAvailableData(basicsData) {
    const insulinDataAvailable = this.insulinDataAvailable(basicsData)
    const noPumpDataMessage = i18next.t('This section requires data from an insulin pump, so there\'s nothing to display.')

    if (basicsData.siteChanges.type !== SECTION_TYPE_UNDECLARED) {
      if (!this.hasSectionData(basicsData, basicsData.siteChanges.type)) {
        basicsData.siteChanges.active = false
        basicsData.siteChanges.message = noPumpDataMessage
        if (!insulinDataAvailable) {
          basicsData.siteChanges.noDataMessage = null
        }
      }
    }
  }

  insulinDataAvailable(basicsData) {
    const { basal, bolus, wizard } = _.get(basicsData, 'data', {})
    return _.get(basal, 'data.length', false)
      || _.get(bolus, 'data.length', false)
      || _.get(wizard, 'data.length', false)
  }

  hasSectionData(basicsData, section) {
    // check that section has data within range of current view
    const data = _.get(basicsData, `data[${section}].data`)
    if (_.isEmpty(data)) {
      return false
    }
    return _.some(data, (datum) => {
      return datum.normalTime >= basicsData.dateRange[0]
    })
  }

  render() {
    const { basicsData } = this.state
    return <div data-testid="chart-basics-factory">{basicsData && this.renderColumn()}</div>
  }

  renderColumn() {
    const { basicsData, data, siteChanges } = this.state
    return (
      <Section
        key={siteChanges.name}
        chart={siteChanges.chart}
        chartWidth={0}
        data={data}
        days={basicsData.days}
        labels={siteChanges.labels}
        name={siteChanges.name}
        open={siteChanges.open}
        section={siteChanges}
        title={siteChanges.title}
        trackMetric={this.props.trackMetric}
      />
    )
  }
}

export default BasicsChartNoSize
