/*
 * Copyright (c) 2021-2022, Diabeloop
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

const fs = require('fs').promises
const path = require('path')
const { expect } = require('chai')
const blipEnglish = Object.keys(require('../../locales/en/translation.json'))
const ylpEnglish = Object.keys(require('../../locales/en/yourloops.json'))

const reFuncTranslate1 = /[^a-zA-Z0-9]t\("([^"]+)"\s*(,[^)]+)?\)/
const reFuncTranslate2 = /[^a-zA-Z0-9]t\('([^']+)'\s*(,[^)]+)?\)/
const reFuncTranslate3 = /[^a-zA-Z0-9]t\(`([^`]+)`\s*(,[^)]+)?\)/

/** Keys to ignore (used in <Trans /> or composed keys or others mechanism) */
const ignoredTransKeysForBlip = [
  'html.setting-no-uploaded-data',
  'between {{low}} - {{high}} {{- units}}',
  // Bolus types:
  'bolus_biphasic',
  'bolus_normal',
  'bolus_pen',
  // Physical activity intensity
  'high-pa',
  'medium-pa',
  'low-pa',
  // Dates (not sure all are still used)
  'hour',
  'hours',
  'minute',
  'minutes',
  'month',
  'months',
  'seconds',
  'week',
  'weeks',
  'year',
  'years',
  // Others
  'YYYY-MM-DD',
  'carbs',
  'delivered',
  'level',
  'wheel-label-off',
  'wheel-label-on'
]
const ignoredTransKeyInBlipFiles = [
  '${physicalActivity.reportedIntensity}-pa',
  'bolus_${bolusType}',
  'bolus_${bolusSubType}',
  'params|${parameter.name}',
  'params|${row.name}'
]
const ignoredTransKeyForYourLoops = [
  // Countries (from locales/languages.json)
  'Austria',
  'Belgium',
  'France',
  'Germany',
  'Italy',
  'Netherlands',
  'Spain',
  'Switzerland',
  'United Kingdom',
  // HcpProfessions
  'hcp-profession-nurse',
  'hcp-profession-diabeto',
  'hcp-profession-other',
  'hcp-profession-dietitian',
  // <Trans /> keys
  'consent-renew-message',
  'consent-welcome-message',
  'modal-add-patient-warning-line2',
  'modal-patient-team-privacy-2',
  'no',
  'notification-caregiver-invitation-by-patient',
  'notification-hcp-invitation-by-team',
  'notification-patient-invitation-by-team',
  'signup-steppers-ending-message-1',
  'signup-steppers-ending-message-2',
  'team-leave-dialog-and-del-question',
  'team-leave-dialog-only-admin-consequences',
  'team-members-dialog-rmmember-question',
  'team-members-dialog-rmmember-title',
  'team-modal-create-warning-line2',
  // Generated keys
  'consent-caregiver-privacy-policy',
  'consent-caregiver-terms-of-use',
  'consent-hcp-feedback',
  'consent-hcp-privacy-policy',
  'consent-hcp-terms-of-use',
  'consent-patient-privacy-policy',
  'consent-patient-terms-of-use',
  'consent-monitoring-terms-of-use',
  'diabete-type',
  'not-logged-in',
  'modal-add-medical-team-code-no-invite',
  'modal-caregiver-remove-patient-failure',
  'modal-caregiver-remove-patient-info-2',
  'modal-caregiver-remove-patient-remove',
  'modal-caregiver-remove-patient-success',
  'modal-caregiver-remove-patient-title',
  'modal-patient-remove-caregiver-failure',
  'modal-patient-remove-caregiver-info-2',
  'modal-patient-remove-caregiver-success',
  'modal-patient-remove-caregiver-title',
  'modal-remove-caregiver-question',
  'modal-remove-patient-question',
  'remove-caregiver',
  'severe-hypoglycemia-threshold',
  'team-leave-dialog-button-leave',
  'select-account-type',
  'consent',
  'create-profile',
  'until',
  // Others
  // TODO
  'alert-invitation-patient-failed-already-in-team',
  'alert-invitation-patient-failed-already-invited',
  'accompanying-documents',
  'product-labelling',
  'no-new-messages',
  'training',
  'initial-hba1c',
  'optional',
  'training-body',
  'login',
  'refresh',
  'login-page-desktop-info-1',
  'login-page-desktop-info-2',
  'login-page-desktop-info-3',
  'login-page-desktop-title',
  'login-page-mobile-title'
]
const ignoredTransKeyInYourLoopsFiles = [
  'yourloops|${s}',
  'gender-${patient.profile.sex.toLocaleLowerCase()}',
  // Documentation!
  'translate-me',
  'translate-{{someone}}'
]

/**
 * @param {string} baseDir
 * @return {Promise<string[]>} A list of json files
 */
async function getFiles(baseDir) {
  // const dir = path.resolve(__dirname, "locales", lang);
  let files = await fs.readdir(baseDir)
  const subDirs = []
  for (const filename of files) {
    if (filename === 'node_modules') {
      continue
    }
    const fullName = `${baseDir}/${filename}`
    const fileStatus = await fs.stat(fullName)
    if (fileStatus.isDirectory()) {
      subDirs.push(fullName)
    }
  }

  files = files.filter((name) => /\.[jt]sx?$/.test(name) && !/\.test\.[jt]sx?$/.test(name))
  files.sort((a, b) => a.localeCompare(b))
  const fullNames = files.map((file) => `${baseDir}/${file}`)
  for (const dirName of subDirs) {
    const subFiles = await getFiles(dirName)
    Array.prototype.push.apply(fullNames, subFiles)
  }
  return fullNames
}

/**
 * Get the translations used
 * @param {string} file The filename
 * @returns {Promise<string[]>} The list of used translations
 */
async function getTranslations(file) {
  const content = await fs.readFile(file, { encoding: 'utf-8' })
  const lines = content.split('\n')
  /** @type {string[]} */
  const trKeys = []
  for (const line of lines) {
    // console.log(line);
    let match = reFuncTranslate1.exec(line) ?? reFuncTranslate2.exec(line) ?? reFuncTranslate3.exec(line)
    if (match !== null) {
      const trKey = match[1]
      if (typeof trKey === 'string') {
        trKeys.push(trKey)
      }
    }
  }
  return trKeys
}

/**
 *
 * @param {string[]} files List of files
 * @returns {Promise<string[]>} list of found keys
 */
async function getTrKeys(files) {
  /** @type {string[]} */
  const trKeys = []
  for (const file of files) {
    const keys = await getTranslations(file)
    // console.log({ file, trKeys });
    for (const key of keys) {
      // Avoid Double entries
      if (!trKeys.includes(key)) {
        trKeys.push(key)
      }
    }
  }
  trKeys.sort((a, b) => a.localeCompare(b))
  return trKeys
}

describe('Locales tests', () => {
  it('should find all translations from translation.json', async () => {
    const blipFiles = await getFiles(path.resolve(`${__dirname}/../../packages/blip`))
    expect(blipFiles).to.be.an('array').not.empty
    const dumbFiles = await getFiles(path.resolve(`${__dirname}/../../packages/dumb`))
    expect(dumbFiles).to.be.an('array').not.empty
    const tidelineFiles = await getFiles(path.resolve(`${__dirname}/../../packages/tideline`))
    expect(tidelineFiles).to.be.an('array').not.empty
    const vizFiles = await getFiles(path.resolve(`${__dirname}/../../packages/viz`))
    expect(vizFiles).to.be.an('array').not.empty

    const allFiles = blipFiles
    Array.prototype.push.apply(allFiles, dumbFiles)
    Array.prototype.push.apply(allFiles, tidelineFiles)
    Array.prototype.push.apply(allFiles, vizFiles)

    const trKeys = await getTrKeys(allFiles)
    /** @type {string[]} */
    const unusedTranslations = []
    /** @type {string[]} */
    const missingTranslations = []
    for (const key of blipEnglish) {
      if (!trKeys.includes(key) && !ignoredTransKeysForBlip.includes(key)) {
        unusedTranslations.push(key)
      }
    }
    for (const key of trKeys) {
      // Use yourloops.json as a fallback
      if (!blipEnglish.includes(key) && !ylpEnglish.includes(key) && !ignoredTransKeyInBlipFiles.includes(key)) {
        missingTranslations.push(key)
      }
    }

    expect(unusedTranslations, 'Unused translations').to.be.empty
    expect(missingTranslations, 'Missing translations').to.be.empty
  })

  it('should find all translations from yourloops.json', async () => {
    const allFiles = await getFiles(path.resolve(`${__dirname}/../../packages/yourloops`))
    const trKeys = await getTrKeys(allFiles)
    /** @type {string[]} */
    const unusedTranslations = []
    /** @type {string[]} */
    const missingTranslations = []
    for (const key of ylpEnglish) {
      if (!trKeys.includes(key) && !ignoredTransKeyForYourLoops.includes(key)) {
        unusedTranslations.push(key)
      }
    }
    for (const key of trKeys) {
      if (!ylpEnglish.includes(key) && !ignoredTransKeyInYourLoopsFiles.includes(key)) {
        missingTranslations.push(key)
      }
    }

    expect(unusedTranslations, `Unused translations: ${JSON.stringify(unusedTranslations)}`).to.be.empty
    expect(missingTranslations, `Missing translations: ${JSON.stringify(missingTranslations)}`).to.be.empty
  })
})
