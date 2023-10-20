/**
 * @private Exported for unit tests.
 * @param {{duration:number;epoch:number;epochEnd:number;subType:string;discontinuousEnd:boolean;discontinuousStart:boolean;}[]} basals
 * @param {[number,number]} bounds
 */
export function updateBasalDiscontinuous(basals: {
    duration: number;
    epoch: number;
    epochEnd: number;
    subType: string;
    discontinuousEnd: boolean;
    discontinuousStart: boolean;
}[], bounds: [number, number]): void;
/**
 *
 * @param {import("medical-domain").MedicalDataService} medicalData
 * @param {moment.Moment} startDate
 * @param {moment.Moment} endDate
 */
export function selectDailyViewData(medicalData: any, startDate: moment.Moment, endDate: moment.Moment): {
    dataByDate: {};
    basalRange: number[];
    bgRange: any[];
    bolusRange: [string, string] | [undefined, undefined];
    dateRange: any[];
    pumpSettings: any;
    timezone: any;
};
/**
 * Hackish way to have a fake pumpSettings at a date.
 *
 * This is not complete, only valid for the device parameters.
 * Actually we can't get the pumpSettings at a specified date
 * from the API. This need to be addressed later.
 * @param {object} latestPumpSettings
 * @param {moment.Moment} date
 */
export function generatePumpSettings(latestPumpSettings: object, date: moment.Moment): any;
/**
 * @param {object} data
 * @param {DataUtil} dataUtil
 * @returns data param
 */
export function generatePDFStats(data: object, dataUtil: DataUtil): any;
export type DataUtil = import("../data").default;
