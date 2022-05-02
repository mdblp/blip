/**
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from "react";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import TimelineIcon from "@material-ui/icons/Timeline";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

import BasicDropdown from "../dropdown/basic-dropdown";
import { commonTeamStyles } from "./common";
import { useAuth } from "../../lib/auth";
import { TeamMemberRole } from "../../models/team";
import { Team } from "../../lib/team";

const useStyles = makeStyles(() => ({
  alarmsTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    marginLeft: "44px",
  },
  desktopMacIcon: {
    margin: "0px",
  },
  dropdown: {
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "0px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    width: "255px",
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: "16px",
  },
  teamInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "30px",
  },
  value: {
    fontSize: "13px",
    lineHeight: "16px",
    whiteSpace: "pre-line",
  },
}));

export interface TeamAlarmsProps {
  team : Team,
}

function TeamAlarms(props : TeamAlarmsProps): JSX.Element {
  const { team } = props;
  const classes = useStyles();
  const commonTeamClasses = commonTeamStyles();
  const { t } = useTranslation("yourloops");
  const authContext = useAuth();
  const loggedInUserId = authContext.user?.userid as string;
  const isUserAdmin = team.members.find(member => member.user.userid === loggedInUserId && member.role === TeamMemberRole.admin);

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root}>
        <div className={classes.header}>
          <div className={classes.alarmsTitle}>
            <DesktopMacIcon className={classes.desktopMacIcon} />
            <Typography className={commonTeamClasses.title}>
              {t("telemonitoring-alarms").toUpperCase()}
            </Typography>
          </div>
          {
            isUserAdmin &&
            <Button className={commonTeamClasses.button} disabled>
              <SaveIcon className={commonTeamClasses.icon}/>
              {t("save-modifications")}
            </Button>
          }
        </div>
        <div className={classes.body}>
          <div className={classes.teamInfo}>
            <HourglassEmptyIcon className={commonTeamClasses.icon}/>
            <Typography className={classes.label}>
              {t("time-away-from-target")}
            </Typography>
            <Typography className={classes.value}>
              {t("threshold")}
            </Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="25%"
                values={["10%", "25%", "50%", "75%"]}
                onSelect={() => {
                  console.log("Selected");
                }} />
            </div>
            <Typography className={classes.value}>
              {t("on-a-period-of")}
            </Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="12 hours"
                values={["12 hours", "24 hours"]}
                onSelect={() => {
                  console.log("Selected");
                }} />
            </div>
          </div>
          <div className={classes.teamInfo}>
            <TimelineIcon className={commonTeamClasses.icon}/>
            <Typography className={classes.label}>
              {t("severe-hypoglycemia")}
            </Typography>
            <Typography className={classes.value}>
              {t("criteria")} #1
            </Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="Units"
                values={["Units"]}
                onSelect={() => {
                  console.log("Selected");
                }} />
            </div>
            <Typography className={classes.value}>
              {t("criteria")} #2
            </Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="Units"
                values={["Units"]}
                onSelect={() => {
                  console.log("Selected");
                }} />
            </div>
          </div>
          <div className={classes.teamInfo}>
            <SignalWifiOffIcon className={commonTeamClasses.icon}/>
            <Typography className={classes.label}>
              {t("untransferred-data")}
            </Typography>
            <Typography className={classes.value}>
              {t("criteria")} #1
            </Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="Units"
                values={["Units"]}
                onSelect={() => {
                  console.log("Selected");
                }} />
            </div>
            <Typography className={classes.value}>
              {t("criteria")} #2
            </Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="Units"
                values={["Units"]}
                onSelect={() => {
                  console.log("Selected");
                }} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TeamAlarms;
