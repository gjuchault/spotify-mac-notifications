const SpotifyWebApi = require('spotify-web-api-node')
const promptly = require('promptly')
const opn = require('opn')
const config = require('./config')

let hasAccessToken = false

function startAccessToken(expiresIn) {
    hasAccessToken = true

    setTimeout(() => {
        hasAccessToken = false
    }, (expiresIn - 1) * 1000)
}

module.exports = async () => {
    const spotifyApi = new SpotifyWebApi(config)

    if (hasAccessToken) {
        return spotifyApi
    }

    if (config.refreshToken) {
        spotifyApi.setRefreshToken(config.refreshToken)

        try {
            const res = await spotifyApi.refreshAccessToken()

            spotifyApi.setAccessToken(res.body.access_token)
            startAccessToken(res.body.expires_in)

            return spotifyApi
        } catch (err) {
            console.log('Refreshing token could not be made, going for a new auth')
            console.log(err)
        }
    }

    let url
    try {
        url = await spotifyApi.createAuthorizeURL([ 'user-read-currently-playing' ])
    } catch (err) {
        console.error('Couldn\'t create an authorization url')
        process.exit(1)
    }

    opn(url)

    let token
    try {
        token = await promptly.prompt('Paste token from website :')
    } catch (err) {
        console.error('Token authorization failed')
        process.exit(1)
    }

    let res

    try {
        res = await spotifyApi.authorizationCodeGrant(token)
    } catch (err) {
        console.error('Couldn\'t create an authorization token')
        process.exit(1)
    }

    accessToken = res.body.access_token

    startAccessToken(res.body.expires_in)

    config.set('refreshToken', res.body.refresh_token)

    return spotifyApi
}
