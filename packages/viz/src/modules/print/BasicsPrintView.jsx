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

import { buildLayoutColumns, LayoutColumnType, PrintView } from 'dumb'

import {
  cgmStatusMessage,
  defineBasicsSections,
  determineBgDistributionSource,
  disableEmptySections,
  generateCalendarDayLabels,
  processInfusionSiteHistory,
  reduceByDay
} from '../../utils/basics/data'

import { generateBgRangeLabels } from '../../utils/bloodglucose'
import { formatDecimalNumber, formatPercentage } from '../../utils/format'
import { getLatestPumpUpload } from '../../utils/device'

import { arc, pie } from 'd3-shape'
import parse from 'parse-svg-path'
import translate from 'translate-svg-path'
import serialize from 'serialize-svg-path'

import {
  CGM_DATA_KEY,
  NO_SITE_CHANGE,
  SITE_CHANGE,
  SITE_CHANGE_CANNULA,
  SITE_CHANGE_RESERVOIR,
  SITE_CHANGE_TUBING
} from '../../utils/constants'

import { Images } from './utils/constants'

const t = i18next.t.bind(i18next)

class BasicsPrintView extends PrintView {
  constructor(doc, data, opts) {
    super(doc, data, opts)

    this.siteChangeImages = {
      [SITE_CHANGE_CANNULA]: Images.siteChangeCannulaImage,
      [SITE_CHANGE_RESERVOIR]: Images.siteChangeReservoirDiabeloopImage,
      [SITE_CHANGE_TUBING]: Images.siteChangeTubingImage
    }

    const latestPumpUpload = getLatestPumpUpload(_.get(data, 'data.upload.data', []))
    this.source = _.get(latestPumpUpload, 'source', '').toLowerCase()
    this.manufacturer = this.source

    // Process basics data
    const { source: bgSource, cgmStatus } = determineBgDistributionSource(this.data)
    _.assign(this, { bgSource, cgmStatus })

    this.data.sections = defineBasicsSections(
      this.bgPrefs,
      this.manufacturer,
      _.get(latestPumpUpload, 'deviceModel')
    )

    this.data = reduceByDay(this.data, this.bgPrefs)

    const averageDailyCarbs = _.get(this.data, 'stats.carbs.data.raw.totalCarbsPerDay')
    const totalDailyDose = _.get(this.data, 'stats.averageDailyDose.data.raw.totalInsulin')
    const { basal, bolus } = _.get(this.data, 'stats.totalInsulin.data.raw', {})
    const averageDailyDose = { basal, bolus }

    const basalBolusRatio = {
      basal: basal / totalDailyDose,
      bolus: bolus / totalDailyDose
    }

    const { automated, manual } = _.get(this.data, 'stats.timeInAuto.data.raw', {})
    const totalBasalDuration = _.get(this.data, 'stats.timeInAuto.data.total.value')
    const timeInAutoRatio = {
      automated: automated / totalBasalDuration,
      manual: manual / totalBasalDuration
    }

    _.assign(this.data.data, {
      averageDailyCarbs,
      averageDailyDose,
      basalBolusRatio,
      timeInAutoRatio,
      totalDailyDose
    })

    this.data = processInfusionSiteHistory(this.data)

    this.data = disableEmptySections(this.data)

    // Auto-bind callback methods
    this.renderStackedStat = this.renderStackedStat.bind(this)
    this.renderPieChart = this.renderPieChart.bind(this)
    this.renderCalendarCell = this.renderCalendarCell.bind(this)

    this.doc.addPage()
    this.initLayout()
  }

  newPage() {
    super.newPage(this.getDateRange(this.data.dateRange[0], this.data.dateRange[1], undefined, this.data.timezone))
  }

  initCalendar() {
    const columnWidth = this.getActiveColumnWidth()
    const calendar = {}

    calendar.labels = generateCalendarDayLabels(this.data.days)

    calendar.headerHeight = 15

    calendar.columns = _.map(calendar.labels, label => ({
      id: label,
      header: label,
      width: columnWidth / 7,
      height: columnWidth / 7,
      cache: false,
      renderer: this.renderCalendarCell,
      headerBorder: '',
      headerPadding: [4, 2, 0, 2],
      padding: [3, 2, 3, 2]
    }))

    calendar.days = this.data.days

    calendar.pos = {}

    this.calendar = calendar
  }

  initLayout() {
    this.setLayoutColumns(this.chartArea.width, 15, 'percentage', [28, 72])
  }

  render() {
    this.renderLeftColumn()
    this.renderCenterColumn()
  }

  goToLayoutColumnPosition(index) {
    if (this.layoutColumns) {
      this.doc.x = this.layoutColumns.columns[index].x
      this.doc.y = this.layoutColumns.columns[index].y
      this.layoutColumns.activeIndex = index
    }
  }

  getActiveColumnWidth() {
    if (!this.layoutColumns) {
      throw Error('this.layoutColumns must be defined')
    }
    return this.layoutColumns.columns[this.layoutColumns.activeIndex].width
  }

  /**
   * @param width {number}
   * @param gutter {number}
   * @param type {LayoutColumnType}
   * @param widths {number[]}
   * @return {void}
   */
  setLayoutColumns(width, gutter, type, widths) {
    const columns = buildLayoutColumns(widths, this.chartArea.width, type, this.chartArea.leftEdge, this.doc.y, gutter)

    this.layoutColumns = {
      activeIndex: 0,
      columns
    }
  }

  renderLeftColumn() {
    const { averageDailyDose, basalBolusRatio, timeInAutoRatio } = this.data.data

    this.goToLayoutColumnPosition(0)

    this.renderBgDistribution()
    this.renderAggregatedStats()

    this.renderRatio('basalBolusRatio', {
      primary: basalBolusRatio,
      secondary: averageDailyDose
    })

    this.renderRatio('timeInAutoRatio', {
      primary: timeInAutoRatio
    })
  }

  renderCenterColumn() {
    this.goToLayoutColumnPosition(1)

    this.initCalendar()

    this.renderCalendarSection({
      title: {
        text: this.data.sections.siteChanges.title
      },
      data: _.get(
        this.data.data,
        `${_.get(this.data.sections.siteChanges, 'type')}.infusionSiteHistory`,
        {}
      ),
      type: 'siteChange',
      disabled: this.data.sections.siteChanges.disabled,
      emptyText: this.data.sections.siteChanges.emptyText
    })
  }

  renderBgDistribution() {
    const columnWidth = this.getActiveColumnWidth()

    this.renderSectionHeading(t('Time In Range'), {
      width: columnWidth,
      fontSize: this.largeFontSize,
      moveDown: 0.435
    })

    this.doc.fontSize(this.smallFontSize)

    if (this.bgSource) {
      const stat = this.bgSource === CGM_DATA_KEY ? 'timeInRange' : 'readingsInRange'
      const rangeDurations = _.get(this.data, `stats.${stat}.data.raw`, {})
      const totalDuration = _.get(this.data, `stats.${stat}.data.total.value`, {})

      this.doc.text(cgmStatusMessage(this.cgmStatus), { width: columnWidth })

      const tableColumns = [
        {
          id: 'value',
          cache: false,
          renderer: this.renderCustomTextCell,
          width: columnWidth,
          height: 35,
          fontSize: this.largeFontSize,
          font: this.boldFont,
          noteFontSize: this.smallFontSize,
          align: 'left'
        }
      ]

      const bgRangeLabels = generateBgRangeLabels(this.bgPrefs)
      const bgRangeColors = _.mapValues(bgRangeLabels, (value, key) => {
        switch (key) {
          case 'veryLow':
          case 'low':
            return this.colors.low

          case 'high':
          case 'veryHigh':
            return this.colors.high

          case 'target':
          default:
            return this.colors.target
        }
      })

      const rows = _.map(_.keys(bgRangeLabels), key => {
        const value = rangeDurations[key] / totalDuration
        const stripePadding = 2

        return {
          value: {
            text: formatPercentage(value),
            note: bgRangeLabels[key]
          },
          _fillStripe: {
            color: bgRangeColors[key],
            opacity: 0.75,
            width: (columnWidth - (2 * stripePadding)) * value,
            background: true,
            padding: stripePadding
          }
        }
      }).reverse()

      this.renderTable(tableColumns, rows, {
        showHeaders: false,
        bottomMargin: 15
      })
    } else {
      this.setFill(this.colors.lightGrey)

      this.doc
        .text(this.data.sections.bgDistribution.emptyText, {
          width: columnWidth
        })
        .moveDown()

      this.setFill()
    }
  }

  renderAggregatedStats() {
    const { averageDailyCarbs, totalDailyDose } = this.data.data

    this.renderSimpleStat(
      this.data.sections.averageDailyCarbs.title,
      averageDailyCarbs ? formatDecimalNumber(averageDailyCarbs) : '--',
      ' g',
      !averageDailyCarbs
    )

    this.renderSimpleStat(this.data.sections.totalDailyDose.title,
      totalDailyDose ? formatDecimalNumber(totalDailyDose, 1) : '--',
      ' U',
      !totalDailyDose
    )

    const { averageGlucose } = _.get(this.data.stats, 'averageGlucose.data.raw', {})
    this.renderSimpleStat(t('Average BG'), formatDecimalNumber(averageGlucose), `\n${this.bgUnits}`)

    const {
      glucoseManagementIndicator,
      insufficientData
    } = _.get(this.data.stats, 'glucoseManagementIndicator.data.raw', {})
    if (!insufficientData && !Number.isNaN(glucoseManagementIndicator)) {
      // HbA1c is an estimation, which only have meaning with enough data
      // If we don't have enough data to print it, don't display it
      this.renderSimpleStat(t('GMI ({{bgSourceLabel}})'), formatDecimalNumber(glucoseManagementIndicator, 1), '%')
    }
  }

  renderRatio(sectionKey, sectionData) {
    const columnWidth = this.getActiveColumnWidth()

    const {
      [sectionKey]: section
    } = this.data.sections

    const { active, disabled } = section

    if (active) {
      const heading = {
        text: section.title
      }

      if (disabled) {
        this.renderSimpleStat(heading, '--', '', true)
      } else {
        const { primary, secondary } = sectionData
        const { dimensions } = section
        const key1 = dimensions[0].key
        const key2 = dimensions[1].key

        this.renderTableHeading(heading, {
          font: this.font,
          fontSize: this.defaultFontSize,
          columnsDefaults: {
            width: columnWidth,
            border: 'TLR'
          }
        })

        const tableColumns = [
          {
            id: key1,
            align: 'left',
            width: columnWidth * 0.35,
            height: 55,
            cache: false,
            renderer: this.renderStackedStat,
            border: 'LB',
            disabled
          },
          {
            id: 'chart',
            align: 'center',
            width: columnWidth * 0.3,
            height: 70,
            cache: false,
            renderer: this.renderPieChart,
            padding: [0, 0, 0, 0],
            border: 'B',
            disabled
          },
          {
            id: key2,
            align: 'right',
            width: columnWidth * 0.35,
            height: 55,
            cache: false,
            renderer: this.renderStackedStat,
            border: 'RB',
            disabled
          }
        ]

        const ratioColors = {
          basal: this.colors.basal,
          bolus: this.colors.bolus,
          automated: this.colors.basalAutomated,
          manual: this.colors.basal
        }

        const rows = [
          {
            [key1]: {
              stat: dimensions[0].label,
              primary: disabled ? '--' : formatPercentage(primary[key1])
            },
            chart: {
              data: disabled ? [
                {
                  value: 1.0,
                  color: this.colors.lightGrey
                }
              ] : [
                {
                  value: primary[key1],
                  color: ratioColors[key1],
                  label: 'basal'
                },
                {
                  value: primary[key2],
                  color: ratioColors[key2],
                  label: 'bolus'
                }
              ]
            },
            [key2]: {
              stat: dimensions[1].label,
              primary: disabled ? '--' : formatPercentage(primary[key2])
            }
          }
        ]

        if (secondary) {
          rows[0][key1].secondary = disabled
            ? '-- U'
            : `${formatDecimalNumber(secondary[key1], 1)} U`

          rows[0][key2].secondary = disabled
            ? '-- U'
            : `${formatDecimalNumber(secondary[key2], 1)} U`
        }

        this.renderTable(tableColumns, rows, {
          showHeaders: false,
          bottomMargin: 15
        })
      }
    }
  }

  renderStackedStat(tb, data, draw, column, pos, padding) {
    if (draw) {
      const {
        stat,
        primary,
        secondary
      } = data[column.id]

      const xPos = pos.x + _.get(padding, 'left', 0)
      const yPos = pos.y + padding.top

      const width = column.width - _.get(padding, 'left', 0) - _.get(padding, 'right', 0)
      const align = _.get(column, 'align', 'left')

      const textOpts = {
        align,
        width,
        paragraphGap: 5
      }

      this.setFill(column.disabled ? this.colors.lightGrey : 'black', 1)

      this.doc
        .font(this.boldFont)
        .fontSize(this.smallFontSize)
        .text(stat, xPos, yPos, textOpts)

      this.doc
        .font(this.boldFont)
        .fontSize(this.largeFontSize)
        .text(primary, _.assign({}, textOpts, {
          paragraphGap: 0
        }))

      if (secondary) {
        this.doc
          .font(this.font)
          .fontSize(this.smallFontSize)
          .text(secondary, textOpts)
      }
    }

    return ' '
  }

  renderPieChart(tb, data, draw, column, pos) {
    if (draw) {
      const {
        width,
        height
      } = column

      const radius = width > height ? height / 2 : width / 2
      const xPos = pos.x + width / 2
      const yPos = pos.y + height / 2

      const {
        data: pieData
      } = data[column.id]

      const arcData = pie()(_.map(pieData, d => d.value))

      let rotation = 0

      const generateArcPath = (datum, index) => {
        const label = _.get(pieData, `${index}.label`)

        // If the first arc rendered its the basal, and it starts at the top,
        // rotate it back so that the bolus arc starts at the 12:00 position
        if (index === 0 && label === 'basal' && datum.startAngle === 0) {
          rotation = datum.endAngle
        }

        return arc()
          .startAngle((d) => (d.startAngle - rotation))
          .endAngle((d) => (d.endAngle - rotation))
          .innerRadius(0)
          .outerRadius(radius)(datum)
      }

      _.forEach(arcData, (segment, index) => {
        const path = generateArcPath(segment, index)
        const points = translate(parse(path), xPos, yPos)
        const adjustedPath = serialize(points)

        this.setFill(pieData[index].color, 1)

        this.doc
          .path(adjustedPath)
          .fill()
      })

      this.setFill()
    }

    return ' '
  }

  defineStatColumns(opts = {}) {
    const columnWidth = this.getActiveColumnWidth()

    const {
      height = 35,
      statWidth = columnWidth * 0.65,
      valueWidth = columnWidth * 0.35,
      statFont = this.font,
      statFontSize = this.defaultFontSize,
      valueFont = this.boldFont,
      valueFontSize = this.defaultFontSize,
      statHeader = false,
      valueHeader = false
    } = opts

    return [
      {
        id: 'stat',
        cache: false,
        renderer: this.renderCustomTextCell,
        width: Math.round(statWidth) - this.tableSettings.borderWidth,
        height,
        fontSize: statFontSize,
        font: statFont,
        align: 'left',
        headerAlign: 'left',
        border: 'TBL',
        headerBorder: 'TBL',
        valign: 'center',
        header: statHeader
      },
      {
        id: 'value',
        cache: false,
        renderer: this.renderCustomTextCell,
        width: Math.round(valueWidth) - this.tableSettings.borderWidth,
        height,
        fontSize: valueFontSize,
        font: valueFont,
        align: 'right',
        headerAlign: 'right',
        border: 'TBR',
        headerBorder: 'TBR',
        valign: 'center',
        header: valueHeader
      }
    ]
  }

  renderSimpleStat(stat, value, units, disabled) {
    const tableColumns = this.defineStatColumns()

    this.setFill(disabled ? this.colors.lightGrey : 'black', 1)

    const rows = [
      {
        stat,
        value: `${value}${units}`
      }
    ]

    this.renderTable(tableColumns, rows, {
      showHeaders: false,
      bottomMargin: 15
    })

    this.setFill()
  }

  renderCalendarSection(opts) {
    const {
      title,
      data,
      type,
      bottomMargin = 20,
      disabled,
      emptyText
    } = opts

    const columnWidth = this.getActiveColumnWidth()

    this.renderSectionHeading(title.text, {
      width: columnWidth,
      fontSize: this.largeFontSize,
      moveDown: 0.25
    })

    if (disabled) {
      this.renderEmptyText(emptyText)
    } else {
      let priorToFirstSiteChange = false
      if (type === 'siteChange') {
        priorToFirstSiteChange = _.some(data, { daysSince: Number.NaN })
      }

      const chunkedDayMap = _.chunk(_.map(this.calendar.days, (day, index) => {
        const date = moment.utc(day.date)
        const dateLabelMask = (index === 0 || date.date() === 1) ? t('MMM D') : t('D')

        let dayType = _.get(data, `${day.date}.type`, day.type)

        if (dayType === 'noSiteChange' && priorToFirstSiteChange) {
          dayType = 'past'
        }

        if (dayType === 'siteChange' && priorToFirstSiteChange) {
          priorToFirstSiteChange = false
        }

        return {
          color: this.colors[type],
          count: _.get(data, `${day.date}.total`, _.get(data, `${day.date}.count`, 0)),
          dayOfWeek: date.format(t('ddd')),
          daysSince: _.get(data, `${day.date}.daysSince`),
          label: date.format(dateLabelMask),
          type: dayType
        }
      }), 7)

      const rows = _.map(chunkedDayMap, week => {
        const values = {}

        _.forEach(week, day => {
          values[day.dayOfWeek] = day
        })

        return values
      })

      this.doc.fontSize(this.smallFontSize)

      const currentYPos = this.doc.y
      const headerHeight = this.doc.currentLineHeight()

      this.doc.y = currentYPos + (headerHeight - 9.25)

      this.calendar.pos[type] = {
        y: currentYPos + headerHeight + 4,
        pageIndex: this.currentPageIndex
      }

      this.renderTable(this.calendar.columns, rows, {
        bottomMargin
      })
    }
  }

  renderCalendarCell(tb, data, draw, column, pos, padding) {
    if (draw) {
      const {
        color,
        count,
        type,
        daysSince,
        label
      } = data[column.id]

      const xPos = pos.x + padding.left
      const yPos = pos.y + padding.top

      this.setFill(type === 'future' ? this.colors.lightGrey : 'black', 1)

      this.doc
        .fontSize(this.extraSmallFontSize)
        .text(label, xPos, yPos)

      const width = column.width - _.get(padding, 'left', 0) - _.get(padding, 'right', 0)
      const height = column.height - _.get(padding, 'top', 0) - _.get(padding, 'bottom', 0)

      const gridHeight = height - (this.doc.y - yPos)
      const gridWidth = width > gridHeight ? gridHeight : width

      const siteChangeTypes = [NO_SITE_CHANGE, SITE_CHANGE]
      const isSiteChange = _.includes(siteChangeTypes, type) ? type === SITE_CHANGE : null

      if (isSiteChange) {
        this.setStroke(this.colors.lightGrey)
        this.doc.lineWidth(1)

        const isFirst = _.isNaN(daysSince)

        const linePos = {
          x: pos.x,
          y: pos.y + column.height / 2 - 1
        }

        const dotPos = {
          x: linePos.x + column.width - 6,
          y: linePos.y
        }

        this.doc
          .moveTo(isFirst ? dotPos.x : linePos.x, linePos.y)
          .lineTo(linePos.x + column.width, linePos.y)
          .stroke()

        if (isSiteChange) {
          const daysSinceLabel = daysSince === 1 ? t('day') : t('days')

          const siteChangeType = this.data.sections.siteChanges.type
          const imageWidth = width / 3
          const imagePadding = (width - imageWidth) / 1.3

          this.setStroke('white')
          this.doc.lineWidth(2)

          this.doc
            .moveTo(linePos.x + column.width / 2, linePos.y - 0.5)
            .lineTo(dotPos.x, linePos.y)
            .stroke()

          this.setFill(color)
          this.setStroke(this.colors.lightGrey)

          this.doc
            .lineWidth(0.5)
            .circle(dotPos.x, dotPos.y, 2.5)
            .fillAndStroke()

          this.setFill()

          this.doc.image(this.siteChangeImages[siteChangeType], xPos + imagePadding, this.doc.y + imageWidth / 2, {
            width: imageWidth
          })

          if (!isFirst) {
            this.doc.text(`${daysSince} ${daysSinceLabel}`, this.doc.x, this.doc.y + 2, {
              width,
              align: 'center'
            })
          }
        }
      } else if (count > 0) {
        const gridPos = {
          x: pos.x + (column.width - gridWidth) / 2,
          y: this.doc.y
        }

        this.setFill(color)
        this.renderCountGrid(count, gridWidth, gridPos, color)
        this.setFill()
      }

      this.resetText()
    }

    return ' '
  }

  renderCountGrid(count, width, pos) {
    const colCount = 3
    const rowCount = 3
    const gridSpaces = colCount * rowCount
    const padding = width * 0.05
    const maxCount = 17
    const renderCount = count > maxCount ? maxCount : count

    const {
      x: xPos,
      y: yPos
    } = pos

    const diameter = (width - padding * (colCount - 1)) / colCount
    const radius = diameter / 2

    const grid = _.times(rowCount, (row) => _.times(colCount, (col) => ({
      x: xPos + (col * diameter) + (padding * col),
      y: yPos + (row * diameter) + (padding * row)
    })))

    const countArray = _.fill(Array(renderCount), 1)
    const extrasArray = _.map(
      _.chunk(countArray.splice(gridSpaces), gridSpaces - 1),
      chunk => chunk.length
    ).reverse()

    const gridValues = _.map(
      _.fill(Array(gridSpaces), 0),
      (space, index) => (_.get(countArray, index, 0) + _.get(extrasArray, index, 0))
    )

    if (extrasArray.length) {
      gridValues.reverse()
    }

    const chunkedGridValues = _.chunk(gridValues, colCount)

    const renderColumn = rowIndex => (col, colIndex) => {
      const gridPos = grid[rowIndex][colIndex]
      const dot = chunkedGridValues[rowIndex][colIndex]

      if (dot > 1) {
        this.renderCountGrid(dot, diameter, gridPos)
      } else if (dot === 1) {
        this.doc
          .circle(gridPos.x + radius, gridPos.y + radius, radius)
          .fill()
      }
    }

    const renderRow = (row, rowIndex) => {
      _.forEach(row, renderColumn(rowIndex))
    }

    _.forEach(chunkedGridValues, renderRow)
  }

  renderEmptyText(text) {
    this.setFill(this.colors.lightGrey)

    this.doc
      .fontSize(this.defaultFontSize)
      .text(text, {
        width: this.getActiveColumnWidth()
      })
      .moveDown(1.5)

    this.resetText()
  }
}

export default BasicsPrintView
