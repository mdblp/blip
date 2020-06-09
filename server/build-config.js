const shell = require('shelljs');
const { ShellString } = require('shelljs');
const fs = require('fs');
const crypto = require('crypto');
const _ = require('lodash');

const reTitle = /<title>([^<]*)<\/title>/;
const reConfig = /(<!-- config -->)|(<script [^>]*src="config(\.[\w]*)*\.js"[^>]*><\/script>)/m;
const reZendesk = /(<!-- Zendesk disabled -->)|(<script id="ze-snippet" type="text\/javascript" src="[^"]+">\s*<\/script>)/m;
const zendeskDisable = '<!-- Zendesk disabled -->';
const reTrackerUrl = /const u = '(.*)';/;
const reTrackerSiteId = /const id = ([0-9]);/;
const reMatomoJs = /<!-- Start of Tracker Code -->(.*)<!-- End of Tracker Code -->/m;
const reCrowdin = /<!-- Crowdin Start -->(.*)<!-- Crowdin End -->/m;

const start = Date.now();

function getHash(str) {
	const hash = crypto.createHash('md5');
	hash.update(str);
	return hash.digest('hex').substr(0, 20);
}

if (!fs.existsSync('config.app.js')) {
  console.error('Missing file config.app.js');
  process.exit(1);
}

let indexHtml = fs.readFileSync('dist/index.html', 'utf8');

console.log('Building config...');
let configJs = shell.exec('node config.app.js');

let fileHash = getHash(configJs.toString());
const configFilename = `config.${fileHash}.js`;
configJs.to(`dist/${configFilename}`);

// Replace the title
if (typeof process.env.BRANDING === 'string') {
  indexHtml = indexHtml.replace(reTitle, `<title>${process.env.BRANDING}</title>`);
}

// Replace from config.js part
if (reConfig.test(indexHtml)) {
  const configStrOrig = reConfig.exec(indexHtml)[0];
  const configStrRepl = `<script type="text/javascript" src="${configFilename}"></script>`;
  console.log(`Replace ${configStrOrig} by ${configStrRepl}`);
  indexHtml = indexHtml.replace(reConfig, configStrRepl);
} else {
  console.error('Missing config template part');
  process.exit(1);
}

// Replace ZenDesk Javascript
if (typeof process.env.HELP_LINK === 'string') {
  console.log('Using HELP_LINK:', process.env.HELP_LINK);

  if (process.env.HELP_LINK === 'disabled') {
    indexHtml = indexHtml.replace(reZendesk, zendeskDisable);
  } else {
    indexHtml = indexHtml.replace(reZendesk, `<script id="ze-snippet" type="text/javascript" src="${process.env.HELP_LINK}"></script>`);
  }
}

let matomoJs = null;
switch (_.get(process, 'env.METRICS_SERVICE', 'disabled')) {
case 'matomo':
  console.info('Using matomo tracker code');
  if (!_.isEmpty(process.env.MATOMO_TRACKER_URL) && process.env.MATOMO_TRACKER_URL.startsWith('http')) {
    // Replace tracker Javascript
    matomoJs = fs.readFileSync('templates/matomo.js', 'utf8');
    console.info(`Setting up matomo tracker code: ${process.env.MATOMO_TRACKER_URL}`);
    const updatedSrc = matomoJs.replace(reTrackerUrl, (m, u) => {
      return m.replace(u, process.env.MATOMO_TRACKER_URL);
    });
    const siteId = _.get(process, 'env.MATOMO_TRACKER_SITEID', 1);
    matomoJs = updatedSrc.replace(reTrackerSiteId, (m, u) => {
      return m.replace(u, siteId);
    });

    fileHash = getHash(matomoJs);
    indexHtml = indexHtml.replace(reMatomoJs, `<script type="text/javascript" src="matomo.${fileHash}.js"></script>`);

    let shellStr = new ShellString(matomoJs);
    shellStr.to(`dist/matomo.${fileHash}.js`);
  } else {
    console.error('Invalid matomo config url, please verify your MATOMO_TRACKER_URL env variable');
  }
  break;
case 'highwater':
  indexHtml = indexHtml.replace(reMatomoJs, `<!-- Using highwater -->`);
  console.info('Using highwater tracker code');
  break;
case 'disabled':
  console.info('Tracker code is disabled');
  indexHtml = indexHtml.replace(reMatomoJs, `<!-- Tracker disabled -->`);
  break;
default:
  console.error(`Unknown tracker ${process.env.METRICS_SERVICE}`);
  break;
}

// Replace Crowdin Javascript
if (typeof process.env.CROWDIN === 'string' && process.env.CROWDIN === 'enabled') {
  const script = "\
  <script type=\"text/javascript\">\n\
    const _jipt = [];\n\
    _jipt.push(['project', 'yourloops']);\n\
  </script>\n\
  <script type=\"text/javascript\" src=\"//cdn.crowdin.com/jipt/jipt.js\"></script>\n";
  console.log('Enable crowdin...');
  indexHtml = indexHtml.replace(reCrowdin,(m, u) => {
    return m.replace(u, script);
  });
} else {
  indexHtml = indexHtml.replace(reCrowdin, (m, u) => {
    return m.replace(u, '<!-- disabled -->');
  });
}

// Saving
console.log('Updating "dist/index.html"...');
let shellStr = new ShellString(indexHtml);
shellStr.to('dist/index.html');

const end = Date.now();
console.log(`Config built in ${(end - start)}ms`);
