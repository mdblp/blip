/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/**
 * @typedef { import("medical-domain";).MedicalDataService } MedicalDataService
 */

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import bows from 'bows'

import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

import * as viz from 'tidepool-viz'


const PumpSettingsContainer = viz.containers.PumpSettingsContainer

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: 'center',
    fontSize: theme.typography.h5
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))


const SettingsDialog = (props) => {
  const {patientData, timePrefs, bgPrefs, onSwitchToDaily, trackMetric, open, setOpen } = props
  const classes = useStyles()
  const log = bows('SettingsDialog')
  const { t } = useTranslation()
  const renderChart = () => {
    /** @type {{patientData: MedicalDataService}} */
    const mostRecentSettings = _.last(patientData.grouped.pumpSettings)
    log.debug('Settings.renderChart()', mostRecentSettings)

    const handleCopySettings = (success, useClipboardAPI, error ) => {
      log.info('handleCopySettings', { success, useClipboardAPI, error })
      trackMetric('export_data', 'copy_as_text', 'settings')
    }

    return (
      <PumpSettingsContainer
        copySettingsClicked={handleCopySettings}
        manufacturerKey={_.get(mostRecentSettings, 'source', patientData.opts.defaultSource).toLowerCase()}
        pumpSettings={mostRecentSettings}
        timePrefs={timePrefs}
        onSwitchToDaily={onSwitchToDaily}
        bgUnits={bgPrefs.bgUnits}
      />
    )
  }

  const renderMissingSettingsMessage = () => {
    return (
      <Trans className="patient-data-message patient-data-message-loading" i18nKey="html.setting-no-uploaded-data" t={t}>
        <p>
          The System Settings view shows your basal rates, carb ratios, sensitivity factors and more, but it looks like your system hasn&apos;t sent data yet.
        </p>
      </Trans>
    )
  }

  const isMissingSettings = () => {
    const pumpSettings = _.get(patientData, 'grouped.pumpSettings', [])
    return _.isEmpty(pumpSettings)
  }

  return (
    <Dialog
      id="device-usage-details-dialog"
      open={open}
      onClose={()=>setOpen(false)}
      maxWidth="lg"
      scroll="body"
    >
      <DialogTitle>
        <Typography className={classes.dialogTitle}>
          <strong>{t('device-usage')}</strong>
        </Typography>
        <IconButton data-testid="close-settings-dialog" className={classes.closeButton} onClick={()=>setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isMissingSettings() ? renderMissingSettingsMessage() : renderChart()}
      </DialogContent>
    </Dialog>
  )
}


SettingsDialog.propTypes = {
  bgPrefs: PropTypes.object.isRequired,
  timePrefs: PropTypes.object.isRequired,
  patientData: PropTypes.object.isRequired,
  onSwitchToDaily: PropTypes.func.isRequired,
  trackMetric: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
}
export default SettingsDialog
