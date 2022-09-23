import DataAPI from '../../../lib/data/data-api'
import { Patient } from '../../../lib/data/patient'

const CARB_BOLUS_ID = 'carbBolusId'
export const CBG_ID = 'cbgId'
export const CARB_ID1 = 'carbId1'
export const CARB_ID2 = 'carbId2'
export const PHYSICAL_ACTIVITY_ID = 'physicalActivityId'
export const RESERVOIR_CHANGE_ID = 'reservoirChangeId'
export const PARAMETER_ID = 'parameterId'

export const mockDataAPI = () => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(['2022-08-08T15:30:00Z', '2022-08-08T18:30:00Z'])
  jest.spyOn(DataAPI, 'getMessages').mockResolvedValue([])
  jest.spyOn(DataAPI, 'getPatientData').mockImplementation((patient: Patient) => Promise.resolve([
    { time: '2022-08-08T15:30:00Z', type: 'cbg', id: CBG_ID, timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T18:25:00Z', type: 'bolus', id: CARB_BOLUS_ID, timezone: 'Europe/Paris', prescriptor: 'auto', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T18:25:00Z', type: 'wizard', id: CARB_ID1, timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 45, bolus: CARB_BOLUS_ID, uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T16:30:00Z', type: 'basal', id: `${patient.userid}_2022-08-08_5`, timezone: 'Europe/Paris', deliveryType: 'automated', duration: 1000, internalId: '3deeb71f-9b5b-496e-b0af-ef9512c2787f', rate: 0.8, uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T16:35:00Z', type: 'pumpSettings', id: `${patient.userid}_2022-08-08_6`, timezone: 'UTC', uploadId: 'osef', payload: { basalsecurityprofile: null, cgm: { apiVersion: 'v1', endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00', expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Dexcom', name: 'G6', swVersionTransmitter: 'v1', transmitterId: 'a1234' }, device: { deviceId: '1234', imei: '1234567890', manufacturer: 'Diabeloop', name: 'DBLG1', swVersion: 'beta' }, history: [], parameters: [], pump: { expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'VICENTRA', name: 'Kaleido', serialNumber: '123456', swVersion: 'beta' } }, _userId: patient.userid },
    { time: '2022-08-08T16:40:00Z', type: 'upload', id: `${patient.userid}_2022-08-08_7`, timezone: 'UTC', _dataState: 'open', _deduplicator: { name: 'org.tidepool.deduplicator.none', version: '1.0.0' }, _state: 'open', client: { name: 'portal-api.yourloops.com', version: '1.0.0' }, dataSetType: 'continuous', deviceManufacturers: ['Diabeloop'], deviceModel: 'DBLG1', deviceTags: ['cgm', 'insulin-pump'], revision: 1, uploadId: '33031f76c78461670a1a95b5f032bb6a', version: '1.0.0', _userId: patient.userid },
    { time: '2022-08-08T02:00:00Z', type: 'deviceEvent', id: `${patient.userid}_2022-08-08_8`, timezone: 'Europe/Paris', duration: { units: 'hours', value: 2 }, guid: 'confidential_0', inputTime: '2022-08-08T02:00:00Z', subType: 'confidential', uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T12:00:00Z', type: 'food', id: CARB_ID2, timezone: 'Europe/Paris', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 15, units: 'grams' } }, uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T13:00:00Z', type: 'physicalActivity', id: PHYSICAL_ACTIVITY_ID, timezone: 'Europe/Paris', duration: { units: 'seconds', value: 1800 }, guid: 'pa_18', reportedIntensity: 'medium', uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T17:00:00Z', type: 'deviceEvent', id: RESERVOIR_CHANGE_ID, subType: 'reservoirChange', timezone: 'Europe/Paris', uploadId: 'osef', _userId: patient.userid },
    { time: '2022-08-08T08:00:00Z', type: 'deviceEvent', id: PARAMETER_ID, lastUpdateDate: '2022-08-08T08:00:00Z', level: '1', name: 'MEAL_RATIO_LUNCH_FACTOR', previousValue: '110', subType: 'deviceParameter', timezone: 'UTC', units: '%', uploadId: 'osef', value: '100', _userId: patient.userid }
  ]))
}
