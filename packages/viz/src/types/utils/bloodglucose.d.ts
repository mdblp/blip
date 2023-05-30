/**
 * reshapeBgClassesToBgBounds
 * @param {Object} bgPrefs - bgPrefs object from blip containing tideline-style bgClasses
 *
 * @return {Object} bgBounds - tidepool-viz-style bgBounds
 */
export function reshapeBgClassesToBgBounds(bgPrefs: any): any;
/**
 * Generate BG Range Labels for a given set of bg prefs
 *
 * @export
 * @param {Object} bgPrefs - bgPrefs object containing viz-style bgBounds and the bgUnits
 * @returns {Object} bgRangeLabels - map of labels keyed by bgClassification
 */
export function generateBgRangeLabels(bgPrefs: any, opts?: {}): any;
/**
 * getOutOfRangeThreshold
 * @param {Object} bgDatum
 * @return Object containing out of range threshold or null
 */
export function getOutOfRangeThreshold(bgDatum: any): {
    [x: number]: any;
};
/**
 * Get the adjusted count of expected CGM data points for devices that do not sample at the default
 * 5 minute interval, such as the Abbot FreeStyle Libre, which samples every 15 mins
 *
 * @param {Array} data - cgm data
 * @return {Integer} count - the weighted count
 */
export function weightedCGMCount(data: any[]): Integer;
/**
 * Get the CGM sample frequency in milliseconds from a CGM data point. Most devices default at a
 * 5 minute interval, but others, such as the Abbot FreeStyle Libre, sample every 15 mins
 *
 * @param {Array} datum - a cgm data point
 */
export function cgmSampleFrequency(datum: any[]): number;
