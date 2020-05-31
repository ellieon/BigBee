import {GuildMember, PartialGuildMember, TextChannel} from "discord.js";
import {BotExtension, Extension} from "bot/extensions/botExtension";
import * as logger from 'winston'
import {EnvironmentHelper} from "common/environmentHelper";
import {format} from 'common/stringUtils'

@Extension.register
export class Greeter extends BotExtension{
    private static GREETING_STRING: string = `Hi {0}! welcome to the cult. I am {1}, one of the bots taking care of things here!
In an attempt to create a safe space and protect our members from grief, we have implemented a temporary 10 minute timeout for all new users.
Feel free to take the time to take a look around and see what we are all about.
When the time out is lifted, be sure to check out the #channel-roles channel and add pronouns if you wish!
Have fun!!!`

    public init(): void {
        this.getClient().on('guildMemberAdd', (member) => { this.greeter(member) })
    }

    private greeter(member: GuildMember | PartialGuildMember) {
         member.user
            .send(format(Greeter.GREETING_STRING, `<@!${member.id}>`, `<@!${this.getClient().user.id}>`))
            .catch(() => {
                logger.info("Unable to DM user directly, falling back to guild level")
                this.fallbackGreeter(member).catch(logger.error)
            })

    }

    private async fallbackGreeter(member: GuildMember | PartialGuildMember) {
        const channel: TextChannel =
            await member.guild.channels.cache.find( (channel) => channel.name === EnvironmentHelper.getGreeterChannel()) as TextChannel
        if (channel) {
            channel
                .send(format(Greeter.GREETING_STRING, `<@!${member.id}>`, `<@!${this.getClient().user.id}>`))
                .catch(logger.error)
        } else {
            logger.error(`${EnvironmentHelper.getGreeterChannel()} could not be resolved to a guild channel`)
        }
    }

    public getName(): string {
        return 'Greeter';
    }


}

