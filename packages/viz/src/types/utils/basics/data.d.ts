/**
 * Get the Time in Range source and status
 * source will be one of [cbg | smbg | null]
 * status refers the the availability of cgm data [NO_CGM | NOT_ENOUGH_CGM | CGM_CALCULATED]
 *
 * @export
 * @param {Object} basicsData - the preprocessed basics data object
 * @returns {Object} bgSource - source and status of CGM data
 */
export function determineBgDistributionSource(basicsData: any): any;
/**
 * Return a CGM status message
 *
 * @export
 * @param {String} cgmStatus - cbg | smbg | noCGM
 * @returns {String} status message
 */
export function cgmStatusMessage(cgmStatus: string): string;
/**
 * Get latest upload from blip-generated patient data
 *
 * @export
 * @param {Object} basicsData - the preprocessed basics data object
 * @returns {String|Null} - the latest upload source or null
 */
export function getLatestPumpUploaded(basicsData: any): string | null;
/**
 * Get the infusion site history of a patient
 *
 * @param {Object} basicsData - the preprocessed basics data object
 * @param {String} type - infusion type, coming from the patients `siteChangeSource` setting
 * @returns {Object} infusionSiteHistory
 */
export function getInfusionSiteHistory(basicsData: any, type: string): any;
/**
 * Process the infusion site history of a patient
 *
 * @export
 * @param {Object} data - the preprocessed basics data object
 * @param {Object} patient
 * @returns {Object} basicsData - the revised data object
 */
export function processInfusionSiteHistory(data: any): any;
/**
 * Generate function to process summary breakdowns for section data
 *
 * @param {Object} dataObj
 * @param {Object} summary
 * @returns {Function}
 */
export function summarizeTagFn(dataObj: any, summary: any): Function;
/**
 * Get the average number of data events per day excluding the most recent
 *
 * @param {Object} dataObj
 * @param {Number} total
 * @param {String} mostRecentDay
 * @returns
 */
export function averageExcludingMostRecentDay(dataObj: any, total: number, mostRecentDay: string): number;
/**
 * Define sections and dimensions used in the basics view
 *
 * @param {Object} bgPrefs - bgPrefs object containing viz-style bgBounds
 * @returns {Object} sections
 */
export function defineBasicsSections(bgPrefs: any, manufacturer: any, deviceModel: any): any;
/**
 * Set up cross filters by date for all of the data types
 *
 * @export
 * @param {Object} data - the preprocessed basics data object
 * @param {Object} bgPrefs - bgPrefs object containing viz-style bgBounds
 * @returns {Object} basicsData - the revised data object
 */
export function reduceByDay(data: any, bgPrefs: any): any;
/**
 * Generate the day labels based on the days supplied by the processed basics view data
 *
 * @export
 * @param {Array} days - supplied by the processed basics view data
 * @returns {Array} labels - formatted day labels.  I.E. [Mon, Tues, Wed, ...]
 */
export function generateCalendarDayLabels(days: any[]): any[];
/**
 * Set the availability of basics sections
 *
 * @export
 * @param {any} sections
 */
export function disableEmptySections(data: any): any;
