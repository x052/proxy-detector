const maxmind = require('maxmind')
const path = require("path")

const PATH_TO_GEO_IP = path.resolve('./GeoIp')

const ASN_LOOKIP = maxmind.openSync(PATH_TO_GEO_IP + '/GeoLite2-ASN.mmdb')
const COUNTRY_LOOKIP = maxmind.openSync(PATH_TO_GEO_IP + '/GeoLite2-Country.mmdb')

function featurize (ip, isProxy) {
  const splitIp = ip.split('.')

  const ASN = ASN_LOOKIP.get(ip)
  const COUNTRY = COUNTRY_LOOKIP.get(ip)
  if (!ASN || !COUNTRY) {
    return false
  }

  const data = {
    isProxy: isProxy,
    org: ASN.autonomous_system_organization + ''
  }

  if (COUNTRY.continent) {
    data.continentCode = COUNTRY.continent.code + ''
  } else {
    data.continentCode = '?'
  }

  if (COUNTRY.country) {
    data.countryCode = COUNTRY.country.iso_code + ''
  } else {
    data.countryCode = '?'
  }

  return data
}

module.exports = featurize
