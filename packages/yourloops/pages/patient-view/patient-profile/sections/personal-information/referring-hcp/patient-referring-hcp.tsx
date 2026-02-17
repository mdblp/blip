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
import { Patient } from '../../../../../../lib/patient/models/patient.model'
import { getUserName } from '../../../../../../lib/auth/user.util'
import { RemoveReferrerDialog } from './remove-referrer-dialog'
import { AddReferrerDialog } from './add-referer-dialog'

interface PatientReferringHcpsProps {
  patient: Patient
  referrerCount: number
}

const MAX_REFERRER_COUNT = 5

const useStyles = makeStyles()(() => ({
  tableHeader: {
    backgroundColor: 'var(--primary-color-background)'
  }
}))

export const PatientReferringHcp: FC<PatientReferringHcpsProps> = (props) => {
  const { patient, referrerCount } = props
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { user } = useAuth()

  const isAddReferrerEnabled = referrerCount < MAX_REFERRER_COUNT
  const hasReferrers = referrerCount > 0

  const patientProfile = patient.profile
  const patientName = getUserName(patientProfile.firstName, patientProfile.lastName, patientProfile.fullName)

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false)

  const onClickAdd = (): void => {
    setShowAddDialog(true)
  }

  const onCloseAddDialog = (): void => {
    setShowAddDialog(false)
  }

  const onClickRemove = (hcpId: string): void => {
    setShowRemoveDialog(true)
  }

  const onCloseRemoveDialog = (): void => {
    setShowRemoveDialog(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {t('referring-hcp')}
        </Typography>
        <Tooltip
          title={t('too-many-referrers-tooltip', { maxReferrersCount: MAX_REFERRER_COUNT })}
          disableHoverListener={isAddReferrerEnabled}
        >
          {/* The span is needed to ensure the tooltip works when the button is disabled (MUI Tooltip doc) */}
          <span>
            <Button
              variant={referrerCount === 0 ? 'contained' : 'outlined'}
              disabled={!isAddReferrerEnabled}
              startIcon={<PersonAddIcon />}
              onClick={onClickAdd}
            >
            {t('add-referring-hcp')}
          </Button>
          </span>
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="body1">{t('referring-hcp-description')}</Typography>
      </Box>

      {
        hasReferrers &&
        <Card variant="outlined">
          <TableContainer>
            <Table>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell>{t('name')}</TableCell>
                  <TableCell>{t('profession')}</TableCell>
                  <TableCell>{t('email')}</TableCell>
                  <TableCell align="right">{t('actions')}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Profession</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">
                    <IconActionButton
                      // data-testid={`${removePatientLabel} ${patient.profile.email}`}
                      // aria-label={`${removePatientLabel} ${patient.profile.email}`}
                      icon={<PersonRemoveIcon />}
                      color="inherit"
                      tooltip={t('button-remove-referrer')}
                      onClick={() => {
                        onClickRemove('hcpId')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      }

      {showAddDialog &&
        <AddReferrerDialog
          patientName={patientName}
          user={user}
          onClose={onCloseAddDialog}
        />
      }

      {showRemoveDialog &&
        <RemoveReferrerDialog
          referrerName={"HCP NAME"}
          patientName={patientName}
          user={user}
          onClose={onCloseRemoveDialog}
        />
      }
    </>
  )
}
