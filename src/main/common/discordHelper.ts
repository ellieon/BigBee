import {EnvironmentHelper as env} from "./environmentHelper";
const DiscordOauth2 = require('discord-oauth2')

const oauth = new DiscordOauth2({
    clientId: env.getDiscordClientId(),
    clientSecret: env.getDiscordClientSecret(),
    redirectUri: env.getDiscordCallbackUrl()
})

export class DiscordHelper {
    public static async getUserId(authorisationToken: string) {
        return (await oauth.getUser(authorisationToken)).id
    }

    public static async getUser(auth: string) {
        return await oauth.getUser(auth)
    }
}