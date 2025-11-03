/*
 * Copyright (c) 2014-2024, Diabeloop
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

import DialogDatePicker from './dialog-date-picker'
import IconButton from '@mui/material/IconButton'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import classes from './date-picker.css'
import Button from '@mui/material/Button'


interface DailyDatePickerProps {
  atMostRecent: boolean
  date: number | string | Date
  displayedDate: string
  endDate: number | string | Date
  inTransition: boolean
  loading: boolean
  onBackButtonClick: MouseEventHandler<HTMLButtonElement>
  onMostRecentButtonClick: MouseEventHandler<HTMLButtonElement>
  onNextButtonClick: MouseEventHandler<HTMLButtonElement>
  onSelectedDateChange: (start: string) => void
  startDate: number | string | Date
}

export const DailyDatePicker: FunctionComponent<DailyDatePickerProps> = (props) => {
  const {
    atMostRecent,
    date,
    displayedDate,
    endDate,
    inTransition,
    loading,
    onBackButtonClick,
    onMostRecentButtonClick,
    onNextButtonClick,
    onSelectedDateChange,
    startDate
  } = props

  const [isOpen, setIsOpen] = React.useState(false)

  const handleResult = (date: string): void => {
    setIsOpen(false)
    onSelectedDateChange(date)
  }

  const isComponentReady = !inTransition && !loading
  const backButtonDisabled = !isComponentReady
  const nextButtonDisabled = !isComponentReady || atMostRecent

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
        id="daily-chart-title-date"
        data-testid="daily-chart-title-date"
        onClick={() => { setIsOpen(true) }}
        disabled={!isComponentReady || isOpen}
        className={classes.calendarButton}
      >
        {displayedDate}
      </Button>
      {isOpen &&
        <DialogDatePicker
          date={date}
          minDate={startDate}
          maxDate={endDate}
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
