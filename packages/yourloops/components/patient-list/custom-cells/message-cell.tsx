/*
 * Copyright (c) 2023-2026, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { useTranslation } from 'react-i18next'
import { NoMessageIcon } from '../../icons/diabeloop/no-message-icon'
import { MessageIcon } from '../../icons/diabeloop/message-icon'

interface MessageCellProps {
  hasNewMessages: boolean
}

export const MessageCell: FunctionComponent<MessageCellProps> = ({ hasNewMessages }) => {
  const { t } = useTranslation()
  const newUnreadMessagesLabel = t('new-unread-messages')
  const noNewMessagesLabel = t('no-new-messages')
  const title = hasNewMessages ? newUnreadMessagesLabel : noNewMessagesLabel

  return (
    <Tooltip title={title} aria-label={title}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {hasNewMessages
          ? <Badge color="warning" variant="dot">
            <MessageIcon
              data-testid="message-icon"
              titleAccess={newUnreadMessagesLabel}
              aria-label={newUnreadMessagesLabel}
              color="inherit"
            />
          </Badge>
          : <NoMessageIcon
            data-testid="message-icon"
            titleAccess={noNewMessagesLabel}
            aria-label={noNewMessagesLabel}
            color="disabled"
          />
        }
      </Box>
    </Tooltip>
  )
}

