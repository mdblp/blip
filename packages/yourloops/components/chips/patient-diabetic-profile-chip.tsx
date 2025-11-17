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

import React, { FunctionComponent } from 'react'
import { DiabeticType } from 'medical-domain'
import Chip from '@mui/material/Chip'
import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { type SxProps } from '@mui/material'

const styles = makeStyles()((theme: Theme) => {
  return {
    chip: {
      textTransform: 'none',
      borderRadius: theme.spacing(2),
      minWidth: 'auto',
      paddingX: theme.spacing(2),
      paddingY: theme.spacing(0.5),
      margin: theme.spacing(0, 0, 0, 4),
      height: '26px'
    }
  }
})


interface ChipConfig {
  label: string
  color: 'lightBlue' | 'lightPink' | 'lightDarkBlue'
}

interface PatientDiabeticProfileProps {
  patientDiabeticType: DiabeticType
  sx?: SxProps<Theme>
}

export const PatientDiabeticProfileChip: FunctionComponent<PatientDiabeticProfileProps> = (props) => {
  const { patientDiabeticType, sx } = props
  const { t } = useTranslation()
  const { classes } = styles()

  const getChipConfig = (type: DiabeticType): ChipConfig => {
    switch (type) {
      case DiabeticType.DT1DT2:
        return {
          label: t('range-profile-type-1-and-2'),
          color: 'lightBlue'
        }
      case DiabeticType.DT1Pregnancy:
        return {
          label: t('range-profile-pregnancy-type-1'),
          color: 'lightPink'
        }
      case DiabeticType.Custom:
        return {
          label: t('range-profile-custom'),
          color: 'lightDarkBlue'
        }
    }
  }

  const chipConfig = getChipConfig(patientDiabeticType)

  return (
    <Chip
      label={chipConfig.label}
      variant={'filled'}
      color={chipConfig.color}
      className={classes.chip}
      sx={sx}
    />
  )
}
