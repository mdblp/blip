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

import type BaseDatum from './domains/models/medical/datum/basics/base-datum.model'
import type Bolus from './domains/models/medical/datum/bolus.model'
import type Cbg from './domains/models/medical/datum/cbg.model'
import type ConfidentialMode from './domains/models/medical/datum/confidential-mode.model'
import type DeviceParameterChange from './domains/models/medical/datum/device-parameter-change.model'
import DurationUnit from './domains/models/medical/datum/enums/duration-unit.enum'
import type Meal from './domains/models/medical/datum/meal.model'
import type Message from './domains/models/medical/datum/message.model'
import type PhysicalActivity from './domains/models/medical/datum/physical-activity.model'
import Prescriptor from './domains/models/medical/datum/enums/prescriptor.enum'
import PumpManufacturer from './domains/models/medical/datum/enums/pump-manufacturer.enum'
import type ReservoirChange from './domains/models/medical/datum/reservoir-change.model'
import type Smbg from './domains/models/medical/datum/smbg.model'
import Source from './domains/models/medical/datum/enums/source.enum'
import Unit from './domains/models/medical/datum/enums/unit.enum'
import type Wizard from './domains/models/medical/datum/wizard.model'
import type ZenMode from './domains/models/medical/datum/zen-mode.model'
import MedicalDataService from './domains/repositories/medical/medical-data.service'
import type DateFilter from './domains/models/time/date-filter.model'
import type MedicalData from './domains/models/medical/medical-data.model'
import type BasicData from './domains/repositories/medical/basics-data.service'
import WarmUp from './domains/models/medical/datum/warm-up.model'

export {
  type BaseDatum,
  type Bolus,
  type Cbg,
  type ConfidentialMode,
  type DateFilter,
  type DeviceParameterChange,
  DurationUnit,
  type Meal,
  type MedicalData,
  type Message,
  type PhysicalActivity,
  Prescriptor,
  PumpManufacturer,
  type ReservoirChange,
  type Smbg,
  Source,
  Unit,
  type Wizard,
  type ZenMode,
  type BasicData,
  WarmUp,
}

// Datum models
export { AlarmCode } from './domains/models/medical/datum/enums/alarm-code.enum'
export { type AlarmEvent } from './domains/models/medical/datum/alarm-event.model'
export { AlarmEventType } from './domains/models/medical/datum/enums/alarm-event-type.enum'
export { AlarmLevel } from './domains/models/medical/datum/enums/alarm-level.enum'
export { type Basal } from './domains/models/medical/datum/basal.model'
export { BasalDeliveryType } from './domains/models/medical/datum/enums/basal-delivery-type.enum'
export { type BgBounds, type CbgRangeStatistics } from './domains/models/statistics/glycemia-statistics.model'
export { BgClass } from './domains/models/statistics/enum/bg-class.enum'
export { type BgType, type BgUnit, MGDL_UNITS, MMOLL_UNITS } from './domains/models/medical/datum/bg.model'
export { BolusSubtype } from './domains/models/medical/datum/enums/bolus-subtype.enum'
export { ClassificationType } from './domains/models/statistics/enum/bg-classification.enum'
export { Datum } from './domains/models/medical/datum.model'
export { DatumType } from './domains/models/medical/datum/enums/datum-type.enum'
export { DeviceEventSubtype } from './domains/models/medical/datum/enums/device-event-subtype.enum'
export { DeviceSystem } from './domains/models/medical/datum/enums/device-system.enum'
export { type DurationValue } from './domains/models/medical/datum/basics/duration.model'
export { Iob } from './domains/models/medical/datum/iob.datum'
export { type NightMode } from './domains/models/medical/datum/night-mode.model'
export { type Parameter } from './domains/models/medical/datum/device-parameter-change.model'
export { PhysicalActivityName } from './domains/models/medical/datum/enums/physical-activity-name.enum'
export {
  type CgmConfig,
  ChangeType,
  type DeviceConfig,
  type MobileAppConfig,
  type ParameterConfig,
  type ParametersChange,
  type PumpConfig,
  PumpSettings,
  type PumpSettingsParameter,
  SecurityBasalConfig,
  SecurityBasalRate
} from './domains/models/medical/datum/pump-settings.model'
export { type TimeZoneChange } from './domains/models/medical/datum/time-zone-change.model'
export { WizardInputMealFat } from './domains/models/medical/datum/enums/wizard-input-meal-fat.enum'
export { WizardInputMealSource } from './domains/models/medical/datum/enums/wizard-input-meal-source.enum'
export {
  type BgClasses,
  DEFAULT_BG_BOUNDS,
  defaultBgClasses,
  defaultMedicalDataOptions,
  type TimePrefs
} from './domains/models/medical/medical-data-options.model'
export { type WeekDaysFilter } from './domains/models/time/date-filter.model'
export { DiabeticType } from './domains/models/medical/patient-profile/diabetic-type.enum'
export { MonitoringAlertsParameters } from './domains/models/monitoring-alerts/monitoring-alerts-parameters.model'

// Statistics models
export { HoursRange } from './domains/models/statistics/satistics.model'
export { ManualBolusAveragePerRange } from './domains/models/statistics/basal-bolus-statistics.model'
export { RescueCarbsAveragePerRange } from './domains/models/statistics/carbs-statistics.model'

// Services
export { BasalBolusStatisticsService } from './domains/repositories/statistics/insulin-statistics.service'
export { CarbsStatisticsService } from './domains/repositories/statistics/carbs-statistics.service'
export { convertBG } from './domains/repositories/medical/datum/cbg.service'
export { GROUP_ALARMS_THRESHOLD_MINUTES } from './domains/repositories/medical/datum/alarm-event.service'
export {
  classifyBgValue,
  classifyBgValueWithTightRange,
  GlycemiaStatisticsService,
  TIGHT_RANGE_BOUNDS
} from './domains/repositories/statistics/glycemia-statistics.service'
export { applyOffset, MS_IN_DAY } from './domains/repositories/time/time.service'
export * as TimeService from './domains/repositories/time/time.service'
export { getDefaultRangeByDiabeticType, getDefaultAlertsByDiabeticType } from './domains/repositories/medical/patient-profile/patient-profile.service'

export default MedicalDataService
