/**
 * Copyright (c) 2022, Diabeloop
 * Patient information widget for dashboard
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
import moment from "moment-timezone";
import { useTranslation } from "react-i18next";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import LocalHospitalOutlinedIcon from "@material-ui/icons/LocalHospitalOutlined";

import { Settings, IUser } from "../../models/shoreline";
import { getUserFirstLastName } from "../../lib/utils";

const patientInfoWidgetStyles = makeStyles((theme: Theme) => (
  {
    card: {
      width: 430,
    },
    cardHeader: {
      textTransform: "uppercase",
      backgroundColor: "var(--card-header-background-color)",
    },
    cardContent: {
      overflowY: "auto",
      maxHeight: 800,
    },
    sectionTitles: {
      fontSize: "var(--section-title-font-size)",
      // TODO fontWeight typechecking make it not assignable with a CSS variable
      // fontWeight: "var(--section-title-font-weight)",
      fontWeight: 400,
      lineHeight: "var(--section-title-line-height)",
      margin: "var(--section-title-margin)",
      color: "var(--section-title-color)",
    },
    sectionContent: {
      fontSize: "13px",
      fontWeight: 300,
      lineHeight: "15px",
      color: "#444444",
    },
    deviceLabels: {
      paddingLeft: theme.spacing(2),
    },
  }), { name: "patient-info-widget" });

export interface PatientInfoWidgetProps {
  patient: Readonly<IUser>,
}

function PatientInfoWidget(props: PatientInfoWidgetProps): JSX.Element {
  const { patient } = props;
  const classes = patientInfoWidgetStyles();
  const { t } = useTranslation("yourloops");



  const hbA1c: Settings["a1c"] = patient.settings?.a1c
    ? { value: patient.settings.a1c.value, date: moment.utc(patient.settings.a1c.date).format("L") }
    : undefined;
  const birthDate = moment.utc(patient.profile?.patient?.birthday).format("L");
  const userName = getUserFirstLastName(patient);
  // patient.remoteMonitoring
  const patientInfo :Record<string, string>= {
    patient: `${userName.firstName} ${userName.lastName}`,
    birthdate: birthDate,
    email: patient.username,
    hba1c: hbA1c? `${hbA1c.value} (${hbA1c?.date})`: "",
  };

  return (
    <Card id="patient-info" className={classes.card}>
      <CardHeader
        id="patient-info-header"
        avatar={<LocalHospitalOutlinedIcon/>}
        className={classes.cardHeader}
        title={t("patient-info")}
      />
      <CardContent id="patient-info-content" className={classes.cardContent}>
        <Grid className={classes.sectionContent} container spacing={1}>
          {Object.keys(patientInfo).map(
            (key) =>
              <React.Fragment key={key}>
                <Grid item xs={6}>
                  <div className={`${classes.deviceLabels} device-label`}>
                    {t(key)}:
                  </div>
                </Grid>
                <Grid item xs={6} id={`patient-info-${key}-value`}className="device-value">
                  {patientInfo[key]}
                </Grid>
              </React.Fragment>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PatientInfoWidget;
