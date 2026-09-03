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
import { GenericListCard } from '../../../components/generic-list-card/generic-list-card'
import { makeStyles } from 'tss-react/mui'
import { AppUserRoute } from '../../../models/enums/routes.enum'
import { ViewMoreLink } from '../../../components/buttons/view-more-link'
import Typography from '@mui/material/Typography'

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

export const DeviceViewSectionsOverviewCards= () => {
  const { t } = useTranslation()
  const { classes } = cardStyle()

  return (
    <>
      <GenericListCard
        title={t('current-parameters')}
        data-testid="device-view-overview-current-parameters"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink dataTestId="link-device-current-parameters" targetRoute={AppUserRoute.DevicesSectionsOverviewCurrentSettings} />
        }
      />

      <GenericListCard
        title={t('safety-basal')}
        data-testid="device-view-overview-safety-basal"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink dataTestId="link-device-basal-safety" targetRoute={AppUserRoute.DevicesSectionsOverviewBasalSafety} />
        }
      >
        <Typography variant="body2">
          {t('basal-safety-card-text')}
        </Typography>
      </GenericListCard>

      <GenericListCard
        title={t('parameters-history')}
        data-testid="device-view-overview-parameters-history"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink dataTestId="link-device-parameters-history" targetRoute={AppUserRoute.DevicesSectionsOverviewSettingsHistory} />
        }
      />

      <GenericListCard
        title={t('device-history')}
        data-testid="device-view-overview-device-history"
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        headerAction={
          <ViewMoreLink dataTestId="link-device-device-history" targetRoute={AppUserRoute.DevicesSectionsOverviewDevicesHistory} />
        }
      />

    </>
  )
}
