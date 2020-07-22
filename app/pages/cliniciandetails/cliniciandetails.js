
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
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bindActionCreators } from 'redux';

import _ from 'lodash';
import sundial from 'sundial';
import { validateForm } from '../../core/validation';

import * as actions from '../../redux/actions';

import InputGroup from '../../components/inputgroup';
import SimpleForm from '../../components/simpleform';
import personUtils from '../../core/personutils';

var MODEL_DATE_FORMAT = 'YYYY-MM-DD';

export let ClinicianDetails = translate()(React.createClass({
  propTypes: {
    fetchingUser: React.PropTypes.bool.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    trackMetric: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    working: React.PropTypes.bool.isRequired
  },

  formInputs: function () {
    const { t } = this.props;
    return [
    {
      name: 'firstName',
      label: t('First Name'),
      type: 'text',
      placeholder: t('First name')
    },
    {
      name: 'lastName',
      label: t('Last Name'),
      type: 'text',
      placeholder: t('Last name')
    },
    {
      name: 'clinicalRole',
      label: t('Clinical Role'),
      type: 'select',
      value: '',
      placeholder: t('Select Role...'),
      items: [
        {value: 'clinic_manager', label: t('Clinic Manager')},
        {value: 'diabetes_educator', label: t('Diabetes Educator')},
        {value: 'endocrinologist', label: t('Endocrinologist')},
        {value: 'front_desk', label: t('Front Desk')},
        {value: 'information_technology', label: t('IT/Technology')},
        {value: 'medical_assistant', label: t('Medical Assistant')},
        {value: 'nurse', label: t('Nurse/Nurse Practitioner')},
        {value: 'primary_care_physician', label: t('Primary Care Physician')},
        {value: 'physician_assistant', label: t('Physician Assistant')},
        {value: 'other', label: t('Other')}
      ]
    },
    {
      name: 'clinicName',
      label: t('Clinic Name'),
      type: 'text'
    },
    {
      name: 'clinicPhone',
      label: t('Clinic Phone Number (optional)'),
      type: 'text'
    }
  ]},

  getInitialState: function() {
    return {
      working: false,
      formValues: {
        firstName:this.getUserFirstName(),
        lastName:this.getUserLastName(),
        clinicalRole: ''
      },
      validationErrors: {},
    };
  },

  componentDidMount: function() {
    if (this.props.trackMetric) {
      this.props.trackMetric('Web - Clinician Details Setup');
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      formValues: _.assign(this.state.formValues, {
        firstName: this.getUserFirstName(nextProps),
        lastName: this.getUserLastName(nextProps)
      })
    });
  },


  getUserFirstName: function(props) {
    props = props || this.props;
    return personUtils.firstName(props.user) || '';
  },

  getUserLastName: function(props) {
    props = props || this.props;
    return personUtils.lastName(props.user) || '';
  },

  canSubmit: function() {
    if (
      _.get(this,'state.formValues.firstName.length') &&
      _.get(this,'state.formValues.lastName.length') &&
      _.get(this,'state.formValues.clinicalRole.length') &&
      _.get(this,'state.formValues.clinicName.length')
    )
      {
        return true;
      } else {
        return false;
      }
  },

  render: function() {
    const { t } = this.props;
    var form = this.renderForm();

    return (
      <div className="ClinicianDetails">
        <div className="container-box-outer ClinicianDetails-contentOuter">
          <div className="container-box-inner ClinicianDetails-contentInner">
            <div className="ClinicianDetails-content">
              <div className="ClinicianDetails-head">
                {t('Clinician Setup')}
              </div>
              <div className="ClinicianDetails-subTitle">
                {t('Please complete these details.')}
              </div>
              <div className="ClinicianDetails-desc">
                {t('We use these details to identify you to your patients and to better support you.')}
              </div>
              {form}
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderForm: function() {
    return (
      <SimpleForm
        inputs={this.formInputs()}
        formValues={this.state.formValues}
        validationErrors={this.state.validationErrors}
        submitButtonText={this.getSubmitButtonText()}
        submitDisabled={this.props.working || !this.canSubmit()}
        onSubmit={this.handleSubmit}
        onChange={this.handleInputChange}
      />
    );
  },

  getSubmitButtonText: function() {
    const { t } = this.props;
    if (this.props.working) {
      return t('Saving...');
    }
    return t('Continue');
  },

  isFormDisabled: function() {
    return (this.props.fetchingUser && !this.props.user);
  },

  handleInputChange: function(attributes) {
    var key = attributes.name;
    var value = attributes.value;
    if (!key) {
      return;
    }
    const formValues = _.clone(this.state.formValues);

    formValues[key] = value;

    this.setState({formValues: formValues});
  },

  handleSubmit: function(formValues) {
    this.resetFormStateBeforeSubmit(formValues);

    var validationErrors = this.validateFormValues(formValues);

    if (!_.isEmpty(validationErrors)) {
      return;
    }
    const fullName = `${formValues.firstName} ${formValues.lastName}`
    const user = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      fullName: fullName,
      profile: {
        fullName: fullName,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        clinic: {
          role: formValues.clinicalRole,
          name: formValues.clinicName,
          telephone: formValues.clinicPhone
        }
      }
    };
    this.props.onSubmit(user);
  },

  validateFormValues: function(formValues) {
    var form = [
      { type: 'name', name: 'firstName', label: 'first name', value: formValues.firstName },
      { type: 'name', name: 'lastName', label: 'last name', value: formValues.lastName },
      { type: 'clinicName', name: 'clinicName', label: 'clinic name', value: formValues.clinicName },
      { type: 'clinicPhone', name: 'clinicPhone', label: 'clinic phone', value: formValues.clinicPhone },
      { type: 'clinicalRole', name: 'clinicalRole', label: 'clinical role', value: formValues.clinicalRole }
    ];
    var validationErrors = validateForm(form);

    if (!_.isEmpty(validationErrors)) {
      this.setState({
        validationErrors: validationErrors
      });
    }

    return validationErrors;
  },

  resetFormStateBeforeSubmit: function(formValues) {
    this.setState({
      working: true,
      formValues: formValues,
      validationErrors: {}
    });
  }
}));

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */

export function mapStateToProps(state) {
  var user = null;
  if (state.blip.allUsersMap){
    if (state.blip.loggedInUserId) {
      user = state.blip.allUsersMap[state.blip.loggedInUserId];
    }
  }

  return {
    user: user,
    fetchingUser: state.blip.working.fetchingUser.inProgress,
    working: state.blip.working.updatingUser.inProgress,
  };
}

let mapDispatchToProps = dispatch => bindActionCreators({
  updateClinicianProfile: actions.async.updateClinicianProfile
}, dispatch);

let mergeProps = (stateProps, dispatchProps, ownProps) => {
  var api = ownProps.routes[0].api;
  return Object.assign({}, stateProps, {
    onSubmit: dispatchProps.updateClinicianProfile.bind(null, api),
    trackMetric: ownProps.routes[0].trackMetric
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ClinicianDetails);
