/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

import { AppConfig } from "./lib/config";
import { API } from "./lib/api";

declare global {
  // var window: Window & typeof globalThis & ExtendedWindow;
  interface Window {
    _jipt: any;
    _paq: any[];
    zE: (...args: any) => void;
    config?: AppConfig;
    renderIframe?: (config: AppConfig, api: API) => void;
  }
  const BUILD_CONFIG: string;
}

declare module "*.png" {
  const value: any;
  export default value;
}
