/**
 * calculateBasalPath
 * @param {Array} basalSequence - an array of Tidepool basal events to be rendered as one
 * @param {Function} xScale - xScale preconfigured with domain & range
 * @param {Function} yScale - yScale preconfigured with domain & range
 * @param {Object} opts - basal sequence rendering options such as whether filled
 *
 * @return {String} path - basal sequence SVG path
 */
export function calculateBasalPath(basalSequence: any[], xScale: Function, yScale: Function, { endAtZero, flushBottomOffset, isFilled, startAtZero }: any): string;
/**
  * getBasalSequencePaths
  * @param {Array} basalSequence - an array of Tidepool basal events to be rendered as one
  * @param {Function} xScale - xScale preconfigured with domain & range
  * @param {Function} yScale - yScale preconfigured with domain & range
  *
  * @return {Array} paths - Array of Objects, each specifying component paths to draw a bolus
  */
export function getBasalSequencePaths(basalSequence: any[], xScale: Function, yScale: Function): any[];
