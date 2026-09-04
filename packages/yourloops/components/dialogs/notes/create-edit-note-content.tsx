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

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment, { type Moment } from 'moment-timezone'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface CreateEditNoteContentProps {
  title: string
  defaultDateTime: string
  defaultMessage?: string
  timezone: string
  showDateTimePicker: boolean
  onClickSubmit: (data: { message: string, datetime: Moment }) => void
  onClose: () => void
}

enum IdPrefix {
  Create = 'create',
  Edit = 'edit'
}

export const CreateEditNoteContent: FC<CreateEditNoteContentProps> = (props) => {
  const { title, defaultDateTime, defaultMessage, timezone, showDateTimePicker, onClickSubmit, onClose } = props
  const { t } = useTranslation('main')

  const defaultDateTimeMoment = moment.utc(defaultDateTime).tz(timezone)

  const [noteMessage, setNoteMessage] = React.useState<string>(defaultMessage || '')
  const [noteDateTime, setNoteDateTime] = React.useState<Moment>(defaultDateTimeMoment)

  const isEditing = !!defaultMessage

  const submitButtonLabel = isEditing ? t('button-edit') : t('button-create-note')
  const idPrefix = isEditing ? IdPrefix.Edit : IdPrefix.Create

  const isFormUpdated = (): boolean => {
    const isDateTimeUpdated = noteDateTime?.toISOString() !== defaultDateTime
    const isMessageUpdated = noteMessage !== defaultMessage
    return showDateTimePicker ? isDateTimeUpdated || isMessageUpdated : isMessageUpdated
  }

  const isFormValid = (): boolean => {
    const isDateTimeValid = noteDateTime?.isValid()
    const isCommentValid = noteMessage.trim().length > 0
    const isValid = isDateTimeValid && isCommentValid

    return isEditing ? isValid && isFormUpdated() : isValid
  }

  return (
    <>
      <DialogTitle data-testid={`${idPrefix}-note-title`}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {showDateTimePicker &&
            <DateTimePicker
              value={noteDateTime}
              onChange={(newDateTime: Moment) => setNoteDateTime(newDateTime)}
              slotProps={{
                textField: {
                  slotProps: {
                    htmlInput: {
                      'data-testid': `${idPrefix}-note-datetime-input`
                    } as React.InputHTMLAttributes<HTMLInputElement>
                  }
                }
              }}
            />
          }

          <TextField
            placeholder={t('note-create-input-placeholder')}
            variant="outlined"
            sx={{ width: '100%' }}
            aria-label={t(`note-${idPrefix}-input`)}
            value={noteMessage}
            multiline
            rows={4}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNoteMessage(event.target.value)
            }}
            slotProps={{
              htmlInput: {
                'data-testid': `note-${idPrefix}-input`
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions data-testid={`${idPrefix}-note-actions`}>
        <Button
          variant="outlined"
          onClick={onClose}
          data-testid="cancel-button"
        >
          {t('button-cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onClickSubmit({ message: noteMessage, datetime: noteDateTime })}
          data-testid={`${idPrefix}-button`}
          disabled={!isFormValid()}
        >
          {submitButtonLabel}
        </Button>
      </DialogActions>
    </>
  )
}
