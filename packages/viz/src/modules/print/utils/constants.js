// DPI here is the coordinate system, not the resolution; sub-dot precision renders crisply!
export const DPI = 72
export const MARGIN = DPI / 2
export const HEIGHT = 11 * DPI - (2 * MARGIN)
export const WIDTH = 8.5 * DPI - (2 * MARGIN)
export const MARGINS = {
  left: MARGIN,
  top: MARGIN,
  right: MARGIN,
  bottom: MARGIN
}
export const DEFAULT_FONT_SIZE = 10
export const LARGE_FONT_SIZE = 12
export const FOOTER_FONT_SIZE = 8
export const HEADER_FONT_SIZE = 14
export const SMALL_FONT_SIZE = 8
export const EXTRA_SMALL_FONT_SIZE = 6
export const Images = {
  logo: null,
  kaleidoPumpIcon: null,
  danaPumpIcon: null,
  insightPumpIcon: null,
  medisafePumpIcon: null
}
/** @type {{[x:string]: {regularName:string;regular:false|null|ArrayBuffer;boldName:string;bold:false|null|ArrayBuffer;}}} */
export const Fonts = {
  default: {
    regularName: 'Helvetica',
    regular: false, // Be sure it is evaluated to false for default western font
    boldName: 'Helvetica-Bold',
    bold: false
  },
  ja: {
    regular: null,
    regularName: 'jaFontRegular',
    bold: null,
    boldName: 'jaFontBold'
  }
}
