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

import Datum from './domains/models/medical/datum.model'
import Basal from './domains/models/medical/datum/basal.model'
import BolusModel from './domains/models/medical/datum/bolus.model'
import Cbg, { MGDL_UNITS, MMOLL_UNITS } from './domains/models/medical/datum/cbg.model'
import ConfidentialMode from './domains/models/medical/datum/confidential-mode.model'
import DeviceParameterChange from './domains/models/medical/datum/device-parameter-change.model'
import Meal from './domains/models/medical/datum/meal.model'
import Message from './domains/models/medical/datum/message.model'
import PhysicalActivity from './domains/models/medical/datum/physical-activity.model'
import PumpSettings from './domains/models/medical/datum/pump-settings.model'
import ReservoirChange from './domains/models/medical/datum/reservoir-change.model'
import Smbg from './domains/models/medical/datum/smbg.model'
import Upload from './domains/models/medical/datum/upload.model'
import Wizard from './domains/models/medical/datum/wizard.model'
import ZenMode from './domains/models/medical/datum/zen-mode.model'
import MedicalDataService from './domains/repositories/medical/medical-data.service'
import { convertBG } from './domains/repositories/medical/datum/cbg.service'
import { defaultMedicalDataOptions } from './domains/models/medical/medical-data-options.model'
import * as TimeService from './domains/repositories/time/time.service'

export {
  Basal, BolusModel, Cbg, ConfidentialMode, Datum, DeviceParameterChange, Meal, Message,
  PhysicalActivity, PumpSettings, ReservoirChange, Smbg, Upload, Wizard, ZenMode,
  defaultMedicalDataOptions, TimeService, MGDL_UNITS, MMOLL_UNITS, convertBG
}

export default MedicalDataService
