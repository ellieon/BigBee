import {EnvironmentHelper as env} from "./environmentHelper";

const Pool = require('pg').Pool

export class DatabaseHelper {
    readonly pool = new Pool({
        connectionString: env.getDatabaseURL()
    })

    constructor() {
    }

    async getCurrentSpotifyKey(): Promise<string> {
        const res = await this.pool.query("SELECT value FROM config WHERE key = 'spotify_key'")
        console.log(res.rows[0].value)
        return res.rows[0].value as string
    }

    async setCurrentSpotifyKey(key: string): Promise<void>{
        console.log(env.getDatabaseURL())
        console.log('Setting key to ' + key)
        return await this.pool.query("UPDATE config SET value = $1 WHERE key = 'spotify_key'", [key])
    }


}

