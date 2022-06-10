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

import React, { useState } from "react";
import moment from "moment-timezone";
import { useTranslation } from "react-i18next";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { commonComponentStyles } from "../common";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import LocalHospitalOutlinedIcon from "@material-ui/icons/LocalHospitalOutlined";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { Settings } from "../../models/shoreline";
import { Patient } from "../../lib/data/patient";
import RemoteMonitoringPatientInviteDialog from "../dialogs/remote-monitoring-invite";
import { useAuth } from "../../lib/auth";
import { MonitoringStatus } from "../../models/monitoring";
import { useNotification } from "../../lib/notifications/hook";
import { useTeam } from "../../lib/team";
import ConfirmDialog from "../dialogs/confirm-dialog";
import { TeamMemberRole } from "../../models/team";

const patientInfoWidgetStyles = makeStyles((theme: Theme) => ({
  card: {
    width: 430,
  },
  cardHeader: {
    textTransform: "uppercase",
    backgroundColor: "var(--card-header-background-color)",
  },
  deviceLabels: {
    alignSelf: "center",
  },
  deviceValues: {
    overflowWrap: "break-word",
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
}), { name: "patient-info-widget" });

export interface PatientInfoWidgetProps {
  patient: Patient,
}

function PatientInfoWidget(props: PatientInfoWidgetProps): JSX.Element {
  const { patient } = props;
  const classes = patientInfoWidgetStyles();
  const commonStyles = commonComponentStyles();
  const { t } = useTranslation("yourloops");
  const trNA = t("N/A");
  const authHook = useAuth();
  const notificationHook = useNotification();
  const teamHook = useTeam();
  const [showInviteRemoteMonitoringDialog, setShowInviteRemoteMonitoringDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogActionInProgress, setConfirmDialogActionInProgress] = useState(false);
  const hbA1c: Settings["a1c"] = patient.settings.a1c
    ? { value: patient.settings.a1c.value, date: moment.utc(patient.settings.a1c.date).format("L") }
    : undefined;
  const birthdate = moment.utc(patient.profile.birthdate).format("L");

  const isLoggedInUserHcpAdmin = () => {
    return authHook.user?.isUserHcp() &&
      teamHook.getRemoteMonitoringTeams()
        .find(team => team.members.find(member => member.role === TeamMemberRole.admin && member.user.userid === authHook.user?.userid)
          && team.members.find(member => member.user.userid === patient.userid)
        );
  };

  const showMonitoringButtonAction = isLoggedInUserHcpAdmin();

  const buttonsVisible: { invite: boolean, cancel: boolean, renewAndRemove: boolean } = {
    invite: false,
    cancel: false,
    renewAndRemove: false,
  };

  const patientInfo: Record<string, string> = {
    patient: patient.profile.fullName,
    birthdate,
    email: patient.profile.email,
    hba1c: hbA1c ? `${hbA1c.value} (${hbA1c?.date})` : trNA,
  };

  const computePatientInformation = () => {
    patientInfo["remote-monitoring"] = patient.monitoring?.enabled ? t("yes") : t("no");

    const displayInviteButton = patient.monitoring?.enabled === false
      && patient.monitoring.status !== MonitoringStatus.pending
      && patient.monitoring.status !== MonitoringStatus.accepted;
    const displayCancelInviteButton = patient.monitoring?.enabled === false
      && patient.monitoring.status === MonitoringStatus.pending;
    const displayRenewAndRemoveMonitoringButton = (patient.monitoring?.enabled === false
      && patient.monitoring.status === MonitoringStatus.accepted) || patient.monitoring?.enabled === true;

    buttonsVisible.invite = displayInviteButton;
    buttonsVisible.cancel = displayCancelInviteButton;
    buttonsVisible.renewAndRemove = displayRenewAndRemoveMonitoringButton;
  };

  if (patient.monitoring) {
    computePatientInformation();
  }

  const cancelRemoteMonitoringInvite = async () => {
    setConfirmDialogActionInProgress(true);
    try {
      await notificationHook.cancelRemoteMonitoringInvite(teamHook.getPatientRemoteMonitoringTeam(patient).teamId, patient.userid);
      if (!patient.monitoring) {
        throw Error("Cannot cancel monitoring invite as patient monitoring is not defined");
      }
      patient.monitoring = { ...patient.monitoring, status: undefined, monitoringEnd: undefined };
      teamHook.editPatientRemoteMonitoring(patient);
      setConfirmDialogActionInProgress(false);
      setShowConfirmDialog(false);
    } catch (e) {
      setConfirmDialogActionInProgress(false);
    }
  };

  return (
    <Card id="patient-info" className={classes.card}>
      <CardHeader
        id="patient-info-header"
        avatar={<LocalHospitalOutlinedIcon />}
        className={classes.cardHeader}
        title={t("patient-info")}
      />
      <CardContent id="patient-info-content">
        <Grid container spacing={1}>
          {Object.keys(patientInfo).map((key) =>
            <React.Fragment key={key}>
              <Grid item xs={4} className={`${classes.deviceLabels} device-label`}>
                <Typography variant="caption">
                  {t(key)}:
                </Typography>
              </Grid>
              <Grid item xs={8} className={`${classes.deviceValues} device-value`}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" id={`patient-info-${key}-value`}>
                    {patientInfo[key]}
                  </Typography>
                  {key === "remote-monitoring" && showMonitoringButtonAction &&
                    <React.Fragment>
                      {buttonsVisible.invite &&
                        <Button
                          id="invite-button-id"
                          className={commonStyles.button}
                          variant="contained"
                          color="primary"
                          disableElevation
                          size="small"
                          onClick={() => setShowInviteRemoteMonitoringDialog(true)}
                        >
                          {t("button-invite")}
                        </Button>
                      }
                      {buttonsVisible.cancel &&
                        <Button
                          id="cancel-invite-button-id"
                          className={commonStyles.button}
                          variant="contained"
                          color="primary"
                          disableElevation
                          size="small"
                          onClick={() => setShowConfirmDialog(true)}
                        >
                          {t("cancel-invite")}
                        </Button>
                      }
                      {buttonsVisible.renewAndRemove &&
                        <Box>
                          <Button
                            id="renew-button-id"
                            className={commonStyles.button}
                            variant="contained"
                            color="primary"
                            disableElevation
                            size="small"
                            onClick={() => console.log("Renew clicked")}
                          >
                            {t("renew")}
                          </Button>
                          <Button
                            id="remove-button-id"
                            className={`${commonStyles.button} ${classes.marginLeft}`}
                            variant="contained"
                            color="primary"
                            disableElevation
                            size="small"
                            onClick={() => console.log("Remove clicked")}
                          >
                            {t("button-remove")}
                          </Button>
                        </Box>
                      }
                    </React.Fragment>
                  }
                </Box>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </CardContent>
      {showInviteRemoteMonitoringDialog &&
        <RemoteMonitoringPatientInviteDialog
          patient={patient}
          onClose={() => setShowInviteRemoteMonitoringDialog(false)}
        />
      }
      {showConfirmDialog &&
        <ConfirmDialog
          title={t("cancel-remote-monitoring-invite")}
          label={t("cancel-remote-monitoring-invite-confirm", { fullName: patient.profile.fullName })}
          inProgress={confirmDialogActionInProgress}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={cancelRemoteMonitoringInvite}
        />
      }
    </Card>
  );
}

export default PatientInfoWidget;
