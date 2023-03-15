/*
 * Copyright (c) 2021-2023, Diabeloop
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

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { TablePagination, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

import PatientRow from './patient-row'
import { StyledTableCell, StyledTooltip } from '../styled-components'
import { useAuth } from '../../lib/auth'
import { type PatientTableProps } from './models/patient-table-props.model'
import { PatientTableSortFields } from './models/enums/patient-table-sort-fields.enum'
import { type Patient } from '../../lib/patient/models/patient.model'
import { SortDirection } from './models/enums/sort-direction.enum'
import { useTeam } from '../../lib/team'

const patientListStyle = makeStyles({ name: 'ylp-hcp-patients-table' })((theme: Theme) => {
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
})

export const patientListCommonStyle = makeStyles()(() => {
  return {
    largeCell: {
      maxWidth: '300px'
    },
    mediumCell: {
      maxWidth: '200px'
    }
  }
})

function PatientTable(props: PatientTableProps): JSX.Element {
  const {
    patients,
    order,
    filter,
    orderBy,
    onSortList
  } = props
  const { t } = useTranslation('yourloops')
  const { classes } = patientListStyle()
  const { classes: patientListCommonClasses } = patientListCommonStyle()
  const authHook = useAuth()
  const { getRemoteMonitoringTeams } = useTeam()
  const isUserHcp = authHook.user?.isUserHcp()
  const loggedUserIsHcpInMonitoring = !!(isUserHcp && getRemoteMonitoringTeams().find(team => team.members.find(member => member.userId === authHook.user?.id)))
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
              {loggedUserIsHcpInMonitoring &&
                <StyledTableCell
                  id="patients-list-message-icon"
                  className={`${classes.tableCellHeader} ${classes.tableHeaderIcon}`}
                />
              }
              <StyledTableCell
                id="patients-list-remove-icon"
                className={`${classes.tableCellHeader} ${classes.tableHeaderIcon}`}
              />
            </TableRow>
          </TableHead>
          <TableBody id="patient-table-body-id" data-testid="patient-table-body">
            {patientsToDisplay.map(
              (patient: Patient): JSX.Element => (
                <PatientRow
                  key={patient.userid}
                  loggedUserIsHcpInMonitoring={loggedUserIsHcpInMonitoring}
                  filter={filter}
                  patient={patient}
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