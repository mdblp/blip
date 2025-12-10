/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs, { type Dayjs } from 'dayjs'
import { type Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import DateRangeIcon from '@mui/icons-material/DateRange'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Radio, RadioGroup } from '@mui/material'

import { type CalendarOrientation } from '../date-pickers/models'
import RangeDatePicker from '../date-pickers/range-date-picker'
import { type Patient } from '../../lib/patient/models/patient.model'
import type MedicalDataService from 'medical-domain'
import { TimeService } from 'medical-domain'
import { type BgPrefs } from 'dumb'
import moment from 'moment-timezone'
import { createPrintPDFPackage, utils as vizUtils } from 'tidepool-viz'
import type DataUtil from 'tidepool-viz/src/utils/data'
import DataApi from '../../lib/data/data.api'
import { useAuth } from '../../lib/auth'
import metrics from '../../lib/metrics'
import { useAlert } from '../utils/snackbar'
import { type DateRange } from '../patient-data/patient-data.utils'
import { CsvReportModel } from '../../lib/data/models/csv-report.model'
import { logError } from '../../utils/error.util'
import { errorTextFromException } from '../../lib/utils'

export type Presets = '1week' | '2weeks' | '4weeks' | '3months'

export enum OutputFormat {
  Csv = 'csv',
  Pdf = 'pdf'
}

export interface ReportOptions {
  /** Print start date (ISO day ex: 2022-02-10) */
  start: string
  /** Print end date (ISO day ex: 2022-02-10) */
  end: string
  preset?: Presets
  format: OutputFormat
}

interface PrintReportDialogProps {
  bgPrefs: BgPrefs
  defaultPreset?: Presets
  medicalData: MedicalDataService
  onClose: () => void
  patient: Patient
  updateDataForGivenRange: (dateRange: DateRange) => Promise<{ medicalData: MedicalDataService, dataUtil: DataUtil }>
}

const DEFAULT_PRESET: Presets = '4weeks'
const MAX_SELECTABLE_DAYS = 90

const printOptionsStyle = makeStyles({ name: 'dialog-pdf-options' })((theme: Theme) => {
  return {
    marginTop: {
      marginTop: theme.spacing(2)
    },
    customRangeText: {
      marginBottom: theme.spacing(1)
    },
    presetButtons: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
        width: 'calc(50% - 5px)'
      }
    },
    calendarBox: {
      flexDirection: 'column',
      width: 'fit-content',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row'
      }
    }
  }
})

function getDatesFromPreset(preset: Presets, minDate: Dayjs, maxDate: Dayjs, format: OutputFormat): ReportOptions {
  const end = maxDate.format('YYYY-MM-DD')
  let start: Dayjs
  switch (preset) {
    case '1week':
      start = maxDate.subtract(6, 'days')
      break
    case '2weeks':
      start = maxDate.subtract(13, 'days')
      break
    case '4weeks':
      start = maxDate.subtract(27, 'days')
      break
    case '3months':
    default:
      start = maxDate.subtract(89, 'days')
      break
  }
  if (start.isBefore(minDate)) {
    start = minDate
  }
  return { start: start.format('YYYY-MM-DD'), end, preset, format }
}

export const PrintReportDialog: FC<PrintReportDialogProps> = (props) => {
  const { defaultPreset, onClose, medicalData, bgPrefs, patient, updateDataForGivenRange } = props
  const { t } = useTranslation('yourloops')
  const theme = useTheme()
  const { user } = useAuth()
  const alert = useAlert()
  const matchLandscape = useMediaQuery(theme.breakpoints.up('sm'))
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { classes } = printOptionsStyle()
  const orientation: CalendarOrientation = matchLandscape ? 'landscape' : 'portrait'

  const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null)
  const { minDate, maxDate } = useMemo(() => {
    const { startDate, endDate } = medicalData.getLocaleTimeEndpoints()
    let mi = dayjs(startDate, { utc: true })
    let ma = dayjs(endDate, { utc: true })
    if (customStartDate) {
      const newMinDate = customStartDate.subtract(MAX_SELECTABLE_DAYS, 'day')
      const newMaxDate = customStartDate.add(MAX_SELECTABLE_DAYS, 'day')
      if (newMinDate.isAfter(mi)) {
        mi = newMinDate
      }
      if (newMaxDate.isBefore(ma)) {
        ma = newMaxDate
      }
    }
    return { minDate: mi, maxDate: ma }
  }, [medicalData, customStartDate])

  const [reportOptions, setReportOptions] = useState<ReportOptions>(getDatesFromPreset(defaultPreset ?? DEFAULT_PRESET, minDate, maxDate, OutputFormat.Pdf))
  const [buildingReport, setBuildingReport] = useState<boolean>(false)
  const { start, end, displayedDates } = useMemo(() => {
    const startDate = customStartDate ?? dayjs(reportOptions.start, { utc: true })
    const endDate = customStartDate ?? dayjs(reportOptions.end, { utc: true })
    const displayed = `${startDate.format('ll')} → ${endDate.format('ll')}`
    return { start: startDate, end: endDate, displayedDates: displayed }
  }, [reportOptions, customStartDate])

  const handleClickPreset = (preset: Presets): void => {
    setReportOptions(getDatesFromPreset(preset, minDate, maxDate, reportOptions.format))
  }

  const handleChangeCustomDate = (d: Dayjs): void => {
    if (customStartDate) {
      const startDate = customStartDate.isBefore(d) ? customStartDate.format('YYYY-MM-DD') : d.format('YYYY-MM-DD')
      const endDate = customStartDate.isBefore(d) ? d.format('YYYY-MM-DD') : customStartDate.format('YYYY-MM-DD')
      setReportOptions({ start: startDate, end: endDate, format: reportOptions.format })
      setCustomStartDate(null)
    } else {
      setCustomStartDate(d)
    }
  }

  const presetSelected = reportOptions.preset
  const handleOutputFormat = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setReportOptions({ ...reportOptions, format: event.target.value as OutputFormat })
  }

  const downloadFile = (url: string, fileName: string): void => {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click()
    a.remove()
  }

  const downloadPdf = (pdfUrl: string, patientId: string): void => {
    downloadFile(pdfUrl, `yourloops-report-${patientId}.pdf`)
  }

  const downloadCsv = (report: CsvReportModel): void => {
    const url = window.URL.createObjectURL(new Blob([report.Data]))
    downloadFile(url, report.Name)
  }

  const generatePdf = async (): Promise<string> => {
    const start = moment.tz(reportOptions.start, medicalData.getTimezoneAt(TimeService.getEpoch(reportOptions.start))).startOf('day')
    const timezone = medicalData.getTimezoneAt(TimeService.getEpoch(reportOptions.end))
    const end = moment.tz(reportOptions.end, timezone).endOf('day')
    const endPDFDate = end.toISOString()
    const timePrefs = {
      timezoneAware: true,
      timezoneName: timezone
    }
    const opts = {
      bgPrefs,
      patient,
      timePrefs,
      endPDFDate
    }
    const { medicalData: medicalDataUpdated, dataUtil: dataUtilUpdated } = await updateDataForGivenRange({ start, end })
    const lastPumpSettings = medicalData.medicalData.pumpSettings[medicalData.medicalData.pumpSettings.length - 1]
    const pdfData = {
      basics: medicalDataUpdated.generateBasicsData(start.toISOString(), end.toISOString()),
      daily: vizUtils.data.selectDailyViewData(medicalDataUpdated, start, end),
      settings: !reportOptions.preset && lastPumpSettings
        ? vizUtils.data.generatePumpSettings(lastPumpSettings, end)
        : lastPumpSettings
    }

    vizUtils.data.generatePDFStats(pdfData, dataUtilUpdated)
    const { url } = await createPrintPDFPackage(pdfData, opts)
    return url
  }

  const generateCsv = async (): Promise<CsvReportModel> => {
    const startDate = moment.utc(reportOptions.start).startOf('day').toISOString()
    const endDate = moment.utc(reportOptions.end).endOf('day').toISOString()
    return await DataApi.exportData(user, patient.userid, startDate, endDate)
  }

  const onClickDownload = async (): Promise<void> => {
    try {
      setBuildingReport(true)
      switch (reportOptions.format) {
        case OutputFormat.Pdf:
          downloadPdf(await generatePdf(), patient.userid)
          break
        case OutputFormat.Csv:
          downloadCsv(await generateCsv())
          break
      }
      metrics.send('export_data', `save_report_${reportOptions.format}`, reportOptions.preset ?? 'custom')
      onClose()
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'print-report')

      alert.error(t('error-http-40x'))
      metrics.send('export_data', `save_report$_${reportOptions.format}`, 'error')
    } finally {
      setBuildingReport(false)
    }
  }

  return (
    <Dialog
      id="dialog-pdf-options"
      fullScreen={fullScreen}
      open
      onClose={onClose}
      data-start={reportOptions.start}
      data-end={reportOptions.end}
      maxWidth={false}
    >
      <DialogContent>
        <Typography variant="h4">{t('button-pdf-download-report')}</Typography>

        <Typography variant="body2" className={classes.marginTop}>{t('dialog-pdf-options-presets')}</Typography>
        <Box display="flex" flexDirection="row" flexWrap="wrap"
             justifyContent={matchLandscape ? 'start' : 'space-between'}>
          <Chip
            id="pdf-options-button-one-week"
            variant={presetSelected === '1week' ? 'filled' : 'outlined'}
            color={presetSelected === '1week' ? 'primary' : 'default'}
            aria-selected={presetSelected === '1week'}
            onClick={() => {
              handleClickPreset('1week')
            }}
            className={classes.presetButtons}
            label={t('preset-dates-range-1week')}
          />
          <Chip
            id="pdf-options-button-two-weeks"
            variant={presetSelected === '2weeks' ? 'filled' : 'outlined'}
            color={presetSelected === '2weeks' ? 'primary' : 'default'}
            aria-selected={presetSelected === '2weeks'}
            onClick={() => {
              handleClickPreset('2weeks')
            }}
            className={classes.presetButtons}
            label={t('preset-dates-range-2weeks')}
          />
          <Chip
            id="pdf-options-button-four-weeks"
            variant={presetSelected === '4weeks' ? 'filled' : 'outlined'}
            color={presetSelected === '4weeks' ? 'primary' : 'default'}
            aria-selected={presetSelected === '4weeks'}
            onClick={() => {
              handleClickPreset('4weeks')
            }}
            className={classes.presetButtons}
            label={t('preset-dates-range-4weeks')}
          />
          <Chip
            id="pdf-options-button-three-months"
            variant={presetSelected === '3months' ? 'filled' : 'outlined'}
            color={presetSelected === '3months' ? 'primary' : 'default'}
            aria-selected={presetSelected === '3months'}
            onClick={() => {
              handleClickPreset('3months')
            }}
            className={classes.presetButtons}
            label={t('preset-dates-range-3months')}
          />
        </Box>

        <Box display="flex" mt={2} flexDirection="column">
          <Typography variant="body2"
                      className={classes.customRangeText}>{t('dialog-pdf-options-custom-range')}</Typography>
          <TextField
            id="pdf-options-button-custom-range"
            variant="standard"
            aria-selected={!presetSelected}
            data-displayed={displayedDates}
            value={displayedDates}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box display="flex" className={classes.calendarBox}>
          <RangeDatePicker
            minDate={minDate}
            maxDate={maxDate}
            orientation={orientation}
            onChange={handleChangeCustomDate}
            selection={{ mode: 'range', selected: { start, end } }}
          />
        </Box>

        <Box>
          <Typography variant="body2" className={classes.customRangeText}>{t('dialog-pdf-options-format')}</Typography>

          <RadioGroup
            id="pdf-options-output-format"
            value={reportOptions.format}
            row
            onChange={handleOutputFormat}
          >
            <FormControlLabel
              value="pdf"
              control={<Radio id="dialog-pdf-options-selector-pdf" />}
              label={t('dialog-pdf-options-output-format-pdf')}
            />
            <FormControlLabel
              value="csv"
              control={
                <Radio
                  id="dialog-pdf-options-selector-csv"
                  data-testid="dialog-pdf-options-selector-csv"
                />
              }
              label={t('dialog-pdf-options-output-format-csv')} />
          </RadioGroup>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          id="pdf-options-button-cancel"
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          data-testid="pdf-options-button-download"
          disabled={!!customStartDate}
          loading={buildingReport}
          color="primary"
          variant="contained"
          disableElevation
          onClick={onClickDownload}
        >
          {t('button-download')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
