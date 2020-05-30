import * as DiscordClient from 'discord.js'
import {Command, BaseCommand} from '../command'
import {DatabaseHelper} from "../../../common/database";
import * as logger from 'winston'

const COMMAND_STRING = /^bee!disconnect$/
const NAME = 'bee!disconnect'
const DESCRIPTION = 'Disconnects the user from Spotify'

@Command.register
export class Disconnect extends BaseCommand {

    private readonly db: DatabaseHelper = new DatabaseHelper()
    constructor() {
        super(NAME, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await this.db.deleteUser(message.author.id)
            .catch(() => {
                this.crossReactMessage(message)
                message.channel.send(`I was unable to disconnect ${message.guild.member(message.author).displayName}`)
            })
        message.channel.send(`I have disconnected ${message.guild.member(message.author).displayName} from Spotify playback`).catch(logger.error)
        this.checkReactMessage(message)
    }
}
