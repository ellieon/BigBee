import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {DatabaseHelper} from "../../common/database";

const COMMAND_STRING = 'disconnect'
const NAME = 'disconnect'
const DESCRIPTION = 'Disconnects the user from Spotify'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]

export class Disconnect extends Command {

    private readonly db: DatabaseHelper = new DatabaseHelper()
    constructor() {
        super(NAME, true, COMMAND_STRING, ENVIRONMENTS, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await this.db.deleteUser(message.author.id)
            .catch(() => message.channel.send(`I was unable to disconnect ${message.guild.member(message.author).displayName}`))
            .then(()=>message.channel.send(`I have disconnected ${message.guild.member(message.author).displayName} from Spotify playback`).catch(console.log))


    }

}