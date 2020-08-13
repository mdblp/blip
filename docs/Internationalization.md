## Internationalization

### Code organization

Blip is using i18next to make all the labels available in different languages. Below is an example of source code using the i18next module:

```js
import { i18next } from 'i18next';

const t = i18next.t.bind(i18next);

class TidelineHeader extends React.Component {

    ...

    printTitle() {
      switch (this.props.chartType) {
        case 'basics':
            return t('Basics');
      ... 
    }

```
In the above example the `Basics` label will be translated if the related entry exists in the translation files.

### Add a new translation

Steps:
- Add the JSON file to `locales/<lang>/translation.json`.
- Update the `artifact.sh` to allow fetching of the parameters translations (`locales/<lang>/parameter.json`).
- Update `locales/languages.json` with the new language.

### Updating the translation files (deprecated, may be dangerous)

Updating the translation files can be done manually but we recommend to use the `update-translations` helper that is available in our package.json. Here is the command line to execute it. 

```
npm run update-translations
```

It produces updated translations files such as `/locales/[language]/translation.json`. The previous versions of the translations are kept locally as `/locales/[language]/translation_old.json` files.

__Important Note:__ you have first to copy the content of viz and tideline modules into your node_modules blip local folder otherwise some labels will be missed. 

### Terms & co

In order to localize the terms & conditions by country and language you will need:
- A server returning the current country for the user's browser client in JSON on `/country.json`
Example:
```json
{"code":"FR","name":"France","timeZone":"Europe/Paris"}
```
- A manually prepared JSON file with the documents URLs for each country/languages, served by `/legal/legal.json` or `$ASSETS_URL/legal/legal.json`:
Example:
```json
{
  "defaults": {
    "terms": "legal/terms.pdf",
    "dataPrivacy": "legal/data-privacy.pdf",
    "intendedUse": "legal/intended-use.pdf"
  },
  "defaultCountries": {
    "en": "US",
    "fr": "FR",
    "de": "DE"
  },
  "FR": {
    "fr": {
      "terms": "legal/terms.fr-FR.pdf",
      "dataPrivacy": "legal/data-privacy.fr-FR.pdf",
      "intendedUse": "legal/intended-use.fr-FR.pdf"
    }
  },
  "BE": {
    "fr": {
      "terms": "legal/terms.fr-BE.pdf",
      "dataPrivacy": "legal/data-privacy.fr-BE.pdf",
      "intendedUse": "legal/intended-use.fr-BE.pdf"
    },
    "nl": {
      "terms": "legal/terms.nl-BE.pdf",
      "dataPrivacy": "legal/data-privacy.nl-BE.pdf",
      "intendedUse": "legal/intended-use.nl-BE.pdf"
    }
  },
  "DE": {
    "de": {
      "terms": "https://example.com/terms.de-DE.pdf",
      "dataPrivacy": "https://example.com/data-privacy.de-DE.pdf",
      "intendedUse": "https://example.com/intended-use.de-DE.pdf"
    }
  }
}
```

Note: Documents URLs can be relative, or absolute. A PDF is not mandatory.

#### CloudFront lambda edge for `/country.json`

cloudfront-blip-preview-request-origin.js:
```js
'use strict';

/* This is an origin request function */
exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  if (request.uri === "/country.json") {
    const headers = request.headers;
    const countryInfos = {
      code: "US",
      name: "USA",
      timeZone: "UTC",
    };
    if (Array.isArray(headers["cloudfront-viewer-country"])) {
      countryInfos.code = headers["cloudfront-viewer-country"][0].value;
    }
    if (Array.isArray(headers["cloudfront-viewer-country-name"])) {
      countryInfos.name = headers["cloudfront-viewer-country-name"][0].value;
    }
    if (Array.isArray(headers["cloudfront-viewer-time-zone"])) {
      countryInfos.timeZone = headers["cloudfront-viewer-time-zone"][0].value;
    }
    const response = {
      status: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'no-store' }],
        'content-type': [{ key: 'Content-Type', value: 'application/json; charset=utf-8' }],
        'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
      },
      body: JSON.stringify(countryInfos)
    };
    return callback(null, response);
  }
  callback(null, request);
}
```

In order for this lambda to work, you will need to have a cache behavior for it.
- Create a cache behavior for `/country.json`
- Create & set a new cache policy with headers white list:
  * `CloudFront-Viewer-Time-Zone`
  * `CloudFront-Viewer-Country`
  * `CloudFront-Viewer-Country-Name`
- Set your lambda ARN.
