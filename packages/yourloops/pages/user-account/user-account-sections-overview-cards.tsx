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
import { GenericListCard } from '../../components/generic-list-card/generic-list-card'
import { useUserAccountPageState } from './user-account-page-context'
import { makeStyles } from 'tss-react/mui'
import { ExternalConsent } from '../../lib/external-consents/models/external-consent.model'
import { useAuth } from '../../lib/auth'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { ViewMoreLink } from '../../components/buttons/view-more-link'
import PatientUtils from '../../lib/patient/patient.util'
import { getLangName } from '../../lib/language'

interface UserAccountMenuMobileCardsProps {
  consents: ExternalConsent[]
}

export const cardStyle = makeStyles()((theme) => {
  return {
    cards: {
      margin: theme.spacing(2)
    },
    cardsHeader: {
      lineHeight: 1
    },
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5
    }
  }
})

export const UserAccountSectionsOverviewCards: FC<UserAccountMenuMobileCardsProps> = (props) => {
  const { consents } = props
  const { user } = useAuth()
  const { t } = useTranslation()
  const { userAccountForm } = useUserAccountPageState()
  const { classes } = cardStyle()

  const getTableLinesAccount = (): { label: string, value: string }[] => {

    return [
      { label: t('first-name'), value: userAccountForm.firstName },
      { label: t('last-name'), value: userAccountForm.lastName },
      { label: t('country'), value: userAccountForm.country },
      { label: t('gender'), value: PatientUtils.getGenderLabel(userAccountForm.sex) },
      { label: t('email'), value: user.email },
      { label: t('units'), value: userAccountForm.units },
      { label: t('language'), value: getLangName(userAccountForm.lang) }
    ]
  }

  const getTableLinesSharing = (): { label: string; value: string }[] => {
    return consents.map((consent: ExternalConsent) => ({
      label: consent.partnerName,
      value: ''
    }))
  }

  return (
    <>
      <GenericListCard
        title={t('account')}
        tableLines={getTableLinesAccount()}
        data-testid="user-account-menu-mobile-account"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink dataTestId="link-account" targetRoute={AppUserRoute.UserAccountSection} />
        }
      />

      <GenericListCard
        title={t('data-sharing')}
        tableLines={getTableLinesSharing()}
        data-testid="user-account-menu-mobile-data-sharing"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        hideFallbackValue = {true}
        remoteMonitoring = {true}
        headerAction={
          <ViewMoreLink dataTestId="link-data-sharing" targetRoute={AppUserRoute.UserAccountDataSharingSection} />
        }
      />
    </>
  )
}
