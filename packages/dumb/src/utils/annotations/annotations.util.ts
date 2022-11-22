/*
 * Copyright (c) 2022, Diabeloop
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
import { assign } from 'lodash'
import { ANNOTATION_CODE_BG_OUT_OF_RANGE } from '../blood-glucose/blood-glucose.util'
import { Annotation, Message } from '../../models/annotation.model'

const t = i18next.t.bind(i18next)

const ANNOTATION_VALUE_LOW = 'low'

export const getOutOfRangeAnnotationMessages = (annotations?: Annotation[]): Message[] => {
  if (!annotations || annotations.length === 0) {
    return []
  }

  const bgValueLowerLabel = t('* This BG value was lower than your device could record. Your actual BG value is lower than it appears here.')
  const bgValueHigherLabel = t('* This BG value was higher than your device could record. Your actual BG value is higher than it appears here.')

  return annotations.reduce((messages: Message[], annotation: Annotation) => {
    const annotationCode = annotation.code || ''
    if (annotationCode !== ANNOTATION_CODE_BG_OUT_OF_RANGE) {
      return messages
    }
    const value = annotation.value
    const messageValue = value === ANNOTATION_VALUE_LOW ? bgValueLowerLabel : bgValueHigherLabel
    const message = assign({}, annotation, {
      message: {
        value: messageValue
      }
    })
    messages.push(message)
    return messages
  }, [])
}
