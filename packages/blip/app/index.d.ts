/**
 * Copyright (c) 2021, Diabeloop
 * Blip typescript definitions
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

import { AppConfig } from 'yourloops/lib/config/models/app-config.model'
import { Patient } from 'yourloops/lib/patient/models/patient.model'
import BlipApi from 'yourloops/lib/data/blip.api'
import DialogPDFOptions from 'yourloops/components/dialogs/pdf-print-options'
import { IUser } from 'yourloops/lib/data/models/i-user.model'
import { PatientData, PatientDatum } from 'yourloops/lib/data/models/patient-datum.model'
import { MessageNote } from 'yourloops/lib/data/models/message-note.model'
import {
  GetPatientDataOptions,
  GetPatientDataOptionsV0
} from 'yourloops/lib/data/models/get-patient-data-options.model'
import { NavigateFunction } from 'react-router-dom'

interface BlipProperties {
  config: AppConfig;
  api: BlipApi;
  navigate: NavigateFunction;
  pathName: string;
  patient: Patient;
  prefixURL: string;
  dialogPDFOptions: typeof DialogPDFOptions;
}

export {
  BlipProperties,
  BlipApi,
  DialogPDFOptions,
  IUser,
  PatientDatum,
  PatientData,
  MessageNote,
  GetPatientDataOptions,
  GetPatientDataOptionsV0
}

declare function Blip(props: BlipProperties): JSX.Element;

export default Blip
