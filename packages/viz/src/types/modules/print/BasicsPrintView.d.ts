export default BasicsPrintView;
declare class BasicsPrintView extends PrintView<any> {
    constructor(doc: any, data: any, opts: any);
    siteChangeImages: {
        cannulaPrime: any;
        reservoirChange: any;
        tubingPrime: any;
    };
    source: any;
    manufacturer: any;
    renderStackedStat(tb: any, data: any, draw: any, column: any, pos: any, padding: any): string;
    renderPieChart(tb: any, data: any, draw: any, column: any, pos: any): string;
    renderCalendarCell(tb: any, data: any, draw: any, column: any, pos: any, padding: any): string;
    newPage(): void;
    initCalendar(): void;
    calendar: {
        labels: any[];
        headerHeight: number;
        columns: any;
        days: any;
        pos: {};
    };
    initLayout(): void;
    render(): void;
    goToLayoutColumnPosition(index: any): void;
    getActiveColumnWidth(): number;
    setLayoutColumns(width: any, gutter: any, type: any, widths: any): void;
    layoutColumns: {
        activeIndex: number;
        columns: import("dumb/dist/src/models/print/layout-column.model").LayoutColumn[];
    };
    renderLeftColumn(): void;
    renderCenterColumn(): void;
    renderBgDistribution(): void;
    renderAggregatedStats(): void;
    renderRatio(sectionKey: any, sectionData: any): void;
    defineStatColumns(opts?: {}): {
        id: string;
        cache: boolean;
        renderer: (tb: VoilabPdfTable<import("dumb/dist/src/models/print/pdf-table.model").Table>, row: import("dumb/dist/src/models/print/pdf-table.model").Table, draw: boolean, column: import("dumb/dist/src/models/print/pdf-table.model").TableColumn, pos: import("dumb/dist/src/models/print/position.model").Position, padding: import("dumb/dist/src/models/print/padding.model").Padding, isHeader: boolean) => string;
        width: number;
        height: any;
        fontSize: any;
        font: any;
        align: string;
        headerAlign: string;
        border: string;
        headerBorder: string;
        valign: string;
        header: any;
    }[];
    renderSimpleStat(stat: any, value: any, units: any, disabled: any): void;
    renderCalendarSection(opts: any): void;
    renderCountGrid(count: any, width: any, pos: any): void;
    renderEmptyText(text: any): void;
}
import { PrintView } from "dumb";
