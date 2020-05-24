import {Client as DiscordClient} from "@typeit/discord";
import {EnvironmentHelper as env} from "./common/environmentHelper";
import {WebService} from "./web";
import {BeeBot} from "./bot/bot";
import {DatabaseHelper} from "./common/database";

const web = new WebService();
web.init();
const bot = new BeeBot();
bot.init();

const db = new DatabaseHelper()



