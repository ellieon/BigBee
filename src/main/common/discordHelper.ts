import { EnvironmentHelper as env } from 'common/environmentHelper'
import * as DiscordClient from 'discord.js'

const DiscordOauth2 = require('discord-oauth2')
import * as logger from 'winston'

const oauth = new DiscordOauth2({
  clientId: env.getDiscordClientId(),
  clientSecret: env.getDiscordClientSecret(),
  redirectUri: env.getDiscordCallbackUrl()
})

const userCache: DiscordClient.User[] = []

export class DiscordHelper {
  private static instance: DiscordHelper

  client = new DiscordClient.Client()

  private constructor () {
  }

  public static getInstance (): DiscordHelper {
    if (!DiscordHelper.instance) {
      DiscordHelper.instance = new DiscordHelper()
    }

    return DiscordHelper.instance
  }

  public static async getUserId (authorisationToken: string) {
    logger.debug(`DiscordHelper get user id with token ${authorisationToken}`)
    const data = await oauth.getUser(authorisationToken).catch(logger.error)
    return data.id
  }

  public static async getUser (auth: string) {
    logger.debug(`DiscordHelper get user with auth ${auth}`)
    return oauth.getUser(auth).catch(logger.error)
  }

  public async getUserByUserId (userId: string): Promise<DiscordClient.User> {
    if (userCache[userId] === undefined) {
      try {
        const user: DiscordClient.User = await this.client.users.fetch(userId)
        userCache[userId] = user
        return user
      } catch (error) {
        return undefined
      }
    } else {
      return userCache[userId]
    }
  }
}
