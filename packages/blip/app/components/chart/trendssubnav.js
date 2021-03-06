
/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
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
import PropTypes from 'prop-types';
import cx from 'classnames';
import i18next from 'i18next';

const t = i18next.t.bind(i18next);
const domains = ['1 week', '2 weeks', '4 weeks', '3 months'];
const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

class DaysGroup extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired,
    days: PropTypes.array.isRequired,
    onClickGroup: PropTypes.func.isRequired
  };

  render() {
    var groupClass = cx({
      'daysGroup': true,
      'active': this.props.active
    }) + ' ' + this.props.category;

    return (
      <div>
        <input type="checkbox" className={groupClass}
          onChange={this.handleDaysGroupClick}
          checked={this.props.active} />
        {this.props.days}
      </div>
    );

  }

  handleDaysGroupClick = () => {
    this.props.onClickGroup(this.props.category);
  };
}

class TrendsSubNav extends React.Component {
  static propTypes = {
    activeDays: PropTypes.object.isRequired,
    extentSize: PropTypes.number.isRequired,
    domainClickHandlers: PropTypes.object.isRequired,
    onClickDay: PropTypes.func.isRequired,
    toggleWeekdays: PropTypes.func.isRequired,
    toggleWeekends: PropTypes.func.isRequired
  };

  renderDayAbbrev = (day) => {
    switch (day) {
      case 'monday': return t('M_Monday');
      case 'tuesday': return t('Tu_Tuesday');
      case 'wednesday': return t('W_Wednesday');
      case 'thursday': return t('Th_Thursday');
      case 'friday': return t('F_Friday');
      case 'saturday': return t('Sa_Saturday');
      case 'sunday': return t('Su_Sunday');
      default: return undefined;
    }
  };

  extentSizeToDomain = (extentSize) => {
    switch (extentSize) {
      case 7: return '1 week';
      case 14: return '2 weeks';
      case 28: return '4 weeks';
      case 90: return '3 months';
      default: return 'custom';
    }
  };

  renderDomain = (domain) => {
    switch (domain) {
      case '1 week': return t('1 week');
      case '2 weeks': return t('2 weeks');
      case '4 weeks': return t('4 weeks');
      case '3 months': return t('3 months');
      default: return t('custom');
    }
  };

  UNSAFE_componentWillMount() {
    this.areWeekdaysActive(this.props);
    this.areWeekendsActive(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.areWeekdaysActive(nextProps);
    this.areWeekendsActive(nextProps);
  }

  render() {
    var domainContainer = this.renderDomainContainer();
    var dayFilters = this.renderDayFilters();

    return (
      <div id="trendsSubNav">
        {domainContainer}
        {dayFilters}
      </div>
    );

  }

  renderDomainContainer = () => {
    const { activeDays, extentSize } = this.props;
    const domainLinks = [];
    for (let i = 0; i < domains.length; ++i) {
      domainLinks.push(this.renderDomainLink(domains[i]));
    }
    let numActiveDays = 0;
    for (const day in activeDays) {
      if (activeDays[day]) {
        numActiveDays += 1;
      }
    }
    const numVisibleDays = (numActiveDays * extentSize) / 7;
    let visibleDaysText = null;
    if (numVisibleDays % 1 !== 0) {
      visibleDaysText = t('Approx {{numVisibleDays}} days in view', { numVisibleDays: Math.round(numVisibleDays) });
    }
    else {
      visibleDaysText = t('{{numVisibleDays}} days in view', { numVisibleDays });
    }

    return (
      <div className="domainContainer">
        <div className="domainLinks">{domainLinks}</div>
        <p className="visibleDays">{visibleDaysText}</p>
      </div>
    );
  };

  renderDomainLink = (domain) => {
    var domainLinkClass = cx({
      'btn btn-chart-control': true,
      'active': domain === this.extentSizeToDomain(this.props.extentSize)
    });

    return (
      <button className={domainLinkClass} key={domain}
        onClick={this.props.domainClickHandlers[domain]}>{this.renderDomain(domain)}</button>
    );
  };

  renderDayFilters = () => {
    var dayLinks = [];
    for (var i = 0; i < days.length; ++i) {
      dayLinks.push(this.renderDay(days[i]));
    }

    return (
      <div className="daysGroupContainer">
        <DaysGroup
          active={this.state.weekdaysActive}
          category={'weekday'}
          days={dayLinks.slice(0, 5)}
          onClickGroup={this.handleSelectDaysGroup} />
        <DaysGroup
          active={this.state.weekendsActive}
          category={'weekend'}
          days={dayLinks.slice(5, 7)}
          onClickGroup={this.handleSelectDaysGroup} />
      </div>
    );

  };

  renderDay = (day) => {
    var dayLinkClass = cx({
      'dayFilter': true,
      'btn btn-chart-control': true,
      'active': this.props.activeDays[day],
      'inactive': !this.props.activeDays[day]
    }) + ' ' + day;

    return (
      <a className={dayLinkClass} key={day} onClick={this.props.onClickDay(day)}>{this.renderDayAbbrev(day)}</a>
    );

  };

  areWeekdaysActive = (props) => {
    var active = true;
    var activeDays = props.activeDays;
    for (var i = 0; i < weekdays.length; ++i) {
      if (!activeDays[weekdays[i]]) {
        active = false;
        break;
      }
    }
    this.setState({
      weekdaysActive: active
    });
  };

  areWeekendsActive = (props) => {
    var activeDays = props.activeDays;
    this.setState({
      weekendsActive: activeDays.saturday && activeDays.sunday
    });
  };

  // handlers
  handleSelectDaysGroup = (category) => {
    if (category === 'weekday') {
      this.props.toggleWeekdays(this.state.weekdaysActive);
    }
    else if (category === 'weekend') {
      this.props.toggleWeekends(this.state.weekendsActive);
    }
  };
}

export default TrendsSubNav;
