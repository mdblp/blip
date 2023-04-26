/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useAuth } from '../../../lib/auth'
import TrashCanOutlined from '../../icons/trash-can-outlined'
import { type MedicalReport } from '../../../lib/medical-files/models/medical-report.model'
import ListItemButton from '@mui/material/ListItemButton'
import { getMedicalReportDate } from './medical-report-list.util'
import { useTeam } from '../../../lib/team'
import { getUserName } from '../../../lib/auth/user.util'

interface MedicalReportItemProps {
  displayDivider: boolean
  medicalReport: MedicalReport
  onClickMedicalReport: (medicalReport: MedicalReport) => void
  onDeleteMedicalReport: (medicalReport: MedicalReport, teamName: string) => void
}

const useStyle = makeStyles()((theme) => ({
  reportNameItem: {
    paddingRight: theme.spacing(2)
  },
  secondaryText: {
    display: 'flex',
    flexDirection: 'column'
  }
}))

export const MedicalReportItem: FunctionComponent<MedicalReportItemProps> = (props) => {
  const { displayDivider, medicalReport, onClickMedicalReport, onDeleteMedicalReport } = props

  const { t } = useTranslation('yourloops')
  const { classes } = useStyle()
  const { user } = useAuth()
  const { getTeam } = useTeam()

  const medicalReportDate = getMedicalReportDate(medicalReport)
  const medicalReportNumber = medicalReport.number
  const isUserAuthor = user.id === medicalReport.authorId
  const authorName = getUserName(medicalReport.authorFirstName, medicalReport.authorLastName, '')
  const createdBy = authorName.length > 0 ? t('created-by', { name: authorName }) : t('created-by-unknown')
  const teamName = getTeam(medicalReport.teamId)?.name ?? medicalReport.teamName
  const deleteMedicalReportLabel = t('delete-medical-report-number', {
    number: medicalReportNumber,
    name: teamName
  })

  return (
    <ListItem
      data-testid="medical-report-item"
      dense
      divider={displayDivider}
      disablePadding
      secondaryAction={
        isUserAuthor &&
        <Tooltip title={deleteMedicalReportLabel}>
          <IconButton
            data-testid="delete-medical-report"
            edge="end"
            size="small"
            aria-label={deleteMedicalReportLabel}
            onClick={() => {
              onDeleteMedicalReport(medicalReport, teamName)
            }}
          >
            <TrashCanOutlined />
          </IconButton>
        </Tooltip>
      }
    >
      <ListItemButton
        onClick={() => {
          onClickMedicalReport(medicalReport)
        }}
      >
        <ListItemIcon>
          <DescriptionOutlinedIcon />
        </ListItemIcon>
        <Box display="flex" justifyContent="space-between" width="100%">
          <ListItemText
            className={classes.reportNameItem}
            primary={
              <>
                <Typography component="span" variant="subtitle2" className="bold">
                  {t('medical-report')}-{medicalReport.number}&nbsp;
                </Typography>
                <Typography component="span" variant="caption" alignSelf="center">
                  {medicalReportDate}
                </Typography>
              </>
            }
            secondary={
              <span className={classes.secondaryText}>
                <Typography component="span" variant="caption" color="text.secondary">
                  {createdBy}
                </Typography>
                <Typography component="span" fontSize="12px" color="text.secondary">
                  {teamName}
                </Typography>
              </span>
            }
          />
        </Box>
      </ListItemButton>
    </ListItem>
  )
}
