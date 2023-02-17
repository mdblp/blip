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

import React, { type FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useAuth } from '../../../lib/auth'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import MedicalReportEditDialog from '../../dialogs/medical-report-edit-dialog'
import MedicalReportDeleteDialog from '../../dialogs/medical-report-delete-dialog'
import TrashCanOutlined from '../../icons/trash-can-outlined'
import { type CategoryProps } from './medical-files-widget'
import { commonComponentStyles } from '../../common'
import { useAlert } from '../../utils/snackbar'
import CenteredSpinningLoader from '../../loaders/centered-spinning-loader'
import { type MedicalReportDialogPayload, type MedicalReport } from '../../../lib/medical-files/models/medical-report.model'
import ListItemButton from '@mui/material/ListItemButton'

const useStyle = makeStyles()(() => ({
  categoryTitle: {
    fontWeight: 600
  },
  list: {
    maxHeight: 160,
    overflow: 'auto'
  }
}))

const MedicalReportList: FunctionComponent<CategoryProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const { classes } = useStyle()
  const { teamId, patientId } = props
  const { user } = useAuth()
  const alert = useAlert()
  const { classes: commonStyles } = commonComponentStyles()
  const [medicalReports, setMedicalReports] = useState<MedicalReport[] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [medicalReportToEdit, setMedicalReportToEdit] = useState<MedicalReportDialogPayload | undefined>(undefined)
  const [medicalReportToDelete, setMedicalReportToDelete] = useState<MedicalReportDialogPayload | undefined>(undefined)

  const closeMedicalReportEditDialog = (): void => {
    setIsEditDialogOpen(false)
    setMedicalReportToEdit(undefined)
  }

  const closeMedicalReportDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false)
    setMedicalReportToDelete(undefined)
  }

  const onDeleteMedicalReport = (medicalReport: MedicalReport, medicalReportName: string): void => {
    setMedicalReportToDelete({ medicalReport, medicalReportDate: medicalReportName })
    setIsDeleteDialogOpen(true)
  }

  const onClickMedicalReport = (medicalReport: MedicalReport, medicalReportName: string): void => {
    setMedicalReportToEdit({ medicalReport, medicalReportDate: medicalReportName })
    setIsEditDialogOpen(true)
  }

  const updateMedicalReportList = (payload: MedicalReport): void => {
    const index = medicalReports.findIndex((mr) => mr.id === payload.id)
    if (index > -1) {
      medicalReports.splice(index, 1, payload)
    } else {
      medicalReports.push(payload)
    }
    closeMedicalReportEditDialog()
  }

  const removeMedicalReportFromList = (medicalReportId: string): void => {
    const index = medicalReports.findIndex((mr) => mr.id === medicalReportId)
    medicalReports.splice(index, 1)
    closeMedicalReportDeleteDialog()
  }

  const buildMedicalReportDate = (date: string, index: number): string => {
    const medicalReportDate = date.substring(0, 10)
    const previousFileDate = index > 0 ? medicalReports[index - 1].creationDate.substring(0, 10) : null
    return `${medicalReportDate}${medicalReportDate === previousFileDate ? `_${index}` : ''}`
  }

  useEffect(() => {
    if (!medicalReports) {
      MedicalFilesApi.getMedicalReports(patientId, teamId)
        .then(medicalReports => {
          setMedicalReports(medicalReports)
        })
        .catch(() => {
          setMedicalReports([])
          alert.error(t('medical-reports-get-failed'))
        })
    }
    // We don't have exhaustive deps here because we want to run the effect only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        {t('medical-reports')}
      </Typography>
      {medicalReports
        ? <List className={classes.list}>
          {medicalReports.map((medicalReport, index) => {
            const medicalReportDate = buildMedicalReportDate(medicalReport.creationDate, index)
            const isUserAuthor = user.id === medicalReport.authorId
            return (
              <ListItem
                key={index}
                dense
                divider
                disablePadding
                secondaryAction={isUserAuthor &&
                  <Tooltip title={t('delete-medical-report', { date: medicalReportDate })}>
                    <IconButton
                      data-testid="delete-medical-report"
                      edge="end"
                      size="small"
                      aria-label={t('delete-medical-report', { date: medicalReportDate })}
                      onClick={() => {
                        onDeleteMedicalReport(medicalReport, medicalReportDate)
                      }}
                    >
                      <TrashCanOutlined />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  onClick={() => {
                    onClickMedicalReport(medicalReport, medicalReportDate)
                  }}
                >
                  <ListItemIcon>
                    <DescriptionOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t('medical-report-pdf', { date: medicalReportDate })}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
        : <CenteredSpinningLoader size={20} />
      }

      {user.isUserHcp() &&
        <Box display="flex" justifyContent="end" marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disableElevation
            className={commonStyles.button}
            startIcon={<NoteAddIcon />}
            onClick={() => {
              setIsEditDialogOpen(true)
            }}
          >
            {t('new')}
          </Button>
        </Box>
      }

      {isEditDialogOpen &&
        <MedicalReportEditDialog
          {...props}
          medicalReport={medicalReportToEdit?.medicalReport}
          medicalReportDate={medicalReportToEdit?.medicalReportDate}
          onClose={closeMedicalReportEditDialog}
          onSaved={updateMedicalReportList}
        />
      }

      {isDeleteDialogOpen && medicalReportToDelete &&
        <MedicalReportDeleteDialog
          medicalReport={medicalReportToDelete.medicalReport}
          medicalReportDate={medicalReportToDelete.medicalReportDate}
          onClose={closeMedicalReportDeleteDialog}
          onDelete={removeMedicalReportFromList}
        />
      }
    </React.Fragment>
  )
}

export default MedicalReportList
