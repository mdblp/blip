/*
 * Copyright (c) 2023, Diabeloop
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

import React, { type FC } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Card from '@mui/material/Card'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import { formatParameterValue, PARAMETER_STRING_MAX_WIDTH, sortHistory } from './utils/device.utils'
import { type ParametersChange } from 'medical-domain'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import { formatDateWithMomentLongFormat, isEllipsisActive } from '../../lib/utils'
import { CustomChangeChip } from './custom-change-chip'
import classes from './device.css'
import Tooltip from '@mui/material/Tooltip'
import { ChangeValue } from './change-value'

interface ParametersChangeHistoryProps {
  goToDailySpecificDate: (date: number) => void
  history: ParametersChange[]
  timezone: string
}

export const ParametersChangeHistory: FC<ParametersChangeHistoryProps> = ({ history, goToDailySpecificDate, timezone }) => {
  const theme = useTheme()
  const { t } = useTranslation()

  const onClickChangeDate = (date: number): void => {
    goToDailySpecificDate(date)
    window.scroll(0, 0)
  }
  sortHistory(history)

  return (
    <Card variant="outlined" data-testid="history-parameter-table">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Parameter')}</TableCell>
              <TableCell>{t('Value')}</TableCell>
              <TableCell align="right">{t('type-of-change')}</TableCell>
              <TableCell align="right">{t('date')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((parametersChange, historyCurrentIndex) => (
              <React.Fragment key={`${parametersChange.changeDate}-${historyCurrentIndex}`}>
                <TableRow sx={{ backgroundColor: 'var(--primary-color-background)' }} className="change-date-row">
                  <TableCell colSpan={5}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 1
                      }}>
                      <IconButton
                        size="small"
                        color="primary"
                        data-testid={`daily-button-link-${parametersChange.changeDate}`}
                        sx={{ padding: 0 }}
                        onClick={() => {
                          onClickChangeDate(new Date(parametersChange.changeDate).getTime())
                        }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {formatDateWithMomentLongFormat(new Date(parametersChange.changeDate), 'llll', timezone)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                {parametersChange.parameters.map((parameter, index) => (
                  <TableRow
                    key={`${parameter.effectiveDate}-${index}`}
                    data-testid={`parameters-group-${parametersChange.changeDate.substring(0, 10)}-${historyCurrentIndex}-rows-${index}`}
                    className={`${classes.parameterRow} parameter-change-row`}
                  >
                    <TableCell>
                      <Tooltip title={isEllipsisActive(document.getElementById(`${parameter.name}-${index}`)) ? parameter.name : ''}>
                        <Typography
                          className="is-ellipsis"
                          variant="body2"
                          id={`${parameter.name}-${index}`}
                          sx={{
                            maxWidth: PARAMETER_STRING_MAX_WIDTH
                          }}
                        >
                          {t(`params|${parameter.name}`)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <ChangeValue
                        previousValue={parameter.previousValue ? `${formatParameterValue(parameter.previousValue, parameter.previousUnit)} ${parameter.previousUnit}` : parameter.previousValue}
                        currentValue={`${formatParameterValue(parameter.value, parameter.unit)} ${parameter.unit}`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <CustomChangeChip changeType={parameter.changeType} />
                    </TableCell>
                    <TableCell align="right">
                      {formatDateWithMomentLongFormat(new Date(parameter.effectiveDate), 'llll', timezone)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
