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

import { makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlineIcon from "@material-ui/icons/FlagOutlined";

import IconActionButton from "../../../components/buttons/icon-action";
import { FilterType } from "../../../models/generic";
import { MedicalData } from "../../../models/device-data";
import metrics from "../../../lib/metrics";
import { useAuth } from "../../../lib/auth";
import { useTeam } from "../../../lib/team";
import { addPendingFetch, removePendingFetch } from "../../../lib/data";
import { PatientElementProps } from "./models";
import { getMedicalValues } from "./utils";
import { StyledTableCell } from "./table";
import { Box, TableRow, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";

const patientListStyle = makeStyles(
  (theme: Theme) => {
    return {
      flag: {
        color: "#000000",
      },
      flagIconCell: {
        width: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      pendingIconCell: {
        width: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      iconCell: {
        width: theme.spacing(7),
        padding: 0,
      },
      tableRow: {
        cursor: "pointer",
      },
      typography: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    };
  },
  { name: "ylp-hcp-patients-row" }
);

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#F8F7F7",
  },
  "&": {
    height: "64px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

function PatientRow(props: PatientElementProps): JSX.Element {
  const { patient, flagged, filter, onClickPatient, onFlagPatient } = props;
  const { t } = useTranslation("yourloops");
  const trNA = t("N/A");
  const authHook = useAuth();
  const teamHook = useTeam();
  const classes = patientListStyle();
  const [medicalData, setMedicalData] = React.useState<MedicalData | null | undefined>(patient.medicalData);
  const [tooltipText, setTooltipText] = React.useState<string>("");
  const rowRef = React.createRef<HTMLTableRowElement>();

  const userId = patient.userid;
  const email = patient.username;
  const isFlagged = flagged.includes(userId);
  const patientFullName = patient.fullName;
  const patientSystem = patient.system ?? trNA;
  const patientRemoteMonitoring = patient.remoteMonitoring ?? t("no");

  const onClickFlag = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onFlagPatient(userId);
    metrics.send("patient_selection", "flag_patient", isFlagged ? "un-flagged" : "flagged");
  };

  const onRowClick = (): void => {
    onClickPatient(patient);
    metrics.send("patient_selection", "select_patient", isFlagged ? "flagged" : "un-flagged");
  };

  const { tir, tbr, lastUpload } = React.useMemo(() => getMedicalValues(medicalData, trNA), [medicalData, trNA]);
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
    if (session !== null && observedElement !== null && typeof medicalData === "undefined" && !isPendingInvitation) {
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

  const firstRowIcon = filter === FilterType.pending && hasPendingInvitation ?
    (
      <Tooltip
        id={`${rowId}-tooltip-pending`}
        title={t("pending-invitation") as string}
        aria-label={t("pending-invitation")}
        placement="bottom"
      >
        <Box display="flex">
          <AccessTimeIcon id={`${rowId}-pendingicon`} className={classes.pendingIconCell} />
        </Box>
      </Tooltip>) :
    (<IconActionButton
      icon={isFlagged ? <FlagIcon id={`${rowId}-flagged`} /> : <FlagOutlineIcon id={`${rowId}-un-flagged`} />}
      id={`${rowId}-icon-button-flag`}
      onClick={onClickFlag}
      className={`${!isFlagged ? classes.flag : ""} ${classes.flagIconCell} patient-flag-button`}
    />);

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
      <StyledTableCell id={`${rowId}-icon`} className={classes.iconCell}>{firstRowIcon}</StyledTableCell>
      <StyledTableCell id={`${rowId}-patient-full-name`} className={classes.typography}>
        <Tooltip title={tooltipText}>
          <Typography id={`${rowId}-patient-full-name-value`} className={classes.typography}>
            {patientFullName}
          </Typography>
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell id={`${rowId}-system`} className={classes.typography}>{patientSystem}</StyledTableCell>
      <StyledTableCell id={`${rowId}-remote-monitoring`}
        className={classes.typography}>{patientRemoteMonitoring}</StyledTableCell>
      <StyledTableCell id={`${rowId}-tir`} className={classes.typography}>{tir}</StyledTableCell>
      <StyledTableCell id={`${rowId}-tbr`} className={classes.typography}>{tbr}</StyledTableCell>
      <StyledTableCell id={`${rowId}-ldu`} className={classes.typography}>{lastUpload}</StyledTableCell>
    </StyledTableRow>
  );
}

export default PatientRow;
