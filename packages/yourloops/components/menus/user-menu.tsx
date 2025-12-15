/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CancelIcon from '@mui/icons-material/Cancel'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import FaceIcon from '@mui/icons-material/Face'
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import StethoscopeIcon from '../icons/stethoscope-icon'

import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import { useAuth } from '../../lib/auth'
import RoundedHospitalIcon from '../icons/rounded-hospital-icon'
import config from '../../lib/config/config'
import metrics from '../../lib/metrics'
import MenuLayout from '../../layout/menu-layout'
import { isEllipsisActive } from '../../lib/utils'
import { UserRole } from '../../lib/auth/models/enums/user-role.enum'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { getUserName } from '../../lib/auth/user.util'

const classes = makeStyles()((theme) => ({
  typography: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  menu: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

const MENU_MAX_WIDTH_PX = 250

function UserMenu(): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { user, logout } = useAuth()
  const { classes: { menu, typography } } = classes()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile: boolean = useMediaQuery(theme.breakpoints.only('xs'))
  const [tooltipText, setTooltipText] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const opened = !!anchorEl
  const { firstName, fullName, lastName } = user
  const userName = getUserName(firstName, lastName, fullName)

  const getRoleIcon = (): JSX.Element | null => {
    switch (user?.role) {
      case UserRole.Hcp:
        return <StethoscopeIcon data-testid="hcp-icon" />
      case UserRole.Caregiver:
        return <RoundedHospitalIcon data-testid="caregiver-icon" />
      case UserRole.Patient:
        return <FaceIcon data-testid="patient-icon" />
      default:
        console.error('Unknown role')
        return null
    }
  }

  const openMenu = ({ currentTarget }: { currentTarget: HTMLElement }): void => {
    setAnchorEl(currentTarget)
  }

  const closeMenu = (): void => {
    setAnchorEl(null)
  }

  const onClickSettings = (): void => {
    navigate(AppUserRoute.UserAccount)
    closeMenu()
  }

  const onClickLogout = (): void => {
    logout()
    closeMenu()
  }

  const onClickSupport = (): void => {
    window.open(config.SUPPORT_WEB_ADDRESS, '_blank')
    closeMenu()
    metrics.send('support', 'click_customer_service')
  }

  /**
   * User full name is hidden with an ellipsis if too long
   * Here we check if the ellipsis is on, if so we add a tooltip on hover to see the entire name.
   */
  useEffect(() => {
    const userFullNameHtmlElement = document.getElementById('user-menu-full-name')
    setTooltipText(isEllipsisActive(userFullNameHtmlElement) ? userName : '')
  }, [userName])

  return (
    <>
      <Box>
        {isMobile
          ? <IconButton color="inherit" onClick={openMenu}>
            {getRoleIcon()}
          </IconButton>
          : <Button
            color="inherit"
            data-testid="user-menu-button"
            startIcon={getRoleIcon()}
            endIcon={<ArrowDropDownIcon />}
            onClick={openMenu}
          >
            <Tooltip title={tooltipText} disableInteractive>
              <Typography id="user-menu-full-name" className={typography} sx={{
                maxWidth: MENU_MAX_WIDTH_PX
              }}>
                {userName}
              </Typography>
            </Tooltip>
          </Button>
        }
      </Box>

      <MenuLayout
        open={opened}
        anchorEl={anchorEl}
        onClose={closeMenu}
      >
        <Box className={menu} data-testid="user-menu">
          <MenuItem onClick={onClickSettings} data-testid="user-menu-settings-item">
            <ListItemIcon>
              <PermContactCalendarIcon />
            </ListItemIcon>
            <Typography>
              {t('user-account')}
            </Typography>
          </MenuItem>

          <MenuItem onClick={onClickSupport} data-testid="user-menu-contact-support-item">
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <Typography>
              {t('menu-contact-support')}
            </Typography>
          </MenuItem>

          <Box sx={{ marginY: 2 }}>
            <Divider variant="middle" />
          </Box>

          <MenuItem onClick={onClickLogout} data-testid="user-menu-logout-item">
            <ListItemIcon>
              <CancelIcon />
            </ListItemIcon>
            <Typography>
              {t('button-logout')}
            </Typography>
          </MenuItem>
        </Box>
      </MenuLayout>
    </>
  )
}

export const UserMenuMemoized = React.memo(UserMenu)
