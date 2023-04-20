/*
 * Copyright (c) 2023, Diabeloop
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

import { type MonitoringAlerts } from '../../../../../lib/patient/models/monitoring-alerts.model'
import { getMonitoringAlertActiveValueByType } from '../../../../../components/patient-list/utils/patient-list.util'
import { MonitoringAlertType } from '../../../../../components/patient-list/models/enums/monitoring-alert-type.enum'

describe('Patient list util', () => {
  describe('getMonitoringAlertActiveValueByType', () => {
    it('should return the appropriate value', () => {
      const monitoringAlerts: MonitoringAlerts = {
        frequencyOfSevereHypoglycemiaRate: 1,
        frequencyOfSevereHypoglycemiaActive: false,
        nonDataTransmissionRate: 1,
        nonDataTransmissionActive: true,
        timeSpentAwayFromTargetRate: 1,
        timeSpentAwayFromTargetActive: undefined
      }

      expect(getMonitoringAlertActiveValueByType(monitoringAlerts, MonitoringAlertType.FrequencyOfSevereHypoglycemia)).toEqual(false)
      expect(getMonitoringAlertActiveValueByType(monitoringAlerts, MonitoringAlertType.NonDataTransmission)).toEqual(true)
      expect(getMonitoringAlertActiveValueByType(monitoringAlerts, MonitoringAlertType.TimeSpentAwayFromTarget)).toEqual(undefined)
    })
  })
})
