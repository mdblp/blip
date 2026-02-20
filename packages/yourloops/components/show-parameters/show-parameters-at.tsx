/*
 * Copyright (c) 2026, Diabeloop
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

import React, { FunctionComponent, useMemo } from 'react'
import { Button } from "@mui/material"
import { useTranslation } from 'react-i18next'
import classes from './show-parameters.css'
import Draggable from 'react-draggable'
import Popover from '@mui/material/Popover'
import { ParameterConfig, ParametersChange } from 'medical-domain'
import { getParametersAtDate } from './show-parameters.utils'
import Box from '@mui/material/Box'
import { formatParameterValue } from 'dumb/dist/src/utils/format/format.util'
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography'

interface ShowParametersAtProps {
  date: number | string | Date
  parameters: ParameterConfig[]
  history: ParametersChange[]
}

export const ShowParametersAt: FunctionComponent<ShowParametersAtProps> = (props) => {
  const { t } = useTranslation()
  const { parameters, history, date } = props
  const [anchorElement, setAnchorElement] = React.useState<Element | null>(null)
  const open = Boolean(anchorElement)

  const effectiveParameters = useMemo(() => {
    const targetDate = new Date(date)
    return getParametersAtDate(parameters, history, targetDate)
  }, [parameters, history, date])

  const showParameters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Button
        data-testid="show-parameters-at-button"
        variant="outlined"
        className={classes.secondaryButton}
        onClick={showParameters}
        startIcon={<SettingsIcon />}
      >
        {t('show-parameters-at-title-button')}
      </Button>
      <Draggable>
        <Popover
          data-testid={`show-parameters-at-popover`}
          open={open}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                minWidth: 413,
                padding: '16px',
                borderRadius: '24px'
              }
            }
          }}>
          <div>
            <Box sx={{
              marginBottom: 1,
            }}>
              <Typography variant="h6">{t('show-parameters-at-popover-header')}</Typography>
            </Box>
            {effectiveParameters.map(param => (
              <Box
                data-testid={`${param.name.toLowerCase()}-row`}
                key={param.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 0",
              }}>
                <Typography variant="body2">{t(`params|${param.name}`)}</Typography>
                <Typography variant="body2">{formatParameterValue(param.value, param.unit)} {t(param.unit)}</Typography>
              </Box>
            ))}
          </div>
        </Popover>
    </Draggable>
    </>
  )
}
