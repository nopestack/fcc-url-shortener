const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const PORT = process.env.PORT || 3000
const DEBUG = process.env.DEBUG || false

const savedURLs = []

if (DEBUG) {
    savedURLs.push('https://google.com')
    savedURLs.push('https://youtube.com')
    savedURLs.push('https://instagram.com')
    savedURLs.push('https://twitter.com')
}

function saveURL(url) {
    return savedURLs.push(url) - 1
}

app.get('/api/shorturl/:index', async (req, res) => {
    try {
        const url = savedURLs[req.params.index]
        if (!url) {
            throw new Error('Invalid URL')
        }
        if (DEBUG) {
            console.log('Redirected to ', url)
        }
        res.redirect(url)
    } catch ({ message }) {
        res.status(400)
        res.json({
            error: message,
        })
    }
})

app.post('/api/shorturl/new', async (req, res) => {
    try {
        const index = saveURL(req.body.url)
        if (!req.body.url) {
            throw new Error('Invalid input')
        }
        res.status(200).json({
            original_url: req.body.url,
            short_url: `/api/shorturl/${index}`,
        })
    } catch ({ message }) {
        res.status(400).json({
            error: message,
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})
