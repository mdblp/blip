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

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event/dist/cjs/index.js'
import moment from 'moment-timezone'
import { patient2FullName, patient2Initials, userTimFullName, userTimInitials } from '../mock/auth0.hook.mock'
import { NOTE_ID } from '../mock/data.api.mock'

export const checkNoteView = async (nowDate: Date) => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  const displayedDate = moment.utc(nowDate.toISOString()).tz('Europe/Paris').format('MMM D, YYYY h:mm a')

  expect(note).toBeVisible()
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')

  expect(dialog).toBeVisible()
  expect(within(dialog).getByTestId('view-note-title')).toHaveTextContent('Note')
  expect(within(dialog).getByTestId('view-note-thread')).toHaveTextContent(`${patient2Initials}${patient2FullName} - Aug 8, 2022 2:00 pmThis day was very stressful${userTimInitials}${userTimFullName} - Aug 8, 2022 5:00 pmReally? What happened?${patient2Initials}${patient2FullName} - Aug 8, 2022 5:16 pmA lot of things...`)

  const allNotes = within(dialog).getAllByTestId('note-text-bubble')
  const mainNote = allNotes[0]
  const firstComment = allNotes[1]
  const secondComment = allNotes[2]
  expect(mainNote).toHaveTextContent('This day was very stressful')

  expect(screen.queryByTestId('note-text-bubble-menu')).not.toBeInTheDocument()
  await userEvent.hover(mainNote)
  expect(screen.getByTestId('note-text-bubble-menu')).toBeVisible()
  expect(within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })).toBeVisible()
  await userEvent.unhover(mainNote)
  await waitFor(() => {
    expect(screen.queryByTestId('note-text-bubble-menu')).not.toBeInTheDocument()
  })

  await userEvent.hover(firstComment)
  expect(screen.queryByTestId('note-text-bubble-menu')).not.toBeInTheDocument()
  await userEvent.unhover(firstComment)

  await userEvent.hover(secondComment)
  expect(screen.getByTestId('note-text-bubble-menu')).toBeVisible()
  expect(within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })).toBeVisible()
  await userEvent.unhover(secondComment)
  await waitFor(() => {
    expect(screen.queryByTestId('note-text-bubble-menu')).not.toBeInTheDocument()
  })

  expect(within(dialog).getByTestId('view-note-add-comment')).toHaveTextContent(displayedDate)
  expect(within(dialog).getByPlaceholderText('Type a comment here ...')).toBeVisible()
  expect(within(dialog).getByTestId('view-note-actions')).toHaveTextContent('ClosePost')
  expect(within(dialog).getByRole('button', { name: 'Post' })).toBeDisabled()

  await userEvent.click(within(dialog).getByTestId('close-button'))
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteAddCommentSuccess = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  expect(dialog).toBeVisible()
  const commentInput = within(dialog).getByRole('textbox')
  expect(commentInput).toBeVisible()

  const submitButton = within(dialog).getByRole('button', { name: 'Post' })
  expect(submitButton).toBeDisabled()

  await userEvent.type(commentInput, ' ')
  expect(submitButton).toBeDisabled()

  await userEvent.type(commentInput, 'New comment on this note')
  expect(submitButton).toBeEnabled()

  await userEvent.clear(commentInput)
  expect(submitButton).toBeDisabled()

  await userEvent.type(commentInput, 'New comment on this note')
  expect(submitButton).toBeEnabled()

  await userEvent.click(submitButton)

  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Comment added successfully')
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteAddCommentFailure = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  await userEvent.type(within(dialog).getByRole('textbox'), 'New comment on this note')

  const submitButton = within(dialog).getByRole('button', { name: 'Post' })
  await userEvent.click(submitButton)

  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('An error occurred, please try again later.')
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteCreateContent = async () => {
  const newNoteButton = screen.getByTestId('new-note-button')

  await userEvent.hover(newNoteButton)
  const tooltip = screen.getByTestId('new-note-tooltip')
  expect(tooltip).toBeVisible()
  expect(tooltip).toHaveTextContent('New note')

  await userEvent.unhover(newNoteButton)
  expect(screen.queryByTestId('new-note-tooltip')).not.toBeInTheDocument()

  fireEvent.click(newNoteButton)

  const dialog = await screen.findByTestId('create-note-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('New note08/08/2022 12:00 PM​​CancelCreate note')
  expect(within(dialog).getByPlaceholderText('Type a new note here ...')).toBeVisible()

  const createButton = within(dialog).getByRole('button', { name: 'Create note' })
  expect(createButton).toBeDisabled()

  // Text field validation
  const textarea = within(dialog).getByRole('textbox')
  await userEvent.type(textarea, 'My new note')
  expect(createButton).toBeEnabled()
  await userEvent.clear(textarea)
  expect(createButton).toBeDisabled()
  await userEvent.type(textarea, ' ')
  expect(createButton).toBeDisabled()
  await userEvent.type(textarea, 'My new note')
  expect(createButton).toBeEnabled()

  // Datetime field validation
  const dateTimeInput = within(dialog).getByTestId('create-note-datetime-input')
  await userEvent.type(dateTimeInput, '09/08/2022 02:00 PM')
  expect(createButton).toBeEnabled()
  await userEvent.clear(dateTimeInput)
  expect(createButton).toBeDisabled()

  // Cross-field validation
  await userEvent.type(dateTimeInput, '09/08/2022 02:00 PM')
  expect(createButton).toBeEnabled()
  await userEvent.clear(textarea)
  await userEvent.type(textarea, ' ')
  expect(createButton).toBeDisabled()

  await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
  expect(screen.queryByTestId('create-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteEditContent = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  expect(dialog).toBeVisible()

  const allNotes = within(dialog).getAllByTestId('note-text-bubble')
  expect(allNotes).toHaveLength(3)
  await userEvent.hover(allNotes[0])
  const openEditDialogButton = within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })
  await userEvent.click(openEditDialogButton)

  const editNoteDialog = await screen.findByTestId('edit-note-dialog')
  expect(editNoteDialog).toBeVisible()
  expect(editNoteDialog).toHaveTextContent('Edit note08/08/2022 02:00 PM​This day was very stressful​CancelEdit')

  const cancelButton = within(editNoteDialog).getByRole('button', { name: 'Cancel' })
  const editButton = within(editNoteDialog).getByRole('button', { name: 'Edit' })

  expect(cancelButton).toBeEnabled()
  expect(editButton).toBeDisabled()

  // Text field validation
  const textarea = within(editNoteDialog).getByRole('textbox')
  await userEvent.type(textarea, ' edited')
  expect(editButton).toBeEnabled()
  await userEvent.clear(textarea)
  expect(editButton).toBeDisabled()
  await userEvent.type(textarea, ' ')
  expect(editButton).toBeDisabled()
  await userEvent.clear(textarea)
  await userEvent.type(textarea, 'This day was very stressful')
  expect(editButton).toBeDisabled()

  // Datetime field validation
  const dateTimeInput = within(editNoteDialog).getByTestId('edit-note-datetime-input')
  await userEvent.type(dateTimeInput, '09/08/2022 02:00 PM')
  expect(editButton).toBeEnabled()
  await userEvent.type(dateTimeInput, '08/08/2022 02:00 PM')
  expect(editButton).toBeDisabled()

  // Cross-field validation
  await userEvent.type(dateTimeInput, '09/08/2022 02:00 PM')
  expect(editButton).toBeEnabled()
  await userEvent.clear(textarea)
  await userEvent.type(textarea, ' ')
  expect(editButton).toBeDisabled()

  await userEvent.click(cancelButton)
  expect(screen.queryByTestId('edit-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('view-note-dialog')).toBeVisible()
  await userEvent.click(within(dialog).getByTestId('close-button'))
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteCommentEditContent = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  expect(dialog).toBeVisible()

  const allNotes = within(dialog).getAllByTestId('note-text-bubble')
  await userEvent.hover(allNotes[2])
  const openEditDialogButton = within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })
  await userEvent.click(openEditDialogButton)

  const editNoteDialog = await screen.findByTestId('edit-note-dialog')
  expect(editNoteDialog).toBeVisible()
  expect(editNoteDialog).toHaveTextContent('Edit note commentA lot of things...​CancelEdit')

  const cancelButton = within(editNoteDialog).getByRole('button', { name: 'Cancel' })
  const editButton = within(editNoteDialog).getByRole('button', { name: 'Edit' })

  expect(cancelButton).toBeEnabled()
  expect(editButton).toBeDisabled()

  // Text field validation
  const textarea = within(editNoteDialog).getByRole('textbox')
  await userEvent.type(textarea, ' edited')
  expect(editButton).toBeEnabled()
  await userEvent.clear(textarea)
  expect(editButton).toBeDisabled()
  await userEvent.type(textarea, ' ')
  expect(editButton).toBeDisabled()
  await userEvent.clear(textarea)
  await userEvent.type(textarea, 'A lot of things...')
  expect(editButton).toBeDisabled()

  await userEvent.click(cancelButton)
  expect(screen.queryByTestId('edit-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('view-note-dialog')).toBeVisible()
  await userEvent.click(within(dialog).getByTestId('close-button'))
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteEditSuccess = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  const allNotes = within(dialog).getAllByTestId('note-text-bubble')
  await userEvent.hover(allNotes[0])
  const openEditDialogButton = within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })
  await userEvent.click(openEditDialogButton)

  const editNoteDialog = await screen.findByTestId('edit-note-dialog')
  expect(editNoteDialog).toBeVisible()

  const textarea = within(editNoteDialog).getByRole('textbox')
  await userEvent.type(textarea, ' edited')

  const editButton = within(editNoteDialog).getByRole('button', { name: 'Edit' })
  expect(editButton).toBeEnabled()
  await userEvent.click(editButton)

  expect(screen.queryByTestId('edit-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('view-note-dialog')).toBeVisible()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Note edited successfully')

  await userEvent.click(within(dialog).getByTestId('close-button'))
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteCreateSuccess = async () => {
  const newNoteButton = screen.getByTestId('new-note-button')
  fireEvent.click(newNoteButton)

  const dialog = await screen.findByTestId('create-note-dialog')
  expect(dialog).toBeVisible()

  const textarea = within(dialog).getByRole('textbox')
  await userEvent.type(textarea, 'New note content')
  const createButton = within(dialog).getByRole('button', { name: 'Create note' })
  await userEvent.click(createButton)

  expect(screen.queryByTestId('create-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Note created successfully')
}

export const checkNoteCommentEditSuccess = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  const allNotes = within(dialog).getAllByTestId('note-text-bubble')
  await userEvent.hover(allNotes[2])
  const openEditDialogButton = within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })
  await userEvent.click(openEditDialogButton)

  const editNoteDialog = await screen.findByTestId('edit-note-dialog')
  expect(editNoteDialog).toBeVisible()

  const textarea = within(editNoteDialog).getByRole('textbox')
  await userEvent.type(textarea, ' edited')

  const editButton = within(editNoteDialog).getByRole('button', { name: 'Edit' })
  expect(editButton).toBeEnabled()
  await userEvent.click(editButton)

  expect(screen.queryByTestId('edit-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('view-note-dialog')).toBeVisible()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Note comment edited successfully')

  await userEvent.click(within(dialog).getByTestId('close-button'))
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}

export const checkNoteCreateFailure = async () => {
  const newNoteButton = screen.getByTestId('new-note-button')
  fireEvent.click(newNoteButton)

  const dialog = await screen.findByTestId('create-note-dialog')
  expect(dialog).toBeVisible()

  const textarea = within(dialog).getByRole('textbox')
  await userEvent.type(textarea, 'New note content')
  const createButton = within(dialog).getByRole('button', { name: 'Create note' })
  await userEvent.click(createButton)

  expect(screen.queryByTestId('create-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('An error occurred, please try again later.')
}

export const checkNoteEditFailure = async () => {
  const note = screen.getByTestId(`note_group_${NOTE_ID}`)
  fireEvent.click(note)

  const dialog = await screen.findByTestId('view-note-dialog')
  const allNotes = within(dialog).getAllByTestId('note-text-bubble')
  await userEvent.hover(allNotes[0])
  const openEditDialogButton = within(screen.getByTestId('note-text-bubble-menu')).getByRole('button', { name: 'Edit' })
  await userEvent.click(openEditDialogButton)

  const editNoteDialog = await screen.findByTestId('edit-note-dialog')
  expect(editNoteDialog).toBeVisible()

  const textarea = within(editNoteDialog).getByRole('textbox')
  await userEvent.type(textarea, ' edited')

  const editButton = within(editNoteDialog).getByRole('button', { name: 'Edit' })
  expect(editButton).toBeEnabled()
  await userEvent.click(editButton)

  expect(screen.queryByTestId('edit-note-dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('view-note-dialog')).toBeVisible()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('An error occurred, please try again later.')

  await userEvent.click(within(dialog).getByTestId('close-button'))
  expect(screen.queryByTestId('view-note-dialog')).not.toBeInTheDocument()
}
