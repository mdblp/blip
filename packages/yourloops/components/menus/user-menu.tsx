/*
 * Copyright (c) 2022, Diabeloop
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
import { useHistory } from 'react-router-dom'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CancelIcon from '@mui/icons-material/Cancel'
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined'
import FaceIcon from '@mui/icons-material/Face'
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import StethoscopeIcon from '../icons/StethoscopeIcon'

import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import { UserRoles } from '../../models/user'
import { useAuth } from '../../lib/auth'
import RoundedHospitalIcon from '../icons/RoundedHospitalIcon'
import config from '../../lib/config'
import metrics from '../../lib/metrics'
import MenuLayout from '../../layout/menu-layout'
import { isEllipsisActive } from '../../lib/utils'

const classes = makeStyles((theme: Theme) => ({
  clickableMenu: {
    cursor: 'pointer'
  },
  typography: {
    margin: `0 ${theme.spacing(1)}`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}))

function UserMenu(): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { user, logout } = useAuth()
  const { clickableMenu, typography } = classes()
  const history = useHistory()
  const theme = useTheme()
  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))
  const [tooltipText, setTooltipText] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const opened = !!anchorEl

  const getRoleIcon = (): JSX.Element | null => {
    switch (user?.role) {
      case UserRoles.hcp:
        return <StethoscopeIcon />
      case UserRoles.caregiver:
        return <RoundedHospitalIcon />
      case UserRoles.patient:
        return <FaceIcon />
      default:
        console.error('Unknown role')
        return null
    }
  }

  const closeMenu = (): void => {
    setAnchorEl(null)
  }

  const onClickSettings = (): void => {
    history.push('/preferences')
    closeMenu()
  }

  const onClickLogout = async (): Promise<void> => {
    await logout()
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
    setTooltipText(isEllipsisActive(userFullNameHtmlElement) ? user?.fullName : '')
  }, [user?.fullName])

  return (
    <React.Fragment>
      <Box
        id="user-menu"
        display="flex"
        alignItems="center"
        className={clickableMenu}
        maxWidth={250}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <Box id="user-role-icon" display="flex">
          {getRoleIcon()}
        </Box>
        {!isMobileBreakpoint &&
          <React.Fragment>
            <Tooltip title={tooltipText}>
              <Typography id="user-menu-full-name" className={typography}>
                {user?.fullName}
              </Typography>
            </Tooltip>
            <ArrowDropDownIcon />
          </React.Fragment>
        }
      </Box>
      <MenuLayout
        open={opened}
        anchorEl={anchorEl}
        onClose={closeMenu}
      >
        <MenuItem id="user-menu-settings-item" onClick={onClickSettings}>
          <ListItemIcon>
            <PermContactCalendarIcon />
          </ListItemIcon>
          <Typography>
            {t('profile-settings')}
          </Typography>
        </MenuItem>

        <MenuItem id="contact-menu-item" onClick={onClickSupport}>
          <ListItemIcon>
            <ContactSupportOutlinedIcon />
          </ListItemIcon>
          <Typography>
            {t('menu-contact-support')}
          </Typography>
        </MenuItem>

        <Box marginY={1}>
          <Divider variant="middle" />
        </Box>

        <MenuItem id="user-menu-logout-item" onClick={onClickLogout}>
          <ListItemIcon>
            <CancelIcon />
          </ListItemIcon>
          <Typography>
            {t('menu-logout')}
          </Typography>
        </MenuItem>
      </MenuLayout>
    </React.Fragment>
  )
}

export default UserMenu
