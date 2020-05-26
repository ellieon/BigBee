
import {JwtHelper} from "./jwtHelper";
import {EnvironmentHelper} from "../../common/environmentHelper";

export class DiscordMiddleware {
    static createHandler(callback: string) {
        return function (req, res, next) {
            const token = JwtHelper.readBearerTokenFromRequest(req)
            if(!token){
                console.log('No token found, redirect to login')
                res.redirect(`${EnvironmentHelper.getBaseURL()}/login?callback=${callback}`)
            } else {
                res.locals.SESSION_ID = token
                next()
            }
        }
    }
    //static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {



    ///}
}