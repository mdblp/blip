const fs = require("fs");
const path = require('path');
const localeDir = `${__dirname}/locales`;
const localeRef = require("./locales/en/yourloops.json");
const localeRef2 = require("./locales/en/translation.json");
let returnCode = 0;

function checkLocaleFiles(lang) {
  const content = require(path.resolve(localeDir, lang, "yourloops.json"));
  const content2 = require(path.resolve(localeDir, lang, "translation.json"));
  let nbOfUnstranslatedStrings = 0;
  for(key in localeRef) {
    const val = content[key];
    if( val === undefined) {
      console.error(`${lang}: key ${key} is not translated!`);
      nbOfUnstranslatedStrings++;
    }
    // If we wanted to verify that all keys are translated... But seems impossible as there will be cases where key = value
    // if( val === key) {
    //   console.warn(`value for ${key} is the same as the key`);
    // }
  }
  for(key in localeRef2) {
    const val = content2[key];
    if( val === undefined) {
      console.error(`${lang}: key ${key} is not translated!`);
      nbOfUnstranslatedStrings++;
    }
  }
  if (nbOfUnstranslatedStrings > 0) {
    returnCode = 1;
    console.error(`Number of unstranlated strings for "${lang}": ${nbOfUnstranslatedStrings}`);
  }
}
const localeFiles = fs.readdirSync(localeDir);

for( const lang of localeFiles) {
  if (lang !== "languages.json") {
    console.log(`check lang ${lang}`)
    checkLocaleFiles(lang)
  }
}

process.exit(returnCode);
