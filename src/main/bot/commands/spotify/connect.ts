import * as DiscordClient from 'discord.js'
import {Command, BaseCommand} from '../command'
import * as logger from 'winston'
import {EnvironmentHelper} from "common/environmentHelper";

const COMMAND_STRING = /^bee!connect$/
const NAME = 'bee!connect'
const DESCRIPTION = 'Shows instructions to connect to spotify'

@Command.register
export class Disconnect extends BaseCommand {

    constructor() {
        super(NAME, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        message.channel.send(`Visit ${EnvironmentHelper.getBaseURL()} to connect your Spotify`).catch(logger.error)
        this.checkReactMessage(message)
    }
}
