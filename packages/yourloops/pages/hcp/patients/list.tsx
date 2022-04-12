/**
 * Copyright (c) 2022, Diabeloop
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

import { FilterType, PatientTableSortFields, SortDirection } from "../../../models/generic";
import metrics from "../../../lib/metrics";
import { useAuth } from "../../../lib/auth";
import { errorTextFromException, setPageTitle } from "../../../lib/utils";
import { TeamContext, useTeam } from "../../../lib/team";
import PatientsTable from "./table";
import PatientsCards from "./cards";
import { Patient } from "../../../models/patient";
import { PatientListProps } from "./models";
import { comparePatients } from "./utils";

const log = bows("PatientListPage");

// eslint-disable-next-line no-magic-numbers
const throttleSearchMetrics = _.throttle(metrics.send, 10000, { trailing: true });

function PatientList(props: PatientListProps): JSX.Element {
  const { filter, filterType } = props;
  const historyHook = useHistory();
  const { t } = useTranslation("yourloops");
  const theme = useTheme();
  const matchesMediaSizeSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const authHook = useAuth();
  const teamHook = useTeam();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<SortDirection>(SortDirection.asc);
  const [orderBy, setOrderBy] = React.useState<PatientTableSortFields>(PatientTableSortFields.patientFullName);
  const flagged = authHook.getFlagPatients();

  const updatePatientList = (
    teamHook: TeamContext,
    flagged: string[],
    filter: string,
    filterType: FilterType | string,
    orderBy: PatientTableSortFields,
    order: SortDirection
  ) => {
    const filteredPatients = teamHook.filterPatients(filterType, filter, flagged);
    // Sort the patients
    filteredPatients.sort((a: Patient, b: Patient): number => {
      let c = comparePatients(a, b, orderBy);
      if (c === 0) {
        c = comparePatients(a, b, PatientTableSortFields.patientFullName);
      }
      return order === SortDirection.asc ? c : -c;
    });
    const searchByName = filter.length > 0;
    if (searchByName) {
      throttleSearchMetrics("trackSiteSearch", "patient_name", "hcp", filteredPatients.length);
    }
    return filteredPatients;
  };

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

  const handleSortList = (orderBy: PatientTableSortFields, order: SortDirection): void => {
    metrics.send("patient_selection", "sort_patients", orderBy, order === SortDirection.asc ? 1 : -1);
    setOrder(order);
    setOrderBy(orderBy);
  };

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
  return (
    <React.Fragment>
      {matchesMediaSizeSmall ? (
        <Container id="patient-list-container">
          <PatientsCards
            patients={patients}
            flagged={flagged}
            onClickPatient={handleSelectPatient}
            onFlagPatient={handleFlagPatient}
          />
        </Container>
      ) : (
        <Container id="patient-list-container" maxWidth="lg">
          <PatientsTable
            patients={patients}
            flagged={flagged}
            order={order}
            orderBy={orderBy}
            filter={filterType}
            onClickPatient={handleSelectPatient}
            onFlagPatient={handleFlagPatient}
            onSortList={handleSortList}
          />
        </Container>)
      }
    </React.Fragment>
  );
}

export default PatientList;
