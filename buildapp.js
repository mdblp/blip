const shell = require('shelljs');
const ms = require('ms');

const start = Date.now();

console.log('Cleaning output directory "dist/"...');
shell.rm('-rf', 'dist');
shell.mkdir('-p', 'dist');

console.log('Building app from "./app/main.prod.js"...');
shell.exec('webpack --devtool source-map --optimize-minimize');

const end = Date.now();
console.log('App built in ' + ms(end - start));
