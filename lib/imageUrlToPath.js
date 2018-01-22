const path = require('path')
const os = require('os')
const download = require('download')

const fileName = 'spotify-mac-notifications-current-playing'

module.exports = async (url) => {
    const filename = url.substr(url.lastIndexOf('/') + 1)
    const target = path.join(os.tmpdir(), fileName)

    await download(url, os.tmpdir(), { filename: fileName })

    return target
}
