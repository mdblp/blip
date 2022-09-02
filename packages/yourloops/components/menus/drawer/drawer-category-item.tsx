/**
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

import React, { FunctionComponent, ReactElement } from 'react'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

const classes = makeStyles((theme: Theme) => ({
  messagingTitle: {
    fontWeight: 700,
    lineHeight: '20px',
    textTransform: 'uppercase'
  },
  monitoringTitleIcon: {
    color: theme.palette.grey[600]
  }
}))

interface DrawerCategoryItemProps {
  icon: ReactElement
  text: string
}

const DrawerCategoryItem: FunctionComponent<DrawerCategoryItemProps> = (props) => {
  const { messagingTitle, monitoringTitleIcon } = classes()

  return (
    <ListItem>
      <ListItemIcon>
        {props.icon}
      </ListItemIcon>
      <ListItemText className={monitoringTitleIcon}>
        <Box className={messagingTitle}>
          {props.text}
        </Box>
      </ListItemText>
    </ListItem>
  )
}

export default DrawerCategoryItem
