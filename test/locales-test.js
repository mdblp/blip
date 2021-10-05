const expect = require('chai').expect;
const exec = require("child_process").exec;
const ylp_en = require("../locales/en/yourloops.json");
const translations_en = require("../locales/en/translation.json")

describe("Test Translations", () => {

  // it('There should not be unused keys', async () => {
  //   const translationKeysEn = iterate(en, '', []);

  //   let everyStringsAreUsed = true;
  //   for (let i = 0; i < translationKeysEn.length; i += 1) {
  //     await new Promise(resolve => {
  //       exec(`grep --exclude-dir=node_modules -rnw './packages' -e '${translationKeysEn[i]}'`, (_, stdout) => {
  //         if (everyStringsAreUsed) everyStringsAreUsed = !(stdout == '');
  //         if (stdout == '') {
  //           console.warn(`[I18n] Could not find '${translationKeysEn[i]}' in source folder`);
  //         }
  //         resolve();
  //       });
  //     });
  //   }
  //   expect(everyStringsAreUsed).toBeTruthy();
  // });

  it('There are no missing keys', async() => {
    await new Promise(resolve => {
      exec(`grep --exclude-dir=node_modules "t('.*\'" -ohrw './packages' | grep -o "'.*'"`, (_, stdout) => {
        const en = Object.assign(ylp_en, translations_en);
        let allTranslationsDefined = [];
        let ok = true;
        let missingKeys = [];
        for (const property in en) {
          allTranslationsDefined.push(property);
        }
        const allTranslationsUsed = stdout.replace(new RegExp("'", 'g'), '').split('\n');
        allTranslationsUsed.splice(-1, 1);

        for (let i = 0; i < allTranslationsUsed.length; i += 1) {
          if (!allTranslationsDefined.includes(allTranslationsUsed[i])) {
            ok = false;
            missingKeys.push(allTranslationsUsed[i]);
            console.log(allTranslationsUsed[i]);
          }
        }
        expect(ok, `${missingKeys.length} missing translation keys in en file`).to.be.true();
        resolve();
      });
    });
  });
});

