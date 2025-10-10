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

interface FillStripe {
  background: boolean
  color: string
  opacity: number
  padding: number
  width: number
}

export interface TableSettings {
  borderWidth: number
  colors: {
    border: string
    tableHeader: string
    zebraEven: string
    zebraHeader: string
    zebraOdd: string
  }
}

export interface TableHeading {
  note?: string
  subText?: string
  text: string
}

export interface TableColumn {
  align: "center" | "right" | "left" | "justify" | undefined
  fillStripe: FillStripe
  font: string
  fontSize: number
  header: TableHeading
  headerAlign: "center" | "right" | "left" | "justify" | undefined
  headerFillStripe: FillStripe
  headerFont: string
  headerHeight: number
  height: number
  id: keyof Table
  noteFontSize: number
  valign: string
  width: number
}

export type Table = {
  _fill?: { color: string, opacity: number }
  _fillStripe?: { color: string, opacity: number, width: number, padding: number, background: boolean }
  _headerFillStripe?: { color: string, opacity: number, width: number, padding: number, background: boolean }
  _renderedContent?: { height: number }
  column?: string
  heading?: TableHeading
  note?: number
} & Record<string, string | number>

export type Row = Table
