
const sh = require('shelljs');
const fs = require('fs');
const crypto = require('crypto');
const ms = require('ms');

const htmlFile = 'dist/index.html';
const configTemplate = '<!-- config -->';

const start = new Date();

// NOTE: Webpack's hash also uses the absolute path on the filesystem
// Since config is built in `start.sh` and apps can be on different
// servers and directory, we implement our own hashing using the file's content

function getHash(str) {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex').substr(0, 20);
}

console.log('Building config...');
const result = sh.exec('webpack --config config.webpack.js');
if (result.code > 0) {
  process.exit(result.code);
}

const hash = getHash(fs.readFileSync('dist/config.js'));
const filename = `config.${hash}.js`;
console.log(`Renaming to ${filename}...`);
sh.mv('-f', 'dist/config.js', 'dist/' + filename);

console.log(`Updating "${htmlFile}"...`);
let indexHtml = fs.readFileSync(htmlFile, 'utf8');
if (indexHtml.indexOf(configTemplate) > 0) {
  indexHtml = indexHtml.replace(configTemplate,
    `<script type="text/javascript" src="${filename}"></script>`
  );
  sh.ShellString(indexHtml).to(htmlFile);
} else {
  console.error(`Invalid template file ${htmlFile}`);
  process.exit(1);
}

const end = new Date();
console.log('Config built in ' + ms(end - start));
