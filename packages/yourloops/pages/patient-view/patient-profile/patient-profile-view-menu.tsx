/*
 * Copyright (c) 2024, Diabeloop
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
import CardContent from '@mui/material/CardContent'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ListItemText from '@mui/material/ListItemText'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'
import { PatientProfileViewSection } from './patient-profile-view-section.enum'
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined'
import { ChartIcon } from '../../../components/icons/diabeloop/chart-icon'

interface PatientProfileViewMenuProps {
  selectedSection: PatientProfileViewSection
  selectSection: (section: PatientProfileViewSection) => void
}

const useStyles = makeStyles()((theme) => ({
  menuTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  },
  menuItemText: {
    whiteSpace: 'pre-line',
  }
}))

export const PatientProfileViewMenu: FC<PatientProfileViewMenuProps> = (props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { selectedSection, selectSection } = props

  return (
    <Card variant="outlined" data-testid="patient-profile-view-menu">
      <CardContent>
        <MenuList>
          <Typography className={classes.menuTitle}>{t('patient-profile')}</Typography>
          <Divider variant="middle" sx={{
            paddingTop: theme.spacing(1)
          }} />
          <MenuItem
            selected={selectedSection === PatientProfileViewSection.Information}
            onClick={() => selectSection(PatientProfileViewSection.Information)}
            sx={{ marginTop: theme.spacing(2), paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
            data-testid="information-menu-button"
          >
            <ListItemIcon>
              <InfoOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>{t('information')}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedSection === PatientProfileViewSection.Range}
            onClick={() => selectSection(PatientProfileViewSection.Range)}
            sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
            data-testid="range-profile-menu-button"
          >
            <ListItemIcon>
              <ChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>{t('range')}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedSection === PatientProfileViewSection.Alerts}
            onClick={() => selectSection(PatientProfileViewSection.Alerts)}
            sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
            data-testid="alerts-profile-menu-button"
          >
            <ListItemIcon>
              <DesktopMacOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>{t('alerts')}</ListItemText>
          </MenuItem>
        </MenuList>
      </CardContent>
    </Card>
  )
}