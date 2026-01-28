/*
 * Copyright (c) 2025, Diabeloop
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

import React, { FC } from 'react'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import { formatParameterValue, getPumpSettingsParameterList } from '../../device/utils/device.utils'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { formatDateWithMomentLongFormat } from '../../../lib/utils'
import { DataCard } from '../../data-card/data-card'
import { PumpSettings } from 'medical-domain'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'

interface LastUpdatesCardProps {
  pumpSettings: PumpSettings
}

const useStyles = makeStyles()((theme) => ({
  sectionContent: {
    fontSize: '13px',
    fontWeight: 300,
    lineHeight: '15px'
  },
  tableRows: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.grey[100]
    }
  },
  tableCell: {
    height: '30px',
    padding: theme.spacing(0.2, 0.5)
  },
  parameterChangesTable: {
    maxHeight: 200
  }
}))

export const LastUpdatesCard: FC<LastUpdatesCardProps> = (props) => {
  const { t } = useTranslation()
  const { pumpSettings } = props
  const { classes } = useStyles()
  const theme = useTheme()

  return (
    <DataCard data-testid="device-usage-updates">
      <Typography sx={{ fontWeight: 'bold', paddingBottom: theme.spacing(1) }}>
        {t('last-updates')}
      </Typography>
      <TableContainer
        data-testid="device-usage-updates-list"
        className={classes.parameterChangesTable}
      >
        <Table>
          <TableBody className={classes.sectionContent}>
            {pumpSettings && getPumpSettingsParameterList(pumpSettings.payload.history.parameters).map((parameter) => (
              <TableRow
                key={`${parameter.name}-${parameter.effectiveDate}-${parameter.previousValue}`}
                data-param={parameter.name}
                data-testid={parameter.name}
                data-changetype={parameter.changeType}
                data-isodate={parameter.effectiveDate}
                className={`${classes.tableRows} parameter-update`}
              >
                <TableCell className={`${classes.sectionContent} ${classes.tableCell}`}>
                  {formatDateWithMomentLongFormat(new Date(parameter.effectiveDate), 'lll', pumpSettings.timezone)}
                </TableCell>
                <TableCell className={`${classes.sectionContent} ${classes.tableCell}`}>
                  {t(`params|${parameter.name}`)} (
                  {parameter.previousValue &&
                    <>
                      {formatParameterValue(parameter.previousValue, parameter.previousUnit)}{parameter.previousUnit}
                      <span> ➞ </span>
                    </>
                  }
                  {formatParameterValue(parameter.value, parameter.unit)}{parameter.unit})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DataCard>
  )
}
