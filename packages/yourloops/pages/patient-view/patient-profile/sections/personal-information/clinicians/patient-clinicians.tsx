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
import { getUserName } from '../../../../../../lib/auth/user.util'
import { RemoveClinicianDialog } from './remove-clinician-dialog'
import { AddClinicianDialog } from './add-clinician-dialog'
import { Clinician } from '../../../../../../lib/clinicians/models/clinician.model'
import { PatientProfile } from '../../../../../../lib/patient/models/patient-profile.model'
import Avatar from '@mui/material/Avatar'

interface PatientCliniciansProps {
  patientId: string
  patientProfile: PatientProfile
  clinicians: Clinician[]
}

const MAX_CLINICIANS_COUNT = 5

const useStyles = makeStyles()(() => ({
  tableHeader: {
    backgroundColor: 'var(--primary-color-background)'
  },
  hideLastBorder: {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }
}))

export const PatientClinicians: FC<PatientCliniciansProps> = (props) => {
  // const { patientId, patientProfile, clinicians } = props
  const { patientId, patientProfile } = props
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { user } = useAuth()

  const FAKE_CLINICIANS: Clinician[] = [
    {
      id: 'hcp-1',
      fullName: 'Dr. John Doe',
      profession: 'hcp-profession-diabeto',
      email: 'john.doe@mail.com'
    },
    {
      id: 'hcp-2',
      fullName: 'Dr. Mila Fly',
      profession: 'hcp-profession-other',
      email: 'mila.fly@mail.com'
    }
  ]

  // const cliniciansCount = clinicians?.length || 0
  const cliniciansCount = FAKE_CLINICIANS?.length || 0
  const hasClinicians = cliniciansCount > 0
  // const cliniciansSorted = hasClinicians && clinicians.toSorted((a, b) => a.fullName.localeCompare(b.fullName))
  const cliniciansSorted = hasClinicians && FAKE_CLINICIANS.toSorted((a, b) => a.fullName.localeCompare(b.fullName))

  // const clinicianIds = hasClinicians ? clinicians.map(clinician => clinician.id) : []
  const clinicianIds = hasClinicians ? FAKE_CLINICIANS.map(clinician => clinician.id) : []

  const isAddClinicianEnabled = cliniciansCount < MAX_CLINICIANS_COUNT

  const patientName = getUserName(patientProfile.firstName, patientProfile.lastName, patientProfile.fullName)

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false)
  const [clinicianToRemove, setClinicianToRemove] = useState<Clinician | null>(null)

  const getInitials = (clinicianFullname: string): string => {
    const splitName = clinicianFullname.split(' ')
    const firstInitial = splitName[0]?.charAt(0) || ''
    const secondInitial = splitName[1]?.charAt(0) || ''

    return `${firstInitial}${secondInitial}`
  }

  const onClickAdd = (): void => {
    setShowAddDialog(true)
  }

  const onCloseAddDialog = (): void => {
    setShowAddDialog(false)
  }

  const onClickRemove = (hcpId: string): void => {
    setShowRemoveDialog(true)

    // const clinician = clinicians?.find(hcp => hcp.id === hcpId) || null
    const clinician = FAKE_CLINICIANS?.find(hcp => hcp.id === hcpId) || null
    setClinicianToRemove(clinician)
  }

  const onCloseRemoveDialog = (): void => {
    setShowRemoveDialog(false)
  }

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between' }}
        data-testid="patient-clinicians"
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {t('lead-clinicians')}
        </Typography>
        <Tooltip
          title={t('too-many-clinicians-tooltip', { maxCliniciansCount: MAX_CLINICIANS_COUNT })}
          disableHoverListener={isAddClinicianEnabled}
        >
          {/* The span is needed to ensure the tooltip works when the button is disabled (MUI Tooltip doc) */}
          <span>
            <Button
              variant={cliniciansCount === 0 ? 'contained' : 'outlined'}
              disabled={!isAddClinicianEnabled}
              startIcon={<PersonAddIcon />}
              onClick={onClickAdd}
            >
            {t('add-clinician')}
          </Button>
          </span>
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="body1">{t('lead-clinicians-description')}</Typography>
      </Box>

      {
        hasClinicians &&
        <Card variant="outlined">
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
                {cliniciansSorted.map((clinician: Clinician) => (
                  <TableRow key={clinician.id} className={classes.hideLastBorder}>
                    <TableCell>
                      <Avatar sx={{ bgcolor: 'var(--text-color-secondary)' }}>
                        {getInitials(clinician.fullName)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{clinician.fullName}</TableCell>
                    <TableCell>{t(clinician.profession)}</TableCell>
                    <TableCell>{clinician.email}</TableCell>
                    <TableCell align="right" sx={{ py: 0 }}>
                      <IconActionButton
                        // data-testid={`${removePatientLabel} ${hcp.email}`}
                        // aria-label={`${removePatientLabel} ${hcp.email}`}
                        icon={<PersonRemoveIcon />}
                        color="inherit"
                        tooltip={t('button-remove-clinician')}
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
          clinicianIds={clinicianIds}
          user={user}
          onClose={onCloseAddDialog}
        />
      }

      {showRemoveDialog &&
        <RemoveClinicianDialog
          clinician={clinicianToRemove}
          patientInfo={{ id: patientId, name: patientName }}
          isUserPatient={user.isUserPatient()}
          onClose={onCloseRemoveDialog}
        />
      }
    </>
  )
}
