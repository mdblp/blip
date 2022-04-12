/**
 * Copyright (c) 2021, Diabeloop
 * Patient list for HCPs
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

import _ from "lodash";
import React from "react";
import bows from "bows";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import { FilterType, PatientTableSortFields, SortDirection } from "../../../models/generic";
import metrics from "../../../lib/metrics";
import { useAlert } from "../../../components/utils/snackbar";
import { useAuth } from "../../../lib/auth";
import {
  errorTextFromException,
  setPageTitle,
} from "../../../lib/utils";
import { Team, TeamContext, useTeam } from "../../../lib/team";
import { AddPatientDialogResult, AddPatientDialogContentProps } from "../types";
import PatientsSecondaryBar from "./secondary-bar";
import { getMedicalValues } from "./utils";
import PatientListTable from "./table";
import PatientListCards from "./cards";
import AddPatientDialog from "./add-dialog";
import RemovePatientDialog from "./remove-dialog";
import TeamCodeDialog from "./team-code-dialog";
import { Patient } from "../../../models/patient";

const log = bows("PatientListPage");

// eslint-disable-next-line no-magic-numbers
const throttledMetrics = _.throttle(metrics.send, 60000); // No more than one per minute
// eslint-disable-next-line no-magic-numbers
const throttleSearchMetrics = _.throttle(metrics.send, 10000, { trailing: true });

/**
 * Compare two patient for sorting the patient table
 * @param a A patient
 * @param b A patient
 * @param orderBy Sort field
 */
function doCompare(a: Patient, b: Patient, orderBy: PatientTableSortFields): number {
  let aValue: string | number | boolean | Date | null | undefined;
  let bValue: string | number | boolean | Date | null | undefined;

  switch (orderBy) {
  case PatientTableSortFields.alertTimeTarget:
    aValue = a.alerts?.timeSpentAwayFromTargetRate;
    bValue = b.alerts?.timeSpentAwayFromTargetRate;
    break;
  case PatientTableSortFields.alertHypoglycemic:
    aValue = a.alerts?.frequencyOfSevereHypoglycemiaActive;
    bValue = b.alerts?.frequencyOfSevereHypoglycemiaActive;
    break;
  case PatientTableSortFields.ldu:
    aValue = getMedicalValues(a.medicalData).lastUploadEpoch;
    bValue = getMedicalValues(b.medicalData).lastUploadEpoch;
    break;
  case PatientTableSortFields.patientFullName:
    aValue = a.fullName;
    bValue = b.fullName;
    break;
  case PatientTableSortFields.remoteMonitoring:
    aValue = a.remoteMonitoring;
    bValue = b.remoteMonitoring;
    break;
  case PatientTableSortFields.system:
    aValue = a.system;
    bValue = b.system;
    break;
  }

  if (typeof aValue === "string" && typeof bValue === "string") {
    return aValue.localeCompare(bValue);
  }
  if (typeof aValue === "boolean") {
    return aValue ? -1 : 1;
  }
  if (aValue instanceof Date && bValue instanceof Date) {
    return Number(aValue > bValue);
  }
  if (typeof aValue !== "number" || !Number.isFinite(aValue)) {
    return -1;
  }
  if (typeof bValue !== "number" || !Number.isFinite(bValue)) {
    return 1;
  }
  return aValue - bValue;
}

export function updatePatientList(
  teamHook: TeamContext,
  flagged: string[],
  filter: string,
  filterType: FilterType | string,
  orderBy: PatientTableSortFields,
  order: SortDirection
): Patient[] {
  const allPatients = teamHook.getPatients();
  let patients: Readonly<Patient>[];
  if (!(filterType in FilterType)) {
    //filterType is a team id, retrieve all patients not pending in given team
    patients = allPatients.filter((patient) => !teamHook.isUserInvitationPending(patient, filterType));
  } else if (filterType === FilterType.pending) {
    patients = allPatients.filter((patient) => teamHook.isInvitationPending(patient));
  } else {
    patients = allPatients.filter((patient) => !teamHook.isOnlyPendingInvitation(patient));
  }

  const searchByName = filter.length > 0;
  if (searchByName) {
    const searchText = filter.toLocaleLowerCase();
    patients = patients.filter((patient: Patient): boolean => {
      switch (filterType) {
      case FilterType.all:
      case FilterType.pending:
        break;
      case FilterType.flagged:
        if (!flagged.includes(patient.userid)) {
          return false;
        }
        break;
      default:
        if (!teamHook.isInTeam(patient, filterType)) {
          return false;
        }
        break;
      }

      const firstName = patient.firstName ?? "";
      if (firstName.toLocaleLowerCase().includes(searchText)) {
        return true;
      }
      const lastName = patient.lastName ?? "";
      return lastName.toLocaleLowerCase().includes(searchText);
    });
  } else if (filterType === FilterType.flagged) {
    patients = patients.filter((patient: Patient): boolean => flagged.includes(patient.userid));
  } else if (filterType !== FilterType.all && filterType !== FilterType.pending) {
    patients = patients.filter((patient: Patient): boolean => teamHook.isInTeam(patient, filterType));
  }

  // Sort the patients
  patients.sort((a: Patient, b: Patient): number => {
    let c = doCompare(a, b, orderBy);
    if (c === 0) {
      c = doCompare(a, b, PatientTableSortFields.patientFullName);
    }
    return order === SortDirection.asc ? c : -c;
  });

  if (searchByName) {
    throttleSearchMetrics("trackSiteSearch", "patient_name", "hcp", patients.length);
  }

  return patients;
}

function PatientListPage(): JSX.Element {
  const historyHook = useHistory();
  const { t } = useTranslation("yourloops");
  const theme = useTheme();
  const matchesMediaSizeSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const authHook = useAuth();
  const teamHook = useTeam();
  const alert = useAlert();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<SortDirection>(SortDirection.asc);
  const [orderBy, setOrderBy] = React.useState<PatientTableSortFields>(PatientTableSortFields.patientFullName);
  const [filter, setFilter] = React.useState<string>("");
  const [filterType, setFilterType] = React.useState<FilterType | string>(FilterType.all);
  const [patientToAdd, setPatientToAdd] = React.useState<AddPatientDialogContentProps | null>(null);
  const [teamCodeToDisplay, setTeamCodeToDisplay] = React.useState<Team | null>(null);
  const [patientToRemove, setPatientToRemove] = React.useState<Patient | null>(null);
  const flagged = authHook.getFlagPatients();

  const handleRefresh = async (force = false) => {
    log.debug("handleRefresh:", { force });
    setLoading(true);
    setErrorMessage(null);
    try {
      await teamHook.refresh(force);
    } catch (reason: unknown) {
      log.error("handleRefresh", reason);
      const errorMessage = t("error-failed-display-teams", { errorMessage: errorTextFromException(reason) });
      setErrorMessage(errorMessage);
    }
    setLoading(false);
  };

  const handleSelectPatient = (patient: Patient): void => {
    metrics.send("patient_selection", "select_patient", flagged.includes(patient.userid) ? "flagged" : "not_flagged");
    historyHook.push(`/patient/${patient.userid}`);
  };

  const handleFlagPatient = async (userId: string): Promise<void> => {
    metrics.send("patient_selection", "flag_patient", flagged.includes(userId) ? "flagged" : "un-flagged");
    await authHook.flagPatient(userId);
  };

  const handleInvitePatient = async (): Promise<void> => {
    const getPatientEmailAndTeam = (): Promise<AddPatientDialogResult | null> => {
      const teams = teamHook.getMedicalTeams();
      return new Promise((resolve: (value: AddPatientDialogResult | null) => void) => {
        setPatientToAdd({ onDialogResult: resolve, teams });
      });
    };

    const result = await getPatientEmailAndTeam();
    setPatientToAdd(null); // Close the dialog

    if (result !== null) {
      try {
        const { email, teamId } = result;
        const team = teamHook.getTeam(teamId);
        await teamHook.invitePatient(team as Team, email);
        alert.success(t("alert-invitation-sent-success"));
        metrics.send("invitation", "send_invitation", "patient");
        setTeamCodeToDisplay(team);
      } catch (reason) {
        log.error(reason);
        // TODO Errors:
        // - "alert-invitation-patient-failed-already-in-team"
        // - "alert-invitation-patient-failed-already-invited"
        alert.error(t("alert-invitation-patient-failed"));
      }
    }
  };

  const handleSortList = (orderBy: PatientTableSortFields, order: SortDirection): void => {
    metrics.send("patient_selection", "sort_patients", orderBy, order === SortDirection.asc ? 1 : -1);
    setOrder(order);
    setOrderBy(orderBy);
  };

  const handleFilter = (filter: string): void => {
    log.info("Filter patients name", filter);
    throttledMetrics("patient_selection", "search_patient", "by-name");
    setFilter(filter);
  };

  const handleFilterType = (filterType: FilterType | string): void => {
    log.info("Filter patients with", filterType);
    setFilterType(filterType);
    if (!(filterType in FilterType)) {
      log.info("Replace", filterType, "with team"); // TODO Remove me if it works
      filterType = "team";
    }
    metrics.send("patient_selection", "filter_patient", filterType);
  };

  const handleCloseTeamCodeDialog = (): void => {
    setTeamCodeToDisplay(null);
  };

  const handleOnClickRemovePatient = (patient: Patient): void => setPatientToRemove(patient);

  const handleCloseRemovePatientDialog = (): void => setPatientToRemove(null);

  const patients = React.useMemo(() => {
    if (!teamHook.initialized || errorMessage !== null) {
      return [];
    }
    return updatePatientList(teamHook, flagged, filter, filterType, orderBy, order);
  }, [teamHook, flagged, filter, filterType, orderBy, order, errorMessage]);

  React.useEffect(() => {
    if (!teamHook.initialized) {
      if (!loading) {
        setLoading(true);
      }
      return;
    }

    if (teamHook.errorMessage !== null) {
      const message = t("error-failed-display-teams", { errorMessage: teamHook.errorMessage });
      if (message !== errorMessage) {
        log.error("errorMessage", message);
        setErrorMessage(message);
      }
    } else if (errorMessage !== null) {
      setErrorMessage(null);
    }

    if (loading) {
      setLoading(false);
    }
  }, [teamHook.initialized, teamHook.errorMessage, errorMessage, loading, t]);

  React.useEffect(() => {
    setPageTitle(t("hcp-tab-patients"));
  }, [t]);

  if (loading) {
    return (
      <CircularProgress disableShrink
        style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }} />
    );
  }

  if (errorMessage !== null) {
    return (
      <div id="div-api-error-message" className="api-error-message">
        <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>
          {errorMessage}
        </Alert>
        <Button id="button-api-error-message" variant="contained" color="secondary" onClick={() => handleRefresh(true)}>
          {t("button-refresh-page-on-error")}
        </Button>
      </div>
    );
  }

  let patientListElement: JSX.Element;
  if (matchesMediaSizeSmall) {
    patientListElement = (
      <Container id="patient-list-container">
        <PatientListCards
          patients={patients}
          flagged={flagged}
          onClickPatient={handleSelectPatient}
          onFlagPatient={handleFlagPatient}
          onClickRemovePatient={handleOnClickRemovePatient}
        />
      </Container>
    );
  } else {
    patientListElement = (
      <Container id="patient-list-container" maxWidth="lg">
        <PatientListTable
          patients={patients}
          flagged={flagged}
          order={order}
          orderBy={orderBy}
          filter={filterType}
          onClickPatient={handleSelectPatient}
          onFlagPatient={handleFlagPatient}
          onSortList={handleSortList}
          onClickRemovePatient={handleOnClickRemovePatient}
        />
      </Container>
    );
  }

  return (
    <React.Fragment>
      <PatientsSecondaryBar
        filter={filter}
        filterType={filterType}
        onFilter={handleFilter}
        onFilterType={handleFilterType}
        onInvitePatient={handleInvitePatient}
      />
      <Grid container direction="row" justifyContent="center" alignItems="center"
        style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
        <Alert severity="info">{t("alert-patient-list-data-computed")}</Alert>
      </Grid>
      {patientListElement}
      <AddPatientDialog actions={patientToAdd} />
      <TeamCodeDialog
        onClose={handleCloseTeamCodeDialog}
        code={teamCodeToDisplay?.code ?? ""}
        name={teamCodeToDisplay?.name ?? ""}
      />
      <RemovePatientDialog
        isOpen={!!patientToRemove}
        onClose={handleCloseRemovePatientDialog}
        patient={patientToRemove}
      />
    </React.Fragment>
  );
}

export default PatientListPage;
