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
import { useTranslation } from 'react-i18next'
import { GenericListCard } from '../../components/device/generic-list-card'
import { useUserAccountPageState } from './user-account-page-context'
import { makeStyles } from 'tss-react/mui'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';

export const cardStyle = makeStyles({ name: 'footer-component-styles' })((theme) => {
  return {
    cards: {
      margin: theme.spacing(2),
    },
  }
})

export const UserAccountMenuMobileCards = () => {
  const { t } = useTranslation()
  const { userAccountForm } = useUserAccountPageState()
  const { classes } = cardStyle()

  const getTableLinesAccount = (): { value: string, label: string }[] => {
    return [
      { label: t('first-name'), value: userAccountForm.firstName },
      { label: t('last-name'), value: userAccountForm.lastName },
      { label: t('country'), value: userAccountForm.country },
      { label: t('gender'), value: userAccountForm.sex },
      { label: t('units'), value: userAccountForm.units },
      { label: t('language'), value: userAccountForm.lang },
    ]
  }
  const getTableLinesSharing = (): { value: string, label: string }[] => {
    return [
      { label: t('glooko-xt'), value: null },
    ]
  }
  return (
    <>
      <GenericListCard
        className={classes.cards}
        title={t('account')}
        tableLines={getTableLinesAccount()}
        data-testid="user-account-menu-mobile-account"
        headerAction={
          <Link
            href="/ma-page"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {t('view-more')}
            <KeyboardArrowRightIcon fontSize="small" />
          </Link>
        }
      />

      <GenericListCard
        title={t('data-sharing')}
        tableLines={getTableLinesSharing()}
        data-testid="user-account-menu-mobile-data-sharing"
        className = {classes.cards}
        headerAction={
          <Link
            component={RouterLink}
            to="/account"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {t('view-more')}
            <KeyboardArrowRightIcon fontSize="small" />
          </Link>
        }
      />
    </>
  )
}
