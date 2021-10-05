const fs = require("fs");
const path = require('path');
const localeDir = `${__dirname}/locales`;
const localeRef = require("./locales/en/yourloops.json");
let returnCode = 0;

function checkLocaleFiles(lang) {
  const content = require(path.resolve(localeDir, lang, "yourloops.json"));
  let nbOfUnstranslatedStrings = 0;
  for(key in localeRef) {
    const val = content[key];
    if( val === undefined) {
      console.error(`${lang}: key ${key} is not translated!`);
      nbOfUnstranslatedStrings++;
    }
    // if( val === key) {
    //   console.warn(`value for ${key} is the same as the key`);
    // }
  }
  if (nbOfUnstranslatedStrings > 0) {
    returnCode = 1;
    console.log(`Number of unstranlated strings for "${lang}": ${nbOfUnstranslatedStrings}`);
  }

}
const localeFiles = fs.readdirSync(localeDir);

localeFiles.forEach( (lang) => {
  if (lang !== "languages.json") {
    checkLocaleFiles(lang)
  }
});

process.exit(returnCode);
