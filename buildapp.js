const sh = require('shelljs');
const ms = require('ms');

const start = new Date();

console.log('Cleaning output directory "dist/"...');
sh.rm('-rf', 'dist');
sh.mkdir('-p', 'dist');

const isProduction = (process.env.NODE_ENV === 'production');
const entry = isProduction ? './app/main.prod.js': './app/main.js';

console.log('Building app from "' + entry + '"...');
let webpackOptions = '--no-color';
if (isProduction) {
  webpackOptions = `--optimize-minimize --optimize-dedupe ${webpackOptions}`;
}
const result = sh.exec(`webpack ${webpackOptions}`);

const end = new Date();
console.log('App built in ' + ms(end - start));

process.exit(result.code);
