import React, { type FC, useState } from 'react'
import MedicalDataService, { DeviceConfig, PumpSettings } from 'medical-domain'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { CurrentParametersSection } from './sections/current-parameters-section'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { SafetyBasalProfileSection } from './sections/safety-basal-profile-section'
import { ParametersChangeHistorySection } from './sections/parameters-change-history-section'
import { DevicesViewMenu } from './devices-view-menu'
import { DeviceViewSection } from './device-view-section.enum'
import { DeviceChangeHistorySection } from './sections/device-change-history-section'

interface DeviceViewDesktopProps {
  goToDailySpecificDate: (date: number) => void
  medicalData: MedicalDataService
}

export const DevicesViewDesktop: FC<DeviceViewDesktopProps> = ({ medicalData, goToDailySpecificDate }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectedSection, setSelectedSection] = useState(DeviceViewSection.CurrentParameters)
  const pumpSettings = medicalData.medicalData.pumpSettings.at(-1)

  const isBasalSafetyProfileAvailable = (pumpSettings : PumpSettings) : boolean => {
    return !isMobiGoDevice(pumpSettings.payload.device);
  }

  const isMobiGoDevice = (device : DeviceConfig) : boolean => {
    return device.deviceId.toLowerCase().startsWith('mobigo');
  }


  const selectSection = (section: DeviceViewSection): void => {
    setSelectedSection(section)
  }

  const displaySelectedSection = (): JSX.Element => {
    switch (selectedSection) {
      case DeviceViewSection.CurrentParameters:
        return <CurrentParametersSection pumpSettings={pumpSettings} />
      case DeviceViewSection.SafetyBasalProfile:
        return <SafetyBasalProfileSection
          safetyBasalConfig={pumpSettings.payload.securityBasals}
          deviceSystem={pumpSettings.payload.device.name}
        />
      case DeviceViewSection.ParametersChangeHistory:
        return <ParametersChangeHistorySection
          goToDailySpecificDate={goToDailySpecificDate}
          pumpSettings={pumpSettings}
        />
      case DeviceViewSection.DeviceChangeHistory:
        return <DeviceChangeHistorySection goToDailySpecificDate={goToDailySpecificDate} pumpSettings={pumpSettings} />
      default:
        return <></>
    }
  }

  return (
    <Container data-testid="device-settings-container" maxWidth="xl">
      {medicalData.medicalData.pumpSettings.length > 0
        ?
        <Grid container spacing={3}>
          <Grid size={3}>
            <DevicesViewMenu
              selectedSection={selectedSection}
              selectSection={selectSection}
              shouldDisplaySafetyBasalProfile={isBasalSafetyProfileAvailable(pumpSettings)}
            />
          </Grid>
          <Grid size={9}>
            {displaySelectedSection()}
          </Grid>
        </Grid>
        : <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: theme.spacing(4)
          }}>
          <Typography sx={{ fontWeight: 500 }}>{t('no-settings-on-device-alert-message')}</Typography>
        </Box>
      }
    </Container>
  )
}
