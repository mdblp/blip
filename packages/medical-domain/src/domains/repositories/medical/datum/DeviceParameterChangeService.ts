import DeviceParameterChange from '../../../models/medical/datum/DeviceParameterChange'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

/**
 * Used to regroup device parameters in one tooltip, when the changes are too close.
 * This is to avoid superpositions of the icons in the daily view.
 * Format: Duration in milliseconds.
 */
const DEVICE_PARAMS_OFFSET = 30 * 60 * 1000

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): DeviceParameterChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const deviceParameterChange: DeviceParameterChange = {
    ...base,
    type: 'deviceEvent',
    subType: 'deviceParameter',
    params: [
      {
        id: base.id,
        epoch: base.epoch,
        timezone: base.timezone,
        uploadId: rawData.uploadId as string,
        name: rawData.name as string,
        level: rawData.level as string,
        units: rawData.units as string,
        value: rawData.value as string,
        previousValue: rawData.previousValue as string,
        lastUpdateDate: rawData.lastUpdateDate as string
      }
    ]
  }
  return deviceParameterChange
}

const deduplicate = (data: DeviceParameterChange[], _opts: MedicalDataOptions): DeviceParameterChange[] => {
  return data
}

const groupData = (data: DeviceParameterChange[]): DeviceParameterChange[] => {
  data.sort((param1, param2) => param1.epoch - param2.epoch)
  const groupedData: DeviceParameterChange[] = []
  let currentGroup: DeviceParameterChange | null = null
  data.forEach((currentParam) => {
    const paramList = currentParam.params.map(p => {
      if (p.id === currentParam.id) {
        p.timezone = currentParam.timezone
      }
      return p
    })
    currentParam.params = paramList
    if (currentGroup === null) {
      currentGroup = currentParam
    } else {
      if ((currentParam.epoch - currentGroup.epoch) < DEVICE_PARAMS_OFFSET) {
        const aggregatedParams = currentGroup.params.concat(currentParam.params)
        // unique params based on id
        const uniqueParams = [...new Map(aggregatedParams.map(p => [p.id, p])).values()]
        currentGroup.params = uniqueParams
      } else {
        groupedData.push(currentGroup)
        currentGroup = currentParam
      }
    }
  })
  if (currentGroup !== null) {
    groupedData.push(currentGroup)
  }
  return groupedData
}

interface DeviceParameterProcessor {
  groupData: (data: DeviceParameterChange[]) => DeviceParameterChange[]
}

const DeviceParameterChangeService: DatumProcessor<DeviceParameterChange> & DeviceParameterProcessor = {
  normalize,
  deduplicate,
  groupData
}

export default DeviceParameterChangeService
