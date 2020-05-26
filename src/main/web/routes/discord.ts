import * as express from 'express'
import {EnvironmentHelper as env} from "./../../common/environmentHelper";
import {JwtHelper} from "../common/jwtHelper";
const DiscordOauth2 = require('discord-oauth2')

const oauth = new DiscordOauth2({
    clientId: env.getDiscordClientId(),
    clientSecret: env.getDiscordClientSecret(),
    redirectUri: env.getDiscordCallbackUrl()
})

export default express.Router()
    .get('/login', (req, res: express.Request) => {
        const discordAuthUrl = oauth.generateAuthUrl({
            scope: "identify",
            state: `${req.query.callback}`,

        });
        res.redirect(`${discordAuthUrl}`)
    })
    .get('/discord-callback', async (req, res) => {
        console.log(req.query.code)
        try {
            const data = await oauth.tokenRequest({
                code: req.query.code,
                grantType: "authorization_code",
            })

            console.log(data)

            const token: any = JwtHelper.createBearerToken(data.access_token)
            console.log(req.url)
            console.log(token)
            JwtHelper.saveBearerTokenToCookie(res, token)
            console.log(req.query.state)
            console.log(`Post login redirect to ` + req.query.state)
            res.redirect(`${env.getBaseURL()}/${req.query.state}`)
        } catch(err) {
            console.log(err)
            res.send(err)
        }

    })

