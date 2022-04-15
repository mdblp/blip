/**
 * Copyright (c) 2021, Diabeloop
 * Patient list table for HCPs
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

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { styled, withTheme } from "@material-ui/styles";
import { TablePagination } from "@material-ui/core";

import { PatientTableSortFields, SortDirection } from "../../../models/generic";
import { PatientTableProps } from "./models";
import PatientRow from "./row";
import { Patient } from "../../../models/patient";

const patientListStyle = makeStyles(
  (theme: Theme) => {
    return {
      flagSort: {
        width: "100%",
        justifyContent: "center",
      },
      pagination: {
        "& .MuiTablePagination-spacer": {
          display: "none",
        },
        "& .MuiTablePagination-caption:last-of-type": {
          marginLeft: "auto",
        },
      },
      tableHeaderFlagIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: theme.spacing(7),
      },
      table: {
        width: "100%",
      },
      tableContainer: {
        borderRadius: "5px",
        boxShadow: "0px 1px 4px rgb(0 0 0 / 25%)",
      },
      tableRowHeader: {
        padding: 0,
      },
      tableCellHeader: {
        backgroundColor: "#FFF",
        fontSize: "15px",
        fontWeight: 600,
        height: "62px",
        padding: 0,
        paddingLeft: "11px",
      },
      alertTimeTargetHeader: {
        maxWidth: "210px",
      },
      tableHeaderFlag: {
        width: "56px",
        padding: 0,
      },
    };
  },
  { name: "ylp-hcp-patients-table" }
);

export const StyledTableCell = styled(withTheme(TableCell))((props) => ({
  "&": {
    border: "unset",
    borderRight: `0.5px solid ${(props.theme as Theme).palette.divider}`,
  },
}));

function PatientTable(props: PatientTableProps): JSX.Element {
  const {
    patients,
    flagged,
    order,
    filter,
    orderBy,
    onClickPatient,
    onFlagPatient,
    onSortList,
  } = props;
  const { t } = useTranslation("yourloops");
  const classes = patientListStyle();
  const [page, setPage] = React.useState<number>(0);
  const [rowPerPage, setRowPerPage] = React.useState<number>(10);
  const patientsToDisplay = patients.slice(page * rowPerPage, (page + 1) * rowPerPage);

  const patientsRows = patientsToDisplay.map(
    (patient: Patient): JSX.Element => (
      <PatientRow
        key={patient.userid}
        patient={patient}
        flagged={flagged}
        filter={filter}
        onClickPatient={onClickPatient}
        onFlagPatient={onFlagPatient}
      />
    )
  );

  const createSortHandler = (property: PatientTableSortFields): (() => void) => {
    return (/* event: React.MouseEvent */): void => {
      let newOrder = order;
      if (property === orderBy) {
        newOrder = order === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
      }
      onSortList(property, newOrder);
    };
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table id="patients-list-table" className={classes.table} aria-label={t("aria-table-list-patient")} stickyHeader>
          <TableHead>
            <TableRow className={classes.tableRowHeader}>
              <StyledTableCell id="patients-list-header-icon" className={`${classes.tableCellHeader} ${classes.tableHeaderFlag}`}>
                <TableSortLabel
                  id={`patients-list-header-flag${orderBy === PatientTableSortFields.flag ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.flag}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.flag)}
                  className={classes.flagSort}
                >
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell id="patients-list-header-full-name" className={classes.tableCellHeader}>
                <TableSortLabel
                  id={`patients-list-header-full-name-label${orderBy === PatientTableSortFields.patientFullName ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.patientFullName}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.patientFullName)}>
                  {t("patient")}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell id="patients-list-header-system" className={classes.tableCellHeader}>
                <TableSortLabel
                  id={`patients-list-header-system-label${orderBy === PatientTableSortFields.system ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.system}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.system)}>
                  {t("system")}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell id="patients-list-header-remote-monitoring" className={classes.tableCellHeader}>
                <TableSortLabel
                  id={`patients-list-header-remote-monitoring-label${orderBy === PatientTableSortFields.remoteMonitoring ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.remoteMonitoring}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.remoteMonitoring)}>
                  {t("remote-monitoring")}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell id="patients-list-header-alert-time-target" className={`${classes.tableCellHeader} ${classes.alertTimeTargetHeader}`}>
                <TableSortLabel
                  id={`patients-list-header-alert-time-target${orderBy === PatientTableSortFields.alertTimeTarget ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.alertTimeTarget}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.alertTimeTarget)}>
                  {t("alert-time-target")}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell id="patients-list-header-alert-hypoglycemic" className={classes.tableCellHeader}>
                <TableSortLabel
                  id={`patients-list-header-tir-alert-hypoglycemic${orderBy === PatientTableSortFields.alertHypoglycemic ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.alertHypoglycemic}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.alertHypoglycemic)}>
                  {t("alert-hypoglycemic")}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell id="patients-list-header-upload" className={classes.tableCellHeader}>
                <TableSortLabel
                  id={`patients-list-header-ldu-label${orderBy === PatientTableSortFields.ldu ? `-${order}` : ""}`}
                  active={orderBy === PatientTableSortFields.ldu}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.ldu)}>
                  {t("last-data-update")}
                </TableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{patientsRows}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={patients.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
        className={classes.pagination}
      />
    </div>
  );
}

export default PatientTable;
