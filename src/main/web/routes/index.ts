import * as express from 'express'
import {DiscordMiddleware} from "../common/discordMiddleware";
import {SpotifyMiddleware} from "../common/SpotifyMiddleware";
import {EnvironmentHelper} from "../../common/environmentHelper";


export default express.Router()
    .get('/',
        DiscordMiddleware.createHandler('spotify-login'),
        SpotifyMiddleware.requestHandler,
        async (req, res, next) => {
        res.send(`Spotify is connected, disconnect <a href="${EnvironmentHelper.getBaseURL()}/disconnect">here</a>`)
    })
