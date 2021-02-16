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

import * as React from "react";
import bows from "bows";
import { RouteComponentProps } from "react-router-dom";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import { t } from "../../lib/language";
import { Teams, Team, TeamUser } from "../../lib/team";
import { SortDirection, FilterType, SortFields } from "./types";
import { errorTextFromException } from "../../lib/utils";
import apiClient from "../../lib/auth/api";
import PatientListBar from "./patients-list-bar";
import PatientListTable from "./patients-list-table";

interface PatientListPageState {
  loading: boolean;
  errorMessage: string | null;
  patients: TeamUser[];
  allPatients: TeamUser[];
  teams: Team[];
  flagged: string[];
  order: SortDirection;
  orderBy: SortFields;
  filter: string;
  filterType: FilterType;
}

class PatientListPage extends React.Component<RouteComponentProps, PatientListPageState> {
  private log: Console;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = PatientListPage.getInitialState();
    this.log = bows("PatientListPage");

    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onFlagPatient = this.onFlagPatient.bind(this);
    this.onInvitePatient = this.onInvitePatient.bind(this);
    this.onSortList = this.onSortList.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onFilterType = this.onFilterType.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.updatePatientList = this.updatePatientList.bind(this);
  }

  public componentDidMount(): void {
    this.log.debug("Mounted");
    this.onRefresh();
  }

  private static getInitialState(): PatientListPageState {
    return {
      loading: true,
      errorMessage: null,
      patients: [],
      allPatients: [],
      teams: [],
      flagged: [],
      order: "asc",
      orderBy: "lastname",
      filter: "",
      filterType: "all",
    };
  }

  render(): JSX.Element {
    const { loading, patients, teams, flagged, order, orderBy, filter, filterType, errorMessage } = this.state;

    if (loading) {
      return (
        <CircularProgress disableShrink style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }} />
      );
    }
    if (errorMessage !== null) {
      return (
        <div id="div-api-error-message" className="api-error-message">
          <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>
            {errorMessage}
          </Alert>
          <Button id="button-api-error-message" variant="contained" color="secondary" onClick={() => this.onRefresh(true)}>
            {t("button-refresh-page-on-error")}
          </Button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <PatientListBar
          filter={filter}
          filterType={filterType}
          teams={teams}
          onFilter={this.onFilter}
          onFilterType={this.onFilterType}
          onInvitePatient={this.onInvitePatient}
        />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
          <Alert severity="info">{t("alert-patient-list-data-computed")}</Alert>
        </Grid>
        <Container maxWidth="lg" style={{ marginBottom: "2em" }}>
          <PatientListTable
            patients={patients}
            flagged={flagged}
            order={order}
            orderBy={orderBy}
            onClickPatient={this.onSelectPatient}
            onFlagPatient={this.onFlagPatient}
            onSortList={this.onSortList}
          />
        </Container>
      </React.Fragment>
    );
  }

  private onRefresh(forceRefresh = false): void {
    this.setState(PatientListPage.getInitialState(), () => this.doRefresh(forceRefresh));
  }

  private async doRefresh(forceRefresh = false) {
    try {
      const teams = await Teams.refresh(forceRefresh);
      const patients = Teams.getPatients();
      this.setState({ flagged: apiClient.whoami?.preferences?.patientsStarred ?? [] });
      this.setState({ patients, allPatients: patients, teams, loading: false }, this.updatePatientList);
    } catch (reason: unknown) {
      this.log.error("doRefresh", reason);
      const errorMessage = errorTextFromException(reason);
      this.setState({ loading: false, errorMessage });
    }
  }

  private onSelectPatient(user: TeamUser): void {
    this.log.info("Click on", user);
    this.props.history.push(`/hcp/patient/${user.userId}`);
  }

  private onFlagPatient(userId: string): void {
    apiClient.flagPatient(userId).then((flagged: string[]) => {
      this.setState({ flagged });
    });
  }

  private onInvitePatient(username: string, teamId: string): void {
    this.log.info("onInvitePatient", username, teamId);
    this.setState({ loading: true, errorMessage: null }, async () => {
      try {
        await apiClient.invitePatient(username, teamId);
        await this.doRefresh();
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason);
        this.setState({ loading: false, errorMessage });
      }
    });
  }

  /**
   * Compare two patient for sorting the patient table
   * @param a A patient
   * @param b A patient
   * @param flagged Pinned patient
   * @param orderBy Sort field
   */
  private doCompare(a: TeamUser, b: TeamUser, orderBy: SortFields): number {
    let aValue: string;
    let bValue: string;
    switch (orderBy) {
    case "firstname":
      aValue = a.profile?.firstName ?? "😀";
      bValue = b.profile?.firstName ?? "😀";
      break;
    case "lastname":
      aValue = a.profile?.lastName ?? a.profile?.fullName ?? a.username;
      bValue = b.profile?.lastName ?? b.profile?.fullName ?? b.username;
      break;
    }

    return aValue.localeCompare(bValue);
  }

  private onSortList(orderBy: SortFields, order: SortDirection): void {
    this.log.info("Sort patients", orderBy, order);
    this.setState({ order, orderBy }, this.updatePatientList);
  }

  private onFilter(filter: string): void {
    this.log.info("Filter patients name", filter);
    this.setState({ filter }, this.updatePatientList);
  }

  private onFilterType(filterType: FilterType): void {
    this.log.info("Filter patients with", filterType);
    this.setState({ filterType }, this.updatePatientList);
  }

  private updatePatientList() {
    const { allPatients, filter, filterType, flagged, order, orderBy } = this.state;

    let patients = allPatients;
    if (filter.length > 0) {
      const searchText = filter.toLocaleLowerCase();
      patients = allPatients.filter((patient: TeamUser): boolean => {
        switch (filterType) {
        case "all":
          break;
        case "flagged":
          if (!flagged.includes(patient.userId)) {
            return false;
          }
          break;
        case "pending":
          if (!patient.isInvitationPending()) {
            return false;
          }
          break;
        default:
          if (!patient.isInTeam(filterType)) {
            return false;
          }
          break;
        }

        if (patient.firstName.toLocaleLowerCase().includes(searchText)) {
          return true;
        }
        if (patient.lastName.toLocaleLowerCase().includes(searchText)) {
          return true;
        }
        return false;
      });
    } else if (filterType === "flagged") {
      patients = allPatients.filter((patient: TeamUser): boolean => flagged.includes(patient.userId));
    } else if (filterType === "pending") {
      patients = allPatients.filter((patient) => patient.isInvitationPending());
    } else if (filterType !== "all") {
      patients = allPatients.filter((patient: TeamUser): boolean => patient.isInTeam(filterType) ?? false);
    }

    // Sort the patients
    patients.sort((a: TeamUser, b: TeamUser): number => {
      const aFlagged = flagged.includes(a.userId);
      const bFlagged = flagged.includes(b.userId);
      // Flagged: always first
      if (aFlagged && !bFlagged) {
        return -1;
      }
      if (!aFlagged && bFlagged) {
        return 1;
      }

      let c = this.doCompare(a, b, orderBy);
      if (c === 0) {
        // In case of equality: choose another field
        if (orderBy === "lastname") {
          c = this.doCompare(a, b, "firstname");
        } else {
          c = this.doCompare(a, b, "lastname");
        }
      }
      return order === "asc" ? c : -c;
    });

    this.setState({ patients });
  }
}

export default PatientListPage;
