/**
 * Copyright (c) 2021, Diabeloop
 * Patient list for HCPs
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import * as React from "react";
import { RouteComponentProps, globalHistory } from "@reach/router";
import bows from "bows";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
// import { DataGrid, RowsProp, ColDef, RowParams, CellParams } from "@material-ui/data-grid";
// import Grid from "@material-ui/core/Grid";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlineIcon from "@material-ui/icons/FlagOutlined";

import { t } from "../../lib/language";
import apiClient from "../../lib/api";
import { User } from "../../models/shoreline";

type SortDirection = "asc" | "desc";
type SortFields = "lastname" | "firstname";

interface PatientListProps {
  patients: User[];
  flagged: string[];
  order: SortDirection;
  orderBy: SortFields;
  onClickPatient: (user: User) => void;
  onFlagPatient: (userId: string) => void;
  onSortList: (field: SortFields, direction: SortDirection) => void;
}

interface PatientListPageState {
  patients: null | User[];
  flagged: string[];
  order: SortDirection;
  orderBy: SortFields;
}

const patientListStyle = makeStyles((/* theme_or_props */) => {
  return {
    table: {
      width: "100%",
    },
    tableRow: {
      cursor: "pointer",
    },
    tableRowHeader: {
      fontVariant: "small-caps",
    },
  };
});


function PatientsList(props: PatientListProps): JSX.Element {
  const { patients, flagged, order, orderBy, onClickPatient, onFlagPatient, onSortList } = props;
  const classes = patientListStyle();
  const elems = [];
  const nPatients = patients.length;

  for (let i=0; i<nPatients; i++) {
    const patient = patients[i];
    const userId = patient.userid;
    const firstName = patient.profile?.firstName ?? "";
    const lastName = patient.profile?.lastName ?? patient.profile?.fullName ?? patient.username;
    const isFlagged = flagged.includes(userId);
    const onClickFlag = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("onClickFlag", e);
      onFlagPatient(userId);
    };
    const onRowClick = (e: React.MouseEvent) => {
      console.log("onRowClick", patient, e);
      onClickPatient(patient);
    };
    elems.push(
      <TableRow id={`patients-list-row-${userId}`} key={userId} tabIndex={-1} hover onClick={onRowClick} className={classes.tableRow}>
        <TableCell id={`patients-list-row-flag-${userId}`}>
          <IconButton aria-label={t("aria-flag-patient")} size="small" onClick={onClickFlag}>
            {isFlagged ? <FlagIcon /> : <FlagOutlineIcon />}
          </IconButton>
        </TableCell>
        <TableCell id={`patients-list-row-lastname-${userId}`}>{lastName}</TableCell>
        <TableCell id={`patients-list-row-firstname-${userId}`}>{firstName}</TableCell>
        <TableCell id={`patients-list-row-tir-${userId}`}>{t("N/A")}</TableCell>
        <TableCell id={`patients-list-row-avg-glucose-${userId}`}>{t("N/A")}</TableCell>
        <TableCell id={`patients-list-row-tbr-${userId}`}>{t("N/A")}</TableCell>
        <TableCell id={`patients-list-row-upload-${userId}`}>{t("N/A")}</TableCell>
      </TableRow>
    );
  }

  const createSortHandler = (property: SortFields) => {
    return (/* event: React.MouseEvent */): void => {
      onSortList(property, order === "asc" ? "desc" : "asc");
    };
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label={t("aria-table-list-patient")} stickyHeader>
        <TableHead>
          <TableRow className={classes.tableRowHeader}>
            <TableCell id="patients-list-header-flag" />
            <TableCell id="patients-list-header-lastname">
              <TableSortLabel active={orderBy === "lastname"} direction={order} onClick={createSortHandler("lastname")}>
                {t("list-patient-lastname")}
              </TableSortLabel>
            </TableCell>
            <TableCell id="patients-list-header-firstname">
              <TableSortLabel active={orderBy === "firstname"} direction={order} onClick={createSortHandler("firstname")}>
                {t("list-patient-firstname")}
              </TableSortLabel>
            </TableCell>
            <TableCell id="patients-list-header-tir">{t("list-patient-tir")}</TableCell>
            <TableCell id="patients-list-header-avg-glucose">{t("list-patient-avg-glucose")}</TableCell>
            <TableCell id="patients-list-header-tbr">{t("list-patient-tbr")}</TableCell>
            <TableCell id="patients-list-header-upload">{t("list-patient-upload")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elems}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

class PatientListPage extends React.Component<RouteComponentProps, PatientListPageState> {
  private log: Console;

  constructor(props: RouteComponentProps) {
    super(props);

    this.log = bows("PatientListPage");

    const whoAmI = apiClient.whoami;
    this.state = {
      patients: null,
      flagged: whoAmI?.preferences?.patientsStarred ?? [],
      order: "asc",
      orderBy: "lastname",
    };

    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onFlagPatient = this.onFlagPatient.bind(this);
    this.onSortList = this.onSortList.bind(this);
  }

  public componentDidMount(): void {
    this.log.debug("Mounted");

    apiClient.getUserShares().then((patients: User[]) => {
      this.setState({ patients });
    }).catch((reason: unknown) => {
      this.log.error(reason);
    });
  }

  render(): JSX.Element | null {
    const { patients, flagged, order, orderBy } = this.state;
    let listPatients: JSX.Element | null = null;

    if (patients !== null) {
      listPatients = (
        <PatientsList
          patients={patients}
          flagged={flagged}
          order={order}
          orderBy={orderBy}
          onClickPatient={this.onSelectPatient}
          onFlagPatient={this.onFlagPatient}
          onSortList={this.onSortList} />
      );
    }
    return listPatients;
  }

  private onSelectPatient(user: User): void {
    this.log.info('Click on', user);
    globalHistory.navigate(`/hcp/patient/${user.userid}`);
  }

  private onFlagPatient(userId: string): void {
    apiClient.flagPatient(userId).then((flagged: string[]) => {
      this.setState({ flagged });
    });
  }

  /**
   * Compare two patient for sorting the patient table
   * @param a A patient
   * @param b A âtient
   * @param flagged Pinned patient
   * @param orderBy Sort field
   */
  private doCompare(a: User, b: User, orderBy: SortFields): number {
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
    const { patients, flagged } = this.state;

    patients?.sort((a: User, b: User): number => {
      const aFlagged = flagged.includes(a.userid);
      const bFlagged = flagged.includes(b.userid);
      // Flagged: always first
      if (aFlagged && !bFlagged) {
        return -1; // eslint-disable-line no-magic-numbers
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

    this.setState({ patients, order, orderBy });
  }
}

export default PatientListPage;
