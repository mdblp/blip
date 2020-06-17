
/**
 * Copyright (c) 2014, Tidepool Project
 * Copyright (c) 2020, Diabeloop
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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import i18next from '../../core/language';
import * as actions from '../../redux/actions';

import { validateForm } from '../../core/validation';

import config from '../../config';

import personUtils from '../../core/personutils';
import SimpleForm from '../../components/simpleform';

const MESSAGE_TIMEOUT = 2000;
const t = i18next.t.bind(i18next);

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: this.formValuesFromUser(props.user),
      validationErrors: {},
      notification: null
    };

    this.messageTimeoutId = null;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.trackMetric) {
      this.props.trackMetric('Viewed Account Edit');
    }
  }

  componentDidUpdate(prevProps) {
    const prevUserId = _.get(prevProps, 'user.userid', null);
    const currentUserId = _.get(this, 'props.user.userid', null);
    if (prevUserId !== currentUserId) {
      // Keep form values in sync with upstream changes
      this.setState({ formValues: this.formValuesFromUser(this.props.user) });
    }
  }

  componentWillUnmount() {
    if (this.messageTimeoutId !== null) {
      clearTimeout(this.messageTimeoutId);
      this.messageTimeoutId = null;
    }
  }

  formInputs() {
    // @ts-ignore
    const CROWDIN_ACTIVE = typeof _jipt === 'object';
    const inputs = [
      { name: 'fullName', label: t('Full name'), type: 'text' }
    ];

    if (this.isUserAllowedToChangeEmail()) {
      inputs.push({
        name: 'username',
        label: t('Email'),
        type: 'email'
      });
    }

    if (this.isUserAllowedToChangePassword()) {
      inputs.push({
        name: 'password',
        label: t('Password'),
        type: 'passwordShowHide',
        placeholder: t('Password'),
      });
      inputs.push({
        name: 'passwordConfirm',
        label: t('Password'),
        type: 'passwordShowHide',
        placeholder: t('Password'),
      });
    }

    if (config.I18N_ENABLED) {
      const locales = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' }
      ];
      if (CROWDIN_ACTIVE) {
        // Special "pseudo" language for crowdin live preview
        locales.push({ value: 'it', label: 'Crowdin' });
      }
      inputs.push({
        name: 'lang',
        label: t('Language'),
        type: 'select',
        items: locales,
        placeholder: t('Select language...')
      });
    }

    return inputs;
  }

  formValuesFromUser(user) {
    if (user === null || typeof user !== 'object') {
      return null;
    }

    return {
      fullName: user.profile && user.profile.fullName,
      username: user.username,
      lang: _.get(user, 'preferences.displayLanguageCode', undefined)
    };
  }

  render() {
    const { user } = this.props;

    if (user === null) {
      return null;
    }

    const form = this.renderForm();
    const handleClickBack = (e) => {
      e.preventDefault();
      this.props.trackMetric('Clicked Back in Account');
      this.props.history.goBack();
      return false;
    };

    let organization = '';
    if (user && user.profile && user.profile.organization && user.profile.organization.name) {
      organization = user.profile.organization.name + ' / ';
    }

    return (
      <div className="profile">
        <div className="container-box-outer profile-subnav">
          <div className="container-box-inner profile-subnav-box">
            <div className="grid">
              <div className="grid-item one-whole medium-one-third">
                <a className="js-back" href="" onClick={handleClickBack}>
                  <i className="icon-back"></i>
                  {' ' + t('Back')}
                </a>
              </div>
              <div className="grid-item one-whole medium-one-third">
                <div className="profile-subnav-title">{organization + t('Account')}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-box-outer profile-content">
          <div className="container-box-inner profile-content-box">
            <div className="profile-form">{form}</div>
          </div>
        </div>
      </div>
    );
  }

  renderForm() {
    const disabled = this.isResettingUserData();

    return (
      <SimpleForm
        inputs={this.formInputs()}
        formValues={this.state.formValues}
        validationErrors={this.state.validationErrors}
        submitButtonText={t('Save')}
        onSubmit={this.handleSubmit}
        notification={this.state.notification}
        disabled={disabled} />
    );

  }

  handleSubmit(formValues) {
    this.resetFormStateBeforeSubmit(formValues);

    const validationErrors = this.validateFormValues(formValues);
    if (!_.isEmpty(validationErrors)) {
      return;
    }

    const values = this.prepareFormValuesForSubmit(formValues);
    this.submitFormValues(values);
  }

  resetFormStateBeforeSubmit(formValues) {
    this.setState({
      formValues: formValues,
      validationErrors: {},
      notification: null
    });
    if (this.messageTimeoutId !== null) {
      clearTimeout(this.messageTimeoutId);
      this.messageTimeoutId = null;
    }
  }

  validateFormValues(formValues) {
    let form = [
      { type: 'name', name: 'fullName', label: 'full name', value: formValues.fullName }
    ];

    if (this.isUserAllowedToChangeEmail()) {
      form.push({ type: 'email', name: 'username', label: 'email', value: formValues.username });
    }

    if (this.isUserAllowedToChangePassword() && (formValues.password || formValues.passwordConfirm)) {
      form = _.merge(form, [
        { type: 'password', name: 'password', label: 'password', value: formValues.password },
        { type: 'confirmPassword', name: 'passwordConfirm', label: 'confirm password', value: formValues.passwordConfirm, prerequisites: { password: formValues.password } }
      ]);
    }

    const validationErrors = validateForm(form);
    if (!_.isEmpty(validationErrors)) {
      this.setState({ validationErrors });
    }

    return validationErrors;
  }

  prepareFormValuesForSubmit(formValues) {
    const result = {
      profile: {
        fullName: formValues.fullName
      },
    };

    if (this.isUserAllowedToChangeEmail()) {
      result.username = formValues.username;
      result.emails = [formValues.username];
    }

    if (config.I18N_ENABLED) {
      _.set(result, 'preferences.displayLanguageCode', formValues.lang);
    }

    if (this.isUserAllowedToChangePassword() && formValues.password) {
      result.password = formValues.password;
    }

    return result;
  }

  submitFormValues(formValues) {
    const { onSubmit } = this.props;

    // Save optimistically
    onSubmit(formValues);
    this.setState({
      notification: { type: 'success', message: t('All changes saved.') }
    });

    this.messageTimeoutId = setTimeout(() => {
      this.setState({ notification: null });
    }, MESSAGE_TIMEOUT);
  }

  isResettingUserData() {
    return (this.props.fetchingUser && !this.props.user);
  }

  isUserAllowedToChangeEmail() {
    return !personUtils.isPatient(this.props.user) || config.ALLOW_PATIENT_CHANGE_EMAIL;
  }

  isUserAllowedToChangePassword() {
    return !personUtils.isPatient(this.props.user) || config.ALLOW_PATIENT_CHANGE_PASSWORD;
  }
}

UserProfile.propTypes = {
  fetchingUser: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  trackMetric: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    userid: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired,
  }),
};

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */
function mapStateToProps(state) {
  let user = null;
  const { allUsersMap, loggedInUserId } = state.blip;

  if (allUsersMap && loggedInUserId) {
    user = allUsersMap[loggedInUserId];
  }

  return {
    user,
    fetchingUser: state.blip.working.fetchingUser.inProgress
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  updateUser: actions.async.updateUser
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const api = ownProps.routes[0].api;
  return Object.assign({}, _.pick(ownProps, 'history'), stateProps, {
    onSubmit: dispatchProps.updateUser.bind(null, api),
    trackMetric: ownProps.routes[0].trackMetric
  });
};

export { UserProfile, mapStateToProps };
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UserProfile);
