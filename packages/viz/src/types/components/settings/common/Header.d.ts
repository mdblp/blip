export default Header;
declare class Header extends PureComponent<any, any, any> {
    constructor(props: any);
    handleClick(): void;
    state: {
        serialNumberExpanded: boolean;
    };
    render(): JSX.Element;
}
declare namespace Header {
    namespace propTypes {
        const deviceDisplayName: any;
        const deviceMeta: any;
        const title: any;
        const id: any;
    }
    namespace defaultProps {
        const id_1: string;
        export { id_1 as id };
    }
}
import { PureComponent } from "react";
