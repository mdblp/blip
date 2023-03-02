/*
 * Copyright (c) 2017-2023, Diabeloop
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
import _ from 'lodash'
import i18next from 'i18next'

import { FONTS, FOOTER_FONT_SIZE, HEIGHT, MARGINS } from '../../models/constants/pdf.constants'
import { LayoutColumnType } from '../../models/enums/layout-column-type.enum'
import { type Row, type TableColumn } from '../../models/print/pdf-table.model'
import { type LayoutColumn } from '../../models/print/layout-column.model'

interface TableHeading {
  text: string
  subText?: string
  note?: string
}

interface Margins {
  top: number
  bottom: number
  left: number
  right: number
}

interface Fonts {
  regularName: string
  boldName: string
}

interface PageNumbersParams {
  footerFontSize: number
  margins: Margins
  height: number
}

const LIGHT_GREY = '#979797'

const t = i18next.t.bind(i18next)

export const getFonts = (): Fonts => {
  const boldNamePath = `${i18next.language}.boldName`
  const regularNamePath = `${i18next.language}.regularName`
  const boldName = _.get(FONTS, boldNamePath) ?? FONTS.default.boldName
  const regularName = _.get(FONTS, regularNamePath) ?? FONTS.default.regularName
  return {
    regularName,
    boldName
  }
}

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
    { align: 'right' }
  )
}

export const buildLayoutColumns = (layoutColumnWidths: number[], chartAreaWidth: number, layoutColumnType: LayoutColumnType, leftEdge: number, docY: number, gutter: number = 0): LayoutColumn[] => {
  const columns: LayoutColumn[] = []
  const count = layoutColumnWidths.length

  const availableWidth = chartAreaWidth - (gutter * (count - 1))

  switch (layoutColumnType) {
    case LayoutColumnType.Percentage: {
      layoutColumnWidths.reduce((combinedWidths, value, index) => {
        const columnWidth = availableWidth * value / 100
        columns.push({
          x: leftEdge + (gutter * index) + combinedWidths,
          y: docY,
          width: columnWidth
        })
        return combinedWidths + columnWidth
      }, 0)

      break
    }

    case LayoutColumnType.Equal:
    default: {
      const columnWidth = availableWidth / count
      layoutColumnWidths.forEach((value, index) => {
        columns.push({
          x: leftEdge + (gutter * index) + (columnWidth * index),
          y: docY,
          width: columnWidth
        })
      })
      break
    }
  }
  return columns
}

export const getTextData = (row: Row, column: TableColumn, isHeader: boolean | undefined): TableHeading => {
  if ((!isHeader && _.isString(row[column.id])) || _.isString(column.header)) {
    const text = isHeader ? column.header as unknown as string : row[column.id]
    return { text, subText: undefined, note: undefined }
  }
  return row[column.id] as unknown as TableHeading ?? column.header ?? { text: '', subText: '', note: undefined }
}
