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

import type PdfTable from 'voilab-pdf-table'
import { type Position } from './position.model'
import { type Table } from './pdf-table.model'

interface PdfTableExtra {
  bottomMargin: number
  pos: Position
}

interface PdfTableColumnExtra {
  borderColor?: string
  font: string
  fontSize: number
  zebra?: boolean
}

interface PdfDocumentExtra {
  _font?: {
    name: string
  }
  _fontSize?: number
}

interface PdfTableConfigExtra {
  columnsDefaults: {
    zebra: boolean
  }
  font: string
  fontSize: number
  flexColumn: string
}

export type PdfTableOverridden = PdfTable<Table> & PdfTableExtra
export type PdfTableColumnOverridden = PdfTable.VoilabPdfTableColumn<Table> & PdfTableColumnExtra
export type PdfDocumentOverridden = PDFKit.PDFDocument & PdfDocumentExtra
export type PdfTableConfigOverridden = PdfTable.VoilabPdfTableConfig<Table> & PdfTableConfigExtra
