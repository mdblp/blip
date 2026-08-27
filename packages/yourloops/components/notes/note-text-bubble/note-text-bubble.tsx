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
import { Popper } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import React, { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import IconActionButton from '../../buttons/icon-action'

interface NoteCommentProps {
  textMessage: string
  isEditable: boolean
  onClickEdit: () => void
}

const MENU_CLOSE_DELAY_MS = 100

const styles = makeStyles({ name: 'note-text-bubble' })(() => {
  return {
    iconButton: {
      padding: '4px',
      '&:hover': {
        backgroundColor: 'var(--info-color-10)'
      }
    }
  }
})

export const NoteTextBubble: FC<NoteCommentProps> = (props) => {
  const { textMessage, isEditable, onClickEdit } = props
  const { t } = useTranslation('main')
  const { classes } = styles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setAnchorEl(null), MENU_CLOSE_DELAY_MS)
  }

  const cancelClose = (element?: React.MouseEvent<HTMLElement> | HTMLElement) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
    }

    if (element && isEditable) {
      if ('currentTarget' in element) {
        setAnchorEl(element.currentTarget)
      } else {
        setAnchorEl(element)
      }
    }
  }

  return (
    <>
      <Chip
        label={textMessage}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onClick={isEditable ? (e) => cancelClose(e.currentTarget) : undefined}
        tabIndex={isEditable ? 0 : -1}
        aria-haspopup={isEditable ? 'true' : undefined}
        aria-expanded={isEditable ? Boolean(anchorEl) : undefined}
        data-testid="note-text-bubble"
        sx={{
          backgroundColor: 'var(--info-color-10)',
          borderRadius: '24px',
          height: 'auto',
          border: 'none',
          width: 'fit-content',
          '& .MuiChip-label': {
            px: 2,
            py: 1,
            fontSize: '14px',
            display: 'block',
            whiteSpace: 'normal'
          },
          '&:hover': {
            backgroundColor: 'var(--info-color-10)'
          }
        }}
      />

      <Popper
        data-testid="note-text-bubble-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="right-end"
        disablePortal
        sx={{ zIndex: (theme) => theme.zIndex.modal }}
      >
        <Paper
          elevation={8}
          onMouseEnter={() => cancelClose()}
          onMouseLeave={scheduleClose}
          sx={{ p: 1, pointerEvents: 'auto' }}
        >
          <Box sx={{ px: 1 }}>
            <IconActionButton
              icon={<EditOutlined />}
              onClick={onClickEdit}
              aria-label={t('button-edit')}
              tooltip={t('button-edit')}
              className={classes.iconButton}
            />
          </Box>
        </Paper>
      </Popper>
    </>
  )
}
