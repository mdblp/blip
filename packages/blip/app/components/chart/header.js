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
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import i18next from "i18next";

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import GetAppIcon from "@material-ui/icons/GetApp";
import Face from "@material-ui/icons/Face";
import ArrowBack from "@material-ui/icons/ArrowBack";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import AccessTime from "@material-ui/icons/AccessTime";
import IconButton from "@material-ui/core/IconButton";
import Dashboard from "@material-ui/icons/Dashboard";
import Today from "@material-ui/icons/Today";
import TrendingUp from "@material-ui/icons/TrendingUp";

import personUtils from "../../core/personutils";

const t = i18next.t.bind(i18next);

class TidelineHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDialogOpen: false };
  }

  selectedTab() {
    switch (this.props.chartType) {
    // 1 is the separator, so we're skipping it
    case "dashboard":
      return 0;
    case "daily":
      return 2;
    case "trends":
      return 3;
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

    const printViews = ["dashboard", "daily", "trends"];
    const showPrintLink = _.includes(printViews, chartType);

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
      <div className="patient-data-subnav">
        <div className="patient-data-subnav-left">
          <div className="subnav-left-container">
            {this.props.userIsHCP &&
            <div id="subnav-hcp-container">
              <IconButton>
                <ArrowBack id="subnav-arrow-back" onClick={() => this.props.onClickNavigationBack()} />
              </IconButton>
              <Face className="subnav-icon" />
              <span>{ t("patient") } :</span>
              <FormControl id="subnav-patient-list" variant="outlined">
                <Select
                  defaultValue={this.props.patient.userid}
                  onChange={event => this.props.onSwitchPatient(this.props.patients.find(patient => patient.userid === event.target.value))}
                >
                  {
                    this.props.patients.map((patient, i) => {
                      return (<MenuItem key={i} value={patient.userid}>{personUtils.fullName(patient)}</MenuItem>);
                    })
                  }
                </Select>
              </FormControl>
            </div>
            }
            {this.props.chartType === "dashboard" &&
            <Fragment>
              <AccessTime className="subnav-icon" />
              <span id={"subnav-period-label"}>{t("dashboard-header-period-text")}</span>
            </Fragment>
            }
            {this.props.iconBack ? this.renderNavButton("button-nav-back", backClass, this.props.onClickBack, "back", backDisabled) : null}
            {children}
            {this.props.iconNext ? this.renderNavButton("button-nav-next", nextClass, this.props.onClickNext, "next", nextDisabled) : null}
            {this.props.iconMostRecent ? this.renderNavButton("button-nav-mostrecent", mostRecentClass, this.props.onClickMostRecent, "most-recent", mostRecentDisabled) : null}
          </div>
          <div>
            <Tabs
              value={this.selectedTab()}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab className={"subnav-tab"} href={`${prefixURL}/dashboard`} label={t("dashboard")} icon={<Dashboard />}
                onClick={this.props.onClickDashboard} />
              <div className={"dashboard-divider"}></div>
              <Tab className={"subnav-tab"} href={`${prefixURL}/daily`} label={t("Daily")} icon={<Today />} onClick={this.props.onClickOneDay} />
              <Tab className={"subnav-tab"} href={`${prefixURL}/trends`} label={t("Trends")} icon={<TrendingUp />}
                onClick={this.props.onClickTrends} />
            </Tabs>
          </div>
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
