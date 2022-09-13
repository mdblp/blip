import DataAPI from '../../../lib/data/data-api'

export const mockDataAPI = (patientId: string) => {
  jest.spyOn(DataAPI, 'getPatientDataRange').mockResolvedValue(['2022-08-08T15:30:00Z', '2022-08-08T18:30:00Z'])
  jest.spyOn(DataAPI, 'getMessages').mockResolvedValue([])
  jest.spyOn(DataAPI, 'getPatientData').mockResolvedValue([
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_0`, time: '2022-08-08T15:30:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_1`, time: '2022-08-08T15:35:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.4 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_2`, time: '2022-08-08T15:40:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.1 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_3`, time: '2022-08-08T15:45:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 9.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_4`, time: '2022-08-08T15:50:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 8.7 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_5`, time: '2022-08-08T15:55:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 7.9 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_6`, time: '2022-08-08T16:00:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 6.9 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_7`, time: '2022-08-08T16:05:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 6 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_8`, time: '2022-08-08T16:10:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 5.1 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_9`, time: '2022-08-08T16:15:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 4.4 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_10`, time: '2022-08-08T16:20:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.8 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_11`, time: '2022-08-08T16:25:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_12`, time: '2022-08-08T16:30:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.3 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_13`, time: '2022-08-08T16:35:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_14`, time: '2022-08-08T16:40:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.8 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_15`, time: '2022-08-08T16:45:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 4.4 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_16`, time: '2022-08-08T16:50:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 5.1 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_17`, time: '2022-08-08T16:55:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 6 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_18`, time: '2022-08-08T17:00:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 6.9 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_19`, time: '2022-08-08T17:05:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 7.9 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_20`, time: '2022-08-08T17:10:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 8.7 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_21`, time: '2022-08-08T17:15:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 9.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_22`, time: '2022-08-08T17:20:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.1 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_23`, time: '2022-08-08T17:25:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.4 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_24`, time: '2022-08-08T17:30:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_25`, time: '2022-08-08T17:35:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.4 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_26`, time: '2022-08-08T17:40:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 10.1 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_27`, time: '2022-08-08T17:45:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 9.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_28`, time: '2022-08-08T17:50:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 8.7 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_29`, time: '2022-08-08T17:55:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 7.9 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_30`, time: '2022-08-08T18:00:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 6.9 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_31`, time: '2022-08-08T18:05:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 6 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_32`, time: '2022-08-08T18:10:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 5.1 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_33`, time: '2022-08-08T18:15:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 4.4 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_34`, time: '2022-08-08T18:20:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.8 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_35`, time: '2022-08-08T18:25:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.5 },
    { uploadId: 'osef', _userId: patientId, id: `${patientId}_2022-08-08_36`, time: '2022-08-08T18:30:00Z', timezone: 'Europe/Paris', type: 'cbg', units: 'mmol/L', value: 3.3 }])
}
