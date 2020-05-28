import {DatabaseHelper, SpotifyConnection} from "./database";
import {EnvironmentHelper as env} from "./environmentHelper";
import * as SpotifyWebApi from 'spotify-web-api-node'
import * as request from 'request'

export class SpotifyHelper {

    private static instance: SpotifyHelper

    private readonly db: DatabaseHelper
    private readonly spotifyApi: SpotifyWebApi;
    private spotifyConnection: SpotifyConnection = undefined;

    private constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: env.getSpotifyClientId(),
            clientSecret: env.getSpotifyClientSecret(),
            redirectUri: env.getSpotifyCallbackUrl()
        });

        this.db = new DatabaseHelper()
    }


    public static getInstance(): SpotifyHelper {
        if(!SpotifyHelper.instance) {
            SpotifyHelper.instance = new SpotifyHelper()
        }

        return SpotifyHelper.instance
    }

    private async checkConnection(userId: string): Promise<void> {
        this.spotifyConnection = await this.db.getSpotifyKeyForUser(userId)
        this.spotifyApi.setAccessToken(this.spotifyConnection.connectionToken);
        this.spotifyApi.setRefreshToken(this.spotifyConnection.refreshToken);

        if(this.spotifyConnection.expires <= new Date()) {
            console.log('Token expired, refreshing')
            await this.refreshTime(userId)
        }
    }

    private async refreshTime(userId: string): Promise<void> {
        this.spotifyApi.refreshAccessToken().then((data) => {
            let refreshDate: Date = new Date()
            refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10)
            this.spotifyConnection = new SpotifyConnection(data.body.access_token, data.body.refresh_token, refreshDate)
            this.db.updateSpotifyKeyForUser(userId, this.spotifyConnection.connectionToken, this.spotifyConnection.expires)
        })
    }

    public async searchForTrack(searchQuery: string, userId: string): Promise<any> {
        await this.checkConnection(userId)
        return await this.spotifyApi.searchTracks(searchQuery, { limit: 1 })
    }

    public async skipTrack(userId: string): Promise<any> {
        await this.checkConnection(userId)
        return this.spotifyApi.skipToNext()
    }

    public async getCurrentPlaybackState(userId: string): Promise<any> {
        await this.checkConnection(userId)
        return this.spotifyApi.getMyCurrentPlaybackState()
    }

    public async queueSong(trackUri: string, userId: string): Promise<void> {
        await this.checkConnection(userId)

        const data = await this.spotifyApi.getMyCurrentPlaybackState()

        if(data.body.is_playing)
        {
            const options = {
                url: `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'request',
                    'Authorization':  `Bearer ${this.spotifyConnection.connectionToken}`
                }
            };
            await request.post(options);
        }
    }
}