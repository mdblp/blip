/**
 * createPrintView
 * @param {Object} doc - PDFKit document instance
 * @param {Object} data - pre-munged data for the daily print view
 * @param {Object} opts - options
 * @param {Object} type - render type
 *
 * @return {Object} dailyPrintView instance
 */
export function createPrintView(type: any, data: any, opts: any, doc: any): any;
/**
 * createPrintPDFPackage
 * @param {Object} data - Object of tideline-preprocessed Tidepool diabetes data & notes;
 *                       grouped by type
 * @param {Object} opts - an object of print options (see destructured param below)
 *
 * @return {Promise} - Promise that resolves with an object containing the pdf blob and url
 */
export function createPrintPDFPackage(data: any, opts: any): Promise<any>;
export namespace utils {
    export { reshapeBgClassesToBgBounds };
    export { PDFDocument };
    export { blobStream };
    export { PrintView };
    export { BasicsPrintView };
    export { DailyPrintView };
    export { SettingsPrintView };
}
export default doPrint;
import { reshapeBgClassesToBgBounds } from "../../utils/bloodglucose";
import { PrintView } from "dumb";
import BasicsPrintView from "./BasicsPrintView";
import DailyPrintView from "./DailyPrintView";
import { SettingsPrintView } from "dumb";
declare function doPrint(data: any, opts: any): Promise<any>;
