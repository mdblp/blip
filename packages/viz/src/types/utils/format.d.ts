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
 * formatPercentage
 * @param {Number} val - raw decimal proportion, range of 0.0 to 1.0
 *
 * @return {String} percentage
 */
export function formatPercentage(val: number, precision?: number): string;
/**
 * removeTrailingZeroes
 * @param {string} val formatted decimal value, may have trailing zeroes *
 * @return {string} formatted decimal value w/o trailing zero-indexes
 */
export function removeTrailingZeroes(val: string): string;
