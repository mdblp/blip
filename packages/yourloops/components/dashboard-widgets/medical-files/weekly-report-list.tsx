/**
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

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles, Theme } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import FileChartOutlinedIcon from '../../icons/FileChartOutlinedIcon'
import { WeeklyReport } from '../../../lib/medical-files/model'
import MedicalFilesApi from '../../../lib/medical-files/medical-files-api'
import { CategoryProps } from './medical-files-widget'
import WeeklyReportDialog from '../../dialogs/weekly-report-dialog'

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

export default function WeeklyReportList({ teamId, patientId }: CategoryProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const classes = useStyle()
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([])
  const [displayWeeklyReportDetails, setDisplayWeeklyReportDetails] = useState<WeeklyReport | undefined>(undefined)
  const [hoveredItem, setHoveredItem] = useState<string | undefined>(undefined)

  useEffect(() => {
    (async () => {
      setWeeklyReports(await MedicalFilesApi.getWeeklyReports(patientId, teamId))
    })()
  }, [patientId, teamId])

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        {t('weekly-reports')}
      </Typography>
      <List className={classes.list}>
        {weeklyReports.map((weeklyReport, index) => (
          <ListItem
            dense
            divider
            key={index}
            className={`${classes.hoveredItem} ${weeklyReport.id === hoveredItem ? 'selected' : ''}`}
            onMouseOver={() => setHoveredItem(weeklyReport.id)}
            onMouseOut={() => setHoveredItem(undefined)}
            onClick={() => setDisplayWeeklyReportDetails(weeklyReport)}
          >
            <ListItemIcon>
              <FileChartOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              {t('weekly-report-pdf', { pdfName: new Date(weeklyReport.creationDate).toLocaleDateString() })}
            </ListItemText>
          </ListItem>
        ))}
      </List>

      {displayWeeklyReportDetails &&
        <WeeklyReportDialog
          weeklyReport={displayWeeklyReportDetails}
          onClose={() => setDisplayWeeklyReportDetails(undefined)}
        />
      }
    </React.Fragment>
  )
}
