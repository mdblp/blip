/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type FunctionComponent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'

import { useAuth } from '../../../lib/auth'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import MedicalReportEditDialog from '../../dialogs/medical-report-edit-dialog'
import MedicalReportDeleteDialog from '../../dialogs/medical-report-delete-dialog'
import { type CategoryProps } from './medical-files-card'
import { useAlert } from '../../utils/snackbar'
import SpinningLoader from '../../loaders/spinning-loader'
import {
  type MedicalReport,
  type MedicalReportDeleteDialogPayload
} from '../../../lib/medical-files/models/medical-report.model'
import { getSortedMedicalReports } from './medical-report-list.util'
import { MedicalReportItem } from './medical-report-item'
import Typography from '@mui/material/Typography'
import { logError } from '../../../utils/error.util'
import { errorTextFromException } from '../../../lib/utils'

const useStyle = makeStyles()(() => ({
  categoryTitle: {
    fontWeight: 600
  },
  list: {
    paddingTop: 0,
    maxHeight: 360,
    overflow: 'auto'
  }
}))

const MedicalReportList: FunctionComponent<CategoryProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const { classes } = useStyle()
  const { teamId, patientId } = props
  const { user } = useAuth()
  const alert = useAlert()
  const [medicalReports, setMedicalReports] = useState<MedicalReport[] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [medicalReportToEdit, setMedicalReportToEdit] = useState<MedicalReport | undefined>(undefined)
  const [medicalReportToDelete, setMedicalReportToDelete] = useState<MedicalReportDeleteDialogPayload | undefined>(undefined)
  const shouldMakeInitialApiCallToFetchMedicalReports = useRef(true)
  const emptyListLabel = user.isUserHcp() ? t('no-medical-files-hcp') : t('no-medical-files-patient')

  const closeMedicalReportEditDialog = (): void => {
    setIsEditDialogOpen(false)
    setMedicalReportToEdit(undefined)
  }

  const closeMedicalReportDeleteDialog = (): void => {
    setMedicalReportToDelete(undefined)
  }

  const onDeleteMedicalReport = (medicalReport: MedicalReport, teamName: string): void => {
    setMedicalReportToDelete({ medicalReport, teamName })
  }

  const onClickMedicalReport = (medicalReport: MedicalReport): void => {
    setMedicalReportToEdit(medicalReport)
    setIsEditDialogOpen(true)
  }

  const updateMedicalReportList = (payload: MedicalReport): void => {
    const index = medicalReports.findIndex((medicalReport) => medicalReport.id === payload.id)
    const medicalReportsUpdated = Array.from(medicalReports)
    if (index > -1) {
      medicalReportsUpdated.splice(index, 1, payload)
    } else {
      medicalReportsUpdated.push(payload)
    }
    setMedicalReports(medicalReportsUpdated)
    closeMedicalReportEditDialog()
  }

  const removeMedicalReportFromList = (medicalReportId: string): void => {
    const index = medicalReports.findIndex((mr) => mr.id === medicalReportId)
    medicalReports.splice(index, 1)
    closeMedicalReportDeleteDialog()
  }

  useEffect(() => {
    if (!medicalReports && shouldMakeInitialApiCallToFetchMedicalReports.current) {
      shouldMakeInitialApiCallToFetchMedicalReports.current = false
      MedicalFilesApi.getMedicalReports(patientId, teamId)
        .then(medicalReports => {
          setMedicalReports(medicalReports)
        })
        .catch((err) => {
          const errorMessage = errorTextFromException(err)
          logError(errorMessage, 'get-medical-reports')

          setMedicalReports([])
          alert.error(t('medical-reports-get-failed'))
        })
    }
    // We don't have exhaustive deps here because we want to run the effect only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      {medicalReports
        ? medicalReports.length === 0
          ? <Typography color="text.secondary">{emptyListLabel}</Typography>
          : <List className={classes.list}>
          {getSortedMedicalReports(medicalReports).map((medicalReport, index) =>
            <MedicalReportItem
              key={index}
              medicalReport={medicalReport}
              displayDivider={index !== medicalReports.length - 1}
              onClickMedicalReport={onClickMedicalReport}
              onDeleteMedicalReport={onDeleteMedicalReport}
            />
          )}
        </List>
        : <SpinningLoader size={20} />
      }

      {user.isUserHcp() &&
        <Box display="flex" justifyContent="end" marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<NoteAddIcon />}
            onClick={() => {
              setIsEditDialogOpen(true)
            }}
          >
            {t('button-new')}
          </Button>
        </Box>
      }

      {isEditDialogOpen &&
        <MedicalReportEditDialog
          {...props}
          medicalReport={medicalReportToEdit}
          onClose={closeMedicalReportEditDialog}
          onSaved={updateMedicalReportList}
        />
      }

      {medicalReportToDelete &&
        <MedicalReportDeleteDialog
          teamName={medicalReportToDelete.teamName}
          medicalReport={medicalReportToDelete.medicalReport}
          onClose={closeMedicalReportDeleteDialog}
          onDelete={removeMedicalReportFromList}
        />
      }
    </React.Fragment>
  )
}

export default MedicalReportList
