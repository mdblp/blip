/**
 * getBolusEdges
 * @param {Number} bolusWidth - width of a bolus (rendering-platform specific)
 * @param {Number} bolusCenter - scaled center of the bolus on the x (i.e., time) axis
 * @param {Number} bolusBottom - scaled bottom of the bolus on the y-axis
 * @param {Number} bolusHeight - scaled height of the bolus
 *
 * @return {Object} object containing `left`, `right`, `top`, `bottom` edges for a bolus rectangle
 */
export function getBolusEdges(bolusWidth: number, bolusCenter: number, bolusBottom: number, bolusHeight: number): any;
/**
 * getBolusPaths
 * @param {Object} insulinEvent - a Tidepool wizard (with embedded bolus) or bolus datum
 * @param {Function} xScale - xScale preconfigured with domain & range
 * @param {Function} yScale - yScale preconfigured with domain & range
 * @param {Object} opts - bolus rendering options such as width
 *
 * @return {Array} paths - Array of Objects, each specifying component paths to draw a bolus
 */
export default function getBolusPaths(insulinEvent: any, xScale: Function, yScale: Function, { bolusWidth, extendedLineThickness, interruptedLineThickness, triangleHeight }: any): any[];
