
/**
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
 */

import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import moment from 'moment';

function containsAll(str, letters) {
  const ll = letters.length;
  let ca = true;
  for (let i=0; i<ll && ca; i++) {
    ca = ca && str.indexOf(letters[i]) >= 0;
  }
  return ca;
}

function arraySwap(a, i, j) {
  const v = a[i];
  a[i] = a[j];
  a[j] = v;
  return a;
}

class DatePicker extends React.Component {
  static defaultValue = {
    day: undefined,
    month: undefined,
    year: undefined
  };

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.object,
    disabled: PropTypes.bool,
    popup: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    name: 'datepicker',
    value: DatePicker.defaultValue,
    disabled: false,
    popup: false,
    onChange: _.noop,
  };

  constructor(props) {
    super(props);

    let value = props.value;
    if (_.isDate(value)) {
      value = {
        day: props.value.getDate(),
        month: props.value.getMonth(),
        year: props.value.getFullYear()
      };
    } else if (moment.isMoment(value)) {
      value = {
        day: props.value.get('date'),
        month: props.value.get('month'),
        year: props.value.get('year')
      };
    } else if (typeof value === 'string') {
      const m = moment.utc(value);
      value = {
        day: m.get('date'),
        month: m.get('month'),
        year: m.get('year')
      };
    } else if (props.popup && typeof value === 'undefined') {
      // For popup version if value is not set, display the current date
      const today = new Date();
      value = {
        day: today.getDate(),
        months: today.getMonth(),
        year: today.getFullYear(),
      };
    }
    this.state = {
      value,
      hidden: false
    };

    this.handleChangeFlat = this.handleChangeFlat.bind(this);
    this.handleChangePopup = this.handleChangePopup.bind(this);
    this.handlePrevMonth = this.handlePrevMonth.bind(this);
    this.handleNextMonth = this.handleNextMonth.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.value, this.props.value)) {
      this.setState({
        value: this.props.value || DatePicker.defaultValue
      });
    }
  }

  render() {
    const { popup } = this.props;
    const { hidden } = this.state;

    // console.log(moment().weekday(0).format('dd'));

    if (hidden) {
      return null;
    } else if (popup) {
      return this.renderPopup();
    } else {
      return this.renderFlat();
    }
  }

  renderFlat() {
    const { t } = this.props;
    const { value } = this.state;
    const formElements = [ null, null, null ];
    const months = this.getMonths();
    const monthOptions = _.map(months, (item) => {
      return <option key={item.value} value={item.value}>{item.label}</option>;
    });

    const dateFormat = t('date.format', { defaultValue: 'MDY' });

    const selectMonth = (
      <select
        className="DatePicker-control DatePicker-control--month"
        name="month"
        value={value.month}
        disabled={this.props.disabled}
        onChange={this.handleChangeFlat}>
        {monthOptions}
      </select>
    );

    const inputDay = (
      <input
        className="DatePicker-control DatePicker-control--day"
        name="day"
        value={value.day}
        placeholder={t('Day')}
        disabled={this.props.disabled}
        onChange={this.handleChangeFlat} />
    );

    const inputYear = (
      <input
        className="DatePicker-control DatePicker-control--year"
        name="year"
        value={value.year}
        placeholder={t('Year')}
        disabled={this.props.disabled}
        onChange={this.handleChangeFlat} />
    );

    if (dateFormat.length === 3 && containsAll(dateFormat, 'YMD')) {
      for (let i=0; i<3; i++) {
        switch (dateFormat[i]) {
        case 'Y':
          formElements[i] = inputYear;
          break;
        case 'M':
          formElements[i] = selectMonth;
          break;
        case 'D':
          formElements[i] = inputDay;
          break;
        }
      }
    } else {
      formElements[0] = selectMonth;
      formElements[1] = inputDay;
      formElements[2] = inputYear;
    }

    return (
      <div className="DatePicker" name={this.props.name}>
        { formElements[0] }
        { formElements[1] }
        { formElements[2] }
      </div>
    );
  }

  renderPopup() {
    const { value } = this.state;
    const m = moment.utc(value);

    console.log('current date: ', m.toISOString());

    // Build the weekdays (Su Mo Tu We Th Fr Sa)
    const weekDays = [];
    const weekDaysLabel = [];
    for (let i=0; i<7; i++) {
      const weekDay = moment().weekday(i);
      const weekDayLabel = weekDay.format('dd');
      weekDaysLabel.push(weekDayLabel);
      weekDays.push(<span className="datepicker-popup-weekday" key={weekDayLabel}>{weekDayLabel}</span>);
    }

    // Build days
    const monthDays = [];
    const currentMonth = m.get('month');
    const day = moment.utc(m).date(1).weekday(0);
    console.log('first day', day.toISOString());
    // Previous month
    while (day.get('month') !== currentMonth) {
      monthDays.push(this.getNextSpanDay(day, false, true));
    }
    // Current month
    while (day.get('month') === currentMonth) {
      const isSameDay = m.isSame(day, 'day');
      monthDays.push(this.getNextSpanDay(day, isSameDay));
    }
    // Last week days in the next month
    if (day.format('dd') !== weekDaysLabel[weekDaysLabel.length - 1]) {
      while (day.format('dd') !== weekDaysLabel[weekDaysLabel.length - 1]) {
        monthDays.push(this.getNextSpanDay(day, false, true));
      }
      monthDays.push(this.getNextSpanDay(day, false, true));
    }

    return (
      <div className="datepicker-popup">
        <div className="datepicker-popup-head">
          <span className="datepicker-popup-prev-month icon-back" onClick={this.handlePrevMonth}></span>
          <span className="datepicker-popup-year">{m.format('MMM YYYY')}</span>
          <span className="datepicker-popup-next-month icon-next" onClick={this.handleNextMonth}></span>
        </div>
        <div className="datepicker-popup-monthdays">
          {weekDays}
          {monthDays}
        </div>
      </div>
    );
  }

  /**
   * private function.
   *
   * The day moment value will be incremented by 1 day after a call of this function.
   * @param {moment} day the current day.
   * @param {boolean} isSelected true to set the class 'datepicker-popup-day-selected'
   * @param {boolean} wrongMonth true if outside the current displayed month
   */
  getNextSpanDay(day, isSelected = false, wrongMonth = false) {
    const dayOfMonth = day.get('date');
    const key = day.toISOString();
    day.add(1, 'days');

    let className = 'datepicker-popup-day';
    if (isSelected) {
      className = `${className} datepicker-popup-day-selected`;
    }
    if (wrongMonth) {
      className = `${className} datepicker-popup-day-out`;
    }
    return (<span className={className} key={key} value={key} onClick={this.handleChangePopup}>{dayOfMonth}</span>);
  }

  getMonths() {
    const { t } = this.props;
    return [
      {value: '', label: t('Month')},
      {value: '0', label: t('January')},
      {value: '1', label: t('February')},
      {value: '2', label: t('March')},
      {value: '3', label: t('April')},
      {value: '4', label: t('May')},
      {value: '5', label: t('June')},
      {value: '6', label: t('July')},
      {value: '7', label: t('August')},
      {value: '8', label: t('September')},
      {value: '9', label: t('October')},
      {value: '10', label: t('November')},
      {value: '11', label: t('December')}
    ];
  }

  handlePrevMonth(e) {
    const m = moment(this.state.value);
    m.subtract(1, 'months');
    const value = {
      day: m.get('date'),
      month: m.get('month'),
      year: m.get('year')
    }
    this.setState({value});
  }

  handleNextMonth(e) {
    const m = moment(this.state.value);
    m.add(1, 'months');
    const value = {
      day: m.get('date'),
      month: m.get('month'),
      year: m.get('year')
    };
    this.setState({value});
  }

  handleChangePopup(e) {
    const isoDate = e.target.getAttribute('value');
    const valueAsMoment = moment.utc(isoDate);
    const value = {
      day: valueAsMoment.get('date'),
      month: valueAsMoment.get('month'),
      year: valueAsMoment.get('year')
    };
    const valueAsDate = new Date(isoDate);
    this.setState({ hidden: true}, () => {
      this.props.onChange({
        name: this.props.name,
        value,
        valueAsDate,
        valueAsMoment,
      });
    });
  }

  handleChangeFlat(e) {
    const target = e.target;
    const { value: oldValue } = this.state;
    const value = _.clone(oldValue);
    value[target.name] = target.value;

    let valueAsDate = null;
    if (typeof value.year === 'number' && typeof value.month === 'number' && typeof value.day === 'number') {
      valueAsDate = new Date(value.year, value.month, value.day);
    }

    this.props.onChange({
      name: this.props.name,
      value,
      valueAsDate
    });
  }

}

export default translate()(DatePicker);
