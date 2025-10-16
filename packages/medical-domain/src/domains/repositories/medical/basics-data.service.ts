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

import type MedicalData from '../../models/medical/medical-data.model'
import { findBasicsDays, toISOString } from '../time/time.service'
import { Datum } from '../../models/medical/datum.model'

interface BasicData {
  timezone: string
  dateRange: string[]
  days: Array<{
    date: string
    type: string
  }>
  nData: number
  data: {
    reservoirChange: {
      data: Datum[]
    }
    deviceParameter: {
      data: Datum[]
    }
    cbg: {
      data: Datum[]
    }
    smbg: {
      data: Datum[]
    }
    basal: {
      data: Datum[]
    }
    bolus: {
      data: Datum[]
    }
    pumpSettings: {
      data: Datum[]
    }
    wizard: {
      data: Datum[]
    }
  }
}

export function generateBasicData(medicalData: MedicalData, startEpoch: number, startTimezone: string, endEpoch: number, endTimezone: string): BasicData | null {
  const days = findBasicsDays(startEpoch, startTimezone, endEpoch, endTimezone)
  const dateRange = [toISOString(startEpoch), toISOString(endEpoch)]

  const selectData = (group: Datum[]): Datum[] => group.filter((d) => {
    return startEpoch < d.epoch && d.epoch < endEpoch
  })

  const basicsData = {
    timezone: endTimezone,
    dateRange,
    days,
    nData: 0,
    data: {
      reservoirChange: {
        data: selectData(medicalData.reservoirChanges)
      },
      deviceParameter: {
        data: selectData(medicalData.deviceParametersChanges)
      },
      // Types below are needed for PDF
      cbg: {
        data: selectData(medicalData.cbg)
      },
      smbg: {
        data: selectData(medicalData.smbg)
      },
      basal: {
        data: selectData(medicalData.basal)
      },
      bolus: {
        data: selectData(medicalData.bolus)
      },
      pumpSettings: {
        data: medicalData.pumpSettings
      },
      wizard: {
        data: selectData(medicalData.wizards)
      }
    }
  }

  for (const [_key, value] of Object.entries(basicsData.data)) {
    basicsData.nData += value.data.length
  }
  return basicsData
}

export default BasicData
