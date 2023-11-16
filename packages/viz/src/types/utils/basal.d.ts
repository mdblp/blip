/**
* getBasalSequences
* @param {Array} basals - Array of preprocessed Tidepool basal objects
*
* @return {Array} Array of Arrays where each component Array is a sequence of basals
*                 of the same subType to be rendered as a unit
*/
export function getBasalSequences(basals: any[]): any[];
/**
 * getBasalPathGroupType
 * @param {object} datum - single basal datum
 * @return {string} the path group type
 */
export function getBasalPathGroupType(datum?: object): string;
/**
 * getBasalPathGroups
 * @param {Array} basals - Array of preprocessed Tidepool basal objects
 * @return {Array} groups of alternating 'automated' and 'manual' datums
 */
export function getBasalPathGroups(basals: any[]): any[];
/**
 * Get the start and end indexes and datetimes of basal datums within a given time range
 * @param {Array} data Array of Tidepool basal data
 * @param {String} s ISO date string for the start of the range
 * @param {String} e ISO date string for the end of the range
 * @param {Boolean} optionalExtents If true, allow basal gaps at start and end extents of the range.
 * @returns {Object} The start and end datetimes and indexes
 */
export function getEndpoints(data: any[], s: string, e: string, optionalExtents?: boolean): any;
/**
 * Get durations of basal groups within a given span of time
 * @param {Array} data Array of Tidepool basal data
 * @param {String} s ISO date string for the start of the range
 * @param {String} e ISO date string for the end of the range
 * @returns {Object} The durations (in ms) keyed by basal group type
 */
export function getGroupDurations(data: any[], s: string, e: string): any;
