import {DatabaseHelper, SpotifyConnection} from "./database";
import {EnvironmentHelper as env} from "./environmentHelper";
import * as SpotifyWebApi from 'spotify-web-api-node'
import * as request from 'request'

export class SpotifyHelper {
    private readonly db: DatabaseHelper
    private readonly spotifyApi: SpotifyWebApi;
    private spotifyConnection: SpotifyConnection = undefined;

    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: env.getSpotifyClientId(),
            clientSecret: env.getSpotifyClientSecret(),
            redirectUri: env.getSpotifyCallbackUrl()
        });

        this.db = new DatabaseHelper()
    }

    private async checkConnection(): Promise<void> {
        this.spotifyConnection = await this.db.getSpotifyKeyForUser()
        this.spotifyApi.setAccessToken(this.spotifyConnection.connectionToken);
        this.spotifyApi.setRefreshToken(this.spotifyConnection.refreshToken);

        if(this.spotifyConnection.expires <= new Date()) {
            console.log('Token expired, refreshing')
            await this.refreshTime()
        }
    }

    private async refreshTime(): Promise<void> {
        this.spotifyApi.refreshAccessToken().then((data) => {
            let refreshDate: Date = new Date()
            refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10)
            this.spotifyConnection = new SpotifyConnection(data.body.access_token, data.body.refresh_token, refreshDate)
            this.db.updateSpotifyKeyForUser('1', this.spotifyConnection.connectionToken, this.spotifyConnection.expires)
        }).catch(console.log)
    }

    public async searchForTrack(searchQuery: string): Promise<any> {
        await this.checkConnection()
        return await this.spotifyApi.searchTracks(searchQuery, { limit: 1 })
    }

    public async skipTrack(): Promise<any> {
        await this.checkConnection()
        return this.spotifyApi.skipToNext()
    }

    public async getCurrentPlaybackState(): Promise<any> {
        await this.checkConnection()
        return this.spotifyApi.getMyCurrentPlaybackState()
    }

    public async queueSong(trackUri: string): Promise<void> {
        await this.checkConnection()
        const options = {
            url: `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'request',
                'Authorization':  `Bearer ${this.spotifyConnection.connectionToken}`
            }
        };
        return request.post(
            options,
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                }
            }
        );
    }



}