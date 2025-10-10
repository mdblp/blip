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
import type VoilabPdfTable from 'voilab-pdf-table'
import PdfTable from 'voilab-pdf-table'
import i18next from 'i18next'
import colors from '../../../styles/colors.css'
import PdfTableFitColumn from 'voilab-pdf-table/plugins/fitcolumn'

import { formatBirthdate, formatCurrentDate, formatDateRange } from '../../../utils/datetime/datetime.util'

import { DPI, FOOTER_FONT_SIZE, HEIGHT, MARGIN, MARGINS } from '../../../models/constants/pdf.constants'
import { type BgBounds, type BgUnit, type TimePrefs } from 'medical-domain'
import { type BgPrefs } from '../../../models/blood-glucose.model'
import { getFonts, getTextData } from './print-view.util'
import { getPatientFullName } from '../../../utils/patient/patient.util'
import {
  type PdfDocumentOverridden,
  type PdfTableColumnOverridden,
  type PdfTableConfigOverridden,
  type PdfTableOverridden
} from '../../../models/print/pdf-override.model'
import {
  type Row,
  type Table,
  type TableColumn,
  type TableHeading,
  type TableSettings
} from '../../../models/print/pdf-table.model'
import { type Position } from '../../../models/print/position.model'
import { type ChartArea } from '../../../models/print/chart-area.model'
import { type PdfData } from '../../../models/print/pdf-data.model'
import { type Margins } from '../../../models/print/margins.model'
import { type SectionHeading } from '../../../models/print/section-heading.model'
import { type PatientToPrint } from '../../../models/print/patient-to-print.model'
import { type PatientInfoBox } from '../../../models/print/patient-info-box.model'
import { type PrintViewParams } from '../../../models/print/print-view-params.model'
import { type Padding } from '../../../models/print/padding.model'
import { type PageAddEvent } from '../../../models/print/page-add-event.model'
import { type CellStripe } from '../../../models/print/cell-stripe.model'
import { type Colors } from '../../../models/print/colors.model'

const PADDING_PATIENT_INFO = 10

const APP_URL = `${window.location.protocol}//${window.location.hostname}/`
const ALIGN_CENTER = 'center'
const ALIGN_LEFT = 'left'
const COLOR_BLACK = 'black'
const COLOR_WHITE = 'white'
const COLUMN_DEFAULT_PADDING = [7, 5, 3, 5]
const DEFAULT_FONT_SIZE = 10
const DEFAULT_OPACITY = 1
const DEFAULT_STRIPE_WIDTH = 6
const DIVIDER_WIDTH = PADDING_PATIENT_INFO * 2 + 1
const EXTRA_SMALL_FONT_SIZE = 6
const HEADER_FONT_SIZE = 14
const HEADING_COLUMN_ID = 'heading'
const LARGE_FONT_SIZE = 12
const LINE_HEIGHT_REFERENCE_FONT_SIZE = 14
const LOGO_WIDTH = 80
const PAGE_ADDED = 'pageAdded'
const PATIENT_FULL_NAME_MAX_LENGTH = 32
const PATIENT_INFO_LINE_GAP = 2
const PATIENT_INFO_LINE_WIDTH = 1
const SMALL_FONT_SIZE = 8
const TABLE_BOTTOM_MARGIN = 20
const WIDTH = 8.5 * DPI - (2 * MARGIN)
const ZEBRA_COLOR = '#FAFAFA'
const ZEBRA_ODD_COLOR = '#FFFFFF'

const t = i18next.t.bind(i18next)

export class PrintView<T> {
  bgBounds?: BgBounds
  bgPrefs: BgPrefs
  bgUnits: BgUnit
  boldFont: string
  bottomEdge: number
  chartArea: ChartArea
  colors: Colors
  currentPageIndex: number
  data: T
  defaultFontSize: number
  doc: PdfDocumentOverridden
  extraSmallFontSize: number
  font: string
  height: number
  initialTotalPages: number
  largeFontSize: number
  margins: Margins
  smallFontSize: number
  tableSettings: TableSettings
  timePrefs: Partial<TimePrefs>
  totalPages: number
  width: number
  #logo: string
  #table?: PdfTableOverridden
  #titleWidth?: number
  readonly #footerFontSize: number
  readonly #headerFontSize: number
  readonly #patient: PatientToPrint
  readonly #patientInfoBox: PatientInfoBox
  readonly #title: string

  constructor(doc: PdfDocumentOverridden, data: PdfData, params: PrintViewParams) {
    this.#title = params.title
    this.#footerFontSize = params.footerFontSize ?? FOOTER_FONT_SIZE
    this.#headerFontSize = params.headerFontSize ?? HEADER_FONT_SIZE
    this.#logo = params.logo
    this.#patient = params.patient
    this.#patientInfoBox = {
      width: 0,
      height: 0
    }

    const fonts = getFonts()
    this.height = params.height ?? HEIGHT
    this.bgPrefs = params.bgPrefs
    this.bgUnits = this.bgPrefs.bgUnits
    this.boldFont = fonts.boldName
    this.bottomEdge = params.margins.top + this.height
    this.currentPageIndex = -1
    this.initialTotalPages = 0
    this.colors = { ...colors }
    this.data = data as T
    this.defaultFontSize = params.defaultFontSize ?? DEFAULT_FONT_SIZE
    this.doc = doc
    this.extraSmallFontSize = params.extraSmallFontSize ?? EXTRA_SMALL_FONT_SIZE
    this.font = fonts.regularName
    this.largeFontSize = params.largeFontSize ?? LARGE_FONT_SIZE
    this.margins = params.margins ?? MARGINS
    this.smallFontSize = params.smallFontSize ?? SMALL_FONT_SIZE
    this.timePrefs = params.timePrefs
    this.totalPages = this.initialTotalPages = this.doc.bufferedPageRange().count || 0
    this.width = params.width ?? WIDTH

    this.tableSettings = {
      colors: {
        border: this.colors.grey,
        tableHeader: this.colors.basal,
        zebraHeader: ZEBRA_COLOR,
        zebraEven: ZEBRA_COLOR,
        zebraOdd: ZEBRA_ODD_COLOR
      },
      borderWidth: 0.5
    }

    this.chartArea = {
      bottomEdge: this.margins.top + params.height,
      leftEdge: this.margins.left,
      topEdge: this.margins.top,
      width: this.width
    }

    // kick off the dynamic calculation of chart area based on font sizes for header and footer
    this.setHeaderSize()
    this.setFooterSize()

    // Auto-bind callback methods
    this.newPage = this.newPage.bind(this)
    this.renderCustomTextCell = this.renderCustomTextCell.bind(this)

    // Clear previous and set up pageAdded listeners :/
    this.doc.removeAllListeners(PAGE_ADDED)
    this.doc.on(PAGE_ADDED, this.newPage)
  }

  newPage(dateText: string): void {
    const currentFont = {
      name: this.doc._font?.name ?? this.font,
      size: this.doc._fontSize ?? this.defaultFontSize
    }

    this.currentPageIndex++
    this.totalPages++

    this.#renderHeader(dateText)
    this.#renderFooter()
    this.doc.x = this.chartArea.leftEdge
    this.doc.y = this.chartArea.topEdge

    // Set font styles back to what they were before the page break
    // This is needed because the header and footer rendering changes it
    // and any tables that need to continue rendering on the new page are affected.
    this.doc
      .font(currentFont.name)
      .fontSize(currentFont.size)

    this.#updateUnfinishedTablePosition()
  }

  getDateRange(startDate: string, endDate: string, format: string, timezone: string | undefined): string {
    return t('pdf-date-range', { range: formatDateRange(startDate, endDate, format, timezone) })
  }

  setFill(color = COLOR_BLACK, opacity = DEFAULT_OPACITY): void {
    this.doc
      .fillColor(color)
      .fillOpacity(opacity)
  }

  setStroke(color = COLOR_BLACK, opacity = DEFAULT_OPACITY): void {
    this.doc
      .strokeColor(color)
      .strokeOpacity(opacity)
  }

  resetText(): void {
    this.setFill()
    this.doc
      .lineGap(0)
      .fontSize(this.defaultFontSize)
      .font(this.font)
  }

  renderSectionHeading(text: string, sectionHeading?: SectionHeading): void {
    if (sectionHeading) {
      sectionHeading.align = ALIGN_LEFT
    }

    const xPos = sectionHeading?.xPos ?? this.doc.x
    const yPos = sectionHeading?.yPos ?? this.doc.y
    const font = sectionHeading?.font ?? this.font
    const fontSize = sectionHeading?.fontSize ?? this.#headerFontSize
    const moveDown = sectionHeading?.moveDown ?? 1

    this.doc
      .font(font)
      .fontSize(fontSize)
      .text(text, xPos, yPos, sectionHeading)

    this.resetText()
    this.doc.moveDown(moveDown)
  }

  getCustomTextCellStyleParameters(isHeader: boolean | undefined, column: TableColumn, cellStripe: CellStripe, padding: Padding, pos: Position): {
    align: "center" | "right" | "left" | "justify" | undefined,
    xPos: number,
    width: number,
    height: number,
    font: string,
    fontSize: number
  } {
    const stripeOffset = cellStripe.background ? 0 : cellStripe.width
    const paddingLeft = padding.left ?? 0
    const paddingRight = padding.right ?? 0

    return {
      align: (isHeader ? column.headerAlign : column.align) ?? ALIGN_LEFT,
      xPos: pos.x + paddingLeft + stripeOffset,
      width: column.width - paddingLeft - paddingRight,
      height: isHeader ? column.headerHeight : column.height,
      font: isHeader ? column.headerFont : column.font,
      fontSize: column.fontSize ?? this.defaultFontSize
    }
  }

  renderCustomTextCell(tb: VoilabPdfTable<Table>, row: Row, draw: boolean, column: TableColumn, pos: Position, padding: Padding, isHeader: boolean | undefined): string {
    if (draw) {
      const { text, subText, note } = getTextData(row, column, isHeader)
      const cellStripe = this.#renderCellStripe(row, column, pos, isHeader)
      const {
        align,
        xPos,
        width,
        height,
        font,
        fontSize
      } = this.getCustomTextCellStyleParameters(isHeader, column, cellStripe, padding, pos)

      this.doc
        .font(font)
        .fontSize(fontSize)

      const yPos = this.#computeCellYPosition(pos, padding, column, width, height, text)

      this.doc.text(text, xPos, yPos, { continued: !!subText, align, width })

      this.doc.font(this.font)

      if (subText) {
        this.doc.text(` ${subText}`, xPos, yPos, { align, width })
      }

      if (note) {
        const noteFontSize = column.noteFontSize ?? this.defaultFontSize
        this.doc
          .fontSize(noteFontSize)
          .text(note, { align, width })
      }
    }

    return ' '
  }

  renderTableHeading(heading: TableHeading, tableConfig: PdfTableConfigOverridden): void {
    this.doc
      .font(this.font)
      .fontSize(this.largeFontSize)

    const columns: PdfTableColumnOverridden[] = [
      {
        id: HEADING_COLUMN_ID,
        align: ALIGN_LEFT,
        height: heading.note ? 37 : 24,
        cache: false,
        renderer: this.renderCustomTextCell as unknown as (table: VoilabPdfTable<Table>, row: Row, draw: boolean) => void,
        font: tableConfig.font ?? this.boldFont,
        fontSize: tableConfig.fontSize ?? this.largeFontSize
      }
    ]

    const rows: Row[] = [{ heading, note: heading.note }] as Row[]

    this.renderTable(_.defaultsDeep(tableConfig, {
      columnDefaults: {
        headerBorder: ''
      },
      bottomMargin: 0,
      showHeaders: false
    }), columns, rows)

    this.resetText()
  }

  renderTable(pdfTableConfig: PdfTableConfigOverridden, columns: PdfTableColumnOverridden[] = [], rows: Row[] = []): void {
    this.doc.lineWidth(this.tableSettings.borderWidth)

    const fill = pdfTableConfig.columnsDefaults?.fill ?? pdfTableConfig.columnsDefaults?.zebra ?? false

    _.defaultsDeep(pdfTableConfig, {
      columnsDefaults: {
        borderColor: this.tableSettings.colors.border,
        headerBorder: 'TBLR',
        border: 'TBLR',
        align: ALIGN_LEFT,
        padding: COLUMN_DEFAULT_PADDING,
        headerPadding: COLUMN_DEFAULT_PADDING,
        fill
      },
      bottomMargin: TABLE_BOTTOM_MARGIN,
      pos: {
        maxY: this.chartArea.bottomEdge
      }
    })

    const { flexColumn } = pdfTableConfig

    const table = this.#table = new PdfTable(this.doc, pdfTableConfig) as PdfTableOverridden
    if (flexColumn) {
      table.addPlugin(new PdfTableFitColumn<Table>({
        column: flexColumn
      }))
    }

    table.onPageAdd(this.#onPageAdd.bind(this))

    table.onPageAdded((tb) => {
      if (pdfTableConfig.showHeaders) {
        tb.addHeader()
      }
    })

    table.onCellBackgroundAdd(this.#onCellBackgroundAdd.bind(this))

    table.onCellBackgroundAdded(this.#onCellBackgroundAdded.bind(this))

    table.onCellBorderAdd(this.#onCellBorderAdd.bind(this))

    table.onCellBorderAdded(this.#onCellBorderAdded.bind(this))

    table.onRowAdded(this.#onRowAdded.bind(this))

    table.onBodyAdded(this.#onBodyAdded.bind(this))

    table
      .setColumnsDefaults(pdfTableConfig.columnsDefaults)
      .addColumns(columns)
      .addBody(rows)
  }

  setFooterSize(): void {
    this.doc.fontSize(this.#footerFontSize)
    const lineHeight = this.doc.currentLineHeight()
    this.chartArea.bottomEdge = this.chartArea.bottomEdge - lineHeight * 9
  }

  setHeaderSize(): void {
    this.doc.fontSize(this.#headerFontSize)
    const lineHeight = this.doc.currentLineHeight()
    this.chartArea.topEdge = this.chartArea.topEdge + lineHeight * 4
  }

  #computeCellYPosition(pos: Position, padding: Padding, column: TableColumn, width: number, height: number, text: string): number {
    const basicPosition = pos.y + padding.top
    if (column.valign === ALIGN_CENTER) {
      const textHeight = this.doc.heightOfString(text, { width })
      return basicPosition + (height - textHeight) / 2 + 1
    }
    return basicPosition
  }

  #onPageAdd(table: VoilabPdfTable<Table>, row: Row, event: PageAddEvent): void {
    const currentPageIndex = this.initialTotalPages + this.currentPageIndex

    if (currentPageIndex + 1 === this.totalPages) {
      table.pdf.addPage()
    } else {
      this.currentPageIndex++
      table.pdf.switchToPage(this.initialTotalPages + this.currentPageIndex)
      this.#updateUnfinishedTablePosition()
    }

    // cancel event so the automatic page add is not triggered
    event.cancel = true
  }

  #onBodyAdded(table: PdfTableOverridden): void {
    // Restore x position after table is drawn
    this.doc.x = table.pos.x ?? this.doc.page.margins.left

    // Add margin to the bottom of the table
    this.doc.y += table.bottomMargin
  }

  #computeCellBackgroundColor(fillDefined: boolean, zebra: boolean, isHeader: boolean, isEven: boolean): string {
    if (!fillDefined && zebra) {
      if (isHeader) {
        return this.tableSettings.colors.zebraHeader
      }
      return isEven ? this.tableSettings.colors.zebraEven : this.tableSettings.colors.zebraOdd
    }
    return COLOR_WHITE
  }

  #computeCellOpacity(fillDefined: boolean, zebra: boolean, isEven: boolean): number {
    if (!fillDefined) {
      return 1
    }
    return zebra && !isEven ? DEFAULT_OPACITY / 2 : DEFAULT_OPACITY
  }

  #onCellBackgroundAdd(table: VoilabPdfTable<Table>, column: VoilabPdfTable.VoilabPdfTableColumn<Table>, row: Row, index: number, isHeader: boolean): void {
    const {
      fill,
      headerFill,
      zebra
    } = column as PdfTableColumnOverridden

    const isEven = index % 2 === 0

    const fillKey = isHeader ? headerFill : fill

    if (fillKey) {
      const fillDefined = _.isPlainObject(fillKey)
      const color = this.#computeCellBackgroundColor(fillDefined, !!zebra, isHeader, isEven)
      const opacity = this.#computeCellOpacity(fillDefined, !!zebra, isEven)

      this.setFill(color, opacity)
    }

    if (row._fill) {
      const { color, opacity } = row._fill
      this.setFill(color, opacity)
    }
  }

  #onCellBackgroundAdded(): void {
    this.setFill()
  }

  #onCellBorderAdd(tb: VoilabPdfTable<Table>, column: VoilabPdfTable.VoilabPdfTableColumn<Table>): void {
    this.doc.lineWidth(this.tableSettings.borderWidth)
    this.setStroke((column as PdfTableColumnOverridden).borderColor ?? COLOR_BLACK, DEFAULT_OPACITY)
  }

  #onCellBorderAdded(): void {
    this.setStroke()
  }

  #onRowAdded(): void {
    this.resetText()
  }

  #renderPatientInfo(): void {
    const patientName = _.truncate(getPatientFullName(this.#patient), { length: PATIENT_FULL_NAME_MAX_LENGTH })
    const patientBirthdate = formatBirthdate(this.#patient.profile.birthdate)
    const xOffset = this.margins.left
    const yOffset = this.margins.top

    this.doc
      .lineWidth(PATIENT_INFO_LINE_WIDTH)
      .fontSize(DEFAULT_FONT_SIZE)
      .text(patientName, xOffset, yOffset, {
        lineGap: PATIENT_INFO_LINE_GAP
      })

    this.#patientInfoBox.width = this.doc.widthOfString(patientName)
    const patientDateOfBirth = t('DOB: {{birthdate}}', { birthdate: patientBirthdate })

    this.doc
      .font(this.font)
      .fontSize(DEFAULT_FONT_SIZE)
      .text(patientDateOfBirth)

    const patientBirthdayWidth = this.doc.widthOfString(patientDateOfBirth)
    this.#patientInfoBox.height = this.doc.y

    if (this.#patientInfoBox.width < patientBirthdayWidth) {
      this.#patientInfoBox.width = patientBirthdayWidth
    }

    const lineStart = this.margins.left + this.#patientInfoBox.width + PADDING_PATIENT_INFO
    this.doc
      .moveTo(lineStart, this.margins.top)
      .lineTo(lineStart, this.#patientInfoBox.height)
      .stroke(COLOR_BLACK)
  }

  #renderTitle(): void {
    const lineHeight = this.doc.fontSize(HEADER_FONT_SIZE).currentLineHeight()
    const xOffset = this.margins.left + this.#patientInfoBox.width + 21
    const yOffset = this.margins.top + (this.#patientInfoBox.height - this.margins.top) / 2 - lineHeight / 2

    const title = this.currentPageIndex === 0
      ? this.#title
      : t('{{title}} (cont.)', { title: this.#title })

    this.doc.font(this.font).text(title, xOffset, yOffset)
    this.#titleWidth = this.doc.widthOfString(title)
  }

  #renderDateText(dateText = ''): void {
    const lineHeight = this.doc.fontSize(LINE_HEIGHT_REFERENCE_FONT_SIZE).currentLineHeight()

    const elements = [
      this.#patientInfoBox.width,
      DIVIDER_WIDTH,
      this.#titleWidth,
      LOGO_WIDTH,
      this.margins.left,
      this.margins.right
    ]
    const widthUsed = elements.reduce((totalWidth: number, elementWidth: number | undefined) => {
      if (elementWidth) {
        return totalWidth + elementWidth
      }
      return totalWidth
    }, 0)
    // Calculate the remaining available width so we can
    // center the print text between the patient/title text and the logo
    const availableWidth = this.doc.page.width - widthUsed

    const xOffset = (
      this.margins.left + this.#patientInfoBox.width + DIVIDER_WIDTH + (this.#titleWidth ?? 0)
    )
    const yOffset = (
      this.margins.top + (this.#patientInfoBox.height - this.margins.top) / 2 - lineHeight / 2
    )

    this.doc
      .fontSize(DEFAULT_FONT_SIZE)
      .text(dateText, xOffset, yOffset + 2.5, {
        width: availableWidth,
        align: ALIGN_CENTER
      })
  }

  #renderLogo(): void {
    const xOffset = this.doc.page.width - LOGO_WIDTH - this.margins.right
    const yOffset = this.margins.top

    this.doc.image(this.#logo, xOffset, yOffset, { width: LOGO_WIDTH })
  }

  #renderHeader(dateText: string): void {
    this.#renderPatientInfo()

    this.#renderTitle()

    this.#renderLogo()

    this.#renderDateText(dateText)

    this.doc.moveDown()

    const lineHeight = this.doc.fontSize(HEADER_FONT_SIZE).currentLineHeight()
    const height = lineHeight * 2.25 + this.margins.top
    this.doc
      .moveTo(this.margins.left, height)
      .lineTo(this.margins.left + this.width, height)
      .stroke(COLOR_BLACK)
  }

  #renderFooter(): void {
    this.doc.fontSize(this.#footerFontSize)

    const helpText = t('pdf-footer-center-text', { appURL: APP_URL })

    const printDateText = t('Printed on: ') + formatCurrentDate()
    const printDateWidth = this.doc.widthOfString(printDateText)

    const pageCountWidth = this.doc.widthOfString('Page 1 of 1')

    const xPos = this.margins.left
    const yPos = (this.height + this.margins.top) - this.doc.currentLineHeight() * 1.5
    const innerWidth = this.width - printDateWidth - pageCountWidth

    this.doc
      .fillColor(this.colors.lightGrey)
      .fillOpacity(1)
      .text(printDateText, xPos, yPos)
      .text(helpText, xPos + printDateWidth, yPos, {
        width: innerWidth,
        align: ALIGN_CENTER
      })

    this.setFill()
  }

  #updateUnfinishedTablePosition(): void {
    if (this.#table?.pos) {
      const xPos = this.chartArea.leftEdge
      this.#table.pos.x = xPos
      this.doc.x = xPos
      this.#table.pos.y = this.chartArea.topEdge
      this.doc.y = this.chartArea.topEdge
      this.#table.pdf.lineWidth(this.tableSettings.borderWidth)
    }
  }

  #renderCellStripe(row: Row, column: TableColumn, pos: Position, isHeader = false): CellStripe {
    const height = (isHeader ? column.headerHeight : column.height) ?? column.height ?? row._renderedContent?.height ?? 0

    const fillStripe = isHeader ? (row._headerFillStripe ?? column.headerFillStripe) : (row._fillStripe ?? column.fillStripe)
    if (!fillStripe) {
      return {
        width: 0,
        background: false
      }
    }

    const background = fillStripe.background ?? false
    const color = fillStripe.color ?? this.colors.grey
    const opacity = fillStripe.opacity ?? 1
    const padding = fillStripe.padding ?? 0
    const width = fillStripe.width ?? DEFAULT_STRIPE_WIDTH
    this.setFill(color, opacity)

    const xPos = pos.x + 0.25 + padding
    const yPos = pos.y + 0.25 + padding
    const stripeWidth = width
    const stripeHeight = height - 0.5 - (2 * padding)

    if (width > 0) {
      this.doc
        .rect(xPos, yPos, stripeWidth, stripeHeight)
        .fill()
    }

    this.setFill()

    return { background, width }
  }
}
