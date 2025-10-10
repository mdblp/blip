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

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ConfirmDialog, { type ConfirmDialogProps } from '../../../../components/dialogs/confirm-dialog'

describe('ConfirmDialog', () => {
  const onClose = jest.fn()
  const onConfirm = jest.fn()
  const defaultProps: ConfirmDialogProps = {
    title: 'fakeTitle',
    label: 'fakeLabel',
    inProgress: false,
    onClose,
    onConfirm,
    open: true
  }

  function getConfirmDialogPropsJSX(props: ConfirmDialogProps = defaultProps) {
    return <ConfirmDialog {...props} />
  }

  it('should render correct title and label', () => {
    render(getConfirmDialogPropsJSX())
    expect(screen.getByRole('heading', { name: defaultProps.title })).toBeInTheDocument()
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()
  })

  it('should call onClose when clicking on cancel button', () => {
    render(getConfirmDialogPropsJSX())
    fireEvent.click(screen.getByRole('button', { name: 'button-cancel' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onConfirm when clicking on confirm button', () => {
    render(getConfirmDialogPropsJSX())
    fireEvent.click(screen.getByRole('button', { name: 'button-confirm' }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('should not display spinner loader when inProgress is false', () => {
    render(getConfirmDialogPropsJSX())
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('should not display spinner loader when inProgress is undefined', () => {
    render(getConfirmDialogPropsJSX({ ...defaultProps, inProgress: undefined }))
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('should display spinner loader when inProgress is true', () => {
    render(getConfirmDialogPropsJSX({ ...defaultProps, inProgress: true }))
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
