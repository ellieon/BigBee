import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from '../command'

const COMMAND_STRING = /(?:big dick bee)/
const NAME = 'echo'
const DESCRIPTION = ':O Who knows what this does'

@Command.register
export class Echo extends BaseCommand {
    constructor() {
        super(NAME, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await message.channel.send('BIG')
        await message.channel.send('DICK')
        await message.channel.send('BEE')
        this.checkReactMessage(message)
    }

}