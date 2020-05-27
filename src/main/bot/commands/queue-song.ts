import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {SpotifyHelper} from "../../common/spotifyHelper";
import {DatabaseHelper} from "../../common/database";

const COMMAND_STRING = 'queue'
const NAME = 'queue'
const DESCRIPTION = 'Searches for and adds it to a play queue'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]

function handleError(err): void {
    console.log(err)
}

export class QueueSong extends Command {
    private helper: SpotifyHelper = new SpotifyHelper()
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        super(NAME, true, COMMAND_STRING, ENVIRONMENTS, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        const params: string = message.content.substr(this.getTrigger().length, message.content.length)
        console.log(params)
        await this.findAndPlay(message, params)
    }

    async findAndPlay(message: DiscordClient.Message, params: string) {
        if (params.length === 0) {
            message.channel.send("I need a song name to search `bee!queue [search_term]`").catch(handleError)
            return
        }

        const rows: any[] = await this.db.getAllUserIds()
        let name: string, artist: string, uri: string = undefined

        if(rows.length === 0) {
            message.channel.send("There are currently no registered spotify users")
        }
        for (let i = 0; i < rows.length; i++) {
            const userId: string = rows[i].user_id

            if (!uri) {
                const data = (await this.helper.searchForTrack(params, userId)).body.tracks.items

                if (data.length === 0) {
                    message.channel.send("I was unable to find any tracks by the name" + params).catch(console.log)
                }

                name = data[0].name;
                artist = data[0].artists[0].name
                uri = data[0].uri
                await message.channel.send(`Added the song \`${name} by ${artist}\` to all user's play queue`)
                    .catch(handleError)
            }

            this.helper.queueSong(uri, userId).catch(async (err) => {
                const member: DiscordClient.GuildMember = await message.guild.members.fetch(userId)
                console.log(err)
                message.channel.send("I could not add song to the queue for: " + member.displayName).catch(console.log)
            })
        }
    }
}