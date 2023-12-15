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

import React, { type FC, useState } from 'react'
import type MedicalDataService from 'medical-domain'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { CurrentParametersSection } from './sections/current-parameters-section'
import Typography from '@mui/material/Typography'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { ContentCopy, History, PhonelinkSetup } from '@mui/icons-material'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { makeStyles } from 'tss-react/mui'
import { SafetyBasalProfileSection } from './sections/safety-basal-profile-section'
import { ChangeHistorySection } from './sections/change-history-section'
import { BasalIcon } from '../../../components/icons/diabeloop/basal-icon'

interface DeviceViewProps {
  goToDailySpecificDate: (date: number) => void
  medicalData: MedicalDataService
}

const useStyles = makeStyles()((theme) => ({
  menuTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  }
}))

enum DeviceViewSection {
  ChangeHistory = 'ChangeHistory',
  CurrentParameters = 'CurrentParameters',
  SafetyBasalProfile = 'SafetyBasalProfile'
}

export const DeviceView: FC<DeviceViewProps> = ({ medicalData, goToDailySpecificDate }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const [selectedSection, setSelectedSection] = useState(DeviceViewSection.CurrentParameters)
  const pumpSettings = medicalData.medicalData.pumpSettings.at(-1)

  const isSelected = (section: DeviceViewSection): boolean => {
    return section === selectedSection
  }

  const selectSection = (section: DeviceViewSection): void => {
    setSelectedSection(section)
  }

  return (
    <Container data-testid="device-settings-container" maxWidth="xl">
      {medicalData.medicalData.pumpSettings.length > 0
        ?
        <>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Card variant="outlined">
                <CardContent>
                  <MenuList>
                    <Typography className={classes.menuTitle}>Devices</Typography>
                    <Divider variant="middle" sx={{
                      paddingTop: theme.spacing(1)
                    }} />
                    <MenuItem
                      selected={isSelected(DeviceViewSection.CurrentParameters)}
                      onClick={() => selectSection(DeviceViewSection.CurrentParameters)}
                      sx={{ marginTop: theme.spacing(2) }}
                    >
                      <ListItemIcon>
                        <PhonelinkSetup fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Current parameters</ListItemText>
                    </MenuItem>
                    <MenuItem
                      selected={isSelected(DeviceViewSection.SafetyBasalProfile)}
                      onClick={() => selectSection(DeviceViewSection.SafetyBasalProfile)}
                    >
                      <ListItemIcon>
                        <BasalIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Safety basal profile</ListItemText>
                    </MenuItem>
                    <MenuItem
                      selected={isSelected(DeviceViewSection.ChangeHistory)}
                      onClick={() => selectSection(DeviceViewSection.ChangeHistory)}
                    >
                      <ListItemIcon>
                        <History fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Change history</ListItemText>
                    </MenuItem>
                  </MenuList>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={9}>
              {
                isSelected(DeviceViewSection.CurrentParameters) ?
                  <CurrentParametersSection pumpSettings={pumpSettings} />
                  : isSelected(DeviceViewSection.SafetyBasalProfile) ?
                    <SafetyBasalProfileSection></SafetyBasalProfileSection>
                    : isSelected(DeviceViewSection.ChangeHistory) ?
                      <ChangeHistorySection
                        goToDailySpecificDate={goToDailySpecificDate}
                        pumpSettings={pumpSettings}
                      />
                      : <></>
              }

            </Grid>
          </Grid>
        </>
        : <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={theme.spacing(4)}
        >
          <Typography fontWeight={500}>{t('no-settings-on-device-alert-message')}</Typography>
        </Box>
      }
    </Container>
  )
}
