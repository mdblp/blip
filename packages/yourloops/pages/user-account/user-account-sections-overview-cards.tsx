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
import { GenericListCard } from '../../components/device/generic-list-card'
import { useUserAccountPageState } from './user-account-page-context'
import { makeStyles } from 'tss-react/mui'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ExternalConsent } from '../../lib/external-consents/models/external-consent.model'
import { PartnerName } from '../../lib/external-consents/models/enum/partner-name.enum'
import myDiabbyLogo from 'my-diabby-app-icon.svg'
import glookoLogo from 'glooko-app-icon.svg'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { getRemoteMonitoringToolLabel } from './sections/data-sharing-section/remote-monitoring.util'
import { useAuth } from '../../lib/auth'
import { AppUserRoute } from '../../models/enums/routes.enum'

interface UserAccountMenuMobileCardsProps {
  consents: ExternalConsent[]
}

export const cardStyle = makeStyles({ name: 'footer-component-styles' })((theme) => {
  return {
    cards: {
      margin: theme.spacing(2)
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
  const navigate = useNavigate()
  const { userAccountForm } = useUserAccountPageState()
  const { classes } = cardStyle()

  const getTableLinesAccount = (): { value: string, label: string }[] => {
    return [
      { label: t('first-name'), value: userAccountForm.firstName },
      { label: t('last-name'), value: userAccountForm.lastName },
      { label: t('country'), value: userAccountForm.country },
      { label: t('gender'), value: userAccountForm.sex },
      { label: t('email'), value: user.email },
      { label: t('units'), value: userAccountForm.units },
      { label: t('language'), value: userAccountForm.lang }
    ]
  }

  const getRemoteMonitoringToolLogo = (consentName: PartnerName) => {
    switch (consentName) {
      case PartnerName.MyDiabby:
        return myDiabbyLogo
      case PartnerName.GlookoXT:
        return glookoLogo
      default:
        return ''
    }
  }

  const getTableLinesSharing = (): { label: string, value: string }[] => {
    return consents.map((consent: ExternalConsent) => ({
      label: (
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            variant="square"
            src={getRemoteMonitoringToolLogo(consent.partnerName)}
            alt={getRemoteMonitoringToolLabel(consent.partnerName)}
          />
          <span>{consent.partnerName}</span>
        </Box>
      ),
      value: ''
    })) as unknown as { label: string, value: string }[]
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
            className={classes.links}
            component="button"
            onClick={() => navigate(AppUserRoute.AccountSection)}
            underline="none"
            data-testid="link-account"
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
        className={classes.cards}
        headerAction={
          <Link
            className={classes.links}
            component="button"
            onClick={() => navigate(AppUserRoute.DataSharingSection)}
            underline="none"
            data-testid="link-data-sharing"
          >
            {t('view-more')}
            <KeyboardArrowRightIcon fontSize="small" />
          </Link>
        }
      />
    </>
  )
}
