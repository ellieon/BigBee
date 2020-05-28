import {EnvironmentHelper as env} from "./environmentHelper";
const DiscordOauth2 = require('discord-oauth2')
import * as logger from 'winston'

const oauth = new DiscordOauth2({
    clientId: env.getDiscordClientId(),
    clientSecret: env.getDiscordClientSecret(),
    redirectUri: env.getDiscordCallbackUrl()
})

export class DiscordHelper {
    public static async getUserId(authorisationToken: string) {
        logger.debug(`DiscordHelper get user id with token ${authorisationToken}`)
        const data = await oauth.getUser(authorisationToken).catch(logger.error)
        return data.id
    }

    public static async getUser(auth: string) {
        logger.debug(`DiscordHelper get user with auth ${auth}`)
        return await oauth.getUser(auth).catch(logger.error)
    }
}