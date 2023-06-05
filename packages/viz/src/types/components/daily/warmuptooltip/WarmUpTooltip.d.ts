export default WarmUpTooltip;
declare function WarmUpTooltip(props: any): JSX.Element;
declare namespace WarmUpTooltip {
    namespace propTypes {
        const position: any;
        const offset: any;
        const title: any;
        const tail: any;
        const side: any;
        const tailColor: any;
        const tailWidth: any;
        const tailHeight: any;
        const backgroundColor: any;
        const borderColor: any;
        const borderWidth: any;
        const datum: any;
        const timePrefs: any;
    }
    namespace defaultProps {
        const tail_1: boolean;
        export { tail_1 as tail };
        const side_1: string;
        export { side_1 as side };
        const tailWidth_1: number;
        export { tailWidth_1 as tailWidth };
        const tailHeight_1: number;
        export { tailHeight_1 as tailHeight };
        const tailColor_1: any;
        export { tailColor_1 as tailColor };
        const borderColor_1: any;
        export { borderColor_1 as borderColor };
        const borderWidth_1: number;
        export { borderWidth_1 as borderWidth };
        const title_1: any;
        export { title_1 as title };
    }
}
