export default Table;
declare class Table {
    getItemField(item: any, field: any): any;
    normalizeColumns(): any;
    renderHeader(normalizedColumns: any): JSX.Element;
    renderRow(normalizedColumns: any, rowKey: any, rowData: any, trClassName?: string): JSX.Element;
    renderRows(normalizedColumns: any): JSX.Element;
    render(): JSX.Element;
}
declare namespace Table {
    namespace propTypes {
        const title: any;
        const rows: any;
        const columns: any;
        const tableStyle: any;
        const id: any;
    }
    namespace defaultProps {
        const id_1: string;
        export { id_1 as id };
    }
}
