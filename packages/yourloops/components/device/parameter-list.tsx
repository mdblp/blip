/*
 * Copyright (c) 2023-2024, Diabeloop
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
import Card from '@mui/material/Card'
import { useTranslation } from 'react-i18next'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { type ParameterConfig } from 'medical-domain'
import { formatParameterValue, PARAMETER_STRING_MAX_WIDTH } from './utils/device.utils'
import classes from './device.css'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { isEllipsisActive } from '../../lib/utils'

interface ParameterListProps {
  parameters: ParameterConfig[]
}

export const ParameterList: FC<ParameterListProps> = ({ parameters }) => {
  const { t } = useTranslation()

  return (
    <Card variant="outlined">
      <TableContainer>
        <Table>
          <TableHead className={classes.header}>
            <TableRow>
              <TableCell>{t('Parameter')}</TableCell>
              <TableCell align="right">{t('Value')}</TableCell>
              <TableCell align="right">{t('Unit')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((parameter, index) => (
              <TableRow
                key={parameter.name}
                className={classes.parameterRow}
                data-testid={`${parameter.name.toLowerCase()}-row`}
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
                <TableCell align="right">{formatParameterValue(parameter.value, parameter.unit)}</TableCell>
                <TableCell align="right">{parameter.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
