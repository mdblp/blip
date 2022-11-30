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

import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Theme } from '@mui/material/styles'

import { makeStyles } from '@mui/styles'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import FileChartOutlinedIcon from '../../icons/FileChartOutlinedIcon'
import { WeeklyReport } from '../../../lib/medical-files/model'
import MedicalFilesApi from '../../../lib/medical-files/medical-files-api'
import { CategoryProps } from './medical-files-widget'
import WeeklyReportDialog from '../../dialogs/weekly-report-dialog'
import { useAlert } from '../../utils/snackbar'
import CenteredSpinningLoader from '../../loaders/centered-spinning-loader'

const useStyle = makeStyles((theme: Theme) => ({
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

const WeeklyReportList: FunctionComponent<CategoryProps> = ({ teamId, patientId }) => {
  const { t } = useTranslation('yourloops')
  const classes = useStyle()
  const alert = useAlert()
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[] | null>(null)
  const [displayWeeklyReportDetails, setDisplayWeeklyReportDetails] = useState<WeeklyReport | undefined>(undefined)
  const [hoveredItem, setHoveredItem] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!weeklyReports) {
      MedicalFilesApi.getWeeklyReports(patientId, teamId)
        .then(weeklyReports => setWeeklyReports(weeklyReports))
        .catch(() => {
          setWeeklyReports([])
          alert.error(t('weekly-reports-get-failed'))
        })
    }
    // We don't have exhaustive deps here because we want to run the effect only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        {t('weekly-reports')}
      </Typography>
      {weeklyReports
        ? <List className={classes.list}>
          {weeklyReports.map((weeklyReport, index) => (
            <ListItem
              dense
              divider
              key={index}
              aria-label={`weekly-report-${weeklyReport.id}`}
              className={`${classes.hoveredItem} ${weeklyReport.id === hoveredItem ? 'selected' : ''}`}
              onMouseOver={() => setHoveredItem(weeklyReport.id)}
              onMouseOut={() => setHoveredItem(undefined)}
              onClick={() => setDisplayWeeklyReportDetails(weeklyReport)}
            >
              <ListItemIcon>
                <FileChartOutlinedIcon />
              </ListItemIcon>
              <ListItemText>
                {t('weekly-report-pdf', { pdfName: weeklyReport.creationDate.substring(0, 10) })}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        : <CenteredSpinningLoader size={20} />
      }

      {displayWeeklyReportDetails &&
        <WeeklyReportDialog
          weeklyReport={displayWeeklyReportDetails}
          onClose={() => setDisplayWeeklyReportDetails(undefined)}
        />
      }
    </React.Fragment>
  )
}

export default WeeklyReportList
