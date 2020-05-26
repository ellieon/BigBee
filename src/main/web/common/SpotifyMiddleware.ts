import * as express from 'express'
import {EnvironmentHelper} from "../../common/environmentHelper";
import {DatabaseHelper, SpotifyConnection} from "../../common/database";
import {DiscordHelper} from "../../common/discordHelper";

export class SpotifyMiddleware {
    static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {

        const db: DatabaseHelper = new DatabaseHelper()
        const userId = await DiscordHelper.getUserId(res.locals.SESSION_ID)
        const connection: SpotifyConnection = await db.getSpotifyKeyForUser(userId)
        if (!connection) {
            console.log('No spotify token found')
            res.redirect(`${EnvironmentHelper.getBaseURL()}/spotify-login`)
        }
        next()
    }
}