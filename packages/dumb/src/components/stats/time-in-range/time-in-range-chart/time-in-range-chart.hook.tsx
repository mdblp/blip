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

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CBGPercentageBarProps } from '../cbg-percentage-bar/cbg-percentage-bar'
import { type CBGPercentageData, CBGStatType, StatLevel } from '../../../../models/stats.model'
import { ensureNumeric } from '../../stats.util'
import { type TimeInRangeData } from 'tidepool-viz/src/types/utils/data'
import { type BgType, DatumType } from 'medical-domain'
import { BgPrefs } from '../../../../models/blood-glucose.model'

export interface TimeInRangeChartHookProps {
  bgType: BgType
  data: TimeInRangeData
  days: number
  type: CBGStatType
  bgPrefs: BgPrefs
}

interface TimeInRangeChartHookReturn {
  annotations: string[]
  cbgStatsProps: {
    veryHighStat: CBGPercentageBarProps
    highStat: CBGPercentageBarProps
    targetStat: CBGPercentageBarProps
    lowStat: CBGPercentageBarProps
    veryLowStat: CBGPercentageBarProps
  }
  hoveredStatId: StatLevel | null
  onMouseLeave: () => void
  title: string
  legendValues: { className: string, value: string }[]
}

const TITLE_TYPE_READINGS = 'Readings'
const TITLE_TYPE_TIME = 'Time'

export const useTimeInRangeChartHook = (props: TimeInRangeChartHookProps): TimeInRangeChartHookReturn => {
  const { type, days, data, bgType, bgPrefs } = props
  const { t } = useTranslation('main')
  const [hoveredStatId, setHoveredStatId] = useState<StatLevel | null>(null)

  const getDefaultTitle = useCallback((): string => {
    switch (type) {
      case CBGStatType.TimeInRange:
        return t('Time In Range')
      case CBGStatType.ReadingsInRange:
      default:
        return days > 1 ? t('Avg. Daily Readings In Range') : t('Readings In Range')
    }
  }, [days, t, type])

  const [title, setTitle] = useState(() => getDefaultTitle())

  useEffect(() => {
    setTitle(getDefaultTitle())
  }, [getDefaultTitle])

  const annotations = useMemo<string[]>(() => {
    const annotations = []
    switch (type) {
      case CBGStatType.TimeInRange:
        annotations.push(
          t('time-in-range-cgm-one-day'),
          t('compute-oneday-time-in-range')
        )
        break
      case CBGStatType.ReadingsInRange:
      default:
        annotations.push(t('readings-in-range-bgm-daily-average', { smbgLabel: t('BGM') }))
        break
    }

    if (bgType === DatumType.Smbg) {
      annotations.push(t('Derived from _**{{total}}**_ {{smbgLabel}} readings.', {
        total: data.total,
        smbgLabel: t('BGM')
      }))
    }

    return annotations
  }, [bgType, data.total, t, type])

  const onStatMouseover = (id: StatLevel, barTitle: string, hasValues: boolean): void => {
    if (hasValues) {
      setTitle(barTitle)
      setHoveredStatId(id)
    }
  }

  const onMouseLeave = (): void => {
    setTitle(getDefaultTitle())
    setHoveredStatId(null)
  }

  const dataArray = useMemo<CBGPercentageData[]>(() => {
    const titleType = type === CBGStatType.ReadingsInRange ? TITLE_TYPE_READINGS : TITLE_TYPE_TIME

    return [
      {
        id: StatLevel.VeryLow,
        value: ensureNumeric(data.veryLow),
        title: t(`${titleType} Below Range`)
      },
      {
        id: StatLevel.Low,
        value: ensureNumeric(data.low),
        title: t(`${titleType} Below Range`)
      },
      {
        id: StatLevel.Target,
        value: ensureNumeric(data.target),
        title: t(`${titleType} In Range`)
      },
      {
        id: StatLevel.High,
        value: ensureNumeric(data.high),
        title: t(`${titleType} Above Range`)
      },
      {
        id: StatLevel.VeryHigh,
        value: ensureNumeric(data.veryHigh),
        title: t(`${titleType} Above Range`)
      }
    ]
  }, [data.high, data.low, data.target, data.veryHigh, data.veryLow, t, type])

  const total = data.total

  const getCBGPercentageBarProps = (id: string): CBGPercentageBarProps => {
    const stat = dataArray.find(timeInRange => timeInRange.id === id)
    if (!stat) {
      throw Error(`Could not find stat with id ${id}`)
    }
    return {
      type,
      id: stat.id,
      isDisabled: (hoveredStatId && hoveredStatId !== stat.id) ?? total === 0,
      onMouseEnter: onStatMouseover,
      title: stat.title,
      total,
      value: stat.value
    }
  }

  const cbgStatsProps = {
    veryHighStat: getCBGPercentageBarProps(StatLevel.VeryHigh),
    highStat: getCBGPercentageBarProps(StatLevel.High),
    targetStat: getCBGPercentageBarProps(StatLevel.Target),
    lowStat: getCBGPercentageBarProps(StatLevel.Low),
    veryLowStat: getCBGPercentageBarProps(StatLevel.VeryLow)
  }

  const bgClasses = bgPrefs.bgClasses

  const legendValues = [
    { className: 'very-low', value: `<${Math.round(bgClasses.veryLow)}` },
    { className: 'low', value: `${Math.round(bgClasses.veryLow)}-${Math.round(bgClasses.low)}` },
    { className: 'target', value: `${Math.round(bgClasses.low)}-${Math.round(bgClasses.target)}` },
    { className: 'high', value: `${Math.round(bgClasses.target)}-${Math.round(bgClasses.high)}` },
    { className: 'very-high', value: `>${Math.round(bgClasses.high)}` }
  ]

  return ({
    annotations,
    cbgStatsProps,
    onMouseLeave,
    hoveredStatId,
    title,
    legendValues
  })
}
