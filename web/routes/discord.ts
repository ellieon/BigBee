import * as express from 'express'
import {EnvironmentHelper as env} from "../../common/environmentHelper";
const DiscordOauth2 = require('discord-oauth2')

const oauth = new DiscordOauth2({
    clientId: env.getDiscordClientId(),
    clientSecret: env.getDiscordClientSecret(),
    redirectUri: env.getDiscordCallbackUrl()
})

const discordAuthUrl = oauth.generateAuthUrl({
    scope: ["identify"],
    state: "some-state"
});

function errLogger(err) {
    console.log('Something went wrong!', err)
}

export default express.Router()
    .get('/login', (req, res) => {
        res.redirect(discordAuthUrl)
    })
    .get('/discord-callback', (req, res) => {
        console.log(req.query.code)
        oauth.tokenRequest({
            code: req.query.code,
            grantType: "authorization_code"
        })
            .then((data) => oauth.getUser(data.access_token))
            .then((data) => res.send(`${data.id}:${data.username}#${data.discriminator}`))
    })

