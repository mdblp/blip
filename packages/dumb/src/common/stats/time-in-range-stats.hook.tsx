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
import { CBGTimeData, StatLevel } from './time-in-range-stats'
import { CBGTimeStatProps } from './cbg-time-stat'

export interface TimeInRangeStatsHookProps {
  data: CBGTimeData[]
  titleKey: string
  total: number
}

interface TimeInRangeStatsHookReturn {
  cbgStatsProps: {
    veryHighStat: CBGTimeStatProps
    highStat: CBGTimeStatProps
    targetStat: CBGTimeStatProps
    lowStat: CBGTimeStatProps
    veryLowStat: CBGTimeStatProps
  }
  hoveredStatId: StatLevel | null
  onMouseLeave: Function
  titleProps: {
    legendTitle: string
    showTooltipIcon: boolean
    title: string
  }
}

export const useTimeInRangeStatsHook = (props: TimeInRangeStatsHookProps): TimeInRangeStatsHookReturn => {
  const { data, titleKey, total } = props
  const { t } = useTranslation('main')
  const timeInRangeLabel = t(titleKey)

  const [hoveredStatId, setHoveredStatId] = useState<StatLevel | null>(null)
  const [titleProps, setTitleProps] = useState({
    legendTitle: '',
    showTooltipIcon: true,
    title: timeInRangeLabel
  })

  const onStatMouseover = useCallback((id: StatLevel, title: string, legendTitle: string, hasValues: boolean) => {
    if (hasValues) {
      setTitleProps({
        legendTitle,
        showTooltipIcon: false,
        title: `${title}`
      })
      setHoveredStatId(id)
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    setTitleProps({
      legendTitle: '',
      showTooltipIcon: true,
      title: timeInRangeLabel
    })
    setHoveredStatId(null)
  }, [timeInRangeLabel])

  const getCBGTimeStatsProps = useCallback((id: string) => {
    const stat = data.find(timeInRange => timeInRange.id === id)
    if (!stat) {
      throw Error(`Could not find stat with id ${id}`)
    }
    return {
      id: stat.id,
      isDisabled: (hoveredStatId && hoveredStatId !== stat.id) ?? total === 0,
      onMouseOver: () => onStatMouseover(stat.id, stat.title, stat.legendTitle, total !== 0),
      total,
      value: stat.value
    }
  }, [data, hoveredStatId, onStatMouseover, total])

  const cbgStatsProps = useMemo(() => ({
    veryHighStat: getCBGTimeStatsProps(StatLevel.VeryHigh),
    highStat: getCBGTimeStatsProps(StatLevel.High),
    targetStat: getCBGTimeStatsProps(StatLevel.Target),
    lowStat: getCBGTimeStatsProps(StatLevel.Low),
    veryLowStat: getCBGTimeStatsProps(StatLevel.VeryLow)
  }), [getCBGTimeStatsProps])

  return useMemo(() => ({
    cbgStatsProps,
    onMouseLeave,
    hoveredStatId,
    titleProps
  }), [
    cbgStatsProps,
    onMouseLeave,
    hoveredStatId,
    titleProps
  ])
}
