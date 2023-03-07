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

import { buildLayoutColumns, getTextData } from './print-view.util'
import { LayoutColumnType } from '../../models/enums/layout-column-type.enum'
import { type Row, type TableColumn } from '../../models/print/pdf-table.model'

describe('Print view util', () => {
  describe('buildLayoutColumns', () => {
    it('should return correct values when layoutColumnType is equal', () => {
      const layoutColumnWidths = [10, 20, 30]
      const chartAreaWidth = 40
      const leftEdge = 5
      const layoutColumnType = LayoutColumnType.Equal
      const docY = 2
      const gutter = 1

      const columns = buildLayoutColumns(layoutColumnWidths, chartAreaWidth, layoutColumnType, leftEdge, docY, gutter)

      expect(columns).toEqual([
        { width: 12.666666666666666, x: 5, y: 2 },
        { width: 12.666666666666666, x: 18.666666666666664, y: 2 },
        { width: 12.666666666666666, x: 32.33333333333333, y: 2 }
      ])
    })

    it('should return correct values when layoutColumnType is percentage', () => {
      const layoutColumnWidths = [10, 20, 30]
      const chartAreaWidth = 40
      const leftEdge = 5
      const layoutColumnType = LayoutColumnType.Percentage
      const docY = 2
      const gutter = 1

      const columns = buildLayoutColumns(layoutColumnWidths, chartAreaWidth, layoutColumnType, leftEdge, docY, gutter)

      expect(columns).toEqual([
        { width: 3.8, x: 5, y: 2 },
        { width: 7.6, x: 9.8, y: 2 },
        { width: 11.4, x: 18.4, y: 2 }
      ])
    })
  })

  describe('getTextData', () => {
    it('should return correct text data when row is a header and id is of table type', () => {
      const textExpected = 'res'
      const row: Row = { column: 'column', heading: { text: 'text' }, fakeId: textExpected } as unknown as Row
      const column: TableColumn = { id: 'fakeId', header: { text: 'text' } } as TableColumn
      const isHeader = true

      const textData = getTextData(row, column, isHeader)

      expect(textData).toEqual(textExpected)
    })

    it('should return correct text data when row is a header and id is of table type', () => {
      const textExpected = 'res'
      const row: Row = { column: 'column', heading: { text: 'text' }, fakeId: 'res' } as unknown as Row
      const column: TableColumn = { id: 'wrongId', header: { text: textExpected } } as TableColumn
      const isHeader = true

      const textData = getTextData(row, column, isHeader)

      expect(textData).toEqual({ text: textExpected })
    })

    it('should return correct text data when row is not an header and id is of table type and column header is not defined', () => {
      const textExpected = 'res'
      const row: Row = { column: 'column', heading: { text: 'text' }, fakeId: textExpected } as unknown as Row
      const column: TableColumn = { id: 'wrongId' } as TableColumn
      const isHeader = false

      const textData = getTextData(row, column, isHeader)

      expect(textData).toEqual({ text: '', note: undefined, subText: '' })
    })
  })
})
