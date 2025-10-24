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

const reExtractTranslationKeys = /[^a-zA-Z0-9]t\(['"](.*?)['"](.*?)\)/g

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
  'wheel-label-on',
  'Date',
  'Level',
  'Parameter',
  'Parameters History',
  'Reservoir changes',
  'Safety basal profile',
  'millisecond',
  'milliseconds',
  'days',
  'second'
]
const ignoredTransKeyInBlipFiles = [
  'D',
  '${physicalActivity.reportedIntensity}-pa',
  'bolus_${bolusType}',
  'bolus_${bolusSubType}',
  'params|${parameter.name}',
  'params|${row.name}',
  '${titleType} Above Range',
  '${titleType} Below Range',
  '${titleType} In Range',
  'Micro Bolus',
  'params|${nameUppercase}',
  'params|${PhysicalActivityName.AerobicDefault}'
]
const ignoredTransKeyForYourLoops = [
  // Countries (from locales/languages.json)
  'Austria',
  'Belgium',
  'France',
  'Germany',
  'Italy',
  'Japan',
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
  'notification-caregiver-invite-by-patient',
  'notification-hcp-invite-by-team',
  'notification-patient-invite-by-team',
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
  'diabetes-type',
  'not-logged-in',
  'modal-add-medical-team-code-no-invite',
  'modal-cancel-patient-invite-question',
  'modal-caregiver-remove-patient-failure',
  'modal-caregiver-remove-patient-info-2',
  'modal-caregiver-remove-patient-question',
  'modal-caregiver-remove-patient-remove',
  'modal-caregiver-remove-patient-success',
  'modal-caregiver-remove-patient-title',
  'modal-patient-remove-caregiver-failure',
  'modal-patient-remove-caregiver-info-2',
  'modal-patient-remove-caregiver-success',
  'modal-patient-remove-caregiver-title',
  'modal-remove-caregiver-question',
  'modal-remove-patient-question',
  'modal-remove-patient-from-team-info',
  'modal-remove-patient-title',
  'remove-caregiver',
  'severe-hypoglycemia-threshold',
  'team-leave-dialog-button-leave',
  'select-account-type',
  'consent',
  'create-profile',
  'until',
  // Others
  // TODO
  'accompanying-documents',
  'account-flagged-for-deletion',
  'alarm-alert-loop-mode-activated-description',
  'alarm-alert-loop-mode-deactivated-description',
  'alarm-alert-with-code',
  'alarm-at-time',
  'the-pump-battery-is-empty',
  'pump-battery-empty',
  'no-insulin-left-in-reservoir',
  'reservoir-empty',
  'alarm-dana-incompatible-actions-on-pump-description',
  'alarm-dana-incompatible-actions-on-pump-title',
  'alarm-dana-occlusion-description',
  'alarm-hyperglycemia-description',
  'alarm-hyperglycemia-title-old',
  'alarm-hyperglycemia-title-new',
  'alarm-hypoglycemia-description',
  'alarm-hypoglycemia-title-old',
  'alarm-hypoglycemia-title-new',
  'alarm-insight-empty-insulin-cartridge-description',
  'alarm-insight-empty-insulin-cartridge-title',
  'alarm-insight-empty-pump-battery-description',
  'alarm-insight-empty-pump-battery-title',
  'alarm-insight-hypoglycemia-description',
  'alarm-insight-hypoglycemia-title',
  'alarm-insight-incompatible-actions-on-pump-description',
  'alarm-insight-incompatible-actions-on-pump-title',
  'alarm-insight-insulin-cartridge-expired-description',
  'alarm-insight-loop-mode-deactivated-description',
  'alarm-insight-occlusion-description',
  'alarm-insulin-cartridge-expired-title',
  'alarm-kaleido-empty-insulin-cartridge-description',
  'alarm-kaleido-empty-insulin-cartridge-title',
  'alarm-kaleido-empty-pump-battery-description',
  'alarm-kaleido-empty-pump-battery-title',
  'alarm-kaleido-insulin-cartridge-expired-description',
  'alarm-kaleido-occlusion-description',
  'alarm-long-hyperglycemia-description-old',
  'alarm-long-hyperglycemia-description-new',
  'alarm-long-hypoglycemia-description',
  'alarm-loop-mode-activated-description',
  'alarm-loop-mode-deactivated-description',
  'alarm-multiple-occurrences',
  'alarm-no-readings-hypoglycemia-risk-description',
  'alarm-no-readings-hypoglycemia-risk-title-old',
  'alarm-no-readings-hypoglycemia-risk-title-new',
  'alarm-occlusion-title',
  'alarm-pump-cannot-deliver-insulin-description',
  'alarm-sensor-session-expired-description-line1',
  'alarm-sensor-session-expired-description-line2',
  'alarm-sensor-session-expired-title',
  'alarm-sudden-rise-glycemia-description',
  'alarm-sudden-rise-glycemia-title-old',
  'alarm-sudden-rise-glycemia-title-new',
  'alarm-urgent-low-soon-description',
  'alarm-urgent-low-soon-title',
  'alarm-with-code',
  'alert-invite-patient-failed-already-in-team',
  'alert-invite-patient-failed-already-invited',
  'alert-reinvite-patient-failure',
  'alert-reinvite-patient-from-team-success',
  'basal-rate-unit',
  'Basal',
  'Bolus',
  'current-trigger-setting-hypoglycemia',
  'current-trigger-setting-tir',
  'product-labelling',
  'no-new-messages',
  'training',
  'initial-hba1c',
  'optional',
  'training-body',
  'refresh',
  'insulin-unit-u',
  'login-page-desktop-info-1',
  'login-page-desktop-info-2',
  'login-page-desktop-info-3',
  'login-page-desktop-title',
  'login-page-mobile-title',
  'night-mode',
  'end-date',
  'remaining-time',
  'time-in-range-cgm-daily-average',
  'readings-in-range-bgm-daily-average',
  'time-in-range-cgm-one-day',
  'compute-oneday-time-in-range',
  'remaining-time',
  'created-by-unknown',
  'delete-medical-report-number',
  'default-min-max',
  'filters-activated',
  'modal-reinvite-patient-question',
  'no-settings-on-device-alert-message',
  'BGM',
  'tooltip-empty-stat',
  'verify-email-details-2',
  'verify-email-details-3',
  'verify-email-details-4',
  'standard-deviation',
  'standard-deviation-tooltip',
  'tooltip-smbg-data',
  'time-out-of-range',
  'hypoglycemia-tooltip2',
  'time-out-of-range-target-tooltip2',
  'tooltip-total-carbs-smbg-derived',
  'avg-daily-carbs',
  'tooltip-total-day-carbs',
  'tooltip-total-derived-carbs',
  'tooltip-total-week-carbs',
  'total-carbs',
  'hba1c',
  'no-medical-files-patient',
  'added',
  'deleted',
  'updated',
  'time-loop',
  'avg-time-loop-tooltip',
  'time-loop-tooltip',
  'avg-time-loop-how-calculate',
  'time-loop-how-calculate',
  'no-medical-files-patient',
  'average-daily-insulin',
  'average-daily-insulin-tooltip',
  'daily-dose-per-weight',
  'total-insulin',
  'total-insulin-days-tooltip',
  'total-insulin-how-calculate-tooltip',
  'ratio-dose',
  'weight',
  'account-created-info-2-caregiver',
  'account-created-info-2-hcp',
  'signup-unknown-step',
  'meal-carbs',
  'tooltip-avg-daily-week-carbs',
  'tooltip-declared-derived-carbs',
  'tooltip-per-day-carbs',
  'total-declared-carbs',
  'time-loop-tooltip',
  'tooltip-total-derived-carbs',
  'verify-email-error-title',
  'tooltip-total-derived-carbs',
  'sensor-warmup',
  'sensor-warmup-session-end',
  'signup-information-message-2',
  'device',
  'safety-basal-profile-values-not-available',
  'data-period-text-trends'
]
const ignoredTransKeyInYourLoopsFiles = [
  // Documentation!
  'translate-me',
  'translate-{{someone}}',
  // Keys that are prefixed with namespace "params|"
  'params|HEIGHT',
  'params|INSULIN_TYPE',
  'params|WEIGHT'
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
    //console.log(line)
    const match = [...line.matchAll(reExtractTranslationKeys)]
    if (match !== null) {
      //const trKey = match[1]
      //match.forEach(match => console.log(match[1]))
      const translationKeys = match.map(match => match[1])
      translationKeys.forEach(trKey => {
        //console.log('Found translation key:', trKey)
        trKeys.push(trKey)
      })
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
    //console.log({ file, trKeys })
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
    expect(unusedTranslations, `Unused translations: ${JSON.stringify(unusedTranslations)}`).to.be.empty
    expect(missingTranslations, `Missing translations: ${JSON.stringify(missingTranslations)}`).to.be.empty
  })

  it('should find all translations from yourloops.json', async () => {
    //pages/notifications
    const allFiles = await getFiles(path.resolve(`${__dirname}/../../packages/yourloops`))
    //const  allFiles = []
    const dumbFiles = await getFiles(path.resolve(`${__dirname}/../../packages/dumb`))
    //console.log(dumbFiles.length)
    allFiles.push(...dumbFiles)
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
      if (!blipEnglish.includes(key) && !ylpEnglish.includes(key) && !ignoredTransKeyInYourLoopsFiles.includes(key)) {
        missingTranslations.push(key)
      }
    }
    expect(unusedTranslations, `Unused translations: ${JSON.stringify(unusedTranslations)}`).to.be.empty
    expect(missingTranslations, `Missing translations: ${JSON.stringify(missingTranslations)} in translation.json or yourloops.json`).to.be.empty
  })
})
