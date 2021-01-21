/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppConfig } from "../lib/config";

declare global {
  // var window: Window & typeof globalThis & ExtendedWindow;
  interface Window {
    _jipt: any;
    _paq: any[];
    zE: (...args: any) => void;
    config?: AppConfig;
  }
  interface Navigator {
    userLanguage?: string;
  }
  const BUILD_CONFIG: string;
}
