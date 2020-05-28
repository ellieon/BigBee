import * as DiscordClient from 'discord.js'
import {EnvironmentHelper, EnvironmentHelper as env} from "../common/environmentHelper";
import {BaseCommand, Command} from "./commands/command";

const logger = require('winston');

export class BeeBot {
    readonly bot = new DiscordClient.Client()
    private registeredCommands: BaseCommand[] = []

    constructor() {
    }

    init() {

        logger.remove(logger.transports.Console);
        logger.add(new logger.transports.Console, {
            colorize: true
        });

        logger.level = EnvironmentHelper.getLoggingLevel()
        logger.info(`Log level set to ${EnvironmentHelper.getLoggingLevel()}`)
        this.bot.on('ready', () => {
            logger.info('Connected');
            logger.info(`Environment = ${env.getEnvironment()}`)
            logger.info(`Debug channel = ${env.getDebugChannelName()}`)
            this.bot.user.setPresence({
                activity: {name: "Everybody knows it's big dick bee! "},
                status: 'online'
            }).catch(logger.error)
        });

        this.bot.on('message', (message) => {
            this.handleMessage(message)
        });


        this.bot.login(env.getDiscordBotToken()).then(logger.info('Bot login successful'));
        this.addCommands()
    }

    addCommands(): void {
        Command.GetImplementations().forEach((command) => {
            this.addCommand(new command())
        })
    }

    getCommands(): BaseCommand[] {
        return this.registeredCommands
    }

    addCommand(command: BaseCommand): void {
        logger.info(`Registered command ${command.getName()}`)
        command.setClient(this.bot)
        command.setBot(this)
        this.registeredCommands.push(command)
    }

    handleMessage(message: DiscordClient.Message): void {
        this.registeredCommands.forEach((c) => {
            if (message.content.toLowerCase().startsWith(c.getTrigger())) {
                logger.info(`Executing command ${c.getName()}`)
                c.execute(message)
                    .then(() => logger.info(`Command executed ${c.getName()}`))
                    .catch(logger.error)
            }
        })
    }

}


