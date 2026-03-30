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
import { CareTeamSettingsSection } from './care-team-settings-section.enum'
import CardContent from '@mui/material/CardContent'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Info, Notifications } from '@mui/icons-material'
import ListItemText from '@mui/material/ListItemText'
import Card from '@mui/material/Card'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import AnalyticsApi, { ElementType } from '../../lib/analytics/analytics.api'

interface CareTeamSettingsMenuProps {
  selectedSection: CareTeamSettingsSection
  selectSection: (section: CareTeamSettingsSection) => void
}

const useStyles = makeStyles()((theme) => ({
  menuTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  },
  menuItemText: {
    whiteSpace: 'pre-line'
  }
}))

export const CareTeamSettingsMenu: FC<CareTeamSettingsMenuProps> = (props) => {
  const { selectedSection, selectSection } = props
  const { t } = useTranslation()
  const { classes } = useStyles()
  const theme = useTheme()

  return (
    <Card variant="outlined" data-testid="care-team-settings-menu">
      <CardContent>
        <MenuList>
          <Typography className={classes.menuTitle}>{t('header-tab-care-team-settings')}</Typography>
          <Divider
            variant="middle"
            sx={{ paddingTop: theme.spacing(1) }}
          />
          <MenuItem
            selected={selectedSection === CareTeamSettingsSection.InfoAndMembers}
            onClick={() => {
              AnalyticsApi.trackClick(`care-team-settings-menu-info-and-members`, ElementType.Link)
              selectSection(CareTeamSettingsSection.InfoAndMembers)
            }}
            sx={{ marginTop: theme.spacing(2), paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
            data-testid="info-and-members-menu-button"
          >
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>{t('info-and-members')}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedSection === CareTeamSettingsSection.MonitoringAlerts}
            onClick={() => {
              AnalyticsApi.trackClick('care-team-settings-menu-monitoring-alerts', ElementType.Link)
              selectSection(CareTeamSettingsSection.MonitoringAlerts)
            }}
            sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
            data-testid="monitoring-alerts-menu-button"
          >
            <ListItemIcon>
              <Notifications fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>{t('monitoring-alerts')}</ListItemText>
          </MenuItem>
        </MenuList>
      </CardContent>
    </Card>
  )
}
