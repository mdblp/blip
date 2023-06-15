export default DailyPrintView;
declare class DailyPrintView extends PrintView<any> {
    constructor(doc: any, data: any, opts: any);
    bgBounds: any;
    leftEdge: number;
    rightEdge: number;
    source: any;
    manufacturer: any;
    isAutomatedBasalDevice: boolean;
    basalGroupLabels: {
        automated: any;
        manual: any;
    };
    bgAxisFontSize: number;
    carbsFontSize: number;
    summaryHeaderFontSize: any;
    chartsPerPage: any;
    bolusWidth: number;
    carbRadius: number;
    cbgRadius: number;
    markerRadius: number;
    extendedLineThickness: number;
    interruptedLineThickness: number;
    smbgRadius: number;
    triangleHeight: number;
    bgScaleYLimit: number;
    colors: any;
    gapBtwnSummaryAndChartAsPercentage: number;
    chartArea: {
        bottomEdge: any;
        leftEdge: any;
        topEdge: any;
    };
    summaryArea: {
        rightEdge: any;
    };
    chartsByDate: {};
    initialChartsByDate: {};
    chartsPlaced: number;
    initialChartsPlaced: number;
    chartIndex: number;
    initialChartIndex: number;
    newPage(): void;
    calculateChartMinimums(chartArea: any): DailyPrintView;
    chartMinimums: {
        notesEtc: number;
        bgEtcChart: number;
        bolusDetails: number;
        basalChart: number;
        belowBasal: number;
        paddingBelow: number;
        total: number;
    };
    calculateDateChartHeight({ data, date }: {
        data: any;
        date: any;
    }): DailyPrintView;
    makeScales(dateChart: any): DailyPrintView;
    placeChartsOnPage(): DailyPrintView;
    renderEventPath(path: any): void;
    render(): void;
    renderSummary({ date, topEdge }: {
        date: any;
        topEdge: any;
    }): DailyPrintView;
    renderXAxes({ bolusDetailsHeight, topEdge, date }: {
        bolusDetailsHeight: any;
        topEdge: any;
        date: any;
    }): DailyPrintView;
    renderYAxes({ bgScale, bottomOfBasalChart, bounds, date, topEdge, xScale }: {
        bgScale: any;
        bottomOfBasalChart: any;
        bounds: any;
        date: any;
        topEdge: any;
        xScale: any;
    }): DailyPrintView;
    renderCbgs({ bgScale, data: { cbg: cbgs }, xScale }: {
        bgScale: any;
        data: {
            cbg: any;
        };
        xScale: any;
    }): DailyPrintView;
    renderSmbgs({ bgScale, data: { smbg: smbgs }, xScale }: {
        bgScale: any;
        data: {
            smbg: any;
        };
        xScale: any;
    }): DailyPrintView;
    renderInsulinEvents({ bolusScale, data: { bolus: insulinEvents }, xScale }: {
        bolusScale: any;
        data: {
            bolus: any;
        };
        xScale: any;
    }): DailyPrintView;
    renderFoodCarbs({ bolusScale, data: { food }, xScale }: {
        bolusScale: any;
        data: {
            food: any;
        };
        xScale: any;
    }): DailyPrintView;
    renderBolusDetails({ bolusDetailPositions, bolusDetailWidths, bolusScale, data: { bolus: insulinEvents } }: {
        bolusDetailPositions: any;
        bolusDetailWidths: any;
        bolusScale: any;
        data: {
            bolus: any;
        };
    }): DailyPrintView;
    renderBasalRates(chart: any): DailyPrintView;
    renderBasalPaths({ basalScale, data: { basal, basalSequences: sequences }, xScale }: {
        basalScale: any;
        data: {
            basal: any;
            basalSequences: any;
        };
        xScale: any;
    }): DailyPrintView;
    renderChartDivider({ bottomEdge, bottomOfBasalChart }: {
        bottomEdge: any;
        bottomOfBasalChart: any;
    }): void;
    renderLegend(): DailyPrintView;
}
import { PrintView } from "dumb";
