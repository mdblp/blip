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
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlineIcon from "@material-ui/icons/FlagOutlined";

import { t } from "../../lib/language";
import apiClient from "../../lib/api";
import { User } from "../../models/shoreline";

interface PatientListProps {
  patients: User[];
  flagged: string[];
  onClickPatient: (user: User) => void;
  onFlagPatient: (userId: string) => void;
}

interface PatientListPageState {
  patients: null | User[];
  flagged: string[];
}

const patientListStyle = makeStyles((/* theme_or_props */) => {
  return {
    table: {
      width: "100%",
    },
    tableRow: {
      cursor: "pointer",
    },
  };
});


function PatientsList(props: PatientListProps): JSX.Element {
  const { patients, flagged, onClickPatient, onFlagPatient } = props;
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
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label={t("aria-table-list-patient")} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell id="patients-list-header-flag" />
            <TableCell id="patients-list-header-lastname">{t("list-patient-lastname")}</TableCell>
            <TableCell id="patients-list-header-firstname">{t("list-patient-firstname")}</TableCell>
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
    };

    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onFlagPatient = this.onFlagPatient.bind(this);
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
    const { patients, flagged } = this.state;
    let listPatients: JSX.Element | null = null;

    if (patients !== null) {
      listPatients = <PatientsList patients={patients} flagged={flagged} onClickPatient={this.onSelectPatient} onFlagPatient={this.onFlagPatient} />;
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
}

export default PatientListPage;
