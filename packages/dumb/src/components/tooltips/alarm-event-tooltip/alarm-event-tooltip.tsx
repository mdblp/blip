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

import {
  COMMON_TOOLTIP_SIDE,
  COMMON_TOOLTIP_TAIL_HEIGHT,
  COMMON_TOOLTIP_TAIL_WIDTH,
  DEFAULT_TOOLTIP_BORDER_WIDTH,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_TOOLTIP_TAIL,
  Position,
  Side
} from '../common/tooltip/tooltip'
import { AlarmCode, AlarmEvent, AlarmEventType, TimePrefs } from 'medical-domain'
import React, { FC } from 'react'
import { Tooltip } from '../../../index'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { useTranslation } from 'react-i18next'
import colors from '../../../styles/colors.css'
import { getDateTitle } from '../../../utils/tooltip/tooltip.util';
import { AlarmLevel } from 'medical-domain/dist/src/domains/models/medical/datum/enums/alarm-level.enum';
import styles from './alarm-event-tooltip.css'

interface AlarmEventTooltipProps {
  alarmEvent: AlarmEvent
  position: Position
  side: Side
  timePrefs: TimePrefs
}

export const AlarmEventTooltip: FC<AlarmEventTooltipProps> = (props) => {
  const { alarmEvent, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const getBorderColor = (alarmEventType: AlarmEventType): string => {
    switch (alarmEventType) {
      case AlarmEventType.Hyperglycemia:
        return colors.hyperglycemia
      case AlarmEventType.Hypoglycemia:
        return colors.hypoglycemia
      case AlarmEventType.Device:
      default:
        return colors.deviceEvent
    }
  }

  const getContentTitleByCode = (alarmCode: AlarmCode): string => {
    switch (alarmCode) {
      case AlarmCode.UrgentLowSoon:
        return t('alert-urgent-low-soon-title')
      case AlarmCode.Hyperglycemia:
      case AlarmCode.LongHyperglycemia:
        return t('alert-hyperglycemia-title')
      case AlarmCode.SensorSessionExpired:
        return t('alarm-sensor-session-expired-title')
      case AlarmCode.Hypoglycemia:
      case AlarmCode.LongHypoglycemia:
        return t('alarm-hypoglycemia-title')
      case AlarmCode.NoReadingsHypoglycemiaRisk:
        return t('alert-no-readings-hypoglycemia-risk-title')
      case AlarmCode.SuddenRiseInGlycemia:
        return t('alert-sudden-rise-glycemia-title')
      case AlarmCode.EmptyPumpBattery:
        return t('alarm-empty-pump-battery-title')
      case AlarmCode.EmptyInsulinCartridge:
        return t('alarm-empty-insulin-cartridge-title')
      case AlarmCode.InsulinCartridgeExpired:
        return t('alarm-insulin-cartridge-expired-title')
      case AlarmCode.Occlusion:
        return t('alarm-occlusion-title')
      default:
        return ''
    }
  }

  const getContentTextByCode = (alarmCode: AlarmCode): string[] => {
    switch (alarmCode) {
      case AlarmCode.UrgentLowSoon:
        return [t('alert-urgent-low-soon-description'), t('alert-loop-mode-deactivated-description')]
      case AlarmCode.Hyperglycemia:
        return [t('alert-hyperglycemia-description'), t('alert-loop-mode-deactivated-description')]
      case AlarmCode.SensorSessionExpired:
        return [t('alarm-sensor-session-expired-description-line1'), t('alarm-sensor-session-expired-description-line2')]
      case AlarmCode.Hypoglycemia:
        return [t('alarm-hypoglycemia-description'), t('alarm-loop-mode-deactivated-description')]
      case AlarmCode.LongHyperglycemia:
        return [t('alert-long-hyperglycemia-description')]
      case AlarmCode.NoReadingsHypoglycemiaRisk:
        return [t('alert-no-readings-hypoglycemia-risk-description'), t('alert-loop-mode-activated-description')]
      case AlarmCode.SuddenRiseInGlycemia:
        return [t('alert-sudden-rise-glycemia-description'), t('alert-loop-mode-activated-description')]
      case AlarmCode.LongHypoglycemia:
        return [t('alarm-long-hypoglycemia-description'), t('alarm-loop-mode-activated-description')]
      case AlarmCode.EmptyPumpBattery:
        return [t('alarm-empty-pump-battery-description'), t('alarm-pump-cannot-deliver-insulin-description')]
      case AlarmCode.EmptyInsulinCartridge:
        return [t('alarm-empty-insulin-cartridge-description'), t('alarm-pump-cannot-deliver-insulin-description')]
      case AlarmCode.InsulinCartridgeExpired:
        return [t('alarm-insulin-cartridge-expired-description'), t('alarm-pump-cannot-deliver-insulin-description')]
      case AlarmCode.Occlusion:
        return [t('alarm-occlusion-description'), t('alarm-pump-cannot-deliver-insulin-description')]
      default:
        return ['']
    }
  }

  const alarmCode = alarmEvent.alarm.alarmCode
  const title = alarmEvent.alarm.alarmLevel === AlarmLevel.Alarm
    ? t('alarm-with-code', { code: alarmCode })
    : t('alert-with-code', { code: alarmCode })

  const contentTitle = getContentTitleByCode(alarmCode)
  const contentTextArray = getContentTextByCode(alarmCode)

  return (
    <Tooltip
      position={position}
      borderColor={getBorderColor(alarmEvent.alarmEventType)}
      dateTitle={getDateTitle(alarmEvent, timePrefs)}
      title={title}
      side={side || COMMON_TOOLTIP_SIDE}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tail={DEFAULT_TOOLTIP_TAIL}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={styles.container}>
          <TooltipLine label={contentTitle} isBold/>
          {contentTextArray.map((textLine: string) => (
            <TooltipLine label={textLine} key={textLine} />
          ))}
        </div>
      }
    />
  )
}
