import MedicalData from '../../models/medical/MedicalData'
import Datum from '../../models/medical/Datum'
import Upload from '../../models/medical/datum/Upload'
import { toISOString, findBasicsDays } from '../time/TimeService'

interface BasicsData {
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
    upload: {
      data: Upload[]
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
    wizard: {
      data: Datum[]
    }
  }
}

export function generateBasicsData(medicalData: MedicalData, startEpoch: number, startTimezone: string, endEpoch: number, endTimezone: string): BasicsData | null {
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
      upload: {
        data: medicalData.uploads
      },
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

export default BasicsData
