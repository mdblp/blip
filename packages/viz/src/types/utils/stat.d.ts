export const dailyDoseUnitOptions: {
    label: any;
    value: string;
}[];
export namespace statTypes {
    const barBg: string;
    const noBar: string;
    const lines: string;
    const wheel: string;
    const input: string;
    const simple: string;
}
export namespace statBgSourceLabels { }
export namespace statFormats {
    const bgCount: string;
    const bgRange: string;
    const bgValue: string;
    const cv: string;
    const carbs: string;
    const duration: string;
    const gmi: string;
    const percentage: string;
    const standardDevRange: string;
    const standardDevValue: string;
    const units: string;
    const unitsPerKg: string;
}
export namespace commonStats {
    export const averageGlucose: string;
    export const averageDailyDose: string;
    const carbs_1: string;
    export { carbs_1 as carbs };
    export const coefficientOfVariation: string;
    export const glucoseManagementIndicator: string;
    export const readingsInRange: string;
    export const sensorUsage: string;
    export const standardDev: string;
    export const timeInAuto: string;
    export const timeInRange: string;
    export const totalInsulin: string;
}
export const statFetchMethods: {
    [x: string]: string;
};
export function getSum(data: any): any;
export function ensureNumeric(value: any): number;
export function getStatAnnotations(data: any, type: any, opts?: {}): any[];
export function getStatData(data: any, type: any, opts?: {}): {
    raw: any;
};
export function getStatTitle(type: any, opts?: {}): any;
export function getStatDefinition(data: any, type: any, opts?: {}): {
    annotations: any[];
    collapsible: boolean;
    data: {
        raw: any;
    };
    id: any;
    title: any;
    type: string;
};
