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
import { makeStyles, Theme } from "@material-ui/core/styles";

import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import { WeeklyReport } from "../../lib/medical-files/model";
import DialogContentText from "@material-ui/core/DialogContentText";
import Divider from "@material-ui/core/Divider";
import { useTeam } from "../../lib/team";

interface Props {
  onClose: () => void;
  weeklyReport: WeeklyReport;
}

const classes = makeStyles((theme: Theme) => ({
  divider: {
    margin: "30px 0 10px 16px",
  },
  title: {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "& > svg": {
      marginRight: theme.spacing(1),
    },
  },
  explanatoryText: {
    marginTop: theme.spacing(3),
    fontStyle: "italic",
  },
}));

export default function WeeklyReportDialog(props: Props): JSX.Element {
  const { title, divider, explanatoryText } = classes();
  const { t } = useTranslation("yourloops");
  const { onClose, weeklyReport } = props;
  const teamHook = useTeam();
  const patient = teamHook.getPatient(weeklyReport.patientId);
  const endDatePeriod = new Date(weeklyReport.creationDate);
  const startDatePeriod = new Date(weeklyReport.creationDate);
  startDatePeriod.setDate(startDatePeriod.getDate() - 7);

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      onClose={onClose}
    >
      <DialogTitle>
        <Box className={title}>
          <DescriptionOutlinedIcon />
          <Typography variant="h5">
            {t("weekly-report-pdf", { pdfName: new Date(weeklyReport.creationDate).toLocaleDateString() })}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText color="textPrimary">
          {t("firstname")} : {patient?.profile.firstName}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("lastname")} : {patient?.profile.lastName}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("birthdate")} : {patient?.profile.birthdate?.toLocaleDateString()}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("gender")} : {patient?.profile.sex}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("email")} : {patient?.profile.email}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("monitoring-team")} : {patient?.teams.filter(t => t.teamId === weeklyReport.teamId)[0].teamName}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("created-at")} : {endDatePeriod.toLocaleDateString()}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("monitoring-period")}: {startDatePeriod.toLocaleDateString()} - {endDatePeriod.toLocaleDateString()}
        </DialogContentText>
        <Divider className={divider} />
        <Typography variant="h4" align="center">
          {t("events-list")}
        </Typography>
        <DialogContentText color="textPrimary" variant="h6">
          {t("time-out-of-range-target")} : {`${Math.round(weeklyReport.alarms.timeSpentAwayFromTargetRate * 10) / 10}%`}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("glycemic-target")} : {`${weeklyReport.parameters.lowBg} ${weeklyReport.parameters.bgUnit} - ${weeklyReport.parameters.highBg} ${weeklyReport.parameters.bgUnit}`}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("event-trigger-threshold")} : {`${weeklyReport.parameters.outOfRangeThreshold}%`}
        </DialogContentText>
        <DialogContentText color="textPrimary" variant="h6">
          {t("severe-hypoglycemia")} : {`${Math.round(weeklyReport.alarms.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("severe-hypoglycemia-below")} : {`${weeklyReport.parameters.veryLowBg} ${weeklyReport.parameters.bgUnit}`}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("event-trigger-threshold")} : {`${weeklyReport.parameters.hypoThreshold}%`}
        </DialogContentText>

        <DialogContentText color="textPrimary" variant="h6">
          {t("data-not-transmitted")} : {`${Math.round(weeklyReport.alarms.nonDataTransmissionRate * 10) / 10}%`}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("current-trigger-setting-data", { nonDataThreshold: weeklyReport.parameters.nonDataTxThreshold })}
        </DialogContentText>
        <DialogContentText color="textPrimary">
          {t("event-trigger-threshold")} : {`${weeklyReport.parameters.nonDataTxThreshold}%`}
        </DialogContentText>

        <DialogContentText color="textPrimary" className={explanatoryText}>
          {t("yourloops-explanatory-text")}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          disableElevation
          onClick={onClose}
        >
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
