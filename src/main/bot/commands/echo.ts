import * as DiscordClient from 'discord.js'
import {Command} from './command'

const COMMAND_STRING = 'big dick bee'
const NAME = 'echo'
const DESCRIPTION = 'Echoes BIG DICK BEE!'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]

export class Echo extends Command {

    constructor() {
        super(NAME, false, COMMAND_STRING, ENVIRONMENTS, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await message.channel.send('BIG')
        await message.channel.send('DICK')
        await message.channel.send('BEE')
    }

}