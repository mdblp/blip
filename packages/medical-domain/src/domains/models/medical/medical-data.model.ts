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

import type Basal from './datum/basal.model'
import type Bolus from './datum/bolus.model'
import type Cbg from './datum/cbg.model'
import type ConfidentialMode from './datum/confidential-mode.model'
import type DeviceParameterChange from './datum/device-parameter-change.model'
import type Meal from './datum/meal.model'
import type Message from './datum/message.model'
import type PhysicalActivity from './datum/physical-activity.model'
import type PumpSettings from './datum/pump-settings.model'
import type ReservoirChange from './datum/reservoir-change.model'
import type Smbg from './datum/smbg.model'
import type TimeZoneChange from './datum/time-zone-change.model'
import type Upload from './datum/upload.model'
import type WarmUp from './datum/warm-up.model'
import type Wizard from './datum/wizard.model'
import type ZenMode from './datum/zen-mode.model'

interface MedicalData {
  basal: Basal[]
  bolus: Bolus[]
  cbg: Cbg[]
  confidentialModes: ConfidentialMode[]
  deviceParametersChanges: DeviceParameterChange[]
  meals: Meal[]
  messages: Message[]
  physicalActivities: PhysicalActivity[]
  pumpSettings: PumpSettings[]
  reservoirChanges: ReservoirChange[]
  smbg: Smbg[]
  uploads: Upload[]
  warmUps: WarmUp[]
  wizards: Wizard[]
  zenModes: ZenMode[]
  timezoneChanges: TimeZoneChange[]
}

export default MedicalData
