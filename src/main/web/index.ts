import * as express from "express/lib/express";
import spotify from "./routes/spotify";
import discord from "./routes/discord";
import index from "./routes/"
import * as cookieParser from 'cookie-parser'


export class WebService {

    readonly port = process.env.PORT || 3000
    readonly app: express.Application = express()

    init() {
        this.app.use(cookieParser())
        this.app.use(spotify)
        this.app.use(discord)
        this.app.use(index)

        this.app.listen(this.port, () => console.log(`Server is listening on port ${this.port}`))
    }


}





