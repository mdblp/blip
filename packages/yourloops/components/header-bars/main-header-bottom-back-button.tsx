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

import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


const classes = makeStyles()((theme) => ({
  arrowBack: {
    paddingLeft: theme.spacing(2),
    fontSize: '16px'
  },
  mobileLogo: {
    width: '97px',
    height: '28px',
    '& img': {
      objectFit: 'contain'
    }
  },
  bottomPart: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    width: '100%',
    margin: theme.spacing(1)
  }
}))

export const MainHeaderBottomBackButton = () => {

  const { classes: { arrowBack, bottomPart } } = classes()
  const navigate = useNavigate()
  const { t } = useTranslation('yourloops')
  const goHome = () => {
    navigate(-1)
  }

  return (
    <Box
      className={bottomPart}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={goHome}
        className={arrowBack}
        data-testid="back-button"
      >
        {t('back')}
      </Button>
    </Box>
  )
}
