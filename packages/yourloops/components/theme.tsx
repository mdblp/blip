/**
 * Copyright (c) 2021, Diabeloop
 * Material-UI Theming
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { createTheme, Theme } from "@material-ui/core/styles";
import config from "../lib/config";

const DEFAULT_PRIMARY_MAIN_COLOR = "#039BE5";
const DEFAULT_PRIMARY_LIGHT_COLOR = "#4DABF5";
const DEFAULT_PRIMARY_DARK_COLOR = "#1769AA";
const DEFAULT_SECONDARY_MAIN_COLOR = "#EDFAFF";
const DEFAULT_SECONDARY_LIGHT_COLOR = "#F5F9F9";
const DEFAULT_SECONDARY_DARK_COLOR = "#BBC7CC";
const DEFAULT_TEXT_BASE_COLOR = "#444444";

const appElement = document.getElementById("app");
const cssVar = (name: string): string => getComputedStyle(appElement as HTMLElement).getPropertyValue(name).trim();

/** Set one and only one class for the branding in `<div id='app'>` */
export function initTheme() {
  const classList = document.getElementById("app")?.classList;
  classList?.remove(...BRANDING_LIST);
  classList?.add(config.BRANDING.replace("_", "-"));

  const favIcon = document.getElementById("favicon") as HTMLAnchorElement;
  favIcon.href = `./branding_${config.BRANDING}_favicon.ico`;
}

export function getTheme(): Theme {
  return createTheme({
    overrides: {
      MuiCssBaseline: {
        "@global": {
          a: {
            color: "inherit",
            textDecoration: "none",
          },
        },
      },
      MuiButton: {
        root: {
          fontWeight: 600,
        },
      },
      MuiDialogActions: {
        spacing: {
          "padding": 16,
          "& > :last-child": {
            marginLeft: 16,
          },
        },
      },
      MuiSvgIcon: {
        root: {
          margin: 0,
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: 40,
          color: appElement ? cssVar("--text-base-color") : DEFAULT_TEXT_BASE_COLOR,
        },
      },
      MuiPaper: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    palette: {
      type: "light",
      text: {
        primary: appElement ? cssVar("--text-base-color") : DEFAULT_TEXT_BASE_COLOR,
      },
      primary: {
        main: appElement ? cssVar("--color-primary-main") : DEFAULT_PRIMARY_MAIN_COLOR,
        light: appElement ? cssVar("--color-primary-light") : DEFAULT_PRIMARY_LIGHT_COLOR,
        dark: appElement ? cssVar("--color-primary-dark") : DEFAULT_PRIMARY_DARK_COLOR,
      },
      secondary: {
        main: appElement ? cssVar("--color-secondary-main") : DEFAULT_SECONDARY_MAIN_COLOR,
        light: appElement ? cssVar("--color-secondary-light") : DEFAULT_SECONDARY_LIGHT_COLOR,
        dark: appElement ? cssVar("--color-secondary-dark") : DEFAULT_SECONDARY_DARK_COLOR,
      },
    },
  });
}

/**
 * For some reason, return makeStyle(...) here don't work with our theme
 * @param theme Main theme
 * @returns The styles for buttons
 */
export const makeButtonsStyles = (theme: Theme) => ({
  alertActionButton: {
    "color": theme.palette.common.white,
    "backgroundColor": theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
});
