/*
 * Copyright (c) 2017-2023, Diabeloop
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

import i18next from 'i18next'
import blobStream from 'blob-stream'

import * as constants from './utils/constants'
import { arrayBufferToBase64 } from './utils/functions'

// TO_DO have a configuration variable to support specific branding or not like done e.g. in Blip
// branding should make use of artifact.sh to download specific branding artifacts such as images
import siteChangeCannulaImage from './images/sitechange-cannula.png'
import siteChangeReservoirImage from './images/sitechange-reservoir.png'
import siteChangeTubingImage from './images/sitechange-tubing.png'
import siteChangeReservoirDiabeloopImage from './images/diabeloop/sitechange-cartridge.png'
// TODO test if we are supposed to have japanese in pdf
// import jaFontRegular from 'jaFont-Regular.ttf'
// import jaFontBold from 'jaFont-Bold.ttf'
import { PrintView } from 'dumb/src/modules/print/print-view'
import { BASE_64_FLAG } from './utils/constants'

// Exporting utils for easy stubbing in tests
export const utils = {
  blobStream,
  PrintView
}

export const loadImages = async (): Promise<void> => {
  let imageStr = ''

  // if (!constants.Images.logo && window.config) {
  //   const response = await fetch(`/branding_${window.config.BRANDING}_pdf-logo.png`)
  //   const buffer = await response.arrayBuffer()
  //   imageStr = BASE_64_FLAG + arrayBufferToBase64(buffer)
  //   constants.Images.logo = imageStr
  // }

  if (!constants.Images.siteChangeCannulaImage) {
    if (siteChangeCannulaImage.startsWith(BASE_64_FLAG)) {
      imageStr = siteChangeCannulaImage
    } else {
      const response = await fetch(siteChangeCannulaImage)
      const buffer = await response.arrayBuffer()
      imageStr = BASE_64_FLAG + arrayBufferToBase64(buffer)
    }
    constants.Images.siteChangeCannulaImage = imageStr
  }

  if (!constants.Images.siteChangeReservoirImage) {
    if (siteChangeReservoirImage.startsWith(BASE_64_FLAG)) {
      imageStr = siteChangeReservoirImage
    } else {
      const response = await fetch(siteChangeReservoirImage)
      const buffer = await response.arrayBuffer()
      imageStr = BASE_64_FLAG + arrayBufferToBase64(buffer)
    }
    constants.Images.siteChangeReservoirImage = imageStr
  }

  if (!constants.Images.siteChangeTubingImage) {
    if (siteChangeTubingImage.startsWith(BASE_64_FLAG)) {
      imageStr = siteChangeTubingImage
    } else {
      const response = await fetch(siteChangeTubingImage)
      const buffer = await response.arrayBuffer()
      imageStr = BASE_64_FLAG + arrayBufferToBase64(buffer)
    }
    constants.Images.siteChangeTubingImage = imageStr
  }

  if (!constants.Images.siteChangeReservoirDiabeloopImage) {
    if (siteChangeReservoirDiabeloopImage.startsWith(BASE_64_FLAG)) {
      imageStr = siteChangeReservoirDiabeloopImage
    } else {
      const response = await fetch(siteChangeReservoirDiabeloopImage)
      const buffer = await response.arrayBuffer()
      imageStr = BASE_64_FLAG + arrayBufferToBase64(buffer)
    }
    constants.Images.siteChangeReservoirDiabeloopImage = imageStr
  }
  console.log(constants.Images)
}

export const loadFonts = (): void => {
  if (i18next.language === 'ja') {
    // if (constants.Fonts.ja.regular === null) {
    //   const response = await fetch(jaFontRegular)
    //   if (response.ok) {
    //     constants.Fonts.ja.regular = await response.arrayBuffer()
    //   } else {
    //     console.error('Failed to download', response.status, jaFontRegular)
    //   }
    // }
    // if (constants.Fonts.ja.bold === null) {
    //   const response = await fetch(jaFontBold)
    //   if (response.ok) {
    //     constants.Fonts.ja.bold = await response.arrayBuffer()
    //   } else {
    //     console.error('Failed to download', response.status, jaFontBold)
    //   }
    // }
  }
}
