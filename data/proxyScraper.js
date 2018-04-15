const request = require('request')
const fs = require('fs')

const SCRAPE_PAGES = 200
const PROXY_SITES = [
  'http://proxyserverlist-24.blogspot.co.uk/search?max-results=' + SCRAPE_PAGES,
  'http://sslproxies24.blogspot.co.uk/search?max-results=' + SCRAPE_PAGES,
  'http://socksproxylist24.blogspot.co.uk/search?max-results=' + SCRAPE_PAGES,
  'http://www.vipsocks24.net/search?max-results=' + SCRAPE_PAGES,
  'http://www.live-socks.net/search?max-results=' + SCRAPE_PAGES,
  'http://www.socks24.org/search?max-results=' + SCRAPE_PAGES
]

function parseLink (body) {
  body.replace(/<a class='timestamp-link' href='http:\/\/.*.html/g, function (text) {
    text = text.replace("<a class='timestamp-link' href='", '')
    requestSite(text, parseProxies)
  })
}

function requestSite (site, cb) {
  request(site, function (error, response, body) {
    if (!error && response.statusCode != 200) return false
    cb(body)
  })
}

function loadLinks () {
  for (var i = 0; i < PROXY_SITES.length; i++) {
    requestSite(PROXY_SITES[i], parseLink)
  }
}
function parseProxies (body) {
  body = body.match(/\d{1,3}([.])\d{1,3}([.])\d{1,3}([.])\d{1,3}((:)|(\s)+)\d{1,8}/g) || [] // proxy regex
  for (var i = 0; i < body.length; i++) {
    if (body[i].match(/\d{1,3}([.])\d{1,3}([.])\d{1,3}([.])\d{1,3}(\s)+\d{1,8}/g)) { // clean whitespace
      body[i] = body[i].replace(/(\s)+/, ':') // clean whitespace
    }
  }
  body.forEach((e, i) => body[i] = e.split(':')[0])
  fs.appendFileSync('proxiesIpAdresses', body.join('\n') + '\n')
  console.log('Scraped', body.length + ' proxies')
}

loadLinks()
