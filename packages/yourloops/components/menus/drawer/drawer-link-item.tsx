/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FunctionComponent, type ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { type PatientListFilters } from '../../patient-list/enums/patient-list.enum'
import { AppUserRoute } from '../../../models/enums/routes.enum'

const classes = makeStyles()((theme: Theme) => ({
  countLabel: {
    borderRadius: '50%',
    marginLeft: 'auto',
    backgroundColor: theme.palette.primary.main,
    width: '24px',
    lineHeight: '24px',
    textAlign: 'center',
    color: 'white',
    fontSize: '14px'
  },
  listItemRoot: {
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      }
    }
  },
  monitoringBackgroundColor: {
    backgroundColor: theme.palette.warning.main
  },
  selectedColor: {
    color: theme.palette.common.white
  }
}))

interface DrawerLinkItemProps {
  ariaLabel?: string
  count?: number
  icon: ReactElement
  filter: PatientListFilters
  selectedFilter: string
  text: string
}

const DrawerLinkItem: FunctionComponent<DrawerLinkItemProps> = (props) => {
  const { classes: { selectedColor, listItemRoot, countLabel, monitoringBackgroundColor } } = classes()
  const selected = props.filter === props.selectedFilter

  return (
    <Link to={`${AppUserRoute.Home}?filter=${props.filter}`} aria-label={props.filter}>
      <ListItemButton selected={selected} classes={{ root: listItemRoot }}>
        <ListItemIcon aria-label={props.ariaLabel} className={selected ? selectedColor : undefined}>
          {props.icon}
        </ListItemIcon>
        <ListItemText className={selected ? selectedColor : undefined}>
          <Box display="flex">
            {props.text}
            {props.count > 0 &&
              <Box className={`${countLabel} ${monitoringBackgroundColor}`}>
                {props.count}
              </Box>
            }
          </Box>
        </ListItemText>
      </ListItemButton>
    </Link>
  )
}

export default DrawerLinkItem
