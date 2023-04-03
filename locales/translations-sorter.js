const fs = require('fs')
const files = ['yourloops.json', 'translation.json']

/**
 * @param {string} locale The language
 * @param {string} filename The filename
 */
function sortKeysInFile(locale, filename) {
  const jsonFilename = `./${locale}/${filename}`
  const jsonFile = require(jsonFilename)
  const sortedJson = Object.keys(jsonFile).sort().reduce((accumulator, currentValue) => {
    accumulator[currentValue] = jsonFile[currentValue]
    return accumulator
  }, {})

  fs.writeFile(
    `./locales/${locale}/${filename}`,
    JSON.stringify(sortedJson, null, 2) + '\n',
    (err) => {
      console.log(err ?? `Sort ${jsonFilename} done !`)
    })
}

files.forEach((filename) => sortKeysInFile('en', filename))
