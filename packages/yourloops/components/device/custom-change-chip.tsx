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
import Chip from '@mui/material/Chip'
import { ChangeType } from 'dumb/dist/src/models/historized-parameter.model'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'

interface CustomChangeChipProps {
  changeType: ChangeType
}

const useStyles = makeStyles<{ backgroundColor: string }>()((theme, { backgroundColor }) => ({
  customChip: {
    fontWeight: 500,
    border: 'none',
    backgroundColor
  }
}))

type ChipVariant = 'primary' | 'error' | 'success'

export const CustomChangeChip: FC<CustomChangeChipProps> = ({ changeType }) => {
  const { t } = useTranslation()

  const computeStyle = (): { variant: ChipVariant, backgroundColor: string } => {
    let variant: ChipVariant
    let backgroundColor: string
    switch (changeType) {
      case ChangeType.Added:
        variant = 'success'
        backgroundColor = 'var(--success-color-background)'
        break
      case ChangeType.Deleted:
        variant = 'error'
        backgroundColor = 'var(--error-color-background)'
        break
      case ChangeType.Updated:
        variant = 'primary'
        backgroundColor = 'var(--info-color-background)'
        break
    }
    return { variant, backgroundColor }
  }

  const { variant, backgroundColor } = computeStyle()
  const { classes } = useStyles({ backgroundColor })

  return (
    <Chip
      label={t(changeType)}
      color={variant}
      variant="outlined"
      className={classes.customChip}
    />
  )
}
