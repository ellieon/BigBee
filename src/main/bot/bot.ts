import * as DiscordClient from 'discord.js'
import {EnvironmentHelper as env} from "../common/environmentHelper";

import * as Commands from './commands/index'
import {TextChannel} from "discord.js";

const logger = require('winston');

export class BeeBot {
    readonly bot = new DiscordClient.Client()
    private registeredCommands: Commands.Command[] = []

    constructor() {
    }

    init() {
        logger.remove(logger.transports.Console);
        logger.add(new logger.transports.Console, {
            colorize: true
        });
        logger.level = 'debug';

        this.bot.on('ready', () => {
            logger.info('Connected');
            logger.info(`Environment = ${env.getEnvironment()}`)
            logger.info(`Debug channel = ${env.getDebugChannelName()}`)
            this.bot.user.setPresence({activity: {name: "Everybody knows it's big dick bee! "}, status: 'online'})
        });

        this.bot.on('message', (message) => {
            this.handleMessage(message)
        });


        this.bot.login(env.getDiscordBotToken()).then(logger.info('Bot login successful'));
        this.addCommands()
    }

    addCommands(): void {
        this.addCommand(new Commands.Echo())
        this.addCommand(new Commands.Skip())
    }

    addCommand(command: Commands.Command): void {
        logger.info(`Registered command ${command.getName()}`)
        this.registeredCommands.push(command)
    }

    handleMessage(message: DiscordClient.Message): void {
        if(this.isDebugMessage(message) || this.isProdMessage(message)) {
            this.registeredCommands.forEach((c) => {
                if (message.content.toLowerCase().startsWith(c.getTrigger())) {
                    logger.info(`Executing command ${c.getName()}`)
                    c.execute(message).then(() => logger.info(`Command executed ${c.getName()}`));
                }
            })
        }
    }

    isProdMessage(message: DiscordClient.Message): boolean {
        return (message.channel as TextChannel).name !== env.getDebugChannelName()
            && !env.isDevelopmentMode()
    }

    isDebugMessage(message: DiscordClient.Message): boolean {
        return (message.channel as TextChannel).name === env.getDebugChannelName()
            && env.isDevelopmentMode()
    }

}


