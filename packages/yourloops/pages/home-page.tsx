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

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

import { FilterType } from "../models/generic";
import metrics from "../lib/metrics";
import { useAlert } from "../components/utils/snackbar";
import { errorTextFromException, setPageTitle } from "../lib/utils";
import { Team, useTeam } from "../lib/team";
import { AddPatientDialogContentProps, AddPatientDialogResult } from "./hcp/types";
import PatientsSecondaryBar from "../components/patient/secondary-bar";
import AddPatientDialog from "../components/patient/add-dialog";
import RemovePatientDialog from "../components/patient/remove-dialog";
import TeamCodeDialog from "../components/patient/team-code-dialog";
import { Patient } from "../lib/data/patient";
import PatientList from "../components/patient/list";

const log = bows("PatientListPage");

// eslint-disable-next-line no-magic-numbers
const throttledMetrics = _.throttle(metrics.send, 60000); // No more than one per minute

function HomePage(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const teamHook = useTeam();
  const alert = useAlert();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>("");
  const [filterType, setFilterType] = React.useState<FilterType | string>(FilterType.all);
  const [patientToAdd, setPatientToAdd] = React.useState<AddPatientDialogContentProps | null>(null);
  const [teamCodeToDisplay, setTeamCodeToDisplay] = React.useState<Team | null>(null);
  const [patientToRemove, setPatientToRemove] = React.useState<Patient | null>(null);

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

  const handleCloseRemovePatientDialog = (): void => setPatientToRemove(null);

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
        <Button
          id="button-api-error-message"
          variant="contained"
          color="secondary"
          disableElevation
          onClick={() => handleRefresh(true)}
        >
          {t("button-refresh-page-on-error")}
        </Button>
      </div>
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
      <PatientList filter={filter} filterType={filterType}/>
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

export default HomePage;
