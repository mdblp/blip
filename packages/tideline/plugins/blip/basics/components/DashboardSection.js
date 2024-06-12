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

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import NoDataContainer from './NoDataContainer'
import CalendarContainer from './CalendarContainer'

class DashboardSection extends React.Component {
  static propTypes = {
    chartWidth: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    days: PropTypes.array.isRequired,
    name: PropTypes.string,
    section: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,
    trackMetric: PropTypes.func.isRequired
  }

  static defaultProps = {}

  render() {
    var dataDisplay
    var section = this.props.section
    if (section.active) {
      dataDisplay = (
        <CalendarContainer
          chart={section.chart}
          chartWidth={this.props.chartWidth}
          data={this.props.data}
          days={this.props.days}
          hasHover={section.hasHover}
          hoverDisplay={section.hoverDisplay}
          type={section.type}
          trackMetric={this.props.trackMetric}
        />
      )
    }
    else {
      dataDisplay = (
        <NoDataContainer message={section.message} moreInfo={section.noDataMessage || null} />
      )
    }

    var containerClass = cx({
      'DashboardSection-container': true
    })

    var titleContainer
    if (this.props.title && typeof this.props.title === 'function') {
      titleContainer = this.props.title({
        data: this.props.data,
        sectionName: this.props.name,
        trackMetric: this.props.trackMetric
      })
    } else if (this.props.title) {
      var headerClasses = cx({
        'SectionHeader--nodata': section.noData
      })
      titleContainer = (
        <h3 className={headerClasses}>{this.props.title}</h3>
      )
    }

    return (
      <div className="DashboardSection">
        {titleContainer}
        <div className={containerClass}>
          <div className="DashboardSection-content">
            {dataDisplay}
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardSection
