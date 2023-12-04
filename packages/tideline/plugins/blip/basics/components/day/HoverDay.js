import i18next from 'i18next'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment-timezone'
import _ from 'lodash'


const t = i18next.t.bind(i18next)

class HoverDay extends React.Component {
  getCount = () => {
    if (_.isEmpty(this.props.data) ||
      _.isEmpty(this.props.data.dataByDate[this.props.date])) {
      return 0
    }
    var dateData = this.props.data.dataByDate[this.props.date]
    return dateData.total || 0
  }

  mouseEnter = () => {
    this.props.onHover(this.props.date)
  }

  mouseLeave = () => {
    this.props.onHover(null)
  }

  render() {
    const { type, date } = this.props
    const containerClass = `Calendar-day--${type} Calendar-day--HOVER`

    var display = <div className="Calendar-day-text">{this.getCount()}</div>

    if (this.props.hoverDisplay) {
      display = this.props.hoverDisplay({ data: this.props.data, date, trackMetric: this.props.trackMetric })
    }

    return (
      <div
        data-testid="calendar-day-hover"
        className={containerClass}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <p className="Calendar-weekday">{moment.utc(this.props.date).format(t(this.props.dayAbbrevMask))}</p>
        {display}
      </div>
    )
  }
}

HoverDay.propTypes = {
  data: PropTypes.object,
  date: PropTypes.string.isRequired,
  dayAbbrevMask: PropTypes.string,
  hoverDisplay: PropTypes.func,
  onHover: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trackMetric: PropTypes.func.isRequired
}

HoverDay.defaultProps = {
  dayAbbrevMask: 'MMM D'
}

export default HoverDay
