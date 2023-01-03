/*
 * Copyright (c) 2021-2023, Diabeloop
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

import { createTheme, Theme } from '@mui/material/styles'
import config from '../lib/config/config'
import MuseoSlab900 from 'Museo_Slab_900.otf'

const DEFAULT_COLOR = '#000'
const appElement = document.getElementById('app')
const cssVar = (name: string): string => getComputedStyle(appElement).getPropertyValue(name).trim()

/** Set one and only one class for the branding in `<div id='app'>` */
export function initTheme(): void {
  const classList = document.getElementById('app')?.classList
  classList?.remove(...BRANDING_LIST)
  classList?.add(config.BRANDING.replace('_', '-'))

  const favIcon = document.getElementById('favicon') as HTMLAnchorElement
  favIcon.href = `./branding_${config.BRANDING}_favicon.ico`
}

export function getTheme(): Theme {
  return createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: 'inherit',
            textDecoration: 'none'
          },
          body: {
            backgroundColor: appElement ? cssVar('--body-background-color') : DEFAULT_COLOR
          },
          '@font-face': [
            {
              fontFamily: 'MuseoSlab',
              fontWeight: 900,
              src: `url(${MuseoSlab900}) format(opentype)`
            }
          ]
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 600
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          spacing: {
            padding: 16,
            '& > :last-child': {
              marginLeft: 16
            }
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            margin: 0
          }
        }
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover'
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            color: appElement ? cssVar('--text-base-color') : DEFAULT_COLOR
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 12
          }
        }
      }
    },
    palette: {
      mode: 'light',
      text: {
        primary: appElement ? cssVar('--text-base-color') : DEFAULT_COLOR
      },
      primary: {
        main: appElement ? cssVar('--color-primary-main') : DEFAULT_COLOR,
        light: appElement ? cssVar('--color-primary-light') : DEFAULT_COLOR,
        dark: appElement ? cssVar('--color-primary-dark') : DEFAULT_COLOR,
        contrastText: appElement ? cssVar('--color-primary-contrast-text') : DEFAULT_COLOR
      },
      secondary: {
        main: appElement ? cssVar('--color-secondary-main') : DEFAULT_COLOR,
        light: appElement ? cssVar('--color-secondary-light') : DEFAULT_COLOR,
        dark: appElement ? cssVar('--color-secondary-dark') : DEFAULT_COLOR
      },
      info: {
        main: appElement ? cssVar('--color-info-main') : DEFAULT_COLOR,
        light: appElement ? cssVar('--color-info-light') : DEFAULT_COLOR,
        dark: appElement ? cssVar('--color-info-dark') : DEFAULT_COLOR
      }
    }
  })
}
