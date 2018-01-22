const config = require('./config')
const notifier = require('node-notifier')
const spotifyApi = require('./spotifyApi')
const imageUrlToPath = require('./imageUrlToPath')

async function notifyCurrentSong() {
    const spotify = await spotifyApi()

    console.log(`Using access token : ${spotify.getAccessToken()}`)

    try {
        let initialTime = Date.now()

        const currentTrack = await spotify.getMyCurrentPlayingTrack()
        const item = currentTrack.body.item

        const progress = currentTrack.body.progress_ms
        const totalLength = item.duration_ms

        const imageUrl = item.album
            .images
            .sort((a, b) => a.width - b.width)
            [0]
            .url

        const imagePath = await imageUrlToPath(imageUrl)

        notifier.notify({
            title: item.name,
            message: item.album.name,
            icon: imagePath
        })

        console.log(`Currently playing ${item.name} — ${item.album.name}, progress ${(progress / totalLength * 100).toFixed(2)}%`)

        let countdownTime = Date.now()

        setTimeout(() => {
            notifyCurrentSong()
        }, totalLength - progress + countdownTime - initialTime + 500)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

(async function () {
    await notifyCurrentSong()
})()
