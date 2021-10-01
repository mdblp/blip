/**
 *  Translations sorter
 *
 * - author: fatb38
 * - license: MIT
 * - Github profile: https://github.com/fatb38
 */

const fs = require('fs');
const locales = ['de', 'en', 'es', 'fr', 'it', 'lol', 'nl'];

locales.forEach((locale) => {
  const jsonFile = require(`./${locale}/yourloops.json`);
  const sortedJson = Object.keys(jsonFile).sort().reduce((accumulator, currentValue) => {
    accumulator[currentValue] = jsonFile[currentValue];
    return accumulator;
  }, {});

  fs.writeFile(
    `./locales/${locale}/yourloops.json`,
    JSON.stringify(sortedJson, null, 2),
    (err) => {
      console.log(err ? err : `Sort for -${locale}- done !`);
    });
});
