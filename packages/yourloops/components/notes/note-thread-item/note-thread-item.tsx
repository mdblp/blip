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

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { FC } from 'react'
import { getInitials } from '../../../lib/auth/user.util'
import { MessageNote } from '../../../lib/data/models/message-note.model'
import { NoteTextBubble } from '../note-text-bubble/note-text-bubble'
import styles from './note-thread-item.css'

interface NoteThreadItemProps {
  note: MessageNote
  isMainNote: boolean
  isAuthor: boolean
  getDateTime: (timestamp: string) => string
  onClickEdit: (note: MessageNote) => void
}

const AVATAR_MEDIUM_SIZE = '40px'
const AVATAR_SMALL_SIZE = '32px'

const MEDIUM_FONT_SIZE = '20px'
const SMALL_FONT_SIZE = '16px'

export const NoteThreadItem: FC<NoteThreadItemProps> = (props) => {
  const { note, isMainNote, isAuthor, getDateTime, onClickEdit } = props

  const getSize = (): string => {
    return isMainNote ? AVATAR_MEDIUM_SIZE : AVATAR_SMALL_SIZE
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        marginLeft: isMainNote ? 0 : 3
      }}
      data-testid="note-thread-item"
    >
      <Avatar
        sx={{
          bgcolor: 'var(--dark-blue-main)',
          width: getSize(),
          height: getSize(),
          fontSize: isMainNote ? MEDIUM_FONT_SIZE : SMALL_FONT_SIZE
        }}
      >
        {getInitials(note.user.fullName)}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ px: 2, color: 'var(--text-color-secondary)' }}>
          <span className={styles.bold}>{note.user.fullName}</span>
          <span> - {getDateTime(note.timestamp)}</span>
        </Typography>
        <NoteTextBubble
          textMessage={note.messagetext}
          isEditable={isAuthor}
          onClickEdit={() => onClickEdit(note)}
        />
      </Box>
    </Box>
  )
}
