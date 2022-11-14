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

import React from 'react'
import { useTranslation } from 'react-i18next'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { TablePagination, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'

import { PatientTableSortFields, SortDirection } from '../../models/generic'
import { PatientTableProps } from './models'
import PatientRow from './patient-row'
import { Patient } from '../../lib/data/patient'
import { StyledTableCell, StyledTooltip } from '../styled-components'
import { useAuth } from '../../lib/auth'

const patientListStyle = makeStyles(
  (theme: Theme) => {
    return {
      flagSort: {
        width: '100%',
        justifyContent: 'center'
      },
      pagination: {
        '& .MuiTablePagination-spacer': {
          display: 'none'
        },
        '& .MuiTablePagination-caption:last-of-type': {
          marginLeft: 'auto'
        }
      },
      infoIcon: {
        marginLeft: theme.spacing(1),
        marginRight: '2px'
      },
      tableContainer: {
        boxShadow: theme.shadows[2]
      },
      tableRowHeader: {
        padding: 0,
        height: '62px'
      },
      tableCellHeader: {
        backgroundColor: theme.palette.common.white,
        fontSize: '15px',
        fontWeight: 600,
        padding: 0,
        paddingLeft: '11px'
      },
      alertTimeTargetHeader: {
        maxWidth: '210px'
      },
      tableHeaderIcon: {
        width: '56px',
        padding: 0
      }
    }
  },
  { name: 'ylp-hcp-patients-table' }
)
export const patientListCommonStyle = makeStyles(() => {
  return {
    largeCell: {
      maxWidth: '300px'
    },
    mediumCell: {
      maxWidth: '200px'
    }
  }
}
)

function PatientTable(props: PatientTableProps): JSX.Element {
  const {
    patients,
    order,
    filter,
    orderBy,
    onSortList
  } = props
  const { t } = useTranslation('yourloops')
  const classes = patientListStyle()
  const patientListCommonClasses = patientListCommonStyle()
  const authHook = useAuth()
  const isUserHcp = authHook.user?.isUserHcp()
  const [page, setPage] = React.useState<number>(0)
  const [rowPerPage, setRowPerPage] = React.useState<number>(10)
  const patientsToDisplay = patients.slice(page * rowPerPage, (page + 1) * rowPerPage)

  const createSortHandler = (property: PatientTableSortFields): (() => void) => {
    return (): void => {
      let newOrder = order
      if (property === orderBy) {
        newOrder = order === SortDirection.asc ? SortDirection.desc : SortDirection.asc
      }
      onSortList(property, newOrder)
    }
  }

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setRowPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <React.Fragment>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table
          id="patients-list-table"
          aria-label={t('aria-table-list-patient')}
          stickyHeader
        >
          <TableHead>
            <TableRow className={classes.tableRowHeader}>
              <StyledTableCell
                id="patients-list-header-icon"
                className={`${classes.tableCellHeader} ${classes.tableHeaderIcon}`}
              >
                <TableSortLabel
                  id={`patients-list-header-flag${orderBy === PatientTableSortFields.flag ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.flag}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.flag)}
                  className={classes.flagSort}
                >
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                id="patients-list-header-full-name"
                data-testid="patient-list-header-full-name"
                className={`${classes.tableCellHeader} ${patientListCommonClasses.largeCell}`}
              >
                <TableSortLabel
                  id={`patients-list-header-full-name-label${orderBy === PatientTableSortFields.patientFullName ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.patientFullName}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.patientFullName)}>
                  {t('patient')}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                id="patients-list-header-system"
                className={classes.tableCellHeader}
              >
                <TableSortLabel
                  id={`patients-list-header-system-label${orderBy === PatientTableSortFields.system ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.system}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.system)}>
                  {t('system')}
                </TableSortLabel>
              </StyledTableCell>
              {isUserHcp &&
                <StyledTableCell
                  id="patients-list-header-remote-monitoring"
                  className={`${classes.tableCellHeader} ${patientListCommonClasses.mediumCell}`}
                >
                  <TableSortLabel
                    id={`patients-list-header-remote-monitoring-label${orderBy === PatientTableSortFields.remoteMonitoring ? `-${order}` : ''}`}
                    active={orderBy === PatientTableSortFields.remoteMonitoring}
                    direction={order}
                    onClick={createSortHandler(PatientTableSortFields.remoteMonitoring)}>
                    {t('remote-monitoring')}
                  </TableSortLabel>
                </StyledTableCell>
              }
              <StyledTableCell
                id="patients-list-header-alert-time-target"
                className={`${classes.tableCellHeader} ${classes.alertTimeTargetHeader} ${patientListCommonClasses.mediumCell}`}
              >
                <TableSortLabel
                  id={`patients-list-header-alert-time-target${orderBy === PatientTableSortFields.alertTimeTarget ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.alertTimeTarget}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.alertTimeTarget)}>
                  {t('time-out-of-range-target')}
                  <StyledTooltip
                    title={
                      <Typography color="inherit">{t('time-out-of-range-target-tooltip')}</Typography>
                    }
                    arrow
                  >
                    <InfoIcon className={classes.infoIcon} color="primary" />
                  </StyledTooltip>
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                id="patients-list-header-alert-hypoglycemic"
                className={`${classes.tableCellHeader} ${patientListCommonClasses.mediumCell}`}
              >
                <TableSortLabel
                  id={`patients-list-header-tir-alert-hypoglycemic${orderBy === PatientTableSortFields.alertHypoglycemic ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.alertHypoglycemic}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.alertHypoglycemic)}>
                  {t('alert-hypoglycemic')}
                  <StyledTooltip
                    title={
                      <Typography color="inherit">{t('hypoglycemia-tooltip')}</Typography>
                    }
                    arrow
                  >
                    <InfoIcon className={classes.infoIcon} color="primary" />
                  </StyledTooltip>
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                id="patients-list-header-data-not-transferred"
                className={`${classes.tableCellHeader} ${patientListCommonClasses.mediumCell}`}
              >
                <TableSortLabel
                  id={`patients-list-header-data-not-transferred${orderBy === PatientTableSortFields.dataNotTransferred ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.dataNotTransferred}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.dataNotTransferred)}>
                  {t('data-not-transferred')}
                  <StyledTooltip
                    title={
                      <Typography color="inherit">{t('data-not-transferred-tooltip')}</Typography>
                    }
                    arrow
                  >
                    <InfoIcon className={classes.infoIcon} color="primary" />
                  </StyledTooltip>
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                id="patients-list-header-upload"
                className={classes.tableCellHeader}
              >
                <TableSortLabel
                  id={`patients-list-header-ldu-label${orderBy === PatientTableSortFields.ldu ? `-${order}` : ''}`}
                  active={orderBy === PatientTableSortFields.ldu}
                  direction={order}
                  onClick={createSortHandler(PatientTableSortFields.ldu)}>
                  {t('last-data-update')}
                </TableSortLabel>
              </StyledTableCell>
              {isUserHcp &&
                <React.Fragment>
                  <StyledTableCell
                    id="patients-list-message-icon"
                    className={`${classes.tableCellHeader} ${classes.tableHeaderIcon}`}
                  />
                  <StyledTableCell
                    id="patients-list-remove-icon"
                    className={`${classes.tableCellHeader} ${classes.tableHeaderIcon}`}
                  />
                </React.Fragment>
              }
            </TableRow>
          </TableHead>
          <TableBody id="patient-table-body-id" data-testid="patient-table-body">
            {patientsToDisplay.map(
              (patient: Patient): JSX.Element => (
                <PatientRow
                  key={patient.userid}
                  patient={patient}
                  filter={filter}
                />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        id="patient-table-pagination-id"
        component="div"
        count={patients.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('rows-per-page')}
        className={classes.pagination}
      />
    </React.Fragment>
  )
}

export default PatientTable
