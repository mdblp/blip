/*
 * Copyright (c) 2022-2025, Diabeloop
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

export const EMPTY_DATA_PLACEHOLDER = '--'

export enum CBGStatType {
  AverageDailyDose = 'averageDailyDose',
  AverageGlucose = 'averageGlucose',
  Carbs = 'carbs',
  ReadingsInRange = 'readingsInRange',
  StandardDeviation = 'standardDev',
  TimeInAuto = 'timeInAuto',
  TimeInRange = 'timeInRange',
  TimeInRangeDt1 = 'timeInRangeDt1',
  TimeInTightRange = 'timeInTightRange',
  TotalInsulin = 'totalInsulin',
}

export interface CBGPercentageData {
  id: StatLevel
  title: string
  value: number
}

export enum StatLevel {
  VeryHigh = 'veryHigh',
  High = 'high',
  Target = 'target',
  Low = 'low',
  VeryLow = 'veryLow',
  TightRange = 'tightRange',
  TimeInRangeDt1 = 'timeInRangeDt1',
}

export enum StatFormats {
  Cv = 'cv',
  Gmi = 'gmi',
  Percentage = 'percentage',
  Units = 'units',
}
