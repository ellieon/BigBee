import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from './command'
import {DatabaseHelper} from "../../common/database";
import {SpotifyHelper} from "../../common/spotifyHelper";

const COMMAND_STRING = 'skip'
const NAME = 'skip'
const DESCRIPTION = 'Skips to the next song in spotify'

@Command.register
export class Skip extends BaseCommand {
    readonly helper: SpotifyHelper = new SpotifyHelper()
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        super(NAME, true, COMMAND_STRING, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await this.skipSongAndOutput(message)
    }

    async skipSongAndOutput(message: DiscordClient.Message) {
        try {
            const rows: any[] = await this.db.getAllUserIds()

            if(rows.length === 0) {
                message.channel.send('There are no connected Spotify users').catch(console.log)
                return
            }

            await Promise.all(rows.map(async (id) => {
                    this.helper.skipTrack(id.user_id).catch(async () => {
                        const member: DiscordClient.GuildMember = await message.guild.members.fetch(id.user_id)
                        message.channel.send("I could not skip for " + member.displayName)
                            .catch(console.log)
                        }
                    )
                }
            ));

            message.channel.send('Song has been skipped for all users').catch(console.log)

        } catch (err) {
            message.channel.send(`I was unable to skip the song, I might not have an authorisation code for Spotify`)
                .then(console.log)
            console.log(err)
        }
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

}