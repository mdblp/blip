export const BG_HIGH: "High";
export const BG_LOW: "Low";

export const LBS_PER_KG: 2.2046226218;
export const CGM_READINGS_ONE_DAY: 288;
export const CGM_DATA_KEY: "cbg";
export const BGM_DATA_KEY: "smbg";
export const NO_CGM: "noCGM";
export const CGM_CALCULATED: "calculatedCGM";
export const NOT_ENOUGH_CGM: "notEnoughCGM";
export const NO_SITE_CHANGE: "noSiteChange";
export const SITE_CHANGE: "siteChange";
export const SITE_CHANGE_RESERVOIR: "reservoirChange";
export const SITE_CHANGE_TUBING: "tubingPrime";
export const SITE_CHANGE_CANNULA: "cannulaPrime";
export const AUTOMATED_DELIVERY: "automatedDelivery";
export const SCHEDULED_DELIVERY: "scheduledDelivery";
export const SECTION_TYPE_UNDECLARED: "undeclared";
export const DIABELOOP: "Diabeloop";
export const DEFAULT_MANUFACTURER: "default";
export function getPumpVocabularies(): {
    Animas: {
        reservoirChange: any;
        tubingPrime: any;
        cannulaPrime: any;
        automatedDelivery: any;
        scheduledDelivery: any;
    };
    Insulet: {
        reservoirChange: any;
        tubingPrime: any;
        cannulaPrime: any;
        automatedDelivery: any;
        scheduledDelivery: any;
    };
    Medtronic: {
        reservoirChange: any;
        tubingPrime: any;
        cannulaPrime: any;
        automatedDelivery: any;
        scheduledDelivery: any;
    };
    Tandem: {
        reservoirChange: any;
        tubingPrime: any;
        cannulaPrime: any;
        automatedDelivery: any;
        scheduledDelivery: any;
    };
    Diabeloop: {
        reservoirChange: any;
        tubingPrime: any;
        cannulaPrime: any;
        automatedDelivery: any;
        scheduledDelivery: any;
    };
    default: {
        reservoirChange: any;
        tubingPrime: any;
        cannulaPrime: any;
        automatedDelivery: any;
        scheduledDelivery: any;
    };
};
export namespace AUTOMATED_BASAL_DEVICE_MODELS {
    const Medtronic: string[];
    const Diabeloop: boolean;
}
declare const STIFFNESS: 180;
declare const DAMPING: 40;
declare const PRECISION: 0.1;
export {};
