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

import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import React, { type FunctionComponent, type PropsWithChildren } from 'react'

interface DailyDrawerProps {
  onClose: () => void
}

export const DailyDrawer: FunctionComponent<PropsWithChildren<DailyDrawerProps>> = (props) => {
  const { onClose, children } = props

  return (
    <SwipeableDrawer
      data-testid="daily-drawer"
      anchor="bottom"
      open
      onOpen={() => undefined}
      onClose={onClose}
      disableSwipeToOpen
      sx={{ zIndex: (theme) => theme.zIndex.modal }}
      slotProps={{ paper: { sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24 } } }}
    >
      {/* TODO To remove or uncomment */}
      {/*<Box sx={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'var(--grey-color-50)', marginX: 'auto', marginTop: 1 }} />*/}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingX: 1, paddingTop: 1 }}>
        <IconButton data-testid="daily-drawer-close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </SwipeableDrawer>
  )
}
