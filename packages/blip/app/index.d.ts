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
import ChatWidget from 'yourloops/components/chat/chat-widget'
import MedicalFilesWidget from 'yourloops/components/dashboard-widgets/medical-files/medical-files-widget'
import AlarmCard from 'yourloops/components/alarm/alarm-card'
import BlipApi from 'yourloops/lib/data/blip.api'
import DialogDatePicker from 'yourloops/components/date-pickers/dialog-date-picker'
import DialogRangeDatePicker from 'yourloops/components/date-pickers/dialog-range-date-picker'
import DialogPDFOptions from 'yourloops/components/dialogs/pdf-print-options'
import RemoteMonitoringWidget from 'yourloops/components/dashboard-widgets/remote-monitoring-widget'
import { IUser } from 'yourloops/lib/data/models/i-user.model'
import { PatientData, PatientDatum } from 'yourloops/lib/data/models/patient-datum.model'
import { MessageNote } from 'yourloops/lib/data/models/message-note.model'
import {
  GetPatientDataOptions,
  GetPatientDataOptionsV0
} from 'yourloops/lib/data/models/get-patient-data-options.model'

interface BlipProperties {
  config: AppConfig;
  api: BlipApi;
  patient: Patient;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setPatient: Function;
  patients: Patient[];
  userIsHCP: boolean;
  isSelectedTeamMedical: boolean;
  prefixURL: string;
  dialogDatePicker: typeof DialogDatePicker;
  dialogRangeDatePicker: typeof DialogRangeDatePicker;
  dialogPDFOptions: typeof DialogPDFOptions;
  patientInfoWidget: typeof RemoteMonitoringWidget;
  chatWidget: typeof ChatWidget;
  medicalFilesWidget: typeof MedicalFilesWidget;
  alarmCard: typeof AlarmCard;
}

// FIXME: For some reason, the yourloops auth hook
// don't like this export.
declare function cleanStore(): void;

export {
  BlipProperties,
  BlipApi,
  DialogDatePicker,
  DialogRangeDatePicker,
  DialogPDFOptions,
  RemoteMonitoringWidget,
  IUser,
  PatientDatum,
  PatientData,
  MessageNote,
  GetPatientDataOptions,
  GetPatientDataOptionsV0,
  cleanStore
}

declare function Blip(props: BlipProperties): JSX.Element;

export default Blip
