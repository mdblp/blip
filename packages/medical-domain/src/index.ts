/*
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
import BaseDatum from './domains/models/medical/datum/basics/BaseDatum'
import Datum from './domains/models/medical/Datum'
import Basal from './domains/models/medical/datum/Basal'
import Bolus from './domains/models/medical/datum/Bolus'
import Cbg, { BgUnit, MGDL_UNITS, MMOLL_UNITS } from './domains/models/medical/datum/Cbg'
import ConfidentialMode from './domains/models/medical/datum/ConfidentialMode'
import DeviceParameterChange, { Parameter } from './domains/models/medical/datum/DeviceParameterChange'
import { DurationValue } from './domains/models/medical/datum/basics/Duration'
import DurationUnit from './domains/models/medical/datum/enums/duration-unit.enum'
import Meal from './domains/models/medical/datum/Meal'
import Message from './domains/models/medical/datum/Message'
import PhysicalActivity from './domains/models/medical/datum/PhysicalActivity'
import Prescriptor from './domains/models/medical/datum/enums/prescriptor.enum'
import PumpManufacturer from './domains/models/medical/datum/enums/pump-manufacturer.enum'
import PumpSettings, { CgmConfig, DeviceConfig, PumpConfig } from './domains/models/medical/datum/PumpSettings'
import ReservoirChange from './domains/models/medical/datum/ReservoirChange'
import Smbg from './domains/models/medical/datum/Smbg'
import Source from './domains/models/medical/datum/enums/source.enum'
import Unit from './domains/models/medical/datum/enums/unit.enum'
import Upload from './domains/models/medical/datum/Upload'
import Wizard from './domains/models/medical/datum/Wizard'
import ZenMode from './domains/models/medical/datum/ZenMode'
import MedicalDataService from './domains/repositories/medical/MedicalDataService'
import { convertBG } from './domains/repositories/medical/datum/CbgService'
import { BgClasses, defaultMedicalDataOptions } from './domains/models/medical/MedicalDataOptions'
import * as TimeService from './domains/repositories/time/TimeService'

export {
  Basal, BaseDatum, BgClasses, BgUnit, Bolus, Cbg, CgmConfig, ConfidentialMode, Datum, DeviceConfig, DeviceParameterChange, DurationValue, DurationUnit, Meal, Message,
  Parameter, PhysicalActivity, Prescriptor, PumpManufacturer, PumpConfig, PumpSettings, ReservoirChange, Smbg, Source, Unit, Upload, Wizard, ZenMode,
  defaultMedicalDataOptions, TimeService, MGDL_UNITS, MMOLL_UNITS, convertBG
}

export default MedicalDataService
