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

import React, { type FunctionComponent, type MouseEventHandler } from 'react'

import IconButton from '@mui/material/IconButton'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import DialogRangeDatePicker from './dialog-range-date-picker'
import Button from '@mui/material/Button'
import classes from './date-picker.css'

interface TrendsDatePickerProps {
  atMostRecent: boolean
  displayedDate: string
  disabled: boolean
  end: string
  loading: boolean
  maxDate: string
  minDate: string
  onBackButtonClick: MouseEventHandler<HTMLButtonElement>
  onMostRecentButtonClick: MouseEventHandler<HTMLButtonElement>
  onNextButtonClick: MouseEventHandler<HTMLButtonElement>
  onResult: (start: string, end: string) => void
  start: string
}

export const TrendsDatePicker: FunctionComponent<TrendsDatePickerProps> = (props) => {
  const {
    atMostRecent,
    displayedDate,
    disabled,
    end,
    loading,
    maxDate,
    minDate,
    onBackButtonClick,
    onMostRecentButtonClick,
    onNextButtonClick,
    onResult,
    start
  } = props

  const [isOpen, setIsOpen] = React.useState(false)

  const handleResult = (date: string, end: string): void => {
    onResult(date, end)
    setIsOpen(false)
  }

  const backButtonDisabled = loading
  const nextButtonDisabled = atMostRecent || loading

  return (
    <React.Fragment>
      <IconButton
        data-testid="button-nav-back"
        onClick={onBackButtonClick}
        disabled={backButtonDisabled}
        className={classes.calendarButton}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <Button
        id="trends-chart-title-dates"
        onClick={() => { setIsOpen(true) }}
        disabled={disabled || isOpen}
        className={classes.calendarButton}
      >
        {displayedDate}
      </Button>
      {isOpen &&
        <DialogRangeDatePicker
          start={start}
          end={end}
          minDate={minDate}
          maxDate={maxDate}
          maxSelectableDays={90}
          onResult={handleResult}
          showToolbar
        />
      }
      <IconButton
        data-testid="button-nav-next"
        onClick={onNextButtonClick}
        disabled={nextButtonDisabled}
        className={classes.calendarButton}
      >
        <NavigateNextIcon />
      </IconButton>
      <IconButton
        data-testid="button-nav-mostrecent"
        onClick={onMostRecentButtonClick}
        disabled={nextButtonDisabled}
        className={classes.calendarButton}
      >
        <SkipNextIcon />
      </IconButton>
    </React.Fragment>
  )
}
