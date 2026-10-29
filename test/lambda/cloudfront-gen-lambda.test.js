
const crypto = require('crypto')
const util = require('util')
const zlib = require('zlib')
const chai = require('chai')
const lambda = require('../../dist/lambda/cloudfront-test-blip-request-viewer')
const maintenanceLambda = require('../../dist/lambda/cloudfront-test-maintenance-blip-request-viewer')

// Set by test-lambda.sh
const APP_VERSION = process.env.APP_VERSION

function viewerRequest(uri) {
  return {
    Records: [
      {
        cf: {
          config: { distributionId: 'TESTS' },
          request: { uri, method: 'GET', clientIp: '2001:cdba::3257:9652', headers: {} }
        }
      }
    ]
  }
}

describe('CloudFront Lambda Generator', function () {
  const { expect } = chai
  /** @type {(string, object) => Promise<object>} */
  const handler = util.promisify(lambda.handler)

  const testBase = {
    Records: [
      {
        cf: {
          config: {
            distributionId: 'TESTS'
          },
          request: {
            uri: '/',
            method: 'GET',
            clientIp: '2001:cdba::3257:9652',
            headers: {
              'host': [
                {
                  key: 'Host',
                  value: 'd123.cf.net'
                }
              ],
              'user-agent': [
                {
                  key: 'User-Agent',
                  value: 'Test Agent'
                }
              ],
              'user-name': [
                {
                  key: 'User-Name',
                  value: 'aws-cloudfront'
                }
              ]
            }
          }
        }
      }
    ]
  }

  let indexHTML = ''
  it('Should return the index.html in a gzip/base64 content', async () => {
    const gunzip = util.promisify(zlib.gunzip)
    const response = await handler(testBase, null)
    expect(response).to.be.an('object')
    expect(response.status).to.be.equal(200)
    expect(response.statusDescription).to.be.equal('OK')
    expect(response.bodyEncoding).to.be.equal('base64')
    expect(response.body).to.be.a('string')
    let b = Buffer.from(response.body, 'base64')
    b = await gunzip(b)
    indexHTML = b.toString('utf8')
    expect(indexHTML).to.be.a('string')
    expect(indexHTML.startsWith('<!DOCTYPE html>')).to.be.true
  })

  it('Should return the index.html in a gzip/base64 content for others requested URL', async () => {
    testBase.Records[0].cf.request.uri = '/patients/abcd/data'
    const gunzip = util.promisify(zlib.gunzip)
    const response = await handler(testBase, null)
    expect(response).to.be.an('object')
    expect(response.status).to.be.equal(200)
    expect(response.statusDescription).to.be.equal('OK')
    expect(response.bodyEncoding).to.be.equal('base64')
    expect(response.body).to.be.a('string')
    let b = Buffer.from(response.body, 'base64')
    b = await gunzip(b)
    let html = b.toString('utf8')
    expect(html).to.be.a('string')
    expect(indexHTML.startsWith('<!DOCTYPE html>')).to.be.true
    expect(html).to.be.not.equal(indexHTML) // nonce are differents
  })

  it('Should return the config.md5.js', async () => {
    console.log(indexHTML)
    const match = indexHTML.match(/.*(config\.[\da-f]{20}\.js).*/i)
    if (!match) {
      expect.fail('config file name not found')
    }
    const configFileName = match[1]
    console.log(configFileName)
    testBase.Records[0].cf.request.uri = `/${configFileName}`
    const response = await handler(testBase, null)
    expect(response).to.be.an('object')
    expect(response.status).to.be.equal(200)
    expect(response.statusDescription).to.be.equal('OK')
    expect(response.body).to.be.a('string')
    expect(response.body.startsWith('window.config = {')).to.be.true

    const hash = crypto.createHash('sha512')
    hash.update(response.body)
    const configHash = `sha512-${hash.digest('base64')}`

    expect(indexHTML.indexOf(configHash)).to.be.above(0)
  })

  it('Should proceed the request to CloudFront for distribution files, in the release folder', async () => {
    testBase.Records[0].cf.request.uri = '/branding_diabeloop_blue_favicon.ico'
    const response = await handler(testBase, null)
    expect(response).to.be.equal(testBase.Records[0].cf.request)
    expect(response.uri).to.be.equal(`/${APP_VERSION}/branding_diabeloop_blue_favicon.ico`)
  })

  it('Should return the version', async () => {
    testBase.Records[0].cf.request.uri = '/version'
    const response = await handler(testBase, null)
    expect(response.status).to.be.equal(200)
    expect(response.body).to.be.equal(APP_VERSION)
  })

  it('Should request a redirect for distributions files', async () => {
    testBase.Records[0].cf.request.uri = '/patients/branding_diabeloop_blue_favicon.ico'
    const response = await handler(testBase, null)
    expect(response).to.be.an('object')
    expect(response).to.be.deep.equal({
      status: 302,
      statusDescription: 'Found',
      body: '',
      headers: {
        location: [{
          key: 'Location',
          value: '/branding_diabeloop_blue_favicon.ico'
        }]
      }
    })
  })
})

describe('CloudFront Lambda Generator in maintenance mode', function () {
  const { expect } = chai
  /** @type {(string, object) => Promise<object>} */
  const handler = util.promisify(maintenanceLambda.handler)

  for (const uri of ['/', '/index.html', '/patients/abcd/data', '/branding_diabeloop_blue_favicon.ico']) {
    it(`Should return the maintenance page for ${uri}`, async () => {
      const response = await handler(viewerRequest(uri), null)
      expect(response.status).to.be.equal(503)
      expect(response.body.startsWith('<!DOCTYPE html>')).to.be.true
      expect(response.body).to.contain('YourLoops is currently undergoing maintenance')
      expect(response.headers['content-security-policy'][0].value).to.contain("default-src 'none'")
      expect(response.headers['strict-transport-security'][0].value).to.contain('max-age=')
      expect(response.headers['cache-control'][0].value).to.be.equal('no-store')
    })
  }

  it('Should still return the version', async () => {
    const response = await handler(viewerRequest('/version'), null)
    expect(response.status).to.be.equal(200)
    expect(response.body).to.be.equal(APP_VERSION)
  })

  it('Should still return the mobile app links', async () => {
    const response = await handler(viewerRequest('/.well-known/assetlinks.json'), null)
    expect(response.status).to.be.equal(200)
    expect(response.headers['content-type'][0].value).to.be.equal('application/json')
  })
})
