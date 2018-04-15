const maxmind = require('maxmind')
const PATH_TO_GEO_IP = '/home/bhax/Desktop/deepLearn/proxyDetector/data/GeoIp'

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
    // ip: ip, // REMOVE
    // ipOne: splitIp[0],
    // ipTwo: splitIp[1],
    // ipThree: splitIp[2],
    // ipFour: splitIp[3],
    isProxy: isProxy,
    org: ASN.autonomous_system_organization + ''
  }

  if (COUNTRY.continent) {
    data.continentCode = COUNTRY.continent.code + ''
    // data.continentGeonameId = COUNTRY.continent.geoname_id
  } else {
    data.continentCode = '?'
   // data.continentGeonameId = '?'
  }

  if (COUNTRY.country) {
    data.countryCode = COUNTRY.country.iso_code + ''
   // data.countryGeonameId = COUNTRY.country.geoname_id
  } else {
    data.countryCode = '?'
   // data.countryGeonameId = '?'
  }

  return data
}

module.exports = featurize
