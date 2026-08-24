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

import { EditOutlined } from '@mui/icons-material'
import { Menu } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { FC, useRef, useState } from 'react'

interface NoteCommentProps {
  textMessage: string
  isEditable: boolean
  onClickEdit: () => void
}

const MENU_CLOSE_DELAY_MS = 100

export const NoteComment: FC<NoteCommentProps> = (props) => {
  const { textMessage, isEditable, onClickEdit } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setAnchorEl(null), MENU_CLOSE_DELAY_MS)
  }

  const cancelClose = (element?: React.MouseEvent<HTMLElement>) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
    }

    if (element && isEditable) {
      setAnchorEl(element.currentTarget)
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: 'var(--info-color-10)',
        borderRadius: '24px',
        px: 2,
        py: 1,
        width: 'fit-content'
      }}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <Typography variant="body2">{textMessage}</Typography>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        // Disable pointer events on the Menu component to allow hover events to pass through
        sx={{ px: 1, pointerEvents: 'none' }}
        slotProps={{
          list: {
            onMouseEnter: () => cancelClose(),
            onMouseLeave: scheduleClose
          },
          // Enable pointer events on the Menu's Paper component to allow interaction with the menu items
          paper: { sx: { pointerEvents: 'auto' } },
        }}
      >
        <Box sx={{ px: 2 }}>
          <Box
            sx={{
              display: 'flex',
              p: '4px',
              borderRadius: '24px',
              color: 'var(--text-color-secondary)',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'var(--info-color-10)'
              }
            }}
            onClick={onClickEdit}
          >
            <EditOutlined />
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}
