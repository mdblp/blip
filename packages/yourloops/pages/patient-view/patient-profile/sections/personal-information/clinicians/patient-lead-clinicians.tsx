/*
 * Copyright (c) 2026, Diabeloop
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

import React, { FC, useState } from 'react'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '@mui/material'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import { makeStyles } from 'tss-react/mui'
import TableBody from '@mui/material/TableBody'
import PersonRemoveIcon from '../../../../../../components/icons/mui/person-remove-icon'
import IconActionButton from '../../../../../../components/buttons/icon-action'
import Tooltip from '@mui/material/Tooltip'
import { useAuth } from '../../../../../../lib/auth'
import { getInitials, getUserName } from '../../../../../../lib/auth/user.util'
import { RemoveClinicianDialog } from './remove-clinician-dialog/remove-clinician-dialog'
import { AddClinicianDialog } from './add-clinician-dialog/add-clinician-dialog'
import { LeadClinician } from '../../../../../../lib/lead-clinicians/models/lead-clinician.model'
import { PatientProfile } from '../../../../../../lib/patient/models/patient-profile.model'
import Avatar from '@mui/material/Avatar'
import { usePatientsContext } from '../../../../../../lib/patient/patients.provider'
import SpinningLoader from '../../../../../../components/loaders/spinning-loader'
import { usePatient } from '../../../../../../lib/patient/patient.provider'

interface PatientLeadCliniciansProps {
  patientId: string
  patientProfile: PatientProfile
  leadClinicians: LeadClinician[]
}

const MAX_LEAD_CLINICIANS_COUNT = 5

const useStyles = makeStyles()(() => ({
  tableHeader: {
    backgroundColor: 'var(--primary-color-background)'
  },
  hideLastBorder: {
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }
}))

export const PatientLeadClinicians: FC<PatientLeadCliniciansProps> = (props) => {
  const { patientId, patientProfile, leadClinicians } = props
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { user } = useAuth()
  const { refresh: refreshHcp, refreshInProgress: refreshInProgressHcp } = usePatientsContext()
  const { refresh: refreshPatient, refreshInProgress: refreshInProgressPatient } = usePatient()

  const leadCliniciansCount = leadClinicians?.length || 0
  const hasLeadClinicians = leadCliniciansCount > 0
  const leadCliniciansSorted = hasLeadClinicians && leadClinicians.toSorted((a, b) => a.name?.localeCompare(b.name))

  const leadClinicianIds = hasLeadClinicians ? leadClinicians.map(clinician => clinician.id) : []

  const isAddClinicianEnabled = leadCliniciansCount < MAX_LEAD_CLINICIANS_COUNT

  const patientName = getUserName(patientProfile.firstName, patientProfile.lastName, patientProfile.fullName)

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false)
  const [clinicianToRemove, setClinicianToRemove] = useState<LeadClinician>(null)

  const isPatient = user.isUserPatient()
  const refresh = isPatient ? refreshPatient : refreshHcp
  const refreshInProgress = isPatient ? refreshInProgressPatient : refreshInProgressHcp

  const onClickAdd = (): void => {
    setShowAddDialog(true)
  }

  const onSuccessAdd = (): void => {
    onCloseAddDialog()
    refresh()
  }

  const onCloseAddDialog = (): void => {
    setShowAddDialog(false)
  }

  const onClickRemove = (hcpId: string): void => {
    const clinician = leadClinicians?.find(hcp => hcp.id === hcpId) || null
    setClinicianToRemove(clinician)
    setShowRemoveDialog(true)
  }

  const onSuccessRemove = (): void => {
    onCloseRemoveDialog()
    refresh()
  }

  const onCloseRemoveDialog = (): void => {
    setShowRemoveDialog(false)
  }

  return (
    <Box data-testid="patient-clinicians">
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          variant="h6"
          sx={{ marginBottom: 2 }}
          data-testid="patient-clinicians-title"
        >
          {t('lead-clinicians')}
        </Typography>
        <Tooltip
          title={t('too-many-clinicians-tooltip', { maxCliniciansCount: MAX_LEAD_CLINICIANS_COUNT })}
          disableHoverListener={isAddClinicianEnabled}
        >
          {/* The span is needed to ensure the tooltip works when the button is disabled (MUI Tooltip doc) */}
          <span>
            <Button
              variant={leadCliniciansCount === 0 ? 'contained' : 'outlined'}
              disabled={!isAddClinicianEnabled}
              startIcon={<PersonAddIcon />}
              onClick={onClickAdd}
              data-testid="add-clinician-button"
            >
            {t('add-clinician')}
          </Button>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography
          variant="body1"
          data-testid="patient-clinicians-description"
        >{t('lead-clinicians-description')}</Typography>
      </Box>

      {hasLeadClinicians && refreshInProgress &&
        <SpinningLoader />
      }

      {hasLeadClinicians && !refreshInProgress &&
          <Card variant="outlined" data-testid="clinicians-table">
            <TableContainer>
              <Table>
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>{t('name')}</TableCell>
                    <TableCell>{t('profession')}</TableCell>
                    <TableCell>{t('email')}</TableCell>
                    <TableCell align="right">{t('actions')}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {leadCliniciansSorted.map((clinician: LeadClinician) => (
                    <TableRow
                      key={clinician.id}
                      className={classes.hideLastBorder}
                      data-testid={`clinician-row-${clinician.name}`}
                    >
                      <TableCell>
                        {
                          getInitials(clinician.name) &&
                          <Avatar sx={{ bgcolor: 'var(--dark-blue-main)' }}>
                            {getInitials(clinician.name)}
                          </Avatar>
                        }
                      </TableCell>
                      <TableCell>{clinician.name || t('N/A')}</TableCell>
                      <TableCell>{t(clinician.profession)}</TableCell>
                      <TableCell>{clinician.email}</TableCell>
                      <TableCell align="right" sx={{ py: 0 }}>
                        <IconActionButton
                          icon={<PersonRemoveIcon />}
                          color="inherit"
                          tooltip={t('button-remove-clinician')}
                          aria-label={t('button-remove-clinician-named', { clinicianName: clinician.name })}
                          data-testid="remove-clinician-button"
                          onClick={() => {
                            onClickRemove(clinician.id)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
      }

      {showAddDialog &&
        <AddClinicianDialog
          patientInfo={{ id: patientId, name: patientName }}
          clinicianIds={leadClinicianIds}
          user={user}
          onClose={onCloseAddDialog}
          onSuccess={onSuccessAdd}
        />
      }

      {showRemoveDialog && clinicianToRemove &&
        <RemoveClinicianDialog
          clinician={clinicianToRemove}
          patientInfo={{ id: patientId, name: patientName }}
          isUserPatient={user.isUserPatient()}
          onClose={onCloseRemoveDialog}
          onSuccess={onSuccessRemove}
        />
      }
    </Box>
  )
}
