/**
 *
 * @param {Array} parameters Diabeloop patient device parameters
 * @return {Map} parameters by level
 */
export function getParametersByLevel(parameters: any[]): Map<any, any>;
/**
 * Diabeloop text for clipboard copy.
 * @param {Object} device Diabeloop device informations
 *  (deviceId, imei, name, manufacturer, swVersion)
 * @param {Map} parametersByLevel Diabeloop patient parameters sorted by level.
 */
export function diabeloopText(device: any, parametersByLevel: Map<any, any>, displayDeviceDate: any): string;
/**
 * Datas for PDF
 * @param {Object} device Diabeloop device infos
 * @param {string|undefined} timezone
 * @param {string|undefined} date When printing PDF, when the cgm data do not match the date print
 */
export function getDeviceInfosData(device: any, timezone: string | undefined, date: string | undefined): {
    heading: {
        text: any;
        subText: string;
        note: string;
    };
    columns: {
        id: string;
        headerFill: boolean;
        cache: boolean;
        align: string;
        width: number;
    }[];
    rows: {
        label: any;
        value: any;
    }[];
};
/**
 * Return the information to make the PDF table for a level of parameters
 * @param {Array} parameters Array of parameters (object: name, value, unit, level)
 * @param {number} level Level of the parameter
 * @param {number} width Width of the table
 * @param {string|undefined} timezone
 * @param {string|undefined} date When printing PDF, when the cgm data do not match the date print
 */
export function getDeviceParametersData(parameters: any[], { level, width }: number, timezone: string | undefined, date: string | undefined): {
    heading: {
        text: any;
        subText: string;
        note: string;
    };
    columns: {
        id: string;
        header: any;
        cache: boolean;
        align: string;
        width: number;
    }[];
    rows: any[];
};
/**
 * Returns Pump information for PDF
 * @param {object} pump
 * @param {string|undefined} timezone
 * @param {string|undefined} date When printing PDF, when the cgm data do not match the date print
 */
export function getPumpParametersData(pump: object, timezone: string | undefined, date: string | undefined): {
    heading: {
        text: any;
        subText: string;
        note: string;
    };
    columns: {
        id: string;
        headerFill: boolean;
        cache: boolean;
        align: string;
        width: number;
    }[];
    rows: {
        label: any;
        value: any;
    }[];
};
/**
 * Returns CGM information for PDF
 * @param {object} cgm CGM data from the pumpSettings
 * @param {string|undefined} timezone
 * @param {string|undefined} date When printing PDF, when the cgm data do not match the date print
 */
export function getCGMParametersData(cgm: object, timezone: string | undefined, date: string | undefined): {
    heading: {
        text: any;
        note: string;
    };
    columns: {
        id: string;
        headerFill: boolean;
        cache: boolean;
        align: string;
        width: number;
    }[];
    rows: {
        label: any;
        value: any;
    }[];
};
