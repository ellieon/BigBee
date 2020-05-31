import { GuildSettings } from 'bot/common/guild/guildSettings'
import { DatabaseHelper } from 'common/database'
import * as logger from 'winston'

export class GuildSettingsManager {

  private static instance: GuildSettingsManager

  private cache: Map<string, GuildSettings> = new Map()
  private dbHelper: DatabaseHelper = new DatabaseHelper()

  public constructor () {
    this.fillCache()
  }

  public static getInstance (): GuildSettingsManager {
    if (!GuildSettingsManager.instance) {
      logger.info('Creating GuildSettingsManager')
      GuildSettingsManager.instance = new GuildSettingsManager()
    }

    return GuildSettingsManager.instance
  }

  public async saveGuild (guildSettings: GuildSettings): Promise<void> {
    this.cache[guildSettings.id] = guildSettings
    await this.dbHelper.saveGuildSettings(guildSettings)
  }

  public getGuild(id: string): GuildSettings {
    return this.cache[id]
  }

  private async fillCache (): Promise<void> {
    logger.info('Filling guild cache')
    const result = await this.dbHelper.getAllGuildSettings()
    result.rows.forEach((row) => {
      this.cache[row.settings.id] = row.settings
    })
  }

}
