/**
 * Copyright (c) 2022, Diabeloop
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

import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StatLevel, TimeInRangeData } from './time-in-range-stats'

export interface TimeInRangeStatsTitleHookProps {
  data: TimeInRangeData[]
  titleKey: string
  total: number
}

interface TimeInRangeStatsTitleHookReturn {
  cbgStats: {
    veryHighStat: TimeInRangeData
    highStat: TimeInRangeData
    targetStat: TimeInRangeData
    lowStat: TimeInRangeData
    veryLowStat: TimeInRangeData
  }
  cbgTimeStatCommonProps: {
    hoveredStatId: string | null
    onMouseLeave: Function
    onMouseOver: Function
    total: number
  }
  hoveredStatId: StatLevel | null
  titleProps: {
    legendTitle: string
    showTooltipIcon: boolean
    title: string
  }
}

export const useTimeInRangeStatsHook = (props: TimeInRangeStatsTitleHookProps): TimeInRangeStatsTitleHookReturn => {
  const { data, titleKey, total } = props
  const { t } = useTranslation('main')
  const timeInRangeLabel = t(titleKey)

  const [hoveredStatId, setHoveredStatId] = useState<StatLevel | null>(null)
  const [titleProps, setTitleProps] = useState({
    legendTitle: '',
    showTooltipIcon: true,
    title: timeInRangeLabel
  })

  const onStatMouseover = useCallback((id: StatLevel, title: string, legendTitle: string) => {
    setTitleProps({
      legendTitle,
      showTooltipIcon: false,
      title: `${title}`
    })
    setHoveredStatId(id)
  }, [])

  const onStatMouseLeave = useCallback(() => {
    setTitleProps({
      legendTitle: '',
      showTooltipIcon: true,
      title: timeInRangeLabel
    })
    setHoveredStatId(null)
  }, [timeInRangeLabel])

  const cbgTimeStatCommonProps = useMemo(() => ({
    hoveredStatId,
    onMouseLeave: onStatMouseLeave,
    onMouseOver: onStatMouseover,
    total
  }), [hoveredStatId, onStatMouseLeave, onStatMouseover, total])

  const getTimeInRange = useCallback((id: string) => {
    const tir = data.find(timeInRange => timeInRange.id === id)
    if (!tir) {
      throw Error(`Could not find stat with id ${id}`)
    }
    return tir
  }, [data])

  const cbgStats = useMemo(() => ({
    veryHighStat: getTimeInRange(StatLevel.VeryHigh),
    highStat: getTimeInRange(StatLevel.High),
    targetStat: getTimeInRange(StatLevel.Target),
    lowStat: getTimeInRange(StatLevel.Low),
    veryLowStat: getTimeInRange(StatLevel.VeryLow)
  }), [getTimeInRange])

  return useMemo(() => ({
    cbgStats,
    cbgTimeStatCommonProps,
    hoveredStatId,
    titleProps
  }), [
    cbgStats,
    cbgTimeStatCommonProps,
    hoveredStatId,
    titleProps
  ])
}
