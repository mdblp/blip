/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { i18nOptions, init as i18nInit } from '../../lib/language'
import yourloopsEn from '../../../../locales/en/yourloops.json'
import translationEn from '../../../../locales/en/translation.json'
import parameterEn from '../../../../locales/en/parameter.json'

const options = i18nOptions
options.resources.en.yourloops = yourloopsEn
options.resources.en.main = translationEn
options.resources.en.params = parameterEn
options.interpolation.skipOnVariables = false

i18nInit(options).then(() => {
  // nothing to do
}).catch((reason) => {
  console.error(reason)
})

jest.mock('@auth0/auth0-react')


/** Hack to make JSDOM support SVGTransformList (used by d3 in zoom) **/

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix
 */
const createSVGMatrix = () => ({
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  flipX: jest.fn().mockImplementation(createSVGMatrix),
  flipY: jest.fn().mockImplementation(createSVGMatrix),
  inverse: jest.fn().mockImplementation(createSVGMatrix),
  multiply: jest.fn().mockImplementation(createSVGMatrix),
  rotate: jest.fn().mockImplementation(createSVGMatrix),
  rotateFromVector: jest.fn().mockImplementation(createSVGMatrix),
  scale: jest.fn().mockImplementation(createSVGMatrix),
  scaleNonUniform: jest.fn().mockImplementation(createSVGMatrix),
  skewX: jest.fn().mockImplementation(createSVGMatrix),
  skewY: jest.fn().mockImplementation(createSVGMatrix),
  translate: jest.fn().mockImplementation(createSVGMatrix),
});

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransform
 */
const createSVGTransform = () => ({
  type: 0,
  angle: 0,
  matrix: createSVGMatrix(),
  SVG_TRANSFORM_UNKNOWN: 0,
  SVG_TRANSFORM_MATRIX: 1,
  SVG_TRANSFORM_TRANSLATE: 2,
  SVG_TRANSFORM_SCALE: 3,
  SVG_TRANSFORM_ROTATE: 4,
  SVG_TRANSFORM_SKEWX: 5,
  SVG_TRANSFORM_SKEWY: 6,
  setMatrix: jest.fn(),
  setRotate: jest.fn(),
  setScale: jest.fn(),
  setSkewX: jest.fn(),
  setSkewY: jest.fn(),
  setTranslate: jest.fn(),
});

const svgAttribute = {
  writable: true,
  value: {
    baseVal: {
      numberOfItems: 0,
      length: 0,
      appendItem: jest.fn().mockImplementation(createSVGTransform),
      clear: jest.fn(),
      consolidate: jest.fn().mockImplementation(createSVGTransform),
      getItem: jest.fn().mockImplementation(() => createSVGTransform()),
      initialize: jest.fn().mockImplementation(createSVGTransform),
      insertItemBefore: jest.fn().mockImplementation(createSVGTransform),
      removeItem: jest.fn().mockImplementation(createSVGTransform),
      replaceItem: jest.fn().mockImplementation(createSVGTransform),
      createSVGTransformFromMatrix: jest.fn().mockImplementation(createSVGTransform),
    }
  }
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransformList
 * @description SVGElement.width.baseVal is not implemented in JSDOM yet.
 */
Object.defineProperty(globalThis.SVGElement.prototype, 'width', svgAttribute);

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransformList
 * @description SVGElement.height.baseVal is not implemented in JSDOM yet.
 */
Object.defineProperty(globalThis.SVGElement.prototype, 'height', svgAttribute);


/**
 * @see https://github.com/testing-library/react-testing-library/issues/651
 * @description SVGElement.getBBOx is not implemented in JSDOM yet.
 */
Object.defineProperty(globalThis.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
  }),
});
