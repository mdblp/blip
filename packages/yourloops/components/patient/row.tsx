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
import _ from "lodash";
import { useTranslation } from "react-i18next";
import moment from "moment-timezone";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlineIcon from "@material-ui/icons/FlagOutlined";
import AnnouncementIcon from "@material-ui/icons/Announcement";

import IconActionButton from "../buttons/icon-action";
import { FilterType } from "../../models/generic";
import { MedicalData } from "../../models/device-data";
import metrics from "../../lib/metrics";
import { useAuth } from "../../lib/auth";
import { useTeam } from "../../lib/team";
import { addPendingFetch, removePendingFetch } from "../../lib/data";
import { PatientElementProps } from "./models";
import { getMedicalValues } from "./utils";
import { patientListCommonStyle } from "./table";
import { Box, Typography } from "@material-ui/core";
import { StyledTableCell, StyledTableRow } from "../styled-components";

const patientListStyle = makeStyles(
  (theme: Theme) => {
    return {
      alert: {
        color: theme.palette.warning.main,
      },
      alertIcon: {
        marginLeft: theme.spacing(2),
        verticalAlign: "bottom",
      },
      flag: {
        color: theme.palette.primary.main,
      },
      icon: {
        width: "56px",
        alignItems: "center",
        justifyContent: "center",
      },
      iconCell: {
        width: "56px",
        padding: 0,
      },
      remoteMonitoringCell: {
        whiteSpace: "pre-line",
      },
      tableRow: {
        cursor: "pointer",
        height: "64px",
      },
      typography: {
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  },
  { name: "ylp-hcp-patients-row" }
);

function PatientRow(props: PatientElementProps): JSX.Element {
  const { patient, flagged, filter, onClickPatient, onFlagPatient } = props;
  const { t } = useTranslation("yourloops");
  const trNA = t("N/A");
  const authHook = useAuth();
  const teamHook = useTeam();
  const isUserHcp = authHook.user?.isUserHcp();
  const patientIsMonitored = patient.monitoring !== null;
  const classes = patientListStyle();
  const patientListCommonClasses = patientListCommonStyle();
  const [medicalData, setMedicalData] = React.useState<MedicalData | null | undefined>(patient.metadata.medicalData);
  const [tooltipText, setTooltipText] = React.useState<string>("");
  const rowRef = React.createRef<HTMLTableRowElement>();

  const userId = patient.userid;
  const email = patient.profile.email;
  const isFlagged = flagged.includes(userId);
  const patientFullName = patient.profile.fullName;

  const computeRowInformation = () => {
    const mediumCellWithAlertClasses = `${classes.typography} ${patientListCommonClasses.mediumCell} ${classes.alert}`;
    const mediumCellWithClasses = `${classes.typography} ${patientListCommonClasses.mediumCell}`;
    const timeSpentAwayFromTargetActive = patient.metadata.alarm?.timeSpentAwayFromTargetActive ?? false;
    const frequencyOfSevereHypoglycemiaActive = patient.metadata.alarm?.frequencyOfSevereHypoglycemiaActive ?? false;
    const nonDataTransmissionActive = patient.metadata.alarm?.nonDataTransmissionActive ?? false;
    let patientRemoteMonitoring;
    if (patient.monitoring?.enabled) {
      if (patient.monitoring.monitoringEnd) {
        const enDate = moment.utc(patient.monitoring.monitoringEnd).format(moment.localeData().longDateFormat("ll")).toString();
        patientRemoteMonitoring = `${t("yes")}\n(${t("until")} ${enDate})`;
      } else {
        patientRemoteMonitoring = t("yes");
      }
    } else {
      patientRemoteMonitoring = t("no");
    }

    let patientFullNameClasses = `${classes.typography} ${patientListCommonClasses.largeCell}`;
    let timeSpentAwayFromTargetRateClasses = mediumCellWithClasses;
    let frequencyOfSevereHypoglycemiaRateClasses = mediumCellWithClasses;
    let dataNotTransferredRateClasses = mediumCellWithClasses;
    if (isUserHcp) {
      const dataNotTransferredActive = patient.metadata.alarm?.nonDataTransmissionRate ?? false;
      const hasAlert = timeSpentAwayFromTargetActive || frequencyOfSevereHypoglycemiaActive || nonDataTransmissionActive;
      patientFullNameClasses = hasAlert ? `${classes.typography} ${classes.alert} ${patientListCommonClasses.largeCell}` : `${classes.typography} ${patientListCommonClasses.largeCell}`;
      timeSpentAwayFromTargetRateClasses = timeSpentAwayFromTargetActive ? mediumCellWithAlertClasses : mediumCellWithClasses;
      frequencyOfSevereHypoglycemiaRateClasses = frequencyOfSevereHypoglycemiaActive ? mediumCellWithAlertClasses : mediumCellWithClasses;
      dataNotTransferredRateClasses = dataNotTransferredActive ? mediumCellWithAlertClasses : mediumCellWithClasses;
    }
    return {
      patientSystem: patient.settings.system ?? trNA,
      patientRemoteMonitoring,
      timeSpentAwayFromTargetActive,
      frequencyOfSevereHypoglycemiaActive,
      nonDataTransmissionActive,
      patientFullNameClasses,
      timeSpentAwayFromTargetRateClasses,
      frequencyOfSevereHypoglycemiaRateClasses,
      dataNotTransferredRateClasses,
    };
  };

  const {
    patientSystem,
    patientRemoteMonitoring,
    timeSpentAwayFromTargetActive,
    frequencyOfSevereHypoglycemiaActive,
    nonDataTransmissionActive,
    patientFullNameClasses,
    timeSpentAwayFromTargetRateClasses,
    frequencyOfSevereHypoglycemiaRateClasses,
    dataNotTransferredRateClasses,
  } = computeRowInformation();

  const onClickFlag = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onFlagPatient(userId);
    metrics.send("patient_selection", "flag_patient", isFlagged ? "un-flagged" : "flagged");
  };

  const onRowClick = (): void => {
    onClickPatient(patient);
    metrics.send("patient_selection", "select_patient", isFlagged ? "flagged" : "un-flagged");
  };

  const { lastUpload } = React.useMemo(() => getMedicalValues(medicalData, trNA), [medicalData, trNA]);
  // Replace the "@" if the userid is the email (status pending)
  // wdio used in the system tests do not accept "@"" in selectors
  // Theses ids should be the same as in pages/caregiver/patients/table.tsx to ease the tests
  const rowId = `patients-list-row-${userId.replace(/@/g, "_")}`;
  const session = authHook.session();
  const isPendingInvitation = teamHook.isOnlyPendingInvitation(patient);
  const hasPendingInvitation = teamHook.isInvitationPending(patient);
  const isAlreadyInATeam = teamHook.isInAtLeastATeam(patient);

  const isEllipsisActive = (element: HTMLElement | null): boolean | undefined => {
    return element ? element.offsetWidth < element.scrollWidth : undefined;
  };

  React.useEffect(() => {
    const userFullNameHtmlElement = document.getElementById(`${rowId}-patient-full-name-value`);
    setTooltipText(isEllipsisActive(userFullNameHtmlElement) ? patientFullName : "");
  }, [patientFullName, rowId]);

  React.useEffect(() => {
    const observedElement = rowRef.current;
    if (session && observedElement && !medicalData && !isPendingInvitation) {
      /** If unmounted, we want to discard the result, react don't like to update an unmounted component */
      let componentMounted = true;
      const observer = new IntersectionObserver((entries) => {
        const rowDisplayed = entries[0];
        if (rowDisplayed.intersectionRatio > 0) {
          // Displayed: queue the fetch
          addPendingFetch(session, patient).then((md) => {
            if (typeof md !== "undefined") {
              teamHook.setPatientMedicalData(patient.userid, md);
              if (componentMounted) setMedicalData(md);
            }
          }).catch(() => {
            teamHook.setPatientMedicalData(patient.userid, null);
            if (componentMounted) setMedicalData(null);
          });
        } else {
          // No longer displayed, cancel the fetch
          removePendingFetch(patient);
        }
      });

      observer.observe(observedElement);

      return (): void => {
        // Effect callback -> cancel subscriptions to the observer
        // and the API fetch
        observer.disconnect();
        removePendingFetch(patient);
        componentMounted = false;
      };
    }
    return _.noop;
  }, [medicalData, patient, session, isPendingInvitation, teamHook, rowRef]);

  return (
    <StyledTableRow
      id={rowId}
      tabIndex={-1}
      hover
      onClick={hasPendingInvitation && !isAlreadyInATeam ? undefined : onRowClick}
      className={`${classes.tableRow} patients-list-row`}
      data-userid={userId}
      data-email={email}
      ref={rowRef}
    >
      <StyledTableCell
        id={`${rowId}-icon`} className={classes.iconCell}
      >
        {filter === FilterType.pending && hasPendingInvitation ?
          (<Tooltip
            id={`${rowId}-tooltip-pending`}
            title={t("pending-invitation") as string}
            aria-label={t("pending-invitation")}
            placement="bottom"
          >
            <Box display="flex">
              <AccessTimeIcon id={`${rowId}-pendingicon`} className={classes.icon} />
            </Box>
          </Tooltip>) :
          (<IconActionButton
            icon={isFlagged ? <FlagIcon id={`${rowId}-flagged`} /> : <FlagOutlineIcon id={`${rowId}-un-flagged`} />}
            id={`${rowId}-icon-button-flag`}
            onClick={onClickFlag}
            className={`${!isFlagged ? classes.flag : ""} ${classes.icon} patient-flag-button`}
          />)}
      </StyledTableCell>
      <StyledTableCell
        id={`${rowId}-patient-full-name`} className={patientFullNameClasses}
      >
        <Tooltip title={tooltipText}>
          <Typography id={`${rowId}-patient-full-name-value`} className={classes.typography}>
            {patientFullName}
          </Typography>
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell id={`${rowId}-system`} className={classes.typography}>{patientSystem}</StyledTableCell>
      {isUserHcp &&
        <StyledTableCell
          id={`${rowId}-remote-monitoring`}
          className={`${classes.typography} ${patientListCommonClasses.mediumCell} ${classes.remoteMonitoringCell}`}
        >
          {patientRemoteMonitoring}
        </StyledTableCell>
      }
      <StyledTableCell
        id={`${rowId}-time-away-target`}
        className={timeSpentAwayFromTargetRateClasses}
      >
        {`${Math.round(patient.metadata.alarm.timeSpentAwayFromTargetRate * 10) / 10}%`}
        {isUserHcp && patientIsMonitored && timeSpentAwayFromTargetActive &&
          <AnnouncementIcon className={classes.alertIcon} />}
      </StyledTableCell>
      <StyledTableCell
        id={`${rowId}-hypo-frequency-rate`}
        className={frequencyOfSevereHypoglycemiaRateClasses}
      >
        {`${Math.round(patient.metadata.alarm.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
        {isUserHcp && patientIsMonitored && frequencyOfSevereHypoglycemiaActive &&
          <AnnouncementIcon className={classes.alertIcon} />}
      </StyledTableCell>
      <StyledTableCell
        id={`${rowId}-data-not-transferred`}
        className={dataNotTransferredRateClasses}
      >
        {`${Math.round(patient.metadata.alarm.nonDataTransmissionRate * 10) / 10}%`}
        {isUserHcp && patientIsMonitored && nonDataTransmissionActive &&
          <AnnouncementIcon className={classes.alertIcon} />}
      </StyledTableCell>
      <StyledTableCell id={`${rowId}-ldu`} className={classes.typography}>
        {lastUpload}
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default PatientRow;
