/*
 * Copyright (c) 2025, Diabeloop
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

import fs from 'fs';
import path from 'path';

export type Locale = 'en' | 'fr';

/**
 * Utility function to load a JSON
 */
function loadJson(relativePath: string): Record<string, string> {
  const fullPath = path.resolve(new URL('.', import.meta.url).pathname, relativePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw);
}

// load en Translation
const enTranslation = {
  ...loadJson('../../../../locales/en/yourloops.json'),
  ...loadJson('../../../../locales/en/translation.json'),
  ...loadJson('../../../../locales/en/parameter.json')
};

// load fr Translation
const frTranslation = {
  ...loadJson('../../../../locales/fr/yourloops.json'),
  ...loadJson('../../../../locales/fr/translation.json'),
  ...loadJson('../../../../locales/fr/parameter.json')
};

//
export function getTranslation(key: string, locale: Locale = 'en'): string {
  switch (locale) {
    case 'en':
      return enTranslation[key] ?? key;
    case 'fr':
      return frTranslation[key] ?? key;
    default:
      throw new Error(`Locale ${locale} has not been implemented yet`);
  }
}


