/**
 * getHourMinuteFormat
 * @returns string according to translation
 */
export function getHourMinuteFormat(): any;
/**
 * getHourMinuteFormatNoSpace
 * @returns string according to translation
 */
export function getHourMinuteFormatNoSpace(): any;
/**
 * getSimpleHourFormat
 * @returns string according to translation
 */
export function getSimpleHourFormat(): any;
/**
 * getDayFormat
 * @returns string according to translation
 */
export function getDayFormat(): any;
/**
 * getLongDayFormat
 * @returns string according to translation
 */
export function getLongDayFormat(): any;
/**
 * getSimpleHourFormatSpace
 * @returns string according to translation
 */
export function getSimpleHourFormatSpace(): any;
/**
 * getLongFormat
 * @returns string according to translation
 */
export function getLongFormat(): any;
/**
 * addDuration
 * @param {String} datetime - an ISO date string
 * @param {Number} duration - milliseconds to add to date
 * @returns new Date ISO string - the provided datetime + duration
 */
export function addDuration(startTime: any, duration: number): string;
/**
 * getBrowserTimezone
 * @returns {String} browser-determined timezone name
 */
export function getBrowserTimezone(): string;
/**
 * getTimezoneFromTimePrefs
 * @param {{timezoneAware: boolean; timezoneName: string; }} timePrefs - object containing timezoneAware Boolean and timezoneName String
 *
 * @return {String} timezoneName from timePrefs, browser, or fallback to 'UTC'
 */
export function getTimezoneFromTimePrefs(timePrefs: {
    timezoneAware: boolean;
    timezoneName: string;
}): string;
/**
 * formatClocktimeFromMsPer24
 * @param {number} milliseconds - positive integer representing a time of day
 *                            in milliseconds within a 24-hr day
 * @param {string} format - optional moment display format string; default is 'h:mm a'
 *
 * @return {string} formatted clocktime, e.g., '12:05 pm'
 */
export function formatClocktimeFromMsPer24(milliseconds: number, format?: string): string;
/**
 * formatCurrentDate
 * @return {String} formatted current date, e.g., 'Jul 4, 2017';
 */
export function formatCurrentDate(): string;
/**
 * formatDiagnosisDate
 * @param {Object} patient - Tidepool patient object containing profile
 *
 * @return {String} formatted diagnosis date, e.g., 'Jul 4, 1975'; empty String if none found
 */
export function formatDiagnosisDate(patient: any): string;
/**
 * formatDateRange
 * @param {string|Date} startDate - A moment-compatible date object or string
 * @param {string|Date} endDate - A moment-compatible date object or string
 * @param {string|undefined} format - Optional. The moment format string to parse startDate and endDate with
 * @param {string|undefined} timezone Default to UTC
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date, format?: string | undefined, timezone?: string | undefined): string;
/**
 * Format a duration
 * @param {number} duration - positive integer duration in milliseconds
 * @param {{condensed?: boolean}} opts - options
 * @return {string} formatted duration, e.g., '1¼ h'
 */
export function formatDuration(duration: number, opts?: {
    condensed?: boolean;
}): string;
/**
 * formatLocalizedFromUTC
 * @param {String|Number|Date|moment.Moment} utc - Zulu timestamp (Integer hammertime also OK)
 * @param {Object} timePrefs - object containing timezoneAware Boolean and timezoneName String
 * @param  {String} [format] - optional moment display format string; default is 'dddd, MMMM D'
 *
 * @return {String} formatted datetime, e.g., 'Sunday, January 1'
 */
export function formatLocalizedFromUTC(utc: string | number | Date | moment.Moment, timePrefs: any, format?: string): string;
/**
 * getHammertimeFromDatumWithTimePrefs
 * @param {Object} datum - a Tidepool datum with a normalTime (required) and deviceTime (optional)
 * @param {Object} timePrefs - object containing timezoneAware Boolean and timezoneName String
 *
 * @return {Number} Integer hammertime (i.e., UTC time in milliseconds)
 */
export function getHammertimeFromDatumWithTimePrefs(datum: any, timePrefs: any): number;
export const THIRTY_MINS: 1800000;
export const ONE_HR: 3600000;
export const THREE_HRS: 10800000;
export const TWENTY_FOUR_HRS: 86400000;
