import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'
import { DatabaseHelper } from 'common/database'
import * as logger from 'winston'

const DEFAULT_COMMAND = '^bee!bonk-add\\s+?(?<trigger>\\S.+)$|^bee!bonk-remove\\s+?(?<remove>.+)$'

@Command.register
export class BonkAdd extends BaseCommand {

  private reacts: string[] = undefined

  constructor () {
    super('', new RegExp(DEFAULT_COMMAND), '')
  }

  async execute (message: DiscordClient.Message, content: string): Promise<void> {
    const matches = this.getMatches(message)

    if (!this.reacts) {
      this.reacts = await DatabaseHelper.getInstance().getBonkReacts()
    }

    if (matches.groups && matches.groups.trigger) {
      if (await BonkAdd.isUserAuthorised(message)) {
        await this.addBonk(matches.groups.trigger)
        await this.checkReactMessage(message)
      } else {
        logger.info(`${message.author.id} is not authorised for admin commands`)
        await this.crossReactMessage(message)
      }

    } else if (matches.groups && matches.groups.remove) {
      if (await BonkAdd.isUserAuthorised(message)) {
        await this.removeBonk(matches.groups.remove)
        await this.checkReactMessage(message)
      } else {
        logger.info(`${message.author.id} is not authorised for admin commands`)
        await this.crossReactMessage(message)
      }
    }
  }

  private static async isUserAuthorised (message: DiscordClient.Message) {
    const admins: string[] = await DatabaseHelper.getInstance().getBeeAdmins()

    for (let admin of admins) {
      if (admin === message.author.id) {
        return true
      }
    }
    return false
  }

  private async addBonk (trigger: string) {
    logger.info(`Adding a new bottom trigger ${trigger}`)
    this.reacts.push(trigger)
    await DatabaseHelper.getInstance().pushBonkReacts(JSON.stringify(this.reacts))
  }

  private async removeBonk (trigger: string) {
    this.reacts = this.reacts.filter(e => e !== trigger)
    await DatabaseHelper.getInstance().pushBonkReacts(JSON.stringify(this.reacts))
  }
}
