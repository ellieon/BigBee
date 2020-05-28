import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from '../command'
import {SpotifyHelper} from "../../../common/spotifyHelper";
import {DatabaseHelper, UserID} from "../../../common/database";

const COMMAND_STRING = 'queue'
const NAME = "bee!queue [user] <song_name>"
const DESCRIPTION = 'Searches for and adds it to a play queue'
const USER_CAPTURE = /<@!?(\d{17,19})>/
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

        let matches = params.match(USER_CAPTURE)

        let users: UserID[]
        if(matches && matches.length > 1) {
            users = [{user_id: matches[1]}]
            params = params.replace(matches[0], "")
        } else {
            users = await this.db.getAllUserIds()
        }

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
                    return
                }

                name = tracks[0].name;
                artist = tracks[0].artists[0].name
                uri = tracks[0].uri

            }

            await this.helper.queueSong(uri, userId).catch(console.log)
        }

        const successMessage = `Added the song \`${name} by ${artist}\` to`
        if(users.length === 1) {
            message.channel.send(`${successMessage} to <@!${users[0].user_id}>'s queue`)
                .catch(console.log)
        } else {
            message.channel.send(`${successMessage} to all users queue`)
                .catch(console.log)
        }

    }
}