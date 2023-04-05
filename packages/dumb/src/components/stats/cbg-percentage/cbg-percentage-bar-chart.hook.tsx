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

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CBGPercentageBarProps } from './cbg-percentage-bar'
import { type CBGPercentageData, CBGStatType, StatLevel } from '../../../models/stats.model'
import { formatBgValue } from './cbg-percentage-bar.util'
import { ensureNumeric } from '../stats.util'
import { type TimeInRangeData } from 'tidepool-viz/src/types/utils/data'
import { type BgBounds, type BgType, type BgUnit, DatumType } from 'medical-domain'

export interface CBGPercentageBarChartHookProps {
  bgBounds: BgBounds
  bgSource: BgType
  data: TimeInRangeData
  days: number
  type: CBGStatType
  units: BgUnit
}

interface CBGPercentageBarChartHookReturn {
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
  titleProps: { legendTitle: string, title: string }
}

const TITLE_TYPE_READINGS = 'Readings'
const TITLE_TYPE_TIME = 'Time'

export const useCBGPercentageBarChartHook = (props: CBGPercentageBarChartHookProps): CBGPercentageBarChartHookReturn => {
  const { type, units, days, data, bgBounds, bgSource } = props
  const { t } = useTranslation('main')
  const [hoveredStatId, setHoveredStatId] = useState<StatLevel | null>(null)

  const title = useMemo<string>(() => {
    switch (type) {
      case CBGStatType.TimeInRange:
        return days > 1 ? t('Avg. Daily Time In Range') : t('Time In Range')
      case CBGStatType.ReadingsInRange:
      default:
        return days > 1 ? t('Avg. Daily Readings In Range') : t('Readings In Range')
    }
  }, [days, t, type])

  const [titleProps, setTitleProps] = useState({ legendTitle: '', title })

  const annotations = useMemo<string[]>(() => {
    const annotations = []
    switch (type) {
      case CBGStatType.TimeInRange:
        if (days > 1) {
          annotations.push(
            t('time-in-range-cgm-daily-average'),
            t('compute-ndays-time-in-range', { cbgLabel: t('CGM') })
          )
          break
        }
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

    if (bgSource === DatumType.Smbg) {
      annotations.push(t('Derived from _**{{total}}**_ {{smbgLabel}} readings.', {
        total: data.total,
        smbgLabel: t('BGM')
      }))
    }

    return annotations
  }, [bgSource, data.total, days, t, type])

  const onStatMouseover = (id: StatLevel, title: string, legendTitle: string, hasValues: boolean): void => {
    if (hasValues) {
      setTitleProps({ legendTitle, title: `${title}` })
      setHoveredStatId(id)
    }
  }

  const onMouseLeave = (): void => {
    setTitleProps({ legendTitle: '', title })
    setHoveredStatId(null)
  }

  const dataArray = useMemo<CBGPercentageData[]>(() => {
    const titleType = type === CBGStatType.ReadingsInRange ? TITLE_TYPE_READINGS : TITLE_TYPE_TIME
    const bounds = {
      targetLowerBound: formatBgValue(bgBounds.targetLowerBound, units),
      targetUpperBound: formatBgValue(bgBounds.targetUpperBound, units),
      veryHighThreshold: formatBgValue(bgBounds.veryHighThreshold, units),
      veryLowThreshold: formatBgValue(bgBounds.veryLowThreshold, units)
    }

    return [
      {
        id: StatLevel.VeryLow,
        value: ensureNumeric(data.veryLow),
        title: t(`${titleType} Below Range`),
        legendTitle: `<${bounds.veryLowThreshold}`
      },
      {
        id: StatLevel.Low,
        value: ensureNumeric(data.low),
        title: t(`${titleType} Below Range`),
        legendTitle: `${bounds.veryLowThreshold}-${bounds.targetLowerBound}`
      },
      {
        id: StatLevel.Target,
        value: ensureNumeric(data.target),
        title: t(`${titleType} In Range`),
        legendTitle: `${bounds.targetLowerBound}-${bounds.targetUpperBound}`
      },
      {
        id: StatLevel.High,
        value: ensureNumeric(data.high),
        title: t(`${titleType} Above Range`),
        legendTitle: `${bounds.targetUpperBound}-${bounds.veryHighThreshold}`
      },
      {
        id: StatLevel.VeryHigh,
        value: ensureNumeric(data.veryHigh),
        title: t(`${titleType} Above Range`),
        legendTitle: `>${bounds.veryHighThreshold}`
      }
    ]
  }, [bgBounds.targetLowerBound, bgBounds.targetUpperBound, bgBounds.veryHighThreshold, bgBounds.veryLowThreshold, data.high, data.low, data.target, data.veryHigh, data.veryLow, t, type, units])

  const total = dataArray.map(data => data.value).reduce((sum: number, value: number) => sum + value)

  const getCBGPercentageBarProps = (id: string): CBGPercentageBarProps => {
    const stat = dataArray.find(timeInRange => timeInRange.id === id)
    if (!stat) {
      throw Error(`Could not find stat with id ${id}`)
    }
    return {
      type,
      id: stat.id,
      isDisabled: (hoveredStatId && hoveredStatId !== stat.id) ?? total === 0,
      legendTitle: stat.legendTitle,
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

  return ({
    annotations,
    cbgStatsProps,
    onMouseLeave,
    hoveredStatId,
    titleProps
  })
}
