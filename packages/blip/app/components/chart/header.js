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
import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import i18next from "i18next";

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import GetAppIcon from "@material-ui/icons/GetApp";
import Face from "@material-ui/icons/Face";
import ArrowBack from "@material-ui/icons/ArrowBack";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SkipNextIcon from "@material-ui/icons/SkipNext";

import IconButton from "@material-ui/core/IconButton";

import personUtils from "../../core/personutils";

const t = i18next.t.bind(i18next);

class TidelineHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDialogOpen: false };
  }

  static propTypes = {
    children: PropTypes.node,
    patient: PropTypes.object,
    setPatient: PropTypes.func.isRequired,
    patients: PropTypes.object,
    userIsHCP: PropTypes.bool,
    chartType: PropTypes.string.isRequired,
    prefixURL: PropTypes.string,
    inTransition: PropTypes.bool,
    atMostRecent: PropTypes.bool,
    loading: PropTypes.bool,
    iconBack: PropTypes.bool,
    iconNext: PropTypes.bool,
    iconMostRecent: PropTypes.bool,
    trackMetric: PropTypes.func.isRequired,
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
  };

  static defaultProps = {
    inTransition: false,
    atMostRecent: false,
    loading: false,
    canPrint: false,
    prefixURL: "",
  };

  renderStandard() {
    const { canPrint, chartType, atMostRecent, inTransition, loading, prefixURL } = this.props;
    const { children } = this.props;

    const printViews = ["basics", "daily", "bgLog", "settings"];
    const showPrintLink = _.includes(printViews, chartType);

    const basicsLinkClass = cx({
      "js-basics": true,
      "patient-data-subnav-active": chartType === "basics",
      "patient-data-subnav-hidden": chartType === "no-data",
    });

    const dayLinkClass = cx({
      "js-daily": true,
      "patient-data-subnav-active": chartType === "daily",
      "patient-data-subnav-hidden": chartType === "no-data",
    });

    const trendsLinkClass = cx({
      "js-trends": true,
      "patient-data-subnav-active": chartType === "trends",
      "patient-data-subnav-hidden": chartType === "no-data",
    });

    const mostRecentDisabled = atMostRecent || inTransition || loading;
    const mostRecentClass = cx({
      "mui-nav-button": true,
      "patient-data-subnav-hidden": chartType === "no-data",
    });

    const backDisabled = inTransition || loading;
    const backClass = cx({
      "mui-nav-button": true,
      "patient-data-subnav-hidden": chartType === "settings" || chartType === "no-data",
    });

    const nextDisabled = mostRecentDisabled;
    const nextClass = cx({
      "mui-nav-button": true,
      "patient-data-subnav-hidden": chartType === "settings" || chartType === "no-data",
    });

    let printLink = null;
    if (canPrint && showPrintLink) {
      const printLinkClass = cx({
        "patient-data-subnav-button": true,
        "printview-print-icon": true,
      });

      printLink = (
        <button className={printLinkClass} onClick={this.onClickPrint}>
          <GetAppIcon className="print-icon" />
          {t("pdf-generate-report")}
        </button>
      );
    }

    return (
      <div className="grid patient-data-subnav">
        { this.props.userIsHCP &&
          <div>
            <IconButton>
              <ArrowBack onClick={() => this.props.onClickNavigationBack()}/>
            </IconButton>
            <Face/>
            <span>Patient:</span>
            <FormControl variant="outlined">
              <Select
                defaultValue={this.props.patient.userid}
                onChange={event => this.props.onSwitchPatient(this.props.patients.find(patient => patient.userid === event.target.value))}
              >
                {
                  this.props.patients.map((patient,i) => {
                    return(<MenuItem key={i} value={patient.userid}>{personUtils.fullName(patient)}</MenuItem>);
                  })
                }
              </Select>
            </FormControl>
          </div>
        }
        <div className="patient-data-subnav-left">
          <a id="button-tab-dashboard" href={`${prefixURL}/dashboard`} className={basicsLinkClass} onClick={this.props.onClickDashboard}>
            {t("Dashboard")}
          </a>
          <a id="button-tab-daily" href={`${prefixURL}/daily`} className={dayLinkClass} onClick={this.props.onClickOneDay}>
            {t("Daily")}
          </a>
          <a id="button-tab-trends" href={`${prefixURL}/trends`} className={trendsLinkClass} onClick={this.props.onClickTrends}>
            {t("Trends")}
          </a>
        </div>
        <div className="patient-data-subnav-center" id="tidelineLabel">
          {this.props.iconBack ? this.renderNavButton("button-nav-back", backClass, this.props.onClickBack, "back", backDisabled) : null}
          {children}
          {this.props.iconNext ? this.renderNavButton("button-nav-next", nextClass, this.props.onClickNext, "next", nextDisabled) : null}
          {this.props.iconMostRecent ? this.renderNavButton("button-nav-mostrecent", mostRecentClass, this.props.onClickMostRecent, "most-recent", mostRecentDisabled) : null}
        </div>
        <div className="patient-data-subnav-right">
          {printLink}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="patient-data-subnav-outer">
        <div className="patient-data-subnav-inner box-shadow">{this.renderStandard()}</div>
      </div>
    );
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
        e.preventDefault();
      }
    };
    const onClick = this.props.inTransition ? nullAction : clickAction;

    /** @type {JSX.Element|null} */
    let iconComponent = null;
    switch (icon) {
    case "back":
      iconComponent = <NavigateBeforeIcon />;
      break;
    case "next":
      iconComponent = <NavigateNextIcon />;
      break;
    case "most-recent":
      iconComponent = <SkipNextIcon />;
      break;
    default:
      console.error("Invalid icon name", icon);
      break;
    }

    return (
      <IconButton id={id} type="button" className={buttonClass} onClick={onClick} disabled={disabled}>
        {iconComponent}
      </IconButton>
    );
  }

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The DOM/React event
   */
  onClickPrint = (event) => {
    event.preventDefault();
    this.props.onClickPrint();
  };
}

export default TidelineHeader;
