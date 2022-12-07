/*
 * Copyright (c) 2022, Diabeloop
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

import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import EmailIcon from '@mui/icons-material/Email'
import Tooltip from '@mui/material/Tooltip'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FlagIcon from '@mui/icons-material/Flag'
import FlagOutlineIcon from '@mui/icons-material/FlagOutlined'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import { Box, Typography } from '@mui/material'

import IconActionButton from '../buttons/icon-action'
import { getMedicalValues } from './utils'
import { patientListCommonStyle } from './table'
import { StyledTableCell, StyledTableRow } from '../styled-components'
import PatientUtils from '../../lib/patient/patient.util'
import PersonRemoveIcon from '../icons/person-remove-icon'
import { isEllipsisActive } from '../../lib/utils'
import usePatientRow from './patient-row.hook'
import { useHistory } from 'react-router-dom'
import RemovePatientDialog from './remove-patient-dialog'
import EmailOpenIcon from '../icons/email-open-icon'
import RemoveDirectShareDialog from '../dialogs/remove-direct-share-dialog'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { PatientRowProps } from './models/patient-table-props.model'
import { MedicalData } from '../../lib/data/models/medical-data.model'
import { Patient } from '../../lib/patient/models/patient.model'
import { FilterType } from '../../lib/patient/models/enums/filter-type.enum'

const patientListStyle = makeStyles({ name: 'ylp-hcp-patients-row' })((theme: Theme) => {
  return {
    alert: {
      color: theme.palette.warning.main
    },
    alertIcon: {
      marginLeft: theme.spacing(2),
      verticalAlign: 'bottom'
    },
    coloredIcon: {
      color: theme.palette.primary.main
    },
    icon: {
      width: '56px',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconCell: {
      width: '56px',
      padding: 0
    },
    lightGrey: {
      color: theme.palette.grey[500]
    },
    remoteMonitoringCell: {
      whiteSpace: 'pre-line'
    },
    tableRow: {
      cursor: 'pointer',
      height: '64px'
    },
    typography: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
})

const PatientRow: FunctionComponent<PatientRowProps> = ({ patient, filter }) => {
  const historyHook = useHistory()
  const patientHook = usePatientContext()
  const { t } = useTranslation('yourloops')
  const { classes } = patientListStyle()
  const { classes: patientListCommonClasses } = patientListCommonStyle()
  const medicalData: MedicalData | null | undefined = patient.metadata.medicalData

  const [tooltipText, setTooltipText] = useState<string>('')
  const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null)

  const userId = patient.userid
  const email = patient.profile.email
  const patientFullName = patient.profile.fullName
  const hasPendingInvitation = PatientUtils.isInvitationPending(patient)
  const isAlreadyInATeam = PatientUtils.isInAtLeastATeam(patient)
  const hasUnreadMessages = patient.metadata.unreadMessagesSent > 0

  const userToRemove = {
    id: userId,
    fullName: patient.profile.fullName,
    email: patient.profile.email
  }

  const {
    computeRowInformation,
    flagPatient,
    trNA,
    isUserHcp,
    isUserCaregiver,
    isFlagged
  } = usePatientRow({ patient, classes })

  const {
    patientSystem,
    patientRemoteMonitoring,
    timeSpentAwayFromTargetActive,
    frequencyOfSevereHypoglycemiaActive,
    nonDataTransmissionActive,
    patientFullNameClasses,
    timeSpentAwayFromTargetRateClasses,
    frequencyOfSevereHypoglycemiaRateClasses,
    dataNotTransferredRateClasses
  } = computeRowInformation()

  const onClickFlag = async (event: React.MouseEvent): Promise<void> => {
    event.stopPropagation()
    await flagPatient()
  }

  const onClickRow = (): void => {
    historyHook.push(`/patient/${patient.userid}`)
  }

  const onClickRemovePatient = (event: React.MouseEvent): void => {
    event.stopPropagation()
    setPatientToRemove(patient)
  }

  const onCloseRemovePatientDialog = (): void => {
    setPatientToRemove(null)
  }

  const onCloseRemoveDirectShareDialog = (shouldRefresh?: boolean): void => {
    setPatientToRemove(null)

    if (shouldRefresh) {
      patientHook.refresh()
    }
  }

  const { lastUpload } = useMemo(() => getMedicalValues(medicalData, trNA), [medicalData, trNA])

  useEffect(() => {
    const userFullNameHtmlElement = document.getElementById(`${userId}-patient-full-name-value`)
    setTooltipText(isEllipsisActive(userFullNameHtmlElement) ? patientFullName : '')
  }, [patientFullName, userId])

  return (
    <React.Fragment>
      <StyledTableRow
        tabIndex={-1}
        hover
        onClick={hasPendingInvitation && !isAlreadyInATeam ? undefined : onClickRow}
        className={`${classes.tableRow} patients-list-row`}
        data-userid={userId}
        data-email={email}
        data-testid={`patient-row-${userId}`}
      >
        <StyledTableCell className={classes.iconCell}>
          {filter === FilterType.pending && hasPendingInvitation
            ? <Tooltip
              title={t('pending-invitation')}
              aria-label={t('pending-invitation')}
            >
              <Box display="flex">
                <AccessTimeIcon titleAccess="pending-icon" className={classes.icon} />
              </Box>
            </Tooltip>
            : <IconActionButton
              icon={isFlagged
                ? <FlagIcon
                  titleAccess="flag-icon-active"
                  aria-label="flag-icon-active"
                />
                : <FlagOutlineIcon
                  titleAccess="flag-icon-inactive"
                  aria-label="flag-icon-inactive"
                />}
              onClick={onClickFlag}
              className={`${!isFlagged ? classes.coloredIcon : ''} ${classes.icon} patient-flag-button`}
            />
          }
        </StyledTableCell>

        <StyledTableCell
          id={`${userId}-patient-full-name`}
          className={patientFullNameClasses}
        >
          <Tooltip title={tooltipText}>
            <Typography
              id={`${userId}-patient-full-name-value`}
              data-testid="patient-full-name-value"
              className={classes.typography}
            >
              {patientFullName}
            </Typography>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell className={classes.typography}>{patientSystem}</StyledTableCell>
        {isUserHcp &&
          <StyledTableCell
            className={`${classes.typography} ${patientListCommonClasses.mediumCell} ${classes.remoteMonitoringCell}`}>
            {patientRemoteMonitoring}
          </StyledTableCell>
        }

        <StyledTableCell className={timeSpentAwayFromTargetRateClasses}>
          {`${Math.round(patient.metadata.alarm.timeSpentAwayFromTargetRate * 10) / 10}%`}
          {isUserHcp && timeSpentAwayFromTargetActive &&
            <AnnouncementIcon titleAccess="time-away-alert-icon" className={classes.alertIcon} />}
        </StyledTableCell>

        <StyledTableCell className={frequencyOfSevereHypoglycemiaRateClasses}>
          {`${Math.round(patient.metadata.alarm.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
          {isUserHcp && frequencyOfSevereHypoglycemiaActive &&
            <AnnouncementIcon titleAccess="severe-hypo-alert-icon" className={classes.alertIcon} />}
        </StyledTableCell>

        <StyledTableCell className={dataNotTransferredRateClasses}>
          {`${Math.round(patient.metadata.alarm.nonDataTransmissionRate * 10) / 10}%`}
          {isUserHcp && nonDataTransmissionActive &&
            <AnnouncementIcon titleAccess="no-data-alert-icon" className={classes.alertIcon} />}
        </StyledTableCell>

        <StyledTableCell className={classes.typography}>
          {lastUpload}
        </StyledTableCell>

        {isUserHcp &&
          <StyledTableCell className={classes.iconCell}>
            <Tooltip
              title={t(hasUnreadMessages ? 'unread-messages' : 'no-new-messages')}
              aria-label={t(hasUnreadMessages ? 'unread-messages' : 'no-new-messages')}
            >
              <Box display="flex" justifyContent="center">
                {hasUnreadMessages
                  ? <EmailIcon titleAccess="unread-messages-icon" className={classes.coloredIcon} />
                  : <EmailOpenIcon className={classes.lightGrey} />
                }
              </Box>
            </Tooltip>
          </StyledTableCell>
        }

        <StyledTableCell>
          <Tooltip
            title={t('remove-patient')}
            aria-label={t('remove-patient')}
          >
            <Box>
              <IconActionButton
                ariaLabel={`${t('remove-patient')}-${patient.profile.email}`}
                icon={<PersonRemoveIcon />}
                onClick={onClickRemovePatient}
              />
            </Box>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>

      {patientToRemove && isUserHcp &&
        <RemovePatientDialog
          patient={patient}
          onClose={onCloseRemovePatientDialog}
        />
      }

      {patientToRemove && isUserCaregiver &&
        <RemoveDirectShareDialog
          userToRemove={userToRemove}
          onClose={onCloseRemoveDirectShareDialog}
        />
      }
    </React.Fragment>
  )
}

export default PatientRow
