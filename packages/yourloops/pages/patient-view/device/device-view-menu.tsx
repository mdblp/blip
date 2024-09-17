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
import { History, PhonelinkSetup } from '@mui/icons-material'
import ListItemText from '@mui/material/ListItemText'
import { BasalIcon } from '../../../components/icons/diabeloop/basal-icon'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { DeviceViewSection } from '../../../models/enums/device-view-section.enum'

interface DeviceViewMenuProps {
  selectedSection: DeviceViewSection
  selectSection: (section: DeviceViewSection) => void
}

const useStyles = makeStyles()((theme) => ({
  menuTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2)
  }
}))

export const DeviceViewMenu: FC<DeviceViewMenuProps> = (props) => {
  const theme = useTheme()
  const { classes } = useStyles()
  const { selectedSection, selectSection } = props

  return (
    <Card variant="outlined">
      <CardContent>
        <MenuList>
          <Typography className={classes.menuTitle}>Devices</Typography>
          <Divider variant="middle" sx={{
            paddingTop: theme.spacing(1)
          }} />
          <MenuItem
            selected={selectedSection === DeviceViewSection.CurrentParameters}
            onClick={() => selectSection(DeviceViewSection.CurrentParameters)}
            sx={{ marginTop: theme.spacing(2), paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
          >
            <ListItemIcon>
              <PhonelinkSetup fontSize="small" />
            </ListItemIcon>
            <ListItemText>Current parameters</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedSection === DeviceViewSection.SafetyBasalProfile}
            onClick={() => selectSection(DeviceViewSection.SafetyBasalProfile)}
            sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
          >
            <ListItemIcon>
              <BasalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Safety basal profile</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedSection === DeviceViewSection.ChangeHistory}
            onClick={() => selectSection(DeviceViewSection.ChangeHistory)}
            sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
          >
            <ListItemIcon>
              <History fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change history</ListItemText>
          </MenuItem>
        </MenuList>
      </CardContent>
    </Card>
  )
}
