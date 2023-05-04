/**
 * getBolusFromInsulinEvent
 * @param {Object} insulinEvent - a Tidepool wizard or bolus object
 *
 * @return {Object} a Tidepool bolus object
 */
export function getBolusFromInsulinEvent(insulinEvent: any): any;
/**
 * getCarbs
 * @param {Object} insulinEvent - a Tidepool wizard or bolus object
 *
 * @return {Number} grams of carbs input into bolus calculator
 *                  Number.NaN if bolus calculator not used; null if no carbInput
 */
export function getCarbs(insulinEvent: any): number;
/**
 * getProgrammed
 * @param {object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {number} value of insulin programmed for delivery in the given insulinEvent
 */
export function getProgrammed(insulinEvent: object): number;
/**
 * getRecommended
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} total recommended insulin dose
 */
export function getRecommended(insulinEvent: any): number;
/**
 * getDelivered
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} units of insulin delivered in this insulinEvent
 */
export function getDelivered(insulinEvent: any): number;
/**
 * getDuration
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} duration value in milliseconds
 */
export function getDuration(insulinEvent: any): number;
/**
 * getExtended
 * @param {Object} insulinEvent - a Tidepool wizard or bolus object
 *
 * @return {Number} units of insulin delivered over an extended duration
 */
export function getExtended(insulinEvent: any): number;
/**
 * getExtendedPercentage
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {string|number} percentage of combo bolus delivered later
 */
export function getExtendedPercentage(insulinEvent: any): string | number;
/**
 * getMaxDuration
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} duration value in milliseconds
 */
export function getMaxDuration(insulinEvent: any): number;
/**
 * getMaxValue
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Number} max programmed or recommended value wrt the insulinEvent
 */
export function getMaxValue(insulinEvent: any): number;
/**
 * getNormalPercentage
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {string|number} percentage of combo bolus delivered immediately
 */
export function getNormalPercentage(insulinEvent: any): string | number;
/**
 * getTotalBolus
 * @param {Array} insulinEvents - Array of Tidepool bolus or wizard objects
 *
 * @return {Number} total bolus insulin in units
 */
export function getTotalBolus(insulinEvents: any[]): number;
/**
 * hasExtended
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus has an extended delivery portion
 */
export function hasExtended(insulinEvent: any): boolean;
/**
 * isInterruptedBolus
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus was interrupted or not
 */
export function isInterruptedBolus(insulinEvent: any): boolean;
/**
 * isOverride
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus programmed was larger than the calculated recommendation
 */
export function isOverride(insulinEvent: any): boolean;
/**
 * isUnderride
 * @param {Object} insulinEvent - a Tidepool bolus or wizard object
 *
 * @return {Boolean} whether the bolus programmed was smaller than the calculated recommendation
 */
export function isUnderride(insulinEvent: any): boolean;
/**
 * getAnnoations
 * @param {Object} insulinEvent - a Tidebool bolus or wizard object
 *
 * @returns {Array} array of annotations for the bolus or an empty array
 */
export function getAnnotations(insulinEvent: any): any[];
