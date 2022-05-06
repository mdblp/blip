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
import TuneIcon from "@material-ui/icons/Tune";

import BasicDropdown from "../dropdown/basic-dropdown";
import { commonTeamStyles } from "./common";

const useStyles = makeStyles(() => ({
  body: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    marginLeft: "10px",
  },
  categoryBody: {
    display: "flex",
  },
  categoryInfo: {
    fontSize: "10px",
    marginBottom: "16px",
    marginLeft: "10px",
  },
  defaultLabel: {
    marginTop: "10px",
    fontSize: "10px",
    fontStyle: "italic",
    marginLeft: "10px",
  },
  displayFlex: {
    display: "flex",
    alignItems: "center",
  },
  divider: {
    border: "1px solid #C4C4C4",
    marginTop: "20px",
    marginBottom: "20px",
  },
  dropdown: {
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "0px",
  },
  halfWidth: {
    width: "50%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    margin: "0px",
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
  subSubTitle: {
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: "112%",
    marginBottom: "6px",
  },
  subTitle: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "112%",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  title: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginBottom: "24px",
  },
  value: {
    fontSize: "13px",
    lineHeight: "16px",
    whiteSpace: "pre-line",
  },
  valueSelection: {
    display: "flex",
    marginLeft: "10px",
  },
}));

function TeamAlarms(): JSX.Element {
  const classes = useStyles();
  const commonTeamClasses = commonTeamStyles();
  const { t } = useTranslation("yourloops");

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root}>
        <div className={classes.title}>
          <TuneIcon className={classes.icon} />
          <Typography className={commonTeamClasses.title}>
            {t("event-configuration")}
          </Typography>
        </div>
        <div className={classes.body}>
          <div>
            <Typography className={classes.subTitle}>1. {t("time-away-from-target")}</Typography>
            <Typography className={classes.categoryInfo}>{t("current-trigger-setting-tir")}</Typography>
            <div className={classes.categoryBody}>
              <div className={classes.halfWidth}>
                <Typography className={classes.subSubTitle}>A. {t("glycemic-target")}</Typography>
                <div className={classes.valueSelection}>
                  <div className={classes.displayFlex}>
                    <Typography>{t("minimum")} :</Typography>
                    <div className={classes.dropdown}>
                      <BasicDropdown
                        id={"team-basic-dropdown"}
                        defaultValue="70mg/dL"
                        values={["60mg/dL", "70mg/dL", "80mg/dL", "100mg/dL"]}
                        onSelect={() => {
                          console.log("Selected");
                        }} />
                    </div>
                  </div>
                  <div className={classes.displayFlex}>
                    <Typography>{t("maximum")} :</Typography>
                    <div className={classes.dropdown}>
                      <BasicDropdown
                        id={"team-basic-dropdown"}
                        defaultValue="180mg/dL"
                        values={["160mg/dL", "170mg/dL", "180mg/dL", "200mg/dL"]}
                        onSelect={() => {
                          console.log("Selected");
                        }} />
                    </div>
                  </div>
                </div>
                <Typography className={classes.defaultLabel}>{t("default-min-max")}</Typography>
              </div>
              <div className={classes.halfWidth}>
                <Typography className={classes.subSubTitle}>B. {t("event-trigger-threshold")}</Typography>
                <div className={classes.valueSelection}>
                  <div className={classes.displayFlex}>
                    <Typography>{t("time-spent-off-target")}</Typography>
                    <div className={classes.dropdown}>
                      <BasicDropdown
                        id={"team-basic-dropdown"}
                        defaultValue="50%"
                        values={["10%", "30%", "50%", "60%"]}
                        onSelect={() => {
                          console.log("Selected");
                        }} />
                    </div>
                  </div>
                </div>
                <Typography className={classes.defaultLabel}>{t("default", { value : "50%" })}</Typography>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <div>
            <Typography className={classes.subTitle}>2. {t("severe-hypoglycemia")}</Typography>
            <Typography className={classes.categoryInfo}>{t("current-trigger-setting-hypoglycemia")}</Typography>
            <div className={classes.categoryBody}>
              <div className={classes.halfWidth}>
                <Typography className={classes.subSubTitle}>A. {t("severe-hypoglycemia-threshold")}:</Typography>
                <div className={classes.valueSelection}>
                  <div className={classes.displayFlex}>
                    <Typography>{t("severe-hypoglycemia-below")}:</Typography>
                    <div className={classes.dropdown}>
                      <BasicDropdown
                        id={"team-basic-dropdown"}
                        defaultValue="70mg/dL"
                        values={["60mg/dL", "70mg/dL", "80mg/dL", "100mg/dL"]}
                        onSelect={() => {
                          console.log("Selected");
                        }} />
                    </div>
                  </div>
                </div>
                <Typography className={classes.defaultLabel}>{t("default", { value : "50mg/dL" })}</Typography>
              </div>
              <div className={classes.halfWidth}>
                <Typography className={classes.subSubTitle}>B. {t("event-trigger-threshold")}</Typography>
                <div className={classes.valueSelection}>
                  <div className={classes.displayFlex}>
                    <Typography>{t("time-spent-severe-hypoglycemia")}</Typography>
                    <div className={classes.dropdown}>
                      <BasicDropdown
                        id={"team-basic-dropdown"}
                        defaultValue="50%"
                        values={["10%", "30%", "50%", "60%"]}
                        onSelect={() => {
                          console.log("Selected");
                        }} />
                    </div>
                  </div>
                </div>
                <Typography className={classes.defaultLabel}>{t("default", { value : "5%" })}</Typography>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <div>
            <Typography className={classes.subTitle}>3. {t("data-not-transmitted")}</Typography>
            <Typography className={classes.categoryInfo}>{t("current-trigger-setting-data")}</Typography>
            <div className={classes.categoryBody}>
              <div className={classes.halfWidth}>
                <Typography className={classes.subSubTitle}>A. {t("event-trigger-threshold")}</Typography>
                <div className={classes.valueSelection}>
                  <div className={classes.displayFlex}>
                    <Typography>{t("time-spent-without-uploaded-data")}</Typography>
                    <div className={classes.dropdown}>
                      <BasicDropdown
                        id={"team-basic-dropdown"}
                        defaultValue="50%"
                        values={["40%", "50%", "60%", "70%"]}
                        onSelect={() => {
                          console.log("Selected");
                        }} />
                    </div>
                  </div>
                </div>
                <Typography className={classes.defaultLabel}>{t("default", { value : "50%" })}</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TeamAlarms;
