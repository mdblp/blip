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

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonRemoveIcon from '../../../components/icons/mui/person-remove-icon'
import IconActionButton from '../../../components/buttons/icon-action'
import CertifiedProfessionalIcon from '../../../components/icons/certified-professional-icon'

import { type ShareUser } from '../../../lib/share/models/share-user.model'

import { getUserFirstName, getUserLastName } from '../../../lib/utils'
import { SortDirection, SortFields } from './types'
import RemoveDirectShareDialog from '../../../components/dialogs/remove-direct-share-dialog'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { useAuth } from '../../../lib/auth'

export interface CaregiverTableProps {
  caregivers: ShareUser[]
  fetchCaregivers: (userId: string) => void
}

const tableStyles = makeStyles({ name: 'ylp-patient-caregivers-table' })(() => {
  return {
    tableRowHeader: {
      textTransform: 'uppercase'
    },
    tableCellActions: {
      textAlign: 'right'
    }
  }
})

function compareUserShare(orderBy: SortFields, order: SortDirection, a: ShareUser, b: ShareUser): number {
  let value = 0

  if (a.status === UserInviteStatus.Pending && b.status === UserInviteStatus.Pending) {
    value = a.user.username.localeCompare(b.user.username)
    if (order === SortDirection.desc) {
      value = -value
    }
  } else if (a.status === UserInviteStatus.Pending) {
    value = 1
  } else if (b.status === UserInviteStatus.Pending) {
    value = -1
  } else {
    switch (orderBy) {
      case SortFields.firstname:
        value = getUserFirstName(a.user).localeCompare(getUserFirstName(b.user))
        break
      case SortFields.lastname:
        value = getUserLastName(a.user).localeCompare(getUserLastName(b.user))
        break
    }
    if (order === SortDirection.desc) {
      value = -value
    }
  }

  return value
}

function CaregiversTable(props: CaregiverTableProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()
  const { classes } = tableStyles()
  const [orderBy, setOrderBy] = React.useState<SortFields>(SortFields.lastname)
  const [order, setOrder] = React.useState<SortDirection>(SortDirection.asc)
  const [caregiverToRemove, setCaregiverToRemove] = useState<ShareUser | null>(null)

  const createSortHandler = (property: SortFields): (() => void) => {
    return (): void => {
      if (orderBy === property) {
        setOrder(order === SortDirection.asc ? SortDirection.desc : SortDirection.asc)
      } else {
        setOrder(SortDirection.asc)
        setOrderBy(property)
      }
    }
  }

  const onCloseRemoveCaregiverDialog = (shouldRefresh: boolean): void => {
    setCaregiverToRemove(null)
    if (shouldRefresh) {
      props.fetchCaregivers(user.id)
    }
  }

  props.caregivers.sort((a: ShareUser, b: ShareUser) => {
    return compareUserShare(orderBy, order, a, b)
  })

  const tableRows = props.caregivers.map((caregiver: ShareUser) => {
    const user = caregiver.user
    const userId = user.userid
    const userEmail = user.username
    const isPending = caregiver.status === UserInviteStatus.Pending

    const userToRemove = {
      id: userId,
      email: userEmail,
      fullName: `${getUserFirstName(user)} ${getUserLastName(user)}`
    }

    const onClickRemoveCaregiver = (event: React.MouseEvent): void => {
      event.stopPropagation()
      setCaregiverToRemove(caregiver)
    }

    return (
      <React.Fragment key={userId}>
        <TableRow
          key={userId}
          id={`patient-caregivers-table-row-${userId}`}
          data-userid={userId}
          data-testid={`patient-caregivers-table-row-${userEmail}`}
          data-status={caregiver.status}
        >
          <TableCell id={`patient-caregivers-table-row-${userId}-status`}>
            {isPending &&
              <Box display="flex">
                <Tooltip title={t('pending-invite')} aria-label={t('pending-invite')} placement="bottom">
                  <AccessTimeIcon id={`patient-caregivers-table-row-pendingicon-${userId}`} />
                </Tooltip>
              </Box>}
          </TableCell>
          <TableCell id={`patient-caregivers-table-row-${userId}-lastname`}>
            {isPending ? '-' : getUserLastName(user)}
          </TableCell>
          <TableCell id={`patient-caregivers-table-row-${userId}-firstname`}>
            {isPending ? '-' : getUserFirstName(user)}
          </TableCell>
          <TableCell id={`patient-caregivers-table-row-${userId}-email`}>
            <Box display="flex">
              {user.username}
              {user.idVerified && <CertifiedProfessionalIcon />}
            </Box>
          </TableCell>
          <TableCell id={`patient-caregivers-table-row-${userId}-actions`} className={classes.tableCellActions}>
            <IconActionButton
              icon={<PersonRemoveIcon />}
              id={`patient-caregivers-table-row-${userId}-button-remove`}
              aria-label={`${t('remove-caregiver')}-${userEmail}`}
              onClick={onClickRemoveCaregiver}
              tooltip={t('remove-caregiver')} />
          </TableCell>
        </TableRow>

        {caregiverToRemove && caregiverToRemove.user.userid === userId &&
          <RemoveDirectShareDialog
            userToRemove={userToRemove}
            onClose={onCloseRemoveCaregiverDialog}
          />
        }
      </React.Fragment>
    )
  })

  return (
    <TableContainer component={Paper} data-testid="patient-caregivers-list">
      <Table id="patient-caregivers-table" aria-label={t('aria-table-list-caregivers')} stickyHeader>
        <TableHead id="patient-caregivers-table-header">
          <TableRow id="patient-caregivers-table-header-row" className={classes.tableRowHeader}>
            <TableCell id="patient-caregivers-table-header-status" />
            <TableCell id="patient-caregivers-table-header-lastname">
              <TableSortLabel
                active={orderBy === 'lastname'}
                direction={order}
                onClick={createSortHandler(SortFields.lastname)}
              >
                {t('last-name')}
              </TableSortLabel>
            </TableCell>
            <TableCell id="patient-caregivers-table-header-firstname">
              <TableSortLabel
                active={orderBy === 'firstname'}
                direction={order}
                onClick={createSortHandler(SortFields.firstname)}
              >
                {t('first-name')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              {t('email')}
            </TableCell>
            <TableCell id="patient-caregivers-table-header-actions" />
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export default CaregiversTable
