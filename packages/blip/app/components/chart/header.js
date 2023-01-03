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
import _ from 'lodash'
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import i18next from 'i18next'

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import GetAppIcon from '@mui/icons-material/GetApp'
import Face from '@mui/icons-material/Face'
import ArrowBack from '@mui/icons-material/ArrowBack'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import AccessTime from '@mui/icons-material/AccessTime'
import IconButton from '@mui/material/IconButton'
import Dashboard from '@mui/icons-material/Dashboard'
import Today from '@mui/icons-material/Today'
import TrendingUp from '@mui/icons-material/TrendingUp'

const t = i18next.t.bind(i18next)

class TidelineHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isDialogOpen: false }
  }

  selectedTab() {
    switch (this.props.chartType) {
    // 1 is the separator, so we're skipping it
      case 'dashboard':
        return 0
      case 'daily':
        return 2
      case 'trends':
        return 3
    }
  }

  static propTypes = {
    children: PropTypes.node,
    patient: PropTypes.object,
    patients: PropTypes.array,
    userIsHCP: PropTypes.bool,
    chartType: PropTypes.string.isRequired,
    prefixURL: PropTypes.string,
    inTransition: PropTypes.bool,
    atMostRecent: PropTypes.bool,
    loading: PropTypes.bool,
    iconBack: PropTypes.bool,
    iconNext: PropTypes.bool,
    iconMostRecent: PropTypes.bool,
    canPrint: PropTypes.bool,
    onClickBack: PropTypes.func,
    onClickDashboard: PropTypes.func,
    onClickTrends: PropTypes.func,
    onClickMostRecent: PropTypes.func,
    onClickNext: PropTypes.func,
    onClickOneDay: PropTypes.func,
    onClickPrint: PropTypes.func,
    onSwitchPatient: PropTypes.func,
    onClickNavigationBack: PropTypes.func,
    printDefaultPeriod: PropTypes.string
  }

  static defaultProps = {
    inTransition: false,
    atMostRecent: false,
    loading: false,
    canPrint: false,
    prefixURL: ''
  }

  renderStandard() {
    const { canPrint, chartType, atMostRecent, inTransition, loading, prefixURL } = this.props
    const { children } = this.props

    const printViews = ['dashboard', 'daily']
    const showPrintLink = _.includes(printViews, chartType)

    const mostRecentDisabled = atMostRecent || inTransition || loading
    const mostRecentClass = cx({
      'mui-nav-button': true,
      'patient-data-subnav-hidden': chartType === 'no-data'
    })

    const backDisabled = inTransition || loading
    const backClass = cx({
      'mui-nav-button': true,
      'patient-data-subnav-hidden': chartType === 'settings' || chartType === 'no-data'
    })

    const nextDisabled = mostRecentDisabled
    const nextClass = cx({
      'mui-nav-button': true,
      'patient-data-subnav-hidden': chartType === 'settings' || chartType === 'no-data'
    })

    let printLink = null
    if (canPrint && showPrintLink) {
      const printLinkClass = cx({
        'patient-data-subnav-button': true,
        'printview-print-icon': true
      })

      printLink = (
        <button className={printLinkClass} onClick={this.onClickPrint}>
          <GetAppIcon className="print-icon" />
          {t('pdf-generate-report')}
        </button>
      )
    }

    return (
      <div className="patient-data-subnav">
        <div className="patient-data-subnav-left">
          <div className="subnav-left-container">
            {this.props.userIsHCP &&
            <div id="subnav-hcp-container" data-testid="patient-dropdown">
              <IconButton onClick={() => this.props.onClickNavigationBack()} size="large">
                <ArrowBack id="subnav-arrow-back" data-testid="subnav-arrow-back" />
              </IconButton>
              <Face className="subnav-icon" />
              <span>{ t('patient') } :</span>
              <FormControl
                id="subnav-patient-list"
                data-testid="subnav-patient-list"
              >
                <Select
                  data-testid="drop-down-patient"
                  defaultValue={this.props.patient.userid}
                  onChange={event => this.props.onSwitchPatient(this.props.patients.find(patient => patient.userid === event.target.value))}
                >
                  {
                    this.props.patients.map((patient, i) => {
                      return (<MenuItem key={i} value={patient.userid}>{patient.profile.fullName}</MenuItem>)
                    })
                  }
                </Select>
              </FormControl>
            </div>
            }
            {this.props.chartType === 'dashboard' &&
            <Fragment>
              <AccessTime className="subnav-icon" />
              <span id="subnav-period-label">{t('dashboard-header-period-text')}</span>
            </Fragment>
            }
            {this.props.iconBack ? this.renderNavButton('button-nav-back', backClass, this.props.onClickBack, 'back', backDisabled) : null}
            {children}
            {this.props.iconNext ? this.renderNavButton('button-nav-next', nextClass, this.props.onClickNext, 'next', nextDisabled) : null}
            {this.props.iconMostRecent ? this.renderNavButton('button-nav-mostrecent', mostRecentClass, this.props.onClickMostRecent, 'most-recent', mostRecentDisabled) : null}
          </div>
          <div>
            <Tabs value={this.selectedTab()}>
              <Tab className={'subnav-tab'} data-testid="dashboard-tab" href={`${prefixURL}/dashboard`} label={t('dashboard')} icon={<Dashboard />} onClick={this.props.onClickDashboard}/>
              <Tab label="" className={'dashboard-divider'} disabled />
              <Tab className={'subnav-tab'} data-testid="daily-tab" href={`${prefixURL}/daily`} label={t('Daily')} icon={<Today />} onClick={this.props.onClickOneDay} />
              <Tab className={'subnav-tab'} data-testid="trends-tab" href={`${prefixURL}/trends`} label={t('Trends')} icon={<TrendingUp />}
                onClick={this.props.onClickTrends} />
            </Tabs>
          </div>
        </div>

        <div className="patient-data-subnav-right">
          {printLink}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="patient-data-subnav-outer" data-testid="patient-data-subnav-outer">
        <div className="patient-data-subnav-inner box-shadow">{this.renderStandard()}</div>
      </div>
    )
  }

  /**
   * Helper function for rendering the various navigation buttons in the header.
   * It accounts for the transition state and disables the button if it is currently processing.
   *
   * @param {string} id The button id
   * @param {string} buttonClass
   * @param {(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} clickAction
   * @param {"back"|"next"|"most-recent"} icon
   * @param {boolean} disabled true to disable the button
   *
   * @return {JSX.Element}
   */
  renderNavButton(id, buttonClass, clickAction, icon, disabled) {
    const nullAction = (e) => {
      if (e) {
        e.preventDefault()
      }
    }
    const onClick = this.props.inTransition ? nullAction : clickAction

    /** @type {JSX.Element|null} */
    let iconComponent = null
    switch (icon) {
      case 'back':
        iconComponent = <NavigateBeforeIcon />
        break
      case 'next':
        iconComponent = <NavigateNextIcon />
        break
      case 'most-recent':
        iconComponent = <SkipNextIcon />
        break
      default:
        console.error('Invalid icon name', icon)
        break
    }

    return (
      <IconButton
        id={id}
        type="button"
        className={buttonClass}
        onClick={onClick}
        disabled={disabled}
        size="large">
        {iconComponent}
      </IconButton>
    )
  }

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The DOM/React event
   */
  onClickPrint = (event) => {
    event.preventDefault()
    this.props.onClickPrint()
  }
}

export default TidelineHeader