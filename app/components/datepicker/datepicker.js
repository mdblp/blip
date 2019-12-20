
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
    disabled: false,
    popup: false,
    onChange: _.noop,
    value: DatePicker.defaultValue,
  };

  constructor(props) {
    super(props);

    let value = props.value;
    if (_.isDate(value)) {
      value = {
        day: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      };
    }
    this.state = {
      value
    };

    this.months = this.getMonths();
    this.handleChange = this.handleChange.bind(this);
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

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.value, this.props.value)) {
      this.setState({
        value: this.props.value || DatePicker.defaultValue
      });
    }
  }

  render() {
    const { popup } = this.props;
    if (popup) {
      return (<div>TODO</div>);
    } else {
      return this.renderFlat();
    }
  }

  renderFlat() {
    const { t } = this.props;
    const { value } = this.state;
    const monthOptions = _.map(this.months, (item) => {
      return <option key={item.value} value={item.value}>{item.label}</option>;
    });
    return (
      <div className="DatePicker" name={this.props.name}>
        <select
          className="DatePicker-control DatePicker-control--month"
          name="month"
          value={value.month}
          disabled={this.props.disabled}
          onChange={this.handleChange}>
          {monthOptions}
        </select>
        <input
          className="DatePicker-control DatePicker-control--day"
          name="day"
          value={value.day}
          placeholder={t('Day')}
          disabled={this.props.disabled}
          onChange={this.handleChange} />
        <input
          className="DatePicker-control DatePicker-control--year"
          name="year"
          value={value.year}
          placeholder={t('Year')}
          disabled={this.props.disabled}
          onChange={this.handleChange} />
      </div>
    );
  }

  handleChange(e) {
    const target = e.target;
    const { value: oldValue } = this.state;
    const value = _.clone(oldValue);
    value[target.name] = target.value;

    let valueAsDate = null;
    if (typeof value.year === 'number' && typeof value.month === 'number' && typeof value.day === 'number') {
      valueAsDate = new Date(value.year, value.month, value.day);
    }

    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value,
        valueAsDate
      });
    }
  }
}

export default translate()(DatePicker);
