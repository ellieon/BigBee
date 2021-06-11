import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'
import { DatabaseHelper } from 'common/database'
import * as logger from 'winston'

const DEFAULT_COMMAND = '^bee!bottom-add\\s+?(?<trigger>.+)$|^bee!bottom-remove\\s+?(?<remove>.+)$'

@Command.register
export class Bottom extends BaseCommand {
  private trigger: RegExp = undefined
  private triggers: string[] = []

  constructor () {
    super('', new RegExp(DEFAULT_COMMAND), '')
    this.buildTriggerExpression().then()
  }

  async execute (message: DiscordClient.Message, content: string): Promise<void> {
    const matches = this.getMatches(message)

    if (matches.groups && matches.groups.trigger) {
      if (await Bottom.isUserAuthorised(message)) {
        await this.addTrigger(matches.groups.trigger)
        await this.checkReactMessage(message)
      } else {
        logger.info(`${message.author.id} is not authorised for admin commands`)
        await this.crossReactMessage(message)
      }

    } else if (matches.groups && matches.groups.remove) {
      if (await Bottom.isUserAuthorised(message)) {
        await this.removeTrigger(matches.groups.remove)
        await this.checkReactMessage(message)
      } else {
        logger.info(`${message.author.id} is not authorised for admin commands`)
        await this.crossReactMessage(message)
      }
    } else {
      await DatabaseHelper.getInstance().incrementScoreBoardForUser(message.author.id)
      await message.react('🇧')
      await message.react('🇴')
      await message.react('🇹')
      await message.react(`✝`)
      await message.react(`🅾`)
      await message.react('🇲')
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

  private async addTrigger (trigger: string) {
    logger.info(`Adding a new bottom trigger ${trigger}`)
    this.triggers.push(trigger)
    await DatabaseHelper.getInstance().pushNewTriggers(JSON.stringify(this.triggers))
    await this.buildTriggerExpression()
  }

  private async removeTrigger (trigger: string) {
    this.triggers = this.triggers.filter(e => e !== trigger)
    await DatabaseHelper.getInstance().pushNewTriggers(JSON.stringify(this.triggers))
    await this.buildTriggerExpression()
  }

  private async buildTriggerExpression (): Promise<void> {
    this.triggers = await DatabaseHelper.getInstance().getTriggers()
    let regex: string = DEFAULT_COMMAND

    this.triggers.forEach((t) => {
      regex += '|'
      regex += t
    })

    this.trigger = new RegExp(regex)
  }

  getTrigger (): RegExp {
    return this.trigger
  }

}
