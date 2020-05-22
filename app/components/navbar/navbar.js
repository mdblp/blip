
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
import { Link, IndexLink } from 'react-router';
import { translate } from 'react-i18next';
import _ from 'lodash';
import cx from 'classnames';
import bows from 'bows';

import personUtils from '../../core/personutils';
import NavbarPatientCard from '../../components/navbarpatientcard';

import logoSrc from './images/tidepool/logo.png';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
    };

    this.log = bows('NavBar');

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleClickUser = this.handleClickUser.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillUnmount() {
    this.log('Unregister the event to close the menu when click outside of it.');
    const body = document.getElementsByTagName('body');
    body[0].removeEventListener('click', this.handleClickOutside);
  }

  render() {
    return (
      <div className="Navbar">
        {this.renderLogoSection()}
        {this.renderPatientSection()}
        {this.renderMenuSection()}
      </div>
    );
  }

  renderLogoSection() {
    return (
      <div className="Navbar-logoSection">
        {this.renderLogo()}
      </div>
    );
  }

  renderLogo() {
    const handleClick = () => {
      this.props.trackMetric('Clicked Navbar Logo');
    };

    return (
      <IndexLink to="/" className="Navbar-logo" onClick={handleClick}>
        <img src={logoSrc} />
      </IndexLink>
    );
  }

  getPatientLink(patient) {
    if (!patient || !patient.userid) {
      return '';
    }

    return '/patients/' + patient.userid + '/data';
  }

  renderPatientSection() {
    const { patient } = this.props;

    if (_.isEmpty(patient)) {
      return <div className="Navbar-patientSection"></div>;
    }

    patient.link = this.getPatientLink(patient);

    return (
      <div className="Navbar-patientSection" ref="patient">
        <NavbarPatientCard
          href={patient.link}
          currentPage={this.props.currentPage}
          uploadUrl={this.props.getUploadUrl()}
          patient={patient}
          permsOfLoggedInUser={this.props.permsOfLoggedInUser}
          trackMetric={this.props.trackMetric} />
      </div>
    );
  }

  toggleDropdown(e) {
    let { showDropdown } = this.state;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    showDropdown = !showDropdown;
    if (showDropdown) {
      this.setState({ showDropdown }, () => {
        this.log('Register the event to close the menu when click outside of it.');
        const body = document.getElementsByTagName('body');
        body[0].addEventListener('click', this.handleClickOutside);
      });
    } else {
      this.hideDropdown();
    }
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  hideDropdown(callback) {
    if (this.state.showDropdown) {
      this.setState({ showDropdown: false }, () => {
        this.log('Unregister the event to close the menu when click outside of it.');
        const body = document.getElementsByTagName('body');
        body[0].removeEventListener('click', this.handleClickOutside);
        if (callback) {
          callback();
        }
      });
    }
  }

  renderMenuSection() {
    const currentPage = (this.props.currentPage && this.props.currentPage[0] === '/') ? this.props.currentPage.slice(1) : this.props.currentPage;
    const { user, t } = this.props;
    const { showDropdown } = this.state;

    if (_.isEmpty(user)) {
      return null;
    }

    const displayName = this.getUserDisplayName();

    const handleCareteam = () => {
      this.props.trackMetric('Clicked Navbar CareTeam');
    };
    const patientsClasses = cx({
      'Navbar-button': true,
      'Navbar-selected': currentPage && currentPage === 'patients',
    });

    const accountSettingsClasses = cx({
      'Navbar-button': true,
      'Navbar-dropdownIcon-show': currentPage && currentPage === 'profile',
    });

    const dropdownClasses = cx({
      'Navbar-menuDropdown': true,
      'Navbar-menuDropdown-hide': !showDropdown,
    });

    const dropdownIconClasses = cx({
      'Navbar-dropdownIcon': true,
      'Navbar-dropdownIcon-show': showDropdown,
      'Navbar-dropdownIcon-current': currentPage && currentPage === 'profile',
    });

    return (
      <ul className="Navbar-menuSection">
        <li className="Navbar-menuItem">
          <Link to="/patients" title="Care Team" onClick={handleCareteam} className={patientsClasses} ref="careteam"><i className="Navbar-icon icon-careteam"></i></Link>
        </li>
        <li className={dropdownIconClasses}>
          <div onClick={this.toggleDropdown}>
            <i className='Navbar-icon Navbar-icon-profile icon-profile'></i>
            <div className="Navbar-logged">
              <span className="Navbar-loggedInAs">{t('Logged in as ')}</span>
              <span className="Navbar-userName" ref="userFullName" title={displayName}>{displayName}</span>
            </div>
            <i className='Navbar-icon Navbar-icon-down icon-arrow-down'></i>
            <div className='clear'></div>
          </div>
          <div onClick={this.stopPropagation} className={dropdownClasses}>
            <ul>
              <li>
                <Link to="/profile" title={t('Account')} onClick={this.handleClickUser} className={accountSettingsClasses}>
                  <i className='Navbar-icon icon-settings'></i><span className="Navbar-menuText">{t('Account Settings')}</span>
                </Link>
              </li>
              <li>
                <a href="" title={t('Logout')} onClick={this.handleLogout} className="Navbar-button" ref="logout">
                  <i className='Navbar-icon icon-logout'></i><span className="Navbar-menuText">{t('Logout')}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    );
  }

  getUserDisplayName() {
    return personUtils.fullName(this.props.user);
  }

  isSamePersonUserAndPatient() {
    return personUtils.isSame(this.props.user, this.props.patient);
  }

  handleClickUser(e) {
    this.hideDropdown(() => {
      this.props.trackMetric('Clicked Navbar Logged In User');
    });
  }

  handleLogout(e) {
    if (e) {
      e.preventDefault();
    }

    this.hideDropdown(() => {
      const { onLogout } = this.props;
      if (onLogout) {
        onLogout();
      }
    });
  }

  /**
   * Click outside the popup
   * @param {MouseEvent} e click event
   */
  handleClickOutside(e) {
    /** @type{HTMLElement} */
    let elem = e.target;
    let isInsidePopup = false;
    while (elem !== null && !isInsidePopup) {
      isInsidePopup = elem.classList.contains('Navbar-menuSection');
      elem = elem.parentElement;
    }

    if (!isInsidePopup) {
      e.stopPropagation(); // Prevent others elements to have this click event.
      // Click outside the datepicker popup, cancel the action, hide the popup.
      this.hideDropdown();
    }
  }
}

NavBar.propTypes = {
  currentPage: PropTypes.string,
  user: PropTypes.object,
  fetchingUser: PropTypes.bool,
  patient: PropTypes.object,
  fetchingPatient: PropTypes.bool,
  getUploadUrl: PropTypes.func,
  onLogout: PropTypes.func,
  trackMetric: PropTypes.func.isRequired,
  permsOfLoggedInUser: PropTypes.object,
};

export default translate()(NavBar);
