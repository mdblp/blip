/*
 * Copyright (c) 2026, Diabeloop
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

import { CBGPercentageData, StatLevel } from '../../../../models/stats.model'
import { formatDuration } from '../../../../utils/datetime/datetime.util'

interface PercentageValueItem {
  id: StatLevel,
  percentage: number
}

export const getFormattedDuration = (value: number): string => {
  return formatDuration(value, true)
}

export const getTimeInRangePercentages = (dataArray: CBGPercentageData[], total: number): PercentageValueItem[] => {
  const rawPercentages = getRawPercentages(dataArray, total)

  return getSmartRoundedPercentages(rawPercentages)
}

const getSmartRoundedPercentages = (values: PercentageValueItem[]): PercentageValueItem[] => {
  const floors = values.map((value) => Math.floor(value.percentage))
  const sumOfFloors = floors.reduce((acc, value) => acc + value, 0)
  const numberOfValuesToBump = 100 - sumOfFloors

  const idOfValuesToBump = new Set(values
    // Keep only the decimal value for each percentage
    .map((value, index) => ({
      id: value.id,
      value: value.percentage - floors[index]
    }))
    // Sort them by descending order
    .sort((a, b) => b.value - a.value)
    // Keep only the first `numberOfValuesToBump` values
    .slice(0, numberOfValuesToBump)
    // Keep only the id of the values
    .map((value) => value.id))

  return floors.map((floor, index) => {
    const id = values[index].id

    if (idOfValuesToBump.has(id)) {
      return { id, percentage: floor + 1 }
    }
    return { id, percentage: floor }
  })
}

const getRawPercentages = (dataArray: CBGPercentageData[], total: number): PercentageValueItem[] => {
  return dataArray.map((stat: CBGPercentageData) => ({
    id: stat.id,
    percentage: total !== 0 ? stat.value / total * 100 : 0
  }))
}
