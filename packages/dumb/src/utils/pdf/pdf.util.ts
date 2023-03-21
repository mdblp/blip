/*
 * Copyright (c) 2023, Diabeloop
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

import { FOOTER_FONT_SIZE, HEIGHT, MARGINS } from '../../models/constants/pdf.constants'
import { getFonts } from '../../modules/print/print-view/print-view.util'
import { type Margins } from '../../models/print/margins.model'
import i18next from 'i18next'

interface PageNumbersParams {
  footerFontSize: number
  margins: Margins
  height: number
}

const ALIGN_RIGHT = 'right'
const LIGHT_GREY = '#979797'

const t = i18next.t.bind(i18next)

export const renderPageNumbers = (doc: PDFKit.PDFDocument, params: PageNumbersParams): void => {
  const footerFontSize = params.footerFontSize ?? FOOTER_FONT_SIZE
  const margins = params.margins ?? MARGINS
  const height = params.height ?? HEIGHT
  const pageCount = doc.bufferedPageRange().count
  const fonts = getFonts()
  const pageNumbers = Array.from(Array(pageCount).keys())
  pageNumbers.forEach(value => {
    renderPageNumber(doc, value, fonts.regularName, footerFontSize, margins, pageCount, height)
  })
}

const renderPageNumber = (
  doc: PDFKit.PDFDocument,
  pageNumber: number,
  fontName: string,
  footerFontSize: number,
  margins: Margins,
  numberOfPages: number,
  height: number
): void => {
  doc.switchToPage(pageNumber)
  doc.font(fontName)
    .fontSize(footerFontSize)
    .fillColor(LIGHT_GREY)
    .fillOpacity(1)
  doc.text(
    t('Page {{page}} of {{pageCount}}', { page: pageNumber + 1, pageCount: numberOfPages }),
    margins.left,
    (height + margins.top) - doc.currentLineHeight() * 1.5,
    { align: ALIGN_RIGHT }
  )
}
