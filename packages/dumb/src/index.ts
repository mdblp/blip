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

import { AlarmEventTooltip } from './components/tooltips/alarm-event-tooltip/alarm-event-tooltip'
import { BloodGlucoseTooltip } from './components/tooltips/blood-glucose-tooltip/blood-glucose-tooltip'
import { BolusTooltip } from './components/tooltips/bolus-tooltip/bolus-tooltip'
import { CbgDateTraceLabel } from './components/trends/cbg/cbg-date-trace/cbg-date-trace-label'
import { CBGMeanStatMemoized as CBGMeanStat } from './components/stats/cbg-mean/cbg-mean-stat'
import { TimeInRangeChartMemoized as TimeInRangeChart } from './components/stats/time-in-range/time-in-range-chart/time-in-range-chart'
import { TimeInTightRangeChart } from './components/stats/time-in-range/time-in-tight-range-chart/time-in-tight-range-chart'
import {
  CbgStandardDeviationMemoized as CBGStandardDeviation
} from './components/stats/cbg-standard-deviation/cbg-standard-deviation'
import { CBGStatType, StatFormats } from './models/stats.model'
import { ConfidentialTooltip } from './components/tooltips/confidential-tooltip/confidential-tooltip'
import {
  EventSuperpositionPopoverMemoized as EventsSuperpositionPopover
} from './components/tooltips/events-superposition-popover/events-superposition-popover'
import { RescueCarbsTooltip } from './components/tooltips/rescue-carbs-tooltip/rescue-carbs-tooltip'
import { formatBgValue } from './utils/format/format.util'
import { ParameterTooltip } from './components/tooltips/parameter-tooltip/parameter-tooltip'
import { PhysicalTooltip } from './components/tooltips/physical-tooltip/physical-tooltip'
import { InsulinStatisticPanelMemoized as InsulinStatisticsPanel } from './components/stats/insulin/insulin-statistics-panel'
import { LoopModeStatMemoized as LoopModeStat } from './components/stats/loop-mode-stat/loop-mode-stat'
import { ReservoirTooltip } from './components/tooltips/reservoir-tooltip/reservoir-tooltip'
import { StatTooltip } from './components/tooltips/stat-tooltip/stat-tooltip'
import Tooltip from './components/tooltips/common/tooltip/tooltip'
import { TooltipLine } from './components/tooltips/common/tooltip-line/tooltip-line'
import { TooltipColor } from './models/enums/tooltip-color.enum'
import { TooltipSide } from './models/enums/tooltip-side.enum'
import { AverageDailyDoseStatMemoized as AverageDailyDoseStat } from './components/stats/average-daily-dose/average-daily-dose-stat'
import { SimpleStatMemoized as SimpleStat } from './components/stats/simple/simple-stat'
import { type BgPrefs } from './models/blood-glucose.model'
import { RangeSelect } from './components/trends/cbg/range-select/range-select'
import { TrendsProvider } from './provider/trends.provider'
import { FocusedRangeLabels } from './components/trends/common/focused-range-labels/focused-range-labels'
import { TrendsContainer } from './components/trends/common/trends-container/trends-container'
import { SettingsPrintView } from './modules/print/settings-print-view/settings-print-view'
import { PrintView } from './modules/print/print-view/print-view'
import { LayoutColumnType } from './models/enums/layout-column-type.enum'
import { buildLayoutColumns } from './modules/print/print-view/print-view.util'
import { getPatientFullName } from './utils/patient/patient.util'
import {
  formatBirthdate,
  formatLocalizedFromUTC,
  getLongDayHourFormat,
  formatDate,
  TIMEZONE_UTC,
  formatCurrentDate,
  formatClocktimeFromMsPer24,
  getSimpleHourFormatSpace
} from './utils/datetime/datetime.util'
import { renderPageNumbers } from './utils/pdf/pdf.util'
import { WarmUpTooltip } from './components/tooltips/warm-up-tooltip/warm-up-tooltip'
import { Device } from './models/device.model'
import { buildDevice } from './utils/device/device.utils'
import { SafetyBasalItem } from './models/safety-basal-item.model'
import { isSafetyBasalAvailable, getSafetyBasalItems } from './utils/safety-basal-profile/safety-basal-profile.util'
import { NightModeTooltip } from './components/tooltips/night-mode-tooltip/night-mode-tooltip'
import { SimpleValue } from './components/stats/common/simple-value'
import { getSuperpositionEvents, getDataWithoutSuperpositionEvents } from './utils/events/events.util'

export {
  formatDate,
  StatFormats,
  renderPageNumbers,
  AverageDailyDoseStat,
  buildLayoutColumns,
  type BgPrefs,
  BloodGlucoseTooltip,
  BolusTooltip,
  CbgDateTraceLabel,
  CBGMeanStat,
  CBGStandardDeviation,
  CBGStatType,
  ConfidentialTooltip,
  Device,
  buildDevice,
  EventsSuperpositionPopover,
  FocusedRangeLabels,
  formatCurrentDate,
  formatBirthdate,
  formatClocktimeFromMsPer24,
  getPatientFullName,
  getSimpleHourFormatSpace,
  AlarmEventTooltip,
  formatBgValue,
  LayoutColumnType,
  LoopModeStat,
  NightModeTooltip,
  ParameterTooltip,
  PhysicalTooltip,
  PrintView,
  RangeSelect,
  ReservoirTooltip,
  SettingsPrintView,
  SimpleStat,
  StatTooltip,
  TimeInRangeChart,
  TimeInTightRangeChart,
  Tooltip,
  TooltipColor,
  TooltipLine,
  TooltipSide,
  InsulinStatisticsPanel,
  TrendsContainer,
  TrendsProvider,
  formatLocalizedFromUTC,
  getLongDayHourFormat,
  TIMEZONE_UTC,
  WarmUpTooltip,
  RescueCarbsTooltip,
  SafetyBasalItem,
  isSafetyBasalAvailable,
  getSafetyBasalItems,
  SimpleValue,
  getDataWithoutSuperpositionEvents,
  getSuperpositionEvents
}
