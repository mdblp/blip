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
import cx from 'classnames'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'

import { dateTimeFormats } from '../../../../js/data/util/constants'

import ADay from './day/ADay'
import HoverDay from './day/HoverDay'

class CalendarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoverDate: null
    }
  }

  /**
   * Function that is passed to children to update the state
   * to the current hover date, of which there can only be one
   *
   * @param  {String} date
   */
  onHover = (date) => {
    this.setState({ hoverDate: date })
  }


  render() {
    var containerClass = cx('Calendar-container-' + this.props.type, {
      'Calendar-container': true
    })

    var days = this.renderDays()
    var dayLabels = this.renderDayLabels()

    return (
      <div className="Container">
        <div className={containerClass}>
          <div className="Calendar">
            <div className="weekdays">
              {dayLabels}
            </div>
            <div className="day-grid">
              {days}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderDayLabels() {
    // Take the first day in the set and use this to set the day labels
    // Could be subject to change so I thought this was preferred over
    // hard-coding a solution that assumes Monday is the first day
    // of the week.
    if (this.props.days.length === 0) {
      return <></>
    }
    var firstDay = moment.utc(this.props.days[0].date).day()
    const daysRange = _.range(firstDay, firstDay + 7)
    return daysRange.map((dow) => {
      const day = moment.utc().day(dow).format(dateTimeFormats.DDD_FORMAT)
      return (
        <div key={day} className="Calendar-day-label">
          <div className="Calendar-dayofweek">
            {day}
          </div>
        </div>
      )
    })
  }

  renderDays() {
    return this.props.days.map((day, id) => {
      if (this.props.hasHover && this.state.hoverDate === day.date) {
        return (
          <HoverDay
            key={day.date}
            data={this.props.data[this.props.type]}
            date={day.date}
            hoverDisplay={this.props.hoverDisplay}
            onHover={this.onHover}
            timezone={this.props.timezone}
            type={this.props.type}
            title={this.props.title}
            trackMetric={this.props.trackMetric}
          />
        )
      }

      return (
        <ADay key={day.date}
          chart={this.props.chart}
          chartWidth={this.props.chartWidth}
          data={this.props.data[this.props.type]}
          date={day.date}
          future={day.type === 'future'}
          isFirst={id === 0}
          mostRecent={day.type === 'mostRecent'}
          onHover={this.onHover}
          type={this.props.type} />
      )
    })
  }
}

CalendarContainer.propTypes = {
  chart: PropTypes.func.isRequired,
  chartWidth: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  days: PropTypes.array.isRequired,
  hasHover: PropTypes.bool.isRequired,
  hoverDisplay: PropTypes.func,
  sectionId: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  trackMetric: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default CalendarContainer
