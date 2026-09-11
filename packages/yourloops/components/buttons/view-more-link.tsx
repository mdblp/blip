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

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'
import { AppUserRoute } from '../../models/enums/routes.enum'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { makeStyles } from 'tss-react/mui'

interface ViewMoreLinkProps {
  dataTestId: string,
  targetRoute: AppUserRoute | string
}

export const linkStyle = makeStyles()(() => {
  return {
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      color: 'var(--text-color-primary)'
    }
  }
})

export const ViewMoreLink: FC<ViewMoreLinkProps> = (props) => {
  const { dataTestId, targetRoute } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { classes } = linkStyle()

  return (

    <Link
      className={classes.links}
      component="button"
      onClick={() => navigate(targetRoute)}
      underline="none"
      data-testid={dataTestId}
    >
      {t('view-more')}
      <KeyboardArrowRightIcon fontSize="small" />
    </Link>
  )
}
