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
import colors from '../../styles/colors.css'
import PdfTableFitColumn from 'voilab-pdf-table/plugins/fitcolumn'

import {
  formatBirthdate,
  formatCurrentDate,
  formatDateRange,
  getTimezoneFromTimePrefs
} from '../../utils/datetime/datetime.util'

import {
  DEFAULT_FONT_SIZE,
  EXTRA_SMALL_FONT_SIZE,
  FOOTER_FONT_SIZE,
  HEADER_FONT_SIZE,
  HEIGHT,
  Images,
  LARGE_FONT_SIZE,
  MARGINS,
  SMALL_FONT_SIZE,
  WIDTH
} from './utils/constants'
import { type TimePrefs } from 'medical-domain'
import { type BgBounds, type BgPrefs } from '../../models/blood-glucose.model'
import type BasicData from 'medical-domain/dist/src/domains/repositories/medical/basics-data.service'
import { type UnitsType } from '../../models/enums/units-type.enum'
import { buildLayoutColumns, getFonts } from './print-view.util'

export enum LayoutColumnType {
  Percentage = 'percentage',
  Equal = 'equal'
}

interface TableHeading {
  text: string
  subText?: string
  note?: string
}

interface Padding {
  left?: number
  top: number
}

interface TableOpts {
  showHeaders?: boolean
  bottomMargin?: number
  flexColumn?: string
  columnDefaults: Partial<VoilabPdfTable.VoilabPdfTableColumnDefaults<Opts>>
}

interface Position {
  x: number
  y: number
}

interface CellStripeColumn {
  id: keyof Opts
  header: TableHeading
  headerHeight: number
  valign: string
  width: number
  height: number
  headerFillStripe: { color: string, opacity: number, width: number, padding: number, background: boolean }
  fillStripe: { color: string, opacity: number, width: number, padding: number, background: boolean }
  headerFill: { color: string, opacity: number }
  fill: { color: string, opacity: number }
}

interface CellStripe {
  width: number
  height: number
  padding: number
  color: string
  opacity: number
  background: boolean
}

interface SectionHeading {
  xPos: number
  yPos: number
  font: string
  fontSize: number
  subTextFont: string
  subTextFontSize: number
  moveDown: number
}

export interface LayoutColumn {
  x: number
  y: number
  width: number
}

interface LayoutColumns {
  activeIndex: number
  columns: LayoutColumn[]
}

interface Margins {
  top: number
  bottom: number
  left: number
  right: number
}

interface Patient {
  profile: { fullName: string, birthday: string }
}

export interface Opts {
  _bold: unknown
  title: string
  defaultFontSize: number
  footerFontSize: number
  headerFontSize: number
  height: number
  margins: Margins
  patient: Patient
  smallFontSize: number
  timePrefs: TimePrefs
  width: number
  largeFontSize: number
  extraSmallFontSize: number
  bgPrefs: BgPrefs
  heading: TableHeading
  note?: number
  column: string
  _fill?: { color: string, opacity: number }
  _headerFill?: { color: string, opacity: number }
  _headerFillStripe?: { color: string, opacity: number, width: number, padding: number, background: boolean }
  _fillStripe?: { color: string, opacity: number, width: number, padding: number, background: boolean }
  _renderedContent?: { height: number }
}

interface Data {
  basics?: BasicData
}

interface PdfTableExtra {
  pos: Position
  bottomMargin: number
}

interface PdfTableColumnExtra {
  font: string
  fontSize: number
  zebra?: boolean
}

interface PdfDocumentExtra {
  _font?: { name: string }
  _fontSize?: number
}

type CustomPdfTable = PdfTable<Opts> & PdfTableExtra
type CustomColumnTable = VoilabPdfTable.VoilabPdfTableColumn<Opts> & PdfTableColumnExtra
type CustomPdfDocument = PDFKit.PDFDocument & PdfDocumentExtra

const PAGE_ADDED = 'pageAdded'
const APP_URL = `${window.location.protocol}//${window.location.hostname}/`

const t = i18next.t.bind(i18next)

const getPatientFullName = (patient: { profile: { fullName: string } }): string => {
  const fullName = patient?.profile?.fullName
  return fullName ?? i18next.t('Anonymous user')
}

export class PrintView {
  doc: CustomPdfDocument
  title: string
  data: Data
  margins: Margins
  font: string
  boldFont: string
  defaultFontSize: number
  footerFontSize: number
  headerFontSize: number
  largeFontSize: number
  smallFontSize: number
  extraSmallFontSize: number
  bgPrefs: BgPrefs
  bgUnits: UnitsType
  bgBounds?: BgBounds
  timePrefs: TimePrefs
  timezone: string
  width: number
  height: number
  patient: Patient
  patientInfoBox: {
    width: number
    height: number
  }

  colors: {
    grey: string
    basal: string
    lightGrey: string
  }

  tableSettings: {
    colors: {
      border: string
      tableHeader: string
      zebraHeader: string
      zebraEven: string
      zebraOdd: string
    }
    borderWidth: number
  }

  leftEdge: number
  rightEdge: number
  bottomEdge: number

  chartArea: {
    leftEdge: number
    topEdge: number
    bottomEdge: number
    width: number
  }

  initialChartArea: {
    leftEdge: number
    topEdge: number
    bottomEdge: number
    width: number
  }

  initialTotalPages: number
  totalPages: number
  currentPageIndex: number

  table?: CustomPdfTable

  layoutColumns?: LayoutColumns

  dividerWidth?: number
  titleWidth?: number
  logoWidth?: number

  constructor(doc: CustomPdfDocument, data: Data, opts: Opts) {
    this.doc = doc

    this.title = opts.title
    this.data = data

    this.margins = opts.margins ?? MARGINS

    const fonts = getFonts()
    this.font = fonts.regularName
    this.boldFont = fonts.boldName

    this.defaultFontSize = opts.defaultFontSize ?? DEFAULT_FONT_SIZE
    this.footerFontSize = opts.footerFontSize ?? FOOTER_FONT_SIZE
    this.headerFontSize = opts.headerFontSize ?? HEADER_FONT_SIZE
    this.largeFontSize = opts.largeFontSize ?? LARGE_FONT_SIZE
    this.smallFontSize = opts.smallFontSize ?? SMALL_FONT_SIZE
    this.extraSmallFontSize = opts.extraSmallFontSize ?? EXTRA_SMALL_FONT_SIZE

    this.bgPrefs = opts.bgPrefs
    this.bgUnits = opts.bgPrefs.bgUnits
    this.bgBounds = opts.bgPrefs.bgBounds
    this.timePrefs = opts.timePrefs
    this.timezone = getTimezoneFromTimePrefs(opts.timePrefs)

    this.width = opts.width ?? WIDTH
    this.height = opts.height ?? HEIGHT

    this.patient = opts.patient
    this.patientInfoBox = {
      width: 0,
      height: 0
    }

    this.colors = { ...colors }

    this.tableSettings = {
      colors: {
        border: this.colors.grey,
        tableHeader: this.colors.basal,
        zebraHeader: '#FAFAFA',
        zebraEven: '#FAFAFA',
        zebraOdd: '#FFFFFF'
      },
      borderWidth: 0.5
    }

    this.leftEdge = this.margins.left
    this.rightEdge = this.margins.left + this.width
    this.bottomEdge = this.margins.top + this.height

    this.chartArea = {
      bottomEdge: this.margins.top + opts.height,
      leftEdge: this.margins.left,
      topEdge: this.margins.top,
      width: this.rightEdge - this.margins.left
    }

    this.initialChartArea = _.clone(this.chartArea)

    this.initialTotalPages = 0
    this.totalPages = this.initialTotalPages = this.doc.bufferedPageRange().count || 0
    this.currentPageIndex = -1

    // kick off the dynamic calculation of chart area based on font sizes for header and footer
    this.setHeaderSize()
    this.setFooterSize()

    // Auto-bind callback methods
    this.newPage = this.newPage.bind(this)
    this.setNewPageTablePosition = this.setNewPageTablePosition.bind(this)
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

    this.renderHeader(dateText)
    this.renderFooter()
    this.doc.x = this.chartArea.leftEdge
    this.doc.y = this.chartArea.topEdge

    // Set font styles back to what they were before the page break
    // This is needed because the header and footer rendering changes it
    // and any tables that need to continue rendering on the new page are affected.
    this.doc
      .font(currentFont.name)
      .fontSize(currentFont.size)

    if (this.table) {
      this.setNewPageTablePosition()
    }
  }

  setNewPageTablePosition(): void {
    const xPos = this.chartArea.leftEdge

    if (this.table) {
      if (this.table.pos) {
        this.doc.x = this.table.pos.x = xPos
        this.doc.y = this.table.pos.y = this.chartArea.topEdge
      }
      this.table.pdf.lineWidth(this.tableSettings.borderWidth)
    }
  }

  setLayoutColumns(width: number, gutter: number, type: LayoutColumnType, widths: number[]): void {
    const columns = buildLayoutColumns(widths, this.chartArea.width, type, this.chartArea.leftEdge, this.doc.y, gutter)

    this.layoutColumns = {
      activeIndex: 0,
      columns
    }
  }

  goToLayoutColumnPosition(index: number): void {
    if (this.layoutColumns) {
      this.doc.x = this.layoutColumns.columns[index].x
      this.doc.y = this.layoutColumns.columns[index].y
      this.layoutColumns.activeIndex = index
    }
  }

  getActiveColumnWidth(): number {
    if (!this.layoutColumns) {
      throw Error('this.layoutColumns must be defined')
    }
    return this.layoutColumns.columns[this.layoutColumns.activeIndex].width
  }

  getDateRange(startDate: string, endDate: string, format: string, timezone: string | undefined): string {
    return t('pdf-date-range', { range: formatDateRange(startDate, endDate, format, timezone) })
  }

  setFill(color = 'black', opacity = 1): void {
    this.doc
      .fillColor(color)
      .fillOpacity(opacity)
  }

  setStroke(color = 'black', opacity = 1): void {
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

  renderSectionHeading(text: string, opts: SectionHeading): void {
    const {
      xPos = this.doc.x,
      yPos = this.doc.y,
      font = opts.font ?? this.font,
      fontSize = opts.fontSize ?? this.headerFontSize,
      moveDown = 1
    } = opts

    this.doc
      .font(font)
      .fontSize(fontSize)
      .text(text, xPos, yPos, _.defaults(opts, {
        align: 'left'
      }))

    this.resetText()
    this.doc.moveDown(moveDown)
  }

  renderCellStripe(data: Opts, column: CellStripeColumn, pos: Position, isHeader = false): CellStripe {
    const height = (isHeader ? column.headerHeight : column.height) ?? column.height ?? data._renderedContent?.height ?? 0

    const stripe = {
      width: 0,
      height,
      padding: 0,
      color: this.colors.grey,
      opacity: 1,
      background: false
    }

    const fillStripe = isHeader ? (data._headerFillStripe ?? column.headerFillStripe) : (data._fillStripe ?? column.fillStripe)
    if (!fillStripe) {
      return stripe
    }

    stripe.color = fillStripe.color ?? this.colors.grey

    stripe.opacity = fillStripe.opacity ?? 1
    stripe.width = fillStripe.width ?? 6
    stripe.background = fillStripe.background ?? false
    stripe.padding = fillStripe.padding ?? 0

    this.setFill(stripe.color, stripe.opacity)

    return stripe
  }

  renderCustomTextCell(tb: VoilabPdfTable<Opts>, data: Opts, draw: boolean, column: CellStripeColumn, pos: Position, padding: Padding, isHeader: boolean | undefined): string {
    if (draw) {
      let {
        text = '',
        subText = '',
        note
      } = _.get(data, column.id, column.header || {}) as TableHeading
      if ((!isHeader && _.isString(data[column.id])) || _.isString(column.header)) {
        text = isHeader ? column.header as unknown as string : data[column.id] as string
        subText = note = ''
      }

      const alignKey = isHeader ? 'headerAlign' : 'align'
      const align = _.get(column, alignKey, 'left')

      const stripe = this.renderCellStripe(data, column, pos, isHeader)
      const stripeOffset = stripe.background ? 0 : stripe.width

      const xPos = pos.x + _.get(padding, 'left', 0) + stripeOffset
      let yPos = pos.y + padding.top

      const boldRow = data._bold || isHeader

      const width = column.width - _.get(padding, 'left', 0) - _.get(padding, 'right', 0)

      const heightKey = isHeader ? 'headerHeight' : 'height'

      const height = _.get(column, heightKey, column.height) ||
        _.get(data, '_renderedContent.height', 0)

      const fontKey = isHeader ? 'headerFont' : 'font'

      this.doc
        .font(_.get(column, fontKey, boldRow ? this.boldFont : this.font))
        .fontSize(_.get(column, 'fontSize', this.defaultFontSize))

      if (column.valign === 'center') {
        const textHeight = this.doc.heightOfString(text, { width })
        yPos += (height - textHeight) / 2 + 1
      }

      this.doc.text(text, xPos, yPos, {
        continued: subText.length > 0,
        align,
        width
      })

      this.doc.font(this.font)

      if (subText.length > 0) {
        this.doc.text(` ${subText}`, xPos, yPos, {
          align,
          width
        })
      }

      if (note && note.length > 0) {
        this.doc
          .fontSize(_.get(column, 'noteFontSize', this.defaultFontSize))
          .text(note, {
            align,
            width
          })
      }
    }

    return ' '
  }

  renderTableHeading(heading: TableHeading, opts = {}): void {
    this.doc
      .font(this.font)
      .fontSize(this.largeFontSize)

    const columns: readonly CustomColumnTable[] = [
      {
        id: 'heading',
        align: _.get(opts, 'align', 'left'),
        height: _.get(opts, 'height', heading.note ? 37 : 24),
        cache: false,
        renderer: this.renderCustomTextCell as unknown as (table: VoilabPdfTable<Opts>, row: Opts, draw: boolean) => void,
        font: _.get(opts, 'font', this.boldFont),
        fontSize: _.get(opts, 'fontSize', this.largeFontSize)
      }
    ]

    const rows: Opts[] = [
      {
        heading,
        note: heading.note
      }
    ] as Opts[]

    this.renderTable(columns, rows, _.defaultsDeep(opts, {
      columnDefaults: {
        headerBorder: ''
      },
      bottomMargin: 0,
      showHeaders: false
    }))

    this.resetText()
  }

  renderTable(columns: readonly CustomColumnTable[] = [], rows: Opts[] = [], opts: TableOpts): void {
    this.doc.lineWidth(this.tableSettings.borderWidth)

    _.defaultsDeep(opts, {
      columnDefaults: {
        borderColor: this.tableSettings.colors.border,
        headerBorder: 'TBLR',
        border: 'TBLR',
        align: 'left',
        padding: [7, 5, 3, 5],
        headerPadding: [7, 5, 3, 5],
        fill: _.get(opts, 'columnDefaults.fill', _.get(opts, 'columnDefaults.zebra', false))
      },
      bottomMargin: 20,
      pos: {
        maxY: this.chartArea.bottomEdge
      }
    })

    const {
      flexColumn
    } = opts

    const table = this.table = new PdfTable(this.doc, opts) as CustomPdfTable
    if (flexColumn) {
      table.addPlugin(new PdfTableFitColumn<Opts>({
        column: flexColumn as keyof Opts
      }))
    }

    table.onPageAdd(this.onPageAdd.bind(this))

    table.onPageAdded((tb /*, row */) => {
      if (opts.showHeaders) {
        tb.addHeader()
      }
    })

    table.onCellBackgroundAdd(this.onCellBackgroundAdd.bind(this))

    table.onCellBackgroundAdded(this.onCellBackgroundAdded.bind(this))

    table.onCellBorderAdd(this.onCellBorderAdd.bind(this))

    table.onCellBorderAdded(this.onCellBorderAdded.bind(this))

    table.onRowAdd(this.onRowAdd.bind(this))

    table.onRowAdded(this.onRowAdded.bind(this))

    table.onBodyAdded(this.onBodyAdded.bind(this))

    table
      .setColumnsDefaults(opts.columnDefaults)
      .addColumns(columns)
      .addBody(rows)
  }

  onPageAdd(tb: VoilabPdfTable<Opts>, row: Opts, ev: { cancel: boolean }): void {
    const currentPageIndex = this.initialTotalPages + this.currentPageIndex

    if (currentPageIndex + 1 === this.totalPages) {
      tb.pdf.addPage()
    } else {
      this.currentPageIndex++
      tb.pdf.switchToPage(this.initialTotalPages + this.currentPageIndex)
      this.setNewPageTablePosition()
    }

    // cancel event so the automatic page add is not triggered
    ev.cancel = true // eslint-disable-line no-param-reassign
  }

  onBodyAdded(tb: CustomPdfTable): void {
    // Restore x position after table is drawn
    this.doc.x = _.get(tb, 'pos.x', this.doc.page.margins.left)

    // Add margin to the bottom of the table
    this.doc.y += tb.bottomMargin
  }

  onCellBackgroundAdd(tb: VoilabPdfTable<Opts>, column: VoilabPdfTable.VoilabPdfTableColumn<Opts>, row: Opts, index: number, isHeader: boolean): void {
    const {
      fill,
      headerFill,
      zebra
    } = column as CustomColumnTable

    const isEven = index % 2 === 0

    const fillKey = isHeader ? headerFill : fill

    if (fillKey) {
      const fillDefined = _.isPlainObject(fillKey)
      let color: string
      let opacity

      if (!fillDefined) {
        opacity = 1
        if (zebra) {
          if (isHeader) {
            color = this.tableSettings.colors.zebraHeader
          } else {
            color = isEven
              ? this.tableSettings.colors.zebraEven
              : this.tableSettings.colors.zebraOdd
          }
        } else {
          color = 'white'
        }
      } else {
        const defaultOpacity = _.get(fillKey, 'opacity', 1)

        color = _.get(fillKey, 'color', 'white')
        opacity = zebra && !isEven ? defaultOpacity / 2 : defaultOpacity
        opacity = defaultOpacity
      }

      this.setFill(color, opacity)
    }

    if (row._fill) {
      const {
        color,
        opacity
      } = row._fill

      this.setFill(color, opacity)
    }
  }

  onCellBackgroundAdded(): void {
    this.setFill()
  }

  onCellBorderAdd(tb: VoilabPdfTable<Opts>, column: VoilabPdfTable.VoilabPdfTableColumn<Opts>): void {
    this.doc.lineWidth(this.tableSettings.borderWidth)
    this.setStroke(_.get(column, 'borderColor', 'black'), 1)
  }

  onCellBorderAdded(): void {
    this.setStroke()
  }

  onRowAdd(tb: VoilabPdfTable<Opts>, row: Opts): void {
    if (row._bold) {
      this.doc.font(this.boldFont)
    }
  }

  onRowAdded(): void {
    this.resetText()
  }

  renderPatientInfo(): void {
    const patientName = _.truncate(getPatientFullName(this.patient), { length: 32 })
    const patientBirthdate = formatBirthdate(this.patient.profile.birthday ?? '')
    const xOffset = this.margins.left
    const yOffset = this.margins.top

    this.doc
      .lineWidth(1)
      .fontSize(10)
      .text(patientName, xOffset, yOffset, {
        lineGap: 2
      })

    const patientNameWidth = this.patientInfoBox.width = this.doc.widthOfString(patientName)
    const patientDOB = t('DOB: {{birthdate}}', { birthdate: patientBirthdate })

    this.doc
      .font(this.font)
      .fontSize(10)
      .text(patientDOB)

    const patientBirthdayWidth = this.doc.widthOfString(patientDOB)
    this.patientInfoBox.height = this.doc.y

    if (patientNameWidth < patientBirthdayWidth) {
      this.patientInfoBox.width = patientBirthdayWidth
    }

    // Render the divider between the patient info and title
    const padding = 10

    this.doc
      .moveTo(this.margins.left + this.patientInfoBox.width + padding, this.margins.top)
      .lineTo(this.margins.left + this.patientInfoBox.width + padding, this.patientInfoBox.height)
      .stroke('black')

    this.dividerWidth = padding * 2 + 1
  }

  renderTitle(): void {
    const lineHeight = this.doc.fontSize(14).currentLineHeight()
    const xOffset = this.margins.left + this.patientInfoBox.width + 21
    const yOffset = (
      this.margins.top + ((this.patientInfoBox.height - this.margins.top) / 2 - (lineHeight / 2))
    )

    const title = this.currentPageIndex === 0
      ? this.title
      : t('{{title}} (cont.)', { title: this.title })

    this.doc.font(this.font).text(title, xOffset, yOffset)
    this.titleWidth = this.doc.widthOfString(title)
  }

  renderDateText(dateText = ''): void {
    const lineHeight = this.doc.fontSize(14).currentLineHeight()

    // Calculate the remaining available width so we can
    // center the print text between the patient/title text and the logo
    const availableWidth = this.doc.page.width - _.reduce([
      this.patientInfoBox.width,
      this.dividerWidth,
      this.titleWidth,
      this.logoWidth,
      this.margins.left,
      this.margins.right
    ], (a, b) => {
      if (b) {
        return a + b
      }
      return a
    }, 0)

    if (!this.dividerWidth || !this.titleWidth) {
      return
    }

    const xOffset = (
      this.margins.left + this.patientInfoBox.width + this.dividerWidth + this.titleWidth
    )
    const yOffset = (
      this.margins.top + ((this.patientInfoBox.height - this.margins.top) / 2 - (lineHeight / 2))
    )

    this.doc
      .fontSize(10)
      .text(dateText, xOffset, yOffset + 2.5, {
        width: availableWidth,
        align: 'center'
      })
  }

  renderLogo(): void {
    this.logoWidth = 80
    const xOffset = this.doc.page.width - this.logoWidth - this.margins.right
    const yOffset = this.margins.top

    this.doc.image(Images.logo, xOffset, yOffset, { width: this.logoWidth })
  }

  renderHeader(dateText: string): PrintView {
    this.renderPatientInfo()

    this.renderTitle()

    this.renderLogo()

    this.renderDateText(dateText)

    this.doc.moveDown()

    const lineHeight = this.doc.fontSize(14).currentLineHeight()
    const height = lineHeight * 2.25 + this.margins.top
    this.doc
      .moveTo(this.margins.left, height)
      .lineTo(this.margins.left + this.width, height)
      .stroke('black')

    return this
  }

  renderFooter(): PrintView {
    this.doc.fontSize(this.footerFontSize)

    const helpText = t('pdf-footer-center-text', { appURL: APP_URL })

    const printDateText = t('Printed on: ') + formatCurrentDate()
    const printDateWidth = this.doc.widthOfString(printDateText)

    const pageCountWidth = this.doc.widthOfString('Page 1 of 1')

    const xPos = this.margins.left
    const yPos = (this.height + this.margins.top) - this.doc.currentLineHeight() * 1.5
    const innerWidth = (this.width) - printDateWidth - pageCountWidth

    this.doc
      .fillColor(this.colors.lightGrey)
      .fillOpacity(1)
      .text(printDateText, xPos, yPos)
      .text(helpText, xPos + printDateWidth, yPos, {
        width: innerWidth,
        align: 'center'
      })

    this.setFill()

    return this
  }

  setFooterSize(): PrintView {
    this.doc.fontSize(this.footerFontSize)
    const lineHeight = this.doc.currentLineHeight()
    this.chartArea.bottomEdge = this.chartArea.bottomEdge - lineHeight * 9

    return this
  }

  setHeaderSize(): PrintView {
    this.doc.fontSize(this.headerFontSize)
    const lineHeight = this.doc.currentLineHeight()
    this.chartArea.topEdge = this.chartArea.topEdge + lineHeight * 4

    return this
  }
}
