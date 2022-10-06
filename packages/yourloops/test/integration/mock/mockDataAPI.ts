import DataAPI from '../../../lib/data/data-api'

const CARB_BOLUS_ID = 'carbBolusId'
export const CBG_ID = 'cbgId'
export const CARB_ID1 = 'carbId1'
export const CARB_ID2 = 'carbId2'
export const PHYSICAL_ACTIVITY_ID = 'physicalActivityId'
export const PHYSICAL_ACTIVITY_TIME = '2022-08-08T13:00:00Z'
export const RESERVOIR_CHANGE_ID = 'reservoirChangeId'
export const PARAMETER_ID = 'parameterId'

const completeDailyViewData = {
  dataRange: ['2022-08-08T15:30:00Z', '2022-08-08T18:30:00Z'],
  data: [
    { time: '2022-08-08T15:30:00Z', type: 'cbg', id: CBG_ID, timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:35:00Z', type: 'cbg', id: 'cbg_2022-08-08T15:35:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T15:40:00Z', type: 'cbg', id: 'cbg_2022-08-08T15:40:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:00:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:00:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:05:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:05:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:10:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:10:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:20:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:20:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:25:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:25:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:30:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:30:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:35:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:35:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:45:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:45:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:50:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:50:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:55:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:55:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:00:00Z', type: 'cbg', id: 'cbg_2022-08-08T17:00:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:05:00Z', type: 'cbg', id: 'cbg_2022-08-08T17:05:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:25:00Z', type: 'bolus', id: CARB_BOLUS_ID, timezone: 'Europe/Paris', prescriptor: 'auto', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T18:25:00Z', type: 'wizard', id: CARB_ID1, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 45, bolus: CARB_BOLUS_ID, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:30:00Z', type: 'basal', id: 'basal_2022-08-08_5', timezone: 'Europe/Paris', deliveryType: 'automated', duration: 1000, internalId: '3deeb71f-9b5b-496e-b0af-ef9512c2787f', rate: 0.8, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T16:35:00Z', type: 'pumpSettings', id: 'pump_2022-08-08_6', timezone: 'UTC', uploadId: 'osef', payload: { basalsecurityprofile: null, cgm: { apiVersion: 'v1', endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00', expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Dexcom', name: 'G6', swVersionTransmitter: 'v1', transmitterId: 'a1234' }, device: { deviceId: '1234', imei: '1234567890', manufacturer: 'Diabeloop', name: 'DBLG1', swVersion: 'beta' }, history: [], parameters: [], pump: { expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'VICENTRA', name: 'Kaleido', serialNumber: '123456', swVersion: 'beta' } }, _userId: 'osef' },
    { time: '2022-08-08T16:40:00Z', type: 'upload', id: 'upload_2022-08-08_7', timezone: 'UTC', _dataState: 'open', _deduplicator: { name: 'org.tidepool.deduplicator.none', version: '1.0.0' }, _state: 'open', client: { name: 'portal-api.yourloops.com', version: '1.0.0' }, dataSetType: 'continuous', deviceManufacturers: ['Diabeloop'], deviceModel: 'DBLG1', deviceTags: ['cgm', 'insulin-pump'], revision: 1, uploadId: '33031f76c78461670a1a95b5f032bb6a', version: '1.0.0', _userId: 'osef' },
    { time: '2022-08-08T02:00:00Z', type: 'deviceEvent', id: 'deviceEvent_2022-08-08_8', timezone: 'Europe/Paris', duration: { units: 'hours', value: 2 }, guid: 'confidential_0', inputTime: '2022-08-08T02:00:00Z', subType: 'confidential', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T12:00:00Z', type: 'food', id: CARB_ID2, timezone: 'Europe/Paris', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 15, units: 'grams' } }, uploadId: 'osef', _userId: 'osef' },
    { time: PHYSICAL_ACTIVITY_TIME, type: 'physicalActivity', id: PHYSICAL_ACTIVITY_ID, timezone: 'Europe/Paris', duration: { units: 'seconds', value: 1800 }, guid: 'pa_18', reportedIntensity: 'medium', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T17:00:00Z', type: 'deviceEvent', id: RESERVOIR_CHANGE_ID, subType: 'reservoirChange', timezone: 'Europe/Paris', uploadId: 'osef', _userId: 'osef' },
    { time: '2022-08-08T08:00:00Z', type: 'deviceEvent', id: PARAMETER_ID, lastUpdateDate: '2022-08-08T08:00:00Z', level: '1', name: 'MEAL_RATIO_LUNCH_FACTOR', previousValue: '110', subType: 'deviceParameter', timezone: 'UTC', units: '%', uploadId: 'osef', value: '100', _userId: 'osef' }
  ]
}

export const minimalTrendViewData = {
  dataRange: ['2020-01-18T00:00:00Z', '2020-01-20T00:00:00Z'],
  data: [
    { time: '2020-01-20T10:00:00Z', type: 'cbg', id: '2020-01-20_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'cbg', id: '2020-01-19_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 9.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-19T10:00:00Z', type: 'cbg', id: '2020-01-19_1', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2020-01-18T10:00:00Z', type: 'cbg', id: '2020-01-18_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 9.4, uploadId: 'osef', _userId: 'osef' }
  ]
}

export const timeInRangeStatsTrendViewData = {
  dataRange: ['2020-01-19T00:00:00Z', '2020-01-20T00:00:00Z'],
  data: [
    { time: '2020-01-20T10:00:00Z', type: 'cbg', id: '2020-01-20_0', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:00:00Z', type: 'cbg', id: '2020-01-20_1', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:05:00Z', type: 'cbg', id: '2020-01-20_3', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:10:00Z', type: 'cbg', id: '2020-01-20_4', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:15:00Z', type: 'cbg', id: '2020-01-20_5', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:20:00Z', type: 'cbg', id: '2020-01-20_6', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:25:00Z', type: 'cbg', id: '2020-01-20_7', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:30:00Z', type: 'cbg', id: '2020-01-20_8', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:35:00Z', type: 'cbg', id: '2020-01-20_9', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:40:00Z', type: 'cbg', id: '2020-01-20_10', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:45:00Z', type: 'cbg', id: '2020-01-20_11', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:50:00Z', type: 'cbg', id: '2020-01-20_12', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T11:55:00Z', type: 'cbg', id: '2020-01-20_13', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T12:00:00Z', type: 'cbg', id: '2020-01-20_14', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T12:05:00Z', type: 'cbg', id: '2020-01-20_15', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
    { time: '2022-01-20T12:10:00Z', type: 'cbg', id: '2020-01-20_16', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' }
  ]
}

export const mockDataAPI = (patientData = completeDailyViewData) => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(completeDailyViewData.dataRange)
  jest.spyOn(DataAPI, 'getMessages').mockResolvedValue([])
  jest.spyOn(DataAPI, 'getPatientData').mockImplementation(() => Promise.resolve(patientData.data))
}
