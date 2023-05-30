/**
 * noData
 * @param  {ANY} val value to check
 *
 * @return {Boolean}     true if value is defined, not null, not empty string, false otherwise
 */
export function noData(val: ANY): boolean;
/**
 * deviceName
 * @param  {string} manufacturer one of: animas, insulet, medtronic, tandem, diabeloop
 *
 * @return {string}              name for given manufacturer
 */
export function deviceName(manufacturer: string): string;
/**
 * getTotalBasalRates
 * @param  {Array} scheduleData  basal schedule data
 *
 * @return {String}              formatted total of basal rates
 */
export function getTotalBasalRates(scheduleData: any[]): string;
/**
 * getScheduleLabel
 * @param  {String} scheduleName  basal schedule name
 * @param  {String} activeName    name of active basal schedule at time of upload
 * @param  {String} deviceKey    one of: animas, carelink, insulet, medtronic, tandem, diabeloop
 * @param  {Boolean} noUnits      whether units should be included in label object
 *
 * @return {Object}              object representing basal schedule label
 */
export function getScheduleLabel(scheduleName: string, activeName: string, deviceKey: string, noUnits: boolean): any;
/**
 * getScheduleNames
 * @param  {Object} settingsData object with basal schedule properties
 *
 * @return {Array}               array of basal schedule names
 */
export function getScheduleNames(settingsData: any): any[];
/**
 * getTimedSchedules
 * @param  {Array} settingsData array of basal schedules
 *
 * @return {Array}              array of {name, position} basal objects
 */
export function getTimedSchedules(settingsData: any[]): any[];
/**
 * getDeviceMeta
 * @param  {Object} settingsData all settings data
 * @param  {Object} timePrefs    timezone preferences object
 *
 * @return {Object}              filtered meta data
 */
export function getDeviceMeta(settingsData: any, timePrefs: any): any;
/**
 * processBasalRateData
 * @param  {Object} scheduleData basal schedule object
 *
 * @return {Array}               array of formatted schedule entries
 */
export function processBasalRateData(scheduleData: any): any[];
/**
 * processBgTargetData
 * @param  {Array} targetsData  array of blood glucose targets
 * @param  {String} bgUnits     MGDL_UNITS or MMOLL_UNITS
 * @param  {Object} keys        key names as {columnTwo, columnThree}
 *
 * @return {Array}              formatted bloog glucose target data
 */
export function processBgTargetData(targetsData: any[], bgUnits: string, keys: any): any[];
/**
 * processCarbRatioData
 * @param  {Array} carbRatioData  array of carb ratio data
 *
 * @return {Array}                array of formatted carb ratio objects
 */
export function processCarbRatioData(carbRatioData: any[]): any[];
/**
 * processSensitivityData
 * @param  {Array} sensitivityData  array of sensitivity data
 * @param  {String} bgUnits         MGDL_UNITS or MMOLL_UNITS
 *
 * @return {Array}                  array of formatted sensitivity objects
 */
export function processSensitivityData(sensitivityData: any[], bgUnits: string): any[];
/**
 * processTimedSettings
 * @param  {Object} pumpSettings entire pump settings object
 * @param  {Object} schedule     {name, position} schedule object
 * @param  {String} bgUnits      MGDL_UNITS or MMOLL_UNITS
 *
 * @return {Array}               array of formatted objects with
 *                                 {start, rate, bgTarget, carbRatio, insulinSensitivity}
 */
export function processTimedSettings(pumpSettings: any, schedule: any, bgUnits: string): any[];
/**
 * startTimeAndValue
 * @param {TYPE} accessor key for value displayed in this column
 *
 * @return {Array} array of objects describing table columns
 */
export function startTimeAndValue(valueKey: any): any[];
