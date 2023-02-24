/*
 * Copyright (c) 2023, Diabeloop
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

// DPI here is the coordinate system, not the resolution; sub-dot precision renders crisply!
import { arrayBufferToBase64 } from './functions'

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

export const BASE_64_FLAG = 'data:image/jpeg;base64,'

interface ImagesModel {
  logo?: string
  siteChangeCannulaImage?: string
  siteChangeReservoirImage?: string
  siteChangeTubingImage?: string
  siteChangeReservoirDiabeloopImage?: string
}

const buildImages = async (): Promise<ImagesModel> => {
  if (window.config) {
    const response = await fetch(`/branding_${window.config.BRANDING}_pdf-logo.png`)
    const buffer = await response.arrayBuffer()
    const imageStr = BASE_64_FLAG + arrayBufferToBase64(buffer)
    return {
      logo: imageStr,
      siteChangeCannulaImage: undefined,
      siteChangeReservoirImage: undefined,
      siteChangeTubingImage: undefined,
      siteChangeReservoirDiabeloopImage: undefined
    }
  }

  return {}
}

export const Images = await buildImages()

/** @type {{[x:string]: {regularName:string;regular:false|null|ArrayBuffer;boldName:string;bold:false|null|ArrayBuffer;}}} */
export const FONTS = {
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
