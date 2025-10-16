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

// Models & Enums
export { type BgPrefs } from './models/blood-glucose.model'
export { Device } from './models/device.model'
export { LayoutColumnType } from './models/enums/layout-column-type.enum'
export { SafetyBasalItem } from './models/safety-basal-item.model'

// Print view (PDF)
export { PrintView } from './modules/print/print-view/print-view'
export { SettingsPrintView } from './modules/print/settings-print-view/settings-print-view'

// Stats
export {
  AverageDailyDoseStatMemoized as AverageDailyDoseStat
} from './components/stats/average-daily-dose/average-daily-dose-stat'
export { AverageGlucoseMemoized as AverageGlucose } from './components/stats/average-glucose/average-glucose-stat'
export {
  CbgStandardDeviationMemoized as CBGStandardDeviation
} from './components/stats/cbg-standard-deviation/cbg-standard-deviation'
export { CBGStatType, StatFormats } from './models/stats.model'
export {
  InsulinStatisticPanelMemoized as InsulinStatisticsPanel
} from './components/stats/insulin/insulin-statistics-panel'
export { LoopModeStatMemoized as LoopModeStat } from './components/stats/loop-mode-stat/loop-mode-stat'
export { SimpleStatMemoized as SimpleStat } from './components/stats/simple/simple-stat'
export { SimpleValue } from './components/stats/common/simple-value'
export {
  TimeInRangeChartMemoized as TimeInRangeChart
} from './components/stats/time-in-range/time-in-range-chart/time-in-range-chart'
export {
  TimeInTightRangeChart
} from './components/stats/time-in-range/time-in-tight-range-chart/time-in-tight-range-chart'

// Tooltips
export { AlarmEventTooltip } from './components/tooltips/alarm-event-tooltip/alarm-event-tooltip'
export { BasalTooltip } from './components/tooltips/basal-tooltip/basal-tooltip'
export { BloodGlucoseTooltip } from './components/tooltips/blood-glucose-tooltip/blood-glucose-tooltip'
export { BolusTooltip } from './components/tooltips/bolus-tooltip/bolus-tooltip'
export { ConfidentialTooltip } from './components/tooltips/confidential-tooltip/confidential-tooltip'
export {
  EventSuperpositionPopoverMemoized as EventsSuperpositionPopover
} from './components/tooltips/events-superposition-popover/events-superposition-popover'
export { IobTooltip } from './components/tooltips/iob-tooltip/iob-tooltip'
export { NightModeTooltip } from './components/tooltips/night-mode-tooltip/night-mode-tooltip'
export { ParameterTooltip } from './components/tooltips/parameter-tooltip/parameter-tooltip'
export { PhysicalTooltip } from './components/tooltips/physical-tooltip/physical-tooltip'
export { RescueCarbsTooltip } from './components/tooltips/rescue-carbs-tooltip/rescue-carbs-tooltip'
export { ReservoirTooltip } from './components/tooltips/reservoir-tooltip/reservoir-tooltip'
export { StatTooltip } from './components/tooltips/stat-tooltip/stat-tooltip'
export { TimeChangeTooltip } from './components/tooltips/time-change-tooltip/time-change-tooltip'
export { Tooltip } from './components/tooltips/common/tooltip/tooltip'
export { TooltipLine } from './components/tooltips/common/tooltip-line/tooltip-line'
export { TooltipColor } from './models/enums/tooltip-color.enum'
export { TooltipSide } from './models/enums/tooltip-side.enum'
export { WarmUpTooltip } from './components/tooltips/warm-up-tooltip/warm-up-tooltip'
export { ZenModeTooltip } from './components/tooltips/zen-mode-tooltip/zen-mode-tooltip'

// Trends
export { CbgDateTraceLabel } from './components/trends/cbg/cbg-date-trace/cbg-date-trace-label'
export { FocusedRangeLabels } from './components/trends/common/focused-range-labels/focused-range-labels'
export { RangeSelect } from './components/trends/cbg/range-select/range-select'
export { TrendsContainer } from './components/trends/common/trends-container/trends-container'
export { TrendsProvider } from './provider/trends.provider'

// Utils
export {
  formatBirthdate,
  formatClocktimeFromMsPer24,
  formatCurrentDate,
  formatDate,
  formatLocalizedFromUTC,
  getLongDayHourFormat,
  getSimpleHourFormatSpace,
  TIMEZONE_UTC
} from './utils/datetime/datetime.util'
export { buildDevice, isDBLG2 } from './utils/device/device.utils'
export { formatBgValue } from './utils/format/format.util'
export { getDataWithoutSuperpositionEvents, getSuperpositionEvents } from './utils/events/events.util'
export { getPatientFullName } from './utils/patient/patient.util'
export { renderPageNumbers } from './utils/pdf/pdf.util'
export { buildLayoutColumns } from './modules/print/print-view/print-view.util'
export { getSafetyBasalItems, isSafetyBasalAvailable } from './utils/safety-basal-profile/safety-basal-profile.util'
