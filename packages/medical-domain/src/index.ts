/*
 * Copyright (c) 2022-2024, Diabeloop
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

import type Datum from './domains/models/medical/datum.model'
import type { AlarmEvent } from './domains/models/medical/datum/alarm-event.model'
import { AlarmCode } from './domains/models/medical/datum/enums/alarm-code.enum'
import { AlarmEventType } from './domains/models/medical/datum/enums/alarm-event-type.enum'
import { AlarmLevel } from './domains/models/medical/datum/enums/alarm-level.enum'
import type Basal from './domains/models/medical/datum/basal.model'
import type BaseDatum from './domains/models/medical/datum/basics/base-datum.model'
import type Bolus from './domains/models/medical/datum/bolus.model'
import { BolusSubtype } from './domains/models/medical/datum/enums/bolus-subtype.enum'
import { type BgType, type BgUnit, MGDL_UNITS, MMOLL_UNITS } from './domains/models/medical/datum/bg.model'
import type Cbg from './domains/models/medical/datum/cbg.model'
import { ClassificationType } from './domains/models/statistics/enum/bg-classification.enum'
import { type BgBounds, type CbgRangeStatistics } from './domains/models/statistics/glycemia-statistics.model'
import type ConfidentialMode from './domains/models/medical/datum/confidential-mode.model'
import { DatumType } from './domains/models/medical/datum/enums/datum-type.enum'
import { type Parameter } from './domains/models/medical/datum/device-parameter-change.model'
import type DeviceParameterChange from './domains/models/medical/datum/device-parameter-change.model'
import { type DurationValue } from './domains/models/medical/datum/basics/duration.model'
import DurationUnit from './domains/models/medical/datum/enums/duration-unit.enum'
import type Meal from './domains/models/medical/datum/meal.model'
import type Message from './domains/models/medical/datum/message.model'
import type PhysicalActivity from './domains/models/medical/datum/physical-activity.model'
import Prescriptor from './domains/models/medical/datum/enums/prescriptor.enum'
import PumpManufacturer from './domains/models/medical/datum/enums/pump-manufacturer.enum'
import {
  type CgmConfig,
  type DeviceConfig,
  type ParameterConfig,
  type PumpConfig,
  type ParametersChange,
  type PumpSettingsParameter,
  ChangeType,
  PumpSettings,
  SecurityBasalRate,
  SecurityBasalConfig
} from './domains/models/medical/datum/pump-settings.model'
import type ReservoirChange from './domains/models/medical/datum/reservoir-change.model'
import type Smbg from './domains/models/medical/datum/smbg.model'
import Source from './domains/models/medical/datum/enums/source.enum'
import Unit from './domains/models/medical/datum/enums/unit.enum'
import type Wizard from './domains/models/medical/datum/wizard.model'
import { WizardInputMealFat } from './domains/models/medical/datum/enums/wizard-input-meal-fat.enum'
import { WizardInputMealSource } from './domains/models/medical/datum/enums/wizard-input-meal-source.enum'
import type ZenMode from './domains/models/medical/datum/zen-mode.model'
import MedicalDataService from './domains/repositories/medical/medical-data.service'
import { convertBG } from './domains/repositories/medical/datum/cbg.service'
import {
  type BgClasses,
  defaultMedicalDataOptions,
  defaultBgClasses,
  DEFAULT_BG_BOUNDS,
  type TimePrefs
} from './domains/models/medical/medical-data-options.model'
import * as TimeService from './domains/repositories/time/time.service'
import type DateFilter from './domains/models/time/date-filter.model'
import { type WeekDaysFilter } from './domains/models/time/date-filter.model'
import type MedicalData from './domains/models/medical/medical-data.model'
import {
  classifyBgValue,
  GlycemiaStatisticsService
} from './domains/repositories/statistics/glycemia-statistics.service'
import type BasicData from './domains/repositories/medical/basics-data.service'
import { CarbsStatisticsService } from './domains/repositories/statistics/carbs-statistics.service'
import { BasalBolusStatisticsService } from './domains/repositories/statistics/insulin-statistics.service'
import { applyOffset, MS_IN_DAY } from './domains/repositories/time/time.service'
import { HoursRange } from './domains/models/statistics/satistics.model'
import { RescueCarbsAveragePerRange } from './domains/models/statistics/carbs-statistics.model'
import { ManualBolusAveragePerRange } from './domains/models/statistics/basal-bolus-statistics.model'
import { GROUP_ALARMS_THRESHOLD_MINUTES } from './domains/repositories/medical/datum/alarm-event.service'
import { DeviceSystem } from './domains/models/medical/datum/enums/device-system.enum'

export {
  AlarmCode,
  type AlarmEvent,
  AlarmEventType,
  AlarmLevel,
  applyOffset,
  RescueCarbsAveragePerRange,
  ManualBolusAveragePerRange,
  HoursRange,
  type Basal,
  type BaseDatum,
  type BgBounds,
  type BgClasses,
  type BgType,
  type BgUnit,
  type Bolus,
  BolusSubtype,
  type Cbg,
  type CbgRangeStatistics,
  type CgmConfig,
  ClassificationType,
  type ConfidentialMode,
  DatumType,
  type DateFilter,
  type Datum,
  type DeviceConfig,
  type DeviceParameterChange,
  DeviceSystem,
  type DurationValue,
  DurationUnit,
  type Meal,
  type MedicalData,
  type Message,
  type Parameter,
  type ParameterConfig,
  type PhysicalActivity,
  Prescriptor,
  PumpManufacturer,
  type PumpConfig,
  PumpSettings,
  type ReservoirChange,
  SecurityBasalRate,
  SecurityBasalConfig,
  type Smbg,
  Source,
  type TimePrefs,
  Unit,
  type Wizard,
  WizardInputMealFat,
  WizardInputMealSource,
  type ZenMode,
  type WeekDaysFilter,
  defaultMedicalDataOptions,
  DEFAULT_BG_BOUNDS,
  defaultBgClasses,
  TimeService,
  MGDL_UNITS,
  MMOLL_UNITS,
  classifyBgValue,
  convertBG,
  GlycemiaStatisticsService,
  type BasicData,
  CarbsStatisticsService,
  type ParametersChange,
  type PumpSettingsParameter,
  ChangeType,
  BasalBolusStatisticsService,
  MS_IN_DAY,
  GROUP_ALARMS_THRESHOLD_MINUTES
}
export default MedicalDataService
