import * as express from "express/lib/express";
import hello from "./routes/hello";
import spotify from "./routes/spotify";
import discord from "./routes/discord";

export class WebService {

    readonly port = process.env.PORT || 3000
    readonly app: express.Application = express()

     constructor() {

     }

     init() {
         this.app.use(hello)
         this.app.use(spotify)
         this.app.use(discord)

         this.app.listen(this.port, () => console.log(`Server is listening on port ${this.port}`))

    }


}





