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

import React, { type FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Theme } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import FileChartOutlinedIcon from '../../icons/file-chart-outlined-icon'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import { type CategoryProps } from './medical-files-widget'
import { useAlert } from '../../utils/snackbar'
import CenteredSpinningLoader from '../../loaders/centered-spinning-loader'
import { type Prescription } from '../../../lib/medical-files/models/prescription.model'

const useStyle = makeStyles()((theme: Theme) => ({
  categoryTitle: {
    fontWeight: 600
  },
  categoryContainer: {
    marginBottom: theme.spacing(2)
  },
  list: {
    maxHeight: 160,
    overflow: 'auto'
  },
  hoveredItem: {
    '&:hover': {
      cursor: 'pointer'
    },
    '&.selected': {
      backgroundColor: theme.palette.grey[200]
    }
  }
}))

const PrescriptionList: FunctionComponent<CategoryProps> = ({ teamId, patientId }) => {
  const { t } = useTranslation('yourloops')
  const { classes } = useStyle()
  const alert = useAlert()
  const [prescriptions, setPrescriptions] = useState<Prescription[] | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!prescriptions) {
      MedicalFilesApi.getPrescriptions(patientId, teamId)
        .then(prescriptions => { setPrescriptions(prescriptions) })
        .catch(() => {
          setPrescriptions([])
          alert.error(t('prescriptions-get-failed'))
        })
    }
    // We don't have exhaustive deps here because we want to run the effect only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const downloadPrescription = (patientId: string, teamId: string, prescription: Prescription): void => {
    MedicalFilesApi.getPrescription(patientId, teamId, prescription.id).then(data => {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', prescription.name) // or any other extension
      document.body.appendChild(link)
      link.click()
    }).catch(error => {
      console.error(error)
      alert.error(t('download-prescription-error'))
    })
  }

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        {t('prescriptions')}
      </Typography>
      {prescriptions
        ? <List className={classes.list}>
          {prescriptions.map((prescription, index) => (
            <ListItem
              dense
              divider
              key={index}
              aria-label={`prescription-${prescription.id}`}
              className={`${classes.hoveredItem} ${prescription.id === hoveredItem ? 'selected' : ''}`}
              onMouseOver={() => { setHoveredItem(prescription.id) }}
              onMouseOut={() => { setHoveredItem(undefined) }}
              onClick={() => { downloadPrescription(patientId, teamId, prescription) }}
            >
              <ListItemIcon>
                <FileChartOutlinedIcon />
              </ListItemIcon>
              <ListItemText>
                {t('prescription-pdf', { pdfName: prescription.uploadedAt.substring(0, 10) })}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        : <CenteredSpinningLoader size={20} />
      }

    </React.Fragment>
  )
}

export default PrescriptionList
