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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Box, CardHeader, IconButton } from "@material-ui/core";
import TuneIcon from "@material-ui/icons/Tune";
import AnnouncementIcon from "@material-ui/icons/Announcement";

import Card from "@material-ui/core/Card";
import { Patient } from "../../lib/data/patient";
import PatientAlarmDialog from "./patient-alarm-dialog";
import { useAuth } from "../../lib/auth";

const chatWidgetStyles = makeStyles((theme: Theme) => {
  return {
    alertColor: {
      color: theme.palette.warning.main,
    },
    configureIcon: {
      marginRight: theme.spacing(2),
    },
    eventCard: {
      width: "400px",
      height: "350px",
    },
    eventCardHeader: {
      textTransform: "uppercase",
      backgroundColor: "var(--card-header-background-color)",
    },
  };
});


export interface AlarmCardProps {
  patient: Patient;
}

function AlarmCard(props: AlarmCardProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { patient } = props;
  const authHook = useAuth();
  const loggedInUser = authHook.user;
  const classes = chatWidgetStyles();
  const [showPatientAlarmDialog, setShowPatientAlarmDialog] = useState(false);
  const timeSpentAwayFromTargetActive = patient.metadata.alarm.timeSpentAwayFromTargetActive;
  const frequencyOfSevereHypoglycemiaActive = patient.metadata.alarm.frequencyOfSevereHypoglycemiaActive;
  const nonDataTransmissionActive = patient.metadata.alarm.nonDataTransmissionActive;
  const noAlarmActive = !timeSpentAwayFromTargetActive && !frequencyOfSevereHypoglycemiaActive && !nonDataTransmissionActive;

  const buildNumberOfAlarmsLabel = () => {
    if (noAlarmActive) {
      return "";
    }
    const number = [timeSpentAwayFromTargetActive, frequencyOfSevereHypoglycemiaActive, nonDataTransmissionActive].filter(value => value).length;
    return ` (+${number})`;
  };

  const numberOfAlarmsLabel = buildNumberOfAlarmsLabel();

  const onClosePatientAlarmDialog = () => {
    setShowPatientAlarmDialog(false);
  };

  return (
    <Card className={classes.eventCard} id="chat-widget">
      <CardHeader
        id="alarm-card-header-id"
        avatar={<AnnouncementIcon className={noAlarmActive ? "" : classes.alertColor} />}
        className={classes.eventCardHeader}
        title={`${t("events")}${numberOfAlarmsLabel}`}
        action={
          <div>
            {!loggedInUser?.isUserPatient() &&
              <IconButton id="configure-icon-button-id" aria-label="settings"
                onClick={() => setShowPatientAlarmDialog(true)}>
                <TuneIcon className={classes.configureIcon} />
                <Box fontSize={14} fontWeight={600} color={"var(--text-base-color)"}>
                  {t("configure")}
                </Box>
              </IconButton>
            }
          </div>
        }
      />
      <Box marginTop={2} marginLeft={1} marginRight={1}>
        <Box fontSize="16px" marginBottom={1} fontWeight={600} className={classes.alertColor}>
          {t("current-events")}
        </Box>
        <Box id="tir-alarm-id" display="flex" fontSize="13px"
          className={timeSpentAwayFromTargetActive ? classes.alertColor : ""}>
          <div>{t("time-out-of-range-target")}</div>
          <Box
            marginLeft="auto"
          >
            {`${Math.round(patient.metadata.alarm.timeSpentAwayFromTargetRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box id="severe-hypo-alarm-id" display="flex" fontSize="13px"
          className={frequencyOfSevereHypoglycemiaActive ? classes.alertColor : ""}>
          <div>{t("alert-hypoglycemic")}</div>
          <Box
            marginLeft="auto"
          >
            {`${Math.round(patient.metadata.alarm.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box id="non-data-transmission-alarm-id" display="flex" fontSize="13px"
          className={nonDataTransmissionActive ? classes.alertColor : ""}>
          <div>{t("data-not-transferred")}</div>
          <Box marginLeft="auto">{`${Math.round(patient.metadata.alarm.nonDataTransmissionRate * 10) / 10}%`}</Box>
        </Box>
      </Box>
      {showPatientAlarmDialog &&
        <PatientAlarmDialog patient={patient} onClose={onClosePatientAlarmDialog} />
      }
    </Card>
  );
}

export default AlarmCard;
