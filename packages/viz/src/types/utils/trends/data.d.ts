/**
 * findDatesIntersectingWithCbgSliceSegment
 * @param {Array} cbgData - Array of Tidepool cbg events
 * @param {Object} focusedSlice - the current focused cbg slice/segment
 * @param {Array} focusedSliceKeys - Array of 2 keys representing
 *                                   the top & bottom of focused slice segment
 *
 * @return {Array} dates - Array of String dates in YYYY-MM-DD format
 */
export function findDatesIntersectingWithCbgSliceSegment(cbgData: any[], focusedSlice: any, focusedSliceKeys: any[]): any[];
