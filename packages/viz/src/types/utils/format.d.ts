/**
 * formatBgValue
 * @param {Number} val - integer or float blood glucose value in either mg/dL or mmol/L
 * @param {Object} bgPrefs - object containing bgUnits String and bgBounds Object
 *
 * @return {String} formatted blood glucose value
 */
export function formatBgValue(val: number, bgPrefs: any): string;
/**
 * formatDecimalNumber
 * @param {Number} val - numeric value to format
 * @param {Number} [places] - optional number of decimal places to display;
 *                            if not provided, will display as integer (0 decimal places)
 *
 * @return {String} numeric value rounded to the desired number of decimal places
 */
export function formatDecimalNumber(val: number, places?: number): string;
/**
 * Format insulin value
 *
 * @param {number} val - numeric value to format
 * @returns {string} numeric value formatted for the precision of insulin dosing
 */
export function formatInsulin(val: number): string;
/**
 * formatPercentage
 * @param {Number} val - raw decimal proportion, range of 0.0 to 1.0
 *
 * @return {String} percentage
 */
export function formatPercentage(val: number, precision?: number): string;
/**
 * Format Input Time
 * @param {string|number|Date|moment.Moment} utcTime Zulu timestamp (Integer hammertime also OK)
 * @param {{timezoneAware: boolean, timezoneName?: string}} timePrefs
 *
 * @return {string} The formated time for input time in the terminal
 */
export function formatInputTime(utcTime: string | number | Date | moment.Moment, timePrefs: {
    timezoneAware: boolean;
    timezoneName?: string;
}): string;
/**
 * removeTrailingZeroes
 * @param {string} val formatted decimal value, may have trailing zeroes *
 * @return {string} formatted decimal value w/o trailing zero-indexes
 */
export function removeTrailingZeroes(val: string): string;
/**
 * Format the device parameter values.
 * @param {string | number} value The parameter value
 * @param {string} units The parameter units
 * @returns {string} The formated parameter
 */
export function formatParameterValue(value: string | number, units: string): string;
