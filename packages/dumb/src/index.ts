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

import { BloodGlucoseTooltip } from './components/tooltips/blood-glucose-tooltip/blood-glucose-tooltip'
import { BolusTooltip } from './components/tooltips/bolus-tooltip/bolus-tooltip'
import { CbgDateTraceLabel } from './components/trends/cbg/cbg-date-trace/cbg-date-trace-label'
import { CBGMeanStatMemoized as CBGMeanStat } from './components/stats/cbg-mean/cbg-mean-stat'
import {
  CBGPercentageBarChartMemoized as CBGPercentageBarChart
} from './components/stats/cbg-percentage/cbg-percentage-bar-chart'
import {
  CbgStandardDeviationMemoized as CBGStandardDeviation
} from './components/stats/cbg-standard-deviation/cbg-standard-deviation'
import { CBGStatType } from './models/stats.model'
import { ConfidentialTooltip } from './components/tooltips/confidential-tooltip/confidential-tooltip'
import { FoodTooltip } from './components/tooltips/food-tooltip/food-tooltip'
import { ParameterTooltip } from './components/tooltips/parameter-tooltip/parameter-tooltip'
import { PhysicalTooltip } from './components/tooltips/physical-tooltip/physical-tooltip'
import { TotalInsulinStatMemoized as TotalInsulinStat } from './components/stats/total-insulin/total-insulin-stat'
import { TotalCarbsStatMemoized as TotalCarbsStat } from './components/stats/total-carbs/total-carbs-stat'
import { LoopModeStatMemoized as LoopModeStat } from './components/stats/loop-mode-stat/loop-mode-stat'
import { ReservoirTooltip } from './components/tooltips/reservoir-tooltip/reservoir-tooltip'
import { StatTooltip } from './components/tooltips/stat-tooltip/stat-tooltip'
import Tooltip from './components/tooltips/common/tooltip/tooltip'
import { CgmTable } from './components/settings/cgm-table'
import { PumpTable } from './components/settings/pump-table'
import { TerminalTable } from './components/settings/terminal-table'
import {
  AverageDailyDoseStatMemoized as AverageDailyDoseStat
} from './components/stats/average-daily-dose/average-daily-dose-stat'
import { SimpleStatMemoized as SimpleStat } from './components/stats/simple/simple-stat'
import { RangeLabeledToggle } from './components/controls/range-labeled-toggle/range-labeled-toggle'
import { Table } from './components/settings/table'
import CbgSliceSegment from './components/trends/cbg/cbg-slice/cbg-slice-segment'
import { type BgPrefs } from './models/blood-glucose.model'
import { RangeSelect } from './components/trends/cbg/range-select/range-select'
import { TrendsProvider } from './provider/trends.provider'
import { FocusedRangeLabels } from './components/trends/common/focused-range-labels/focused-range-labels'
import {
  TrendsSvgContainerSized as TrendsSvgContainer
} from './components/trends/common/trends-svg-container/trends-svg-container'
import { FocusedCbgSliceSegmentMemoized as FocusedCbgSliceSegment } from './components/trends/cbg/cbg-slice/focused-cbg-slice-segment'

export {
  AverageDailyDoseStat,
  type BgPrefs,
  BloodGlucoseTooltip,
  BolusTooltip,
  CbgDateTraceLabel,
  CBGMeanStat,
  CBGPercentageBarChart,
  CbgSliceSegment,
  CBGStandardDeviation,
  CBGStatType,
  CgmTable,
  ConfidentialTooltip,
  FocusedCbgSliceSegment,
  FocusedRangeLabels,
  FoodTooltip,
  LoopModeStat,
  ParameterTooltip,
  PhysicalTooltip,
  PumpTable,
  RangeLabeledToggle,
  RangeSelect,
  ReservoirTooltip,
  SimpleStat,
  StatTooltip,
  Table,
  TerminalTable,
  Tooltip,
  TotalInsulinStat,
  TotalCarbsStat,
  TrendsProvider,
  TrendsSvgContainer
}
