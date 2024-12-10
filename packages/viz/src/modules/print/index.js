/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
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

import _ from 'lodash'
import i18next from 'i18next'
import moment from 'moment-timezone'
import PDFDocument from 'pdfkit'
import blobStream from 'blob-stream'
import BasicsPrintView from './BasicsPrintView'
import DailyPrintView from './DailyPrintView'
import { reshapeBgClassesToBgBounds } from '../../utils/bloodglucose'
import { PrintView, SettingsPrintView, renderPageNumbers } from 'dumb'
import { getPatientFullName } from '../../utils/misc'
import * as constants from './utils/constants'
import { arrayBufferToBase64 } from './utils/functions'

// TO_DO have a configuration variable to support specific branding or not like done e.g. in Blip
// branding should make use of artifact.sh to download specific branding artifacts such as images
import kaleidoPumpIcon from '../../../../../branding/pump/png/kaleido-pump.png'
import danaPumpIcon from '../../../../../branding/pump/png/dana-pump.png'
import insightPumpIcon from '../../../../../branding/pump/png/insight-pump.png'
import medisafePumpIcon from '../../../../../branding/pump/png/medisafe-pump.png'
import jaFontRegular from 'jaFont-Regular.ttf'
import jaFontBold from 'jaFont-Bold.ttf'

const t = i18next.t.bind(i18next)

// Exporting utils for easy stubbing in tests
export const utils = {
  reshapeBgClassesToBgBounds,
  PDFDocument,
  blobStream,
  PrintView,
  BasicsPrintView,
  DailyPrintView,
  SettingsPrintView
}

async function loadImages() {
  const base64Flag = 'data:image/jpeg;base64,'
  let imageStr = ''

  if (constants.Images.logo === null) {
    const response = await fetch(`/branding_${window.config.BRANDING}_pdf-logo.png`)
    const buffer = await response.arrayBuffer()
    imageStr = base64Flag + arrayBufferToBase64(buffer)
    constants.Images.logo = imageStr
  }

  if (constants.Images.kaleidoPumpIcon === null) {
    if (kaleidoPumpIcon.startsWith(base64Flag)) {
      imageStr = kaleidoPumpIcon
    } else {
      const response = await fetch(kaleidoPumpIcon)
      const buffer = await response.arrayBuffer()
      imageStr = base64Flag + arrayBufferToBase64(buffer)
    }
    constants.Images.kaleidoPumpIcon = imageStr
  }

  if (constants.Images.danaPumpIcon === null) {
    if (danaPumpIcon.startsWith(base64Flag)) {
      imageStr = danaPumpIcon
    } else {
      const response = await fetch(danaPumpIcon)
      const buffer = await response.arrayBuffer()
      imageStr = base64Flag + arrayBufferToBase64(buffer)
    }
    constants.Images.danaPumpIcon = imageStr
  }

  if (constants.Images.insightPumpIcon === null) {
    if (insightPumpIcon.startsWith(base64Flag)) {
      imageStr = insightPumpIcon
    } else {
      const response = await fetch(insightPumpIcon)
      const buffer = await response.arrayBuffer()
      imageStr = base64Flag + arrayBufferToBase64(buffer)
    }
    constants.Images.insightPumpIcon = imageStr
  }

  if (constants.Images.medisafePumpIcon === null) {
    if (medisafePumpIcon.startsWith(base64Flag)) {
      imageStr = kaleidoPumpIcon
    } else {
      const response = await fetch(medisafePumpIcon)
      const buffer = await response.arrayBuffer()
      imageStr = base64Flag + arrayBufferToBase64(buffer)
    }
    constants.Images.medisafePumpIcon = imageStr
  }
}

async function loadFonts() {
  if (i18next.language === 'ja') {
    if (constants.Fonts.ja.regular === null) {
      const response = await fetch(jaFontRegular)
      if (response.ok) {
        constants.Fonts.ja.regular = await response.arrayBuffer()
      } else {
        console.error('Failed to download', response.status, jaFontRegular)
      }
    }
    if (constants.Fonts.ja.bold === null) {
      const response = await fetch(jaFontBold)
      if (response.ok) {
        constants.Fonts.ja.bold = await response.arrayBuffer()
      } else {
        console.error('Failed to download', response.status, jaFontBold)
      }
    }
  }
}

/**
 * createPrintView
 * @param {Object} doc - PDFKit document instance
 * @param {Object} data - pre-munged data for the daily print view
 * @param {Object} opts - options
 * @param {Object} type - render type
 *
 * @return {Object} dailyPrintView instance
 */
export function createPrintView(type, data, opts, doc) {
  const {
    bgPrefs,
    patient,
    timePrefs,
    dpi,
    width,
    height,
    margins,
    logo
  } = opts

  let Renderer
  let renderOpts = {
    bgPrefs,
    // TODO: set this up as a Webpack Define plugin to pull from env variable
    debug: false,
    defaultFontSize: constants.DEFAULT_FONT_SIZE,
    dpi: dpi ?? constants.DPI,
    footerFontSize: constants.FOOTER_FONT_SIZE,
    headerFontSize: constants.HEADER_FONT_SIZE,
    height: height ?? constants.HEIGHT,
    margins: margins ?? constants.MARGINS,
    logo,
    patient,
    smallFontSize: constants.SMALL_FONT_SIZE,
    timePrefs,
    width: width ?? constants.WIDTH
  }

  switch (type) {
    case 'daily':
      Renderer = utils.DailyPrintView

      renderOpts = _.assign(renderOpts, {
        chartsPerPage: 3,
        summaryHeaderFontSize: 10,
        summaryWidthAsPercentage: 0.18,
        title: t('Daily Charts')
      })
      break

    case 'basics':
      Renderer = utils.BasicsPrintView

      renderOpts = _.assign(renderOpts, {
        title: t('The Basics')
      })
      break

    case 'settings':
      Renderer = utils.SettingsPrintView

      renderOpts = _.assign(renderOpts, {
        title: t('settings')
      })
      break

    default:
      return null
  }

  return new Renderer(doc, data, renderOpts)
}

/**
 * createPrintPDFPackage
 * @param {Object} data - Object of tideline-preprocessed Tidepool diabetes data & notes;
 *                       grouped by type
 * @param {Object} opts - an object of print options (see destructured param below)
 *
 * @return {Promise} - Promise that resolves with an object containing the pdf blob and url
 */
export function createPrintPDFPackage(data, opts) {
  return new Promise((resolve, reject) => {
    try {
      const pdfOpts = _.cloneDeep(opts)
      pdfOpts.bgPrefs.bgBounds = utils.reshapeBgClassesToBgBounds(opts.bgPrefs)

      // Paper size A4 -> [595.28, 841.89]
      // see node_modules/pdfkit/js/pdfkit.js:300
      // For USA, it should be set to the default US letter format
      // see packages/viz/src/modules/print/utils/constants.js
      pdfOpts.dpi = constants.DPI
      const margin = constants.DPI / 2
      pdfOpts.width = 595.28 - 2 * margin
      pdfOpts.height = 841.89 - 2 * margin
      pdfOpts.margins = {
        left: margin,
        top: margin,
        right: margin,
        bottom: margin
      }
      pdfOpts.logo = constants.Images.logo

      const mReportDate = moment.tz(opts.endPDFDate, opts.timePrefs.timezoneName)
      const reportDate = mReportDate.format('YYYY-MM-DD')
      const patientName = getPatientFullName(opts.patient)

      // NB: if you don't set the `margin` (or `margins` if not all are the same)
      // then when you are using the .text() command a new page will be added if you specify
      // coordinates outside of the default margin (or outside of the margins you've specified)
      const doc = new utils.PDFDocument({
        autoFirstPage: false,
        bufferPages: true,
        margin: constants.MARGIN,
        displayTitle: `${reportDate} - ${patientName}`,
        lang: i18next.language,
        compress: true,
        size: 'A4',
        info: {
          Title: `${reportDate} - ${patientName}`,
          Author: 'Diabeloop',
          ModDate: mReportDate.toDate()
        }
      })

      const stream = doc.pipe(utils.blobStream())

      _.forOwn(constants.Fonts, (f) => {
        if (typeof f.regularName === 'string' && f.regular) {
          doc.registerFont(f.regularName, f.regular)
        }
        if (typeof f.boldName === 'string' && f.bold) {
          doc.registerFont(f.boldName, f.bold)
        }
      })

      if (data.basics) createPrintView('basics', data.basics, pdfOpts, doc).render()
      if (data.daily) createPrintView('daily', data.daily, pdfOpts, doc).render()
      if (data.settings) createPrintView('settings', data.settings, pdfOpts, doc).render()

      const renderPageParams = {
        footerFontSize: pdfOpts.footerFontSize,
        margins: pdfOpts.margins,
        height: pdfOpts.height
      }
      renderPageNumbers(doc, renderPageParams)

      doc.end()
      const buffers = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers)
        const pdfBase64 = pdfBuffer.toString('base64')
        return resolve( {url : `data:application/octet-stream;charset=utf-16le;base64,${pdfBase64}`})
      })

      stream.on('error', (error) => {
        stream.end()
        return reject(error)
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function doPrint(data, opts) {
  await loadImages()
  await loadFonts()
  return createPrintPDFPackage(data, opts)
}

export default doPrint
