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

var i18next = require('i18next');
var t = i18next.t.bind(i18next);

var _ = require('lodash');
var d3 = require('d3');
var React = require('react');
var cx = require('classnames');

var basicsActions = require('../../logic/actions');
var inputRef = 'weightInput';

var UnknownStatistic = require('../misc/UnknownStatistic');

var MAX_WEIGHT = 500;

var DailyDose = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  /**
   * Get the initial state of the component
   *
   * @return {Object}
   */
  getInitialState: function() {
    return {
      valid: (this.props.data && !!this.props.data.weight),
      formWeight: null
    };
  },
  /**
   * The main render function of the DailyDose component
   * @return {Element}
   */
  render: function() {
    var noTDD = !_.get(this.props, ['data', 'totalDailyDose']);
    var buttonClass = (this.state.valid) ? 'active' : '';
    var calculateButton = (
      <button onClick={this.onClickCalculate} className={buttonClass} >Calculate</button>
    );
    var weightLabelClass = cx({'DailyDose-weightInputForm-label--nodata': noTDD});

    return (
      <div className='DailyDose'>
        <div className="DailyDose-weightInputContainer">
          <div className="DailyDose-weightInputForm">
            <label className={weightLabelClass}>{t('Weight')}</label>
            {this.renderWeightSelector(noTDD)}
          </div>
          {noTDD ? null : calculateButton}
        </div>
        {noTDD ? (<UnknownStatistic />) : null}
      </div>
    );
  },
  /**
   * Render function for the weight selector. We render an input[type=number] element that allows
   * numeric values between 0 and MAX_WEIGHT kgs. An error message will be displayed if the weight
   * entered exceeds MAX_WEIGHT
   *
   * If weight is set in this session then the input element is pre-populated.
   *
   * @return {Element}
   */
  renderWeightSelector: function(noTDD) {
    var currentWeight;

    var classes = cx({
      'DailyDose-weightInputForm-selector' : true,
      'DailyDose-weightInputForm-selector--nodata': noTDD,
      'valid': this.state.valid === true
    });

    var inputElem, tooHighErrorElem;

    if (this.state.valid || this.state.tooHigh) {
      currentWeight = this.state.formWeight;

      if (!currentWeight && this.props.data) {
        currentWeight = this.props.data.weight;
      }
    }

    if (this.state.tooHigh) {
      tooHighErrorElem = <div className='DailyDose-weightInputForm-tooHigh'>Weight cannot exceed {MAX_WEIGHT}kg</div>;
    }

    inputElem = <input className="DailyDose-weightInputForm-input" disabled={!!noTDD} type="number" min="0" max={MAX_WEIGHT} step="0.1" ref={inputRef} name={inputRef} value={currentWeight} onChange={this.onWeightChange} />;

    return (
      <div>
        <div className={classes}>
          {inputElem} kg
        </div>
        {tooHighErrorElem}
      </div>
    );
  },
  /**
   * When the weight value is changed this handler is used
   * to reassess whether the state of the form is valid or not
   *
   */
  onWeightChange: function() {
    var isValid = this.refs[inputRef].validity;
    var value = this.refs[inputRef].value;

    if (!isValid || value[value.length-1] === '.') {
      this.setState({ valid: false });
    } else {
      var weight = parseFloat(value);
      this.setState({ valid: (weight > 0 && weight <= MAX_WEIGHT), formWeight: weight, tooHigh: weight && weight > MAX_WEIGHT});
    }
  },
  /**
   * When the calculate button is clicked this handler is used
   * to store the weight in the session storage
   */
  onClickCalculate: function() {
    var weight = parseFloat(this.refs[inputRef].value);
    if (weight && weight > 0) {
      basicsActions.addToBasicsData('weight', weight);
    }
  }
});

module.exports = DailyDose;
