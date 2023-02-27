/**
 * Copyright (c) 2022, Diabeloop
 * Chart types definitions
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

import MedicalDataService, { Datum, TimePrefs } from 'medical-domain'
import DataUtil from 'tidepool-viz/src/utils/data'
import DialogRangeDatePicker from '../../../../yourloops/components/date-pickers/dialog-range-date-picker'
import { IUser } from 'yourloops/lib/data/models/i-user.model'
import { ChartPrefs } from 'yourloops/components/dashboard-widgets/models/chart-prefs.model'
import { BgPrefs } from 'yourloops/components/dashboard-widgets/models/bg-prefs.model'

export type TrackMetrics = (category: string, action: string, name?: string | undefined, value?: number | undefined) => void;
export type OnLocationChange = (epoch: number, range: number) => Promise<void>;
export type OnUpdateChartPrefs = (charPrefs: ChartPrefs, cb?: () => void) => void;

export interface TrendsProps {
  epochLocation: number;
  msRange: number;
  loading: boolean;
  canPrint: boolean;
  tidelineData: MedicalDataService;
  chartPrefs: ChartPrefs;
  bgPrefs: BgPrefs;
  /** @deprecated */
  timePrefs: TimePrefs;
  patient: IUser;
  prefixURL?: string;
  dataUtil: typeof DataUtil;
  dialogRangeDatePicker: typeof DialogRangeDatePicker;
  trackMetric: TrackMetrics;
  onDatetimeLocationChange: OnLocationChange;
  updateChartPrefs: OnUpdateChartPrefs;
  onClickRefresh: () => void;
  onSwitchToDashboard: () => void;
  onSwitchToDaily: (date?: number | string | Date) => void;
  onSwitchToSettings: () => void;
}

export interface TrendsState {
  updatingDates: boolean;
  localDates: string[];
  atMostRecent: boolean;
  currentCbgData: Datum[];
}
