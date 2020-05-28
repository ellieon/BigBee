import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from '../command'
import {SpotifyHelper} from "../../../common/spotifyHelper";
import {DatabaseHelper, UserID} from "../../../common/database";

const COMMAND_STRING = 'queue'
const NAME = "bee!queue <song_name>"
const DESCRIPTION = 'Searches for and adds it to a play queue'

function handleError(err): void {
    console.log(err)
}

@Command.register
export class QueueSong extends BaseCommand {
    private helper: SpotifyHelper = SpotifyHelper.getInstance()
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        super(NAME, true, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        const params: string = message.content.substr(this.getTrigger().length, message.content.length)
        await this.findAndPlay(message, params)
    }

    async findAndPlay(message: DiscordClient.Message, params: string) {
        if (params.length === 0) {
            message.channel.send("I need a song name to search `bee!queue [search_term]`").catch(handleError)
            return
        }

        const users: UserID[] = await this.db.getAllUserIds()
        let name: string, artist: string, uri: string = undefined

        if(users.length === 0) {
            message.channel.send("There are currently no registered spotify users").catch(console.log)
        }

        for (let i = 0; i < users.length; i++) {
            const userId: string = users[i].user_id

            if (!uri) {
                const trackData = await this.helper.searchForTrack(params, userId)
                const tracks = trackData.body.tracks.items

                if (tracks.length === 0) {
                    message.channel.send("I was unable to find any tracks by the name" + params).catch(console.log)
                }

                name = tracks[0].name;
                artist = tracks[0].artists[0].name
                uri = tracks[0].uri

            }

            await this.helper.queueSong(uri, userId).catch(console.log)
        }

        await message.channel.send(`Added the song \`${name} by ${artist}\` to all user's play queue`)
            .catch(handleError)
    }
}