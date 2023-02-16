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
import MedicalRecordEditDialog from '../../dialogs/medical-record-edit-dialog'
import MedicalRecordDeleteDialog from '../../dialogs/medical-record-delete-dialog'
import TrashCanOutlined from '../../icons/trash-can-outlined'
import { type CategoryProps } from './medical-files-widget'
import { commonComponentStyles } from '../../common'
import { useAlert } from '../../utils/snackbar'
import CenteredSpinningLoader from '../../loaders/centered-spinning-loader'
import { type MedicalRecord } from '../../../lib/medical-files/models/medical-record.model'
import ListItemButton from '@mui/material/ListItemButton'
import { type MedicalRecordDialogPayload } from '../models/medical-record-dialog-payload.model'

const useStyle = makeStyles()(() => ({
  categoryTitle: {
    fontWeight: 600
  },
  list: {
    maxHeight: 160,
    overflow: 'auto'
  }
}))

const MedicalRecordList: FunctionComponent<CategoryProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const { classes } = useStyle()
  const { teamId, patientId } = props
  const { user } = useAuth()
  const alert = useAlert()
  const { classes: commonStyles } = commonComponentStyles()
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [medicalRecordToEdit, setMedicalRecordToEdit] = useState<MedicalRecordDialogPayload | undefined>(undefined)
  const [medicalRecordToDelete, setMedicalRecordToDelete] = useState<MedicalRecordDialogPayload | undefined>(undefined)

  const closeMedicalRecordEditDialog = (): void => {
    setIsEditDialogOpen(false)
    setMedicalRecordToEdit(undefined)
  }

  const closeMedicalRecordDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false)
    setMedicalRecordToDelete(undefined)
  }

  const onDeleteMedicalRecord = (medicalRecord: MedicalRecord, medicalRecordName: string): void => {
    setMedicalRecordToDelete({ medicalRecord, medicalRecordName })
    setIsDeleteDialogOpen(true)
  }

  const onClickMedicalRecord = (medicalRecord: MedicalRecord, medicalRecordName: string): void => {
    setMedicalRecordToEdit({ medicalRecord, medicalRecordName })
    setIsEditDialogOpen(true)
  }

  const updateMedicalRecordList = (payload: MedicalRecord): void => {
    const index = medicalRecords.findIndex((mr) => mr.id === payload.id)
    if (index > -1) {
      medicalRecords.splice(index, 1, payload)
    } else {
      medicalRecords.push(payload)
    }
    closeMedicalRecordEditDialog()
  }

  const removeMedicalRecordFromList = (medicalRecordId: string): void => {
    const index = medicalRecords.findIndex((mr) => mr.id === medicalRecordId)
    medicalRecords.splice(index, 1)
    closeMedicalRecordDeleteDialog()
  }

  const buildFileName = (date: string, index: number): string => {
    const fileDate = date.substring(0, 10)
    const previousFileDate = index > 0 ? medicalRecords[index - 1].creationDate.substring(0, 10) : null
    return `${fileDate}${fileDate === previousFileDate ? `_${index}` : ''}`
  }

  useEffect(() => {
    if (!medicalRecords) {
      MedicalFilesApi.getMedicalRecords(patientId, teamId)
        .then(medicalRecords => {
          setMedicalRecords(medicalRecords)
        })
        .catch(() => {
          setMedicalRecords([])
          alert.error(t('medical-records-get-failed'))
        })
    }
    // We don't have exhaustive deps here because we want to run the effect only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        {t('medical-records')}
      </Typography>
      {medicalRecords
        ? <List className={classes.list}>
          {medicalRecords.map((medicalRecord, index) => {
            const medicalRecordName = buildFileName(medicalRecord.creationDate, index)
            return (
              <ListItem
                key={index}
                dense
                divider
                disablePadding
                secondaryAction={user.id === medicalRecord.authorId &&
                  <Tooltip title={t('delete-medical-record', { date: medicalRecordName })}>
                    <IconButton
                      data-testid="delete-medical-record"
                      edge="end"
                      size="small"
                      aria-label={t('delete-medical-record', { date: medicalRecordName })}
                      onClick={() => {
                        onDeleteMedicalRecord(medicalRecord, medicalRecordName)
                      }}
                    >
                      <TrashCanOutlined />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  onClick={() => {
                    onClickMedicalRecord(medicalRecord, medicalRecordName)
                  }}
                >
                  <ListItemIcon>
                    <DescriptionOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t('medical-record-pdf', { pdfName: medicalRecordName })}
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
        <MedicalRecordEditDialog
          {...props}
          medicalRecord={medicalRecordToEdit?.medicalRecord}
          medicalRecordName={medicalRecordToEdit?.medicalRecordName}
          onClose={closeMedicalRecordEditDialog}
          onSaved={updateMedicalRecordList}
        />
      }

      {isDeleteDialogOpen && medicalRecordToDelete &&
        <MedicalRecordDeleteDialog
          medicalRecord={medicalRecordToDelete.medicalRecord}
          medicalRecordName={medicalRecordToDelete.medicalRecordName}
          onClose={closeMedicalRecordDeleteDialog}
          onDelete={removeMedicalRecordFromList}
        />
      }
    </React.Fragment>
  )
}

export default MedicalRecordList
