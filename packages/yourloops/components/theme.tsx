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

import { createTheme, type Theme } from '@mui/material/styles'
import config from '../lib/config/config'
import MuseoSlabRegular from 'Museo_Slab/Museo_Slab_Regular.otf'
import MuseoSlabBold from 'Museo_Slab/Museo_Slab_Bold.otf'

const DEFAULT_COLOR = '#000'
const appElement = document.getElementById('app')

const cssVar = (name: string): string => getComputedStyle(appElement).getPropertyValue(name).trim()
const getColor = (variable: string): string => appElement ? cssVar(variable) : DEFAULT_COLOR

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
        styleOverrides: `
        @font-face {
          font-family: 'MuseoSlab';
          src: url('${MuseoSlabRegular}') format('opentype');
          font-weight: 300;
        }

        @font-face {
          font-family: 'MuseoSlab';
          src: url('${MuseoSlabBold}') format('opentype');
          font-weight: 900;
        }
      `
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: '28px',
            textTransform: 'none'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            textTransform: 'none'
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
            color: getColor('--text-color-primary')
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 24
          }
        }
      }
    },
    palette: {
      mode: 'light',
      text: {
        primary: getColor('--text-color-primary'),
        secondary: getColor('--text-color-secondary')
      },
      primary: {
        main: getColor('--primary-color-main'),
        light: getColor('--primary-color-light'),
        dark: getColor('--primary-color-dark'),
        contrastText: getColor('--primary-color-contrast-text')
      },
      secondary: {
        main: getColor('--secondary-color-main'),
        light: getColor('--secondary-color-light'),
        dark: getColor('--secondary-color-dark')
      },
      success: {
        main: getColor('--success-color-main'),
        light: getColor('--success-color-light'),
        dark: getColor('--success-color-dark')
      },
      error: {
        main: getColor('--error-color-main'),
        light: getColor('--error-color-light'),
        dark: getColor('--error-color-dark')
      },
      warning: {
        main: getColor('--warning-color-main'),
        light: getColor('--warning-color-light'),
        dark: getColor('--warning-color-dark')
      },
      info: {
        main: getColor('--info-color-main'),
        light: getColor('--info-color-light'),
        dark: getColor('--info-color-dark')
      },
      pink: {
        main: getColor('--pink-main'),
        light: getColor('--pink-light'),
        dark: getColor('--pink-dark'),
        contrastText: '#fff',
      },
      darkBlue : {
        main: getColor('--dark-blue-main'),
        light: getColor('--dark-blue-light'),
        dark: getColor('--dark-blue-dark'),
        contrastText: '#fff',
      }
    }
  })
}
