const fs = require('fs')
const path = require('path')

let config

try {
    config = require('../config')
} catch (err) {
    throw new Error('config.json is missing')
}

if (
    !config.clientId ||
    !config.clientSecret ||
    config.clientId.length === 0 ||
    config.clientSecret.length === 0) {
    throw new Error('Missing clientId or clientSecret in config.json')
}

module.exports = config

module.exports.set = (key, value) => {
    config[key] = value

    fs.writeFileSync(path.join(__dirname, '..', 'config.json'), JSON.stringify(config, null, 4))
}
